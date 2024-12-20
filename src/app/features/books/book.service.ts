import { inject, Injectable } from '@angular/core';
import { combineLatest, debounceTime, map, merge, Observable, of, scan, shareReplay, startWith, Subject } from 'rxjs';

import { Book, BookFormGroupValue, Books } from './book.model'
import { INITIAL_BOOKS } from './init-books'


@Injectable({ providedIn: 'root' })
export class BookService {
  private initBooksHandler = (initBooks: Books) => (): Books => initBooks;

  private addBookHandler = (book: BookFormGroupValue) =>
      (books: Books): Books => [{ id: crypto.randomUUID(), ...book }, ...books];

  private updateBookHandler = (updatedBook: Book) =>
    (books: Books): Books => books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );

  private deleteBookHandler = (id: string) =>
    (books: Books): Books => books.filter((book) => book.id !== id);

  private addBook$ = new Subject<BookFormGroupValue>();
  private updateBook$ = new Subject<Book>();
  private deleteBook$ = new Subject<string>();
  private onSearch$ = new Subject<Event>();

  readonly books$: Observable<Books> = merge(
    of(inject(INITIAL_BOOKS)).pipe(map(this.initBooksHandler)),
    this.addBook$.pipe(map(this.addBookHandler)),
    this.updateBook$.pipe(map(this.updateBookHandler)),
    this.deleteBook$.pipe(map(this.deleteBookHandler)),
  ).pipe(
    scan((state: Books, handlerFn): Books => handlerFn(state), []),
    shareReplay()
  )

  addBook(val: BookFormGroupValue): void {
    this.addBook$.next(val);
  }

  updateBook(val: Book): void {
    this.updateBook$.next(val);
  }

  deleteBook(id: string): void {
    this.deleteBook$.next(id);
  }

  onSearch(event: Event): void  {
    this.onSearch$.next(event);
  }

  private debouncedSearch$: Observable<string> = this.onSearch$.pipe(
    debounceTime(200),
    map((event: Event) => (event.target as HTMLInputElement).value),
    startWith(''),
  );

  readonly searchedBooks$: Observable<Books> = combineLatest([
    this.debouncedSearch$,
    this.books$
  ]).pipe(
    map(([search, books]: [string, Books]) => {
      search = search.trim().toLowerCase();
      return search ?
        books.filter(b => 
          b.author.toLowerCase().includes(search) || b.title.toLowerCase().includes(search)) :
        books
    })
  )
}
