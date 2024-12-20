import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { filter, take } from 'rxjs'

import { DeleteDialogComponent } from '../../../common/components/delete-dialog/delete-dialog.component'
import { Book, BookFormGroup, BookFormGroupValue } from '../book.model'
import { BookService } from '../book.service'

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatDialogModule, MatFormField, MatLabel, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
})
export class BookDialogComponent implements OnInit {
  @ViewChild('fakeFileInput', { static: false })
  fakeFileInput!: ElementRef<HTMLInputElement>;
  readonly dialogRef = inject(MatDialogRef<BookDialogComponent>);
  readonly data = inject<Book>(MAT_DIALOG_DATA);
  private deleteDialogRef = inject(MatDialog);
  private fb = inject(FormBuilder);
  title = 'Add new book';
  imagePreview: string | null = null;

  bookFormGroup!: FormGroup<BookFormGroup>;
  private bookService = inject(BookService);

  ngOnInit() {
    if (Object.keys(this.data).length) {
      this.title = 'Book details';
    }

    this.bookFormGroup = this.fb.group({
      title: this.fb.control<string>(this.data?.title || '', {
        validators: [Validators.required], nonNullable: true }
      ),
      author: this.fb.control<string>(this.data?.author || '', {
        validators: [Validators.required], nonNullable: true
      }),
      year: this.fb.control<number>(this.data?.year || 2024, {
        validators: [Validators.required], nonNullable: true
      }),
      description: this.fb.control<string | null>(this.data?.description || '', {
        nonNullable: true
      }),
      coverImage: this.fb.control<File | null>(this.data?.coverImage || null),
    });

    const file = this.data.coverImage;
    if (file) {
      this.readFile(file)
    }

    if (this.fakeFileInput && file) {
      this.fakeFileInput.nativeElement.value = file?.name || '';
    }
  }

  onSubmit(): void {
    const { id } = this.data;
    if (id) {
      this.bookService.updateBook({...this.bookFormGroup.value as BookFormGroupValue, id});
    } else {
      this.bookService.addBook(this.bookFormGroup.value as BookFormGroupValue);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getFileOnLoad(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (this.fakeFileInput) {
      this.fakeFileInput.nativeElement.value = file?.name || '';
    }
    
    if (file) {
      this.bookFormGroup.patchValue({ coverImage: file });
      this.bookFormGroup.get('coverImage')?.markAsDirty();
      this.readFile(file);
    }
  }

  deleteBook(): void {
    this.deleteDialogRef.open(DeleteDialogComponent, {
      data: { title: this.data.title }, width: '500px', height: '250px'}
    ).afterClosed().pipe(
      take(1),
      filter((isDelete: boolean | undefined) => !!isDelete),
    ).subscribe(() => {
      this.dialogRef.close();
      setTimeout(() => this.bookService.deleteBook(this.data.id))
    }) 
  }
}
