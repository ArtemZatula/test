import { inject, Injectable } from '@angular/core';
import { map, merge, of, scan, shareReplay, Subject } from 'rxjs'

import { Book, BookFormGroupValue } from './book.model'
import { INITIAL_BOOKS } from './init-books'


@Injectable({ providedIn: 'root' })
export class BookService {
  private initBooksHandler = (initBooks: Book[]) => () => initBooks;

  private addBookHandler = (book: BookFormGroupValue) =>
      (books: Book[]) => [
        ...books,
        { id: `${books.length++}`, ...book }
      ];

  private updateBookHandler = (updatedBook: Book) =>
    (books: Book[]) => books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );

  private deleteBookHandler = (id: string) =>
    (books: Book[]) => books.filter((book) => book.id !== id);

  readonly addBook$ = new Subject<BookFormGroupValue>();
  readonly updateBook$ = new Subject<Book>();
  readonly deleteBook$ = new Subject<string>();

  readonly books$ = merge(
    of(inject(INITIAL_BOOKS)).pipe(map(this.initBooksHandler)),
    this.addBook$.pipe(map(this.addBookHandler)),
    this.updateBook$.pipe(map(this.updateBookHandler)),
    this.deleteBook$.pipe(map(this.deleteBookHandler)),
  ).pipe(
    scan((state: Book[], handlerFn) => handlerFn(state), []),
    shareReplay()
  )
}
