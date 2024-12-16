import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

import { Book } from '../book.model'
import { BookService } from '../book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component'

@Component({
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  imports: [AsyncPipe, MatTableModule],
})
export default class BookListComponent {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  columns = ['title', 'author', 'year'];
  books$ = this.bookService.books$;

  addBook() {
    this.dialog.open(BookDialogComponent);
  }

  openDialog(row: Book) {
    this.dialog.open(BookDialogComponent, {data: { ...row }});
  }

}
