import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute,NavigationEnd,ParamMap,Router, RouterLink } from '@angular/router'
import { EMPTY,filter, map, merge, Observable, of, switchMap, take, tap } from 'rxjs'

import { Book } from '../book.model'
import { BookService } from '../book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component'

@Component({
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  imports: [AsyncPipe, MatTableModule, RouterLink],
})
export default class BookListComponent {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  columns = ['title', 'author', 'year', 'delete'];
  books$: Observable<Book[]> = this.bookService.books$;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  private navEnd$ = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd));

  private onNewBookNav$  = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/new')),
  );

  private findBookById$ = (params: ParamMap | undefined): Observable<Book | null | undefined> => {
    const id = params?.get('id');
    if (!id) return of(null);

    return this.books$.pipe(
      map(books => books.find(b => b.id === id)),
      take(1),
    )
  };

  private onEditBookNav$ = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/edit')),
    switchMap(() => this.route.firstChild ? this.route.firstChild.paramMap : EMPTY),
    switchMap(this.findBookById$),
    tap((book: Book | null | undefined) => {
      if (!book) {
        console.log('No such book');
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }),
    filter((book: Book | null | undefined) => !!book)
  );

  constructor() {
    const afterDialogClosed$ = merge(
      this.onNewBookNav$,
      this.onEditBookNav$,
    ).pipe(
      switchMap((book) =>
        this.dialog.open(BookDialogComponent, {data: {...book}}).afterClosed()
      )
    )
  
    afterDialogClosed$.subscribe(() =>
      this.router.navigate(['../'], { relativeTo: this.route })
    );
  }

  onDelete(event: Event, bookId: string) {
    event.stopPropagation();
    this.bookService.deleteBook$.next(bookId);
  }
}
