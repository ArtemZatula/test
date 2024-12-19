import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';

import { Book, BookFormGroup, BookFormGroupValue } from '../book.model'
import { BookService } from '../book.service'

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatDialogModule, MatFormField, MatLabel, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BookDialogComponent>);
  readonly data = inject<Book>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  title = 'Add new book';

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
      description: this.fb.control<string>(this.data?.description || '', {
        nonNullable: true
      }),
    });
  }

  onSubmit() {
    const { id } = this.data;
    if (id) {
      this.bookService.updateBook({...this.bookFormGroup.value as BookFormGroupValue, id});
    } else {
      this.bookService.addBook(this.bookFormGroup.value as BookFormGroupValue);
    }
  }
}
