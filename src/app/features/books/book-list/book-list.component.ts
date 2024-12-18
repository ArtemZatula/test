import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router'
import { EMPTY, filter, map, merge, Observable, switchMap } from 'rxjs'

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private navEnd$: Observable<NavigationEnd> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
  );
  
  private onNewBookNav$: Observable<null>  = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/new')),
    map(() => null),
  );
  
  private onEditBookNav$: Observable<Book | undefined> = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/edit')),
    switchMap(() => this.route.firstChild ? 
      this.route.firstChild.data.pipe(
        map(({ book }) => book)
      ) : EMPTY
    ),
    filter((book: Book | undefined) => !!book),
  );

  columns = ['title', 'author', 'year', 'delete'];
  books$: Observable<Book[]> = this.bookService.books$;

  constructor() {
    merge(
      this.onNewBookNav$,
      this.onEditBookNav$,
    ).pipe(
      switchMap((book: Book | null | undefined) =>
        this.dialog.open(BookDialogComponent, {data: {...book}}).afterClosed()
      ),
    ).subscribe(() =>
      this.router.navigate(['../'], { relativeTo: this.route })
    );
  }

  onDelete(event: Event, bookId: string): void {
    event.stopPropagation();
    this.bookService.deleteBook$.next(bookId);
  }
}
