import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

import { Book, BookFormGroup, BookFormGroupValue } from '../book.model'
import { BookService } from '../book.service'

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss'
})
export class BookDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BookDialogComponent>);
  readonly data = inject<Book>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  bookFormGroup!: FormGroup<BookFormGroup>;
  private bookService = inject(BookService);

  ngOnInit() {
    console.log(this.data)

    this.bookFormGroup = this.fb.group<BookFormGroup>({
      title: this.fb.control<string>(this.data?.title || '', { nonNullable: true }),
      author: this.fb.control<string>(this.data?.author || '', { nonNullable: true }),
      year: this.fb.control<number>(this.data?.year || 1900, { nonNullable: true }),
      description: this.fb.control<string>(this.data?.description || '', { nonNullable: true }),
    });
  }

  onSubmit() {
    this.dialogRef.close();
    this.bookService.addBook$.next(this.bookFormGroup.value as BookFormGroupValue);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
