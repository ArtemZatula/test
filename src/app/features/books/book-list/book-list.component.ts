import { animate, style, transition, trigger } from '@angular/animations'
import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router'
import { EMPTY, filter, map, merge, Observable, switchMap } from 'rxjs'

import { DeleteDialogComponent } from '../../../common/components/delete-dialog/delete-dialog.component'
import { Book, Books } from '../book.model'
import { BookService } from '../book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component'


@Component({
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  imports: [
    AsyncPipe,
    MatTableModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule
],  
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(30px)' })),
      ]),
    ]),
  ],
})
export default class BookListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  onSearch(event: Event) {
    this.bookService.onSearch(event);
  }

  private navEnd$: Observable<NavigationEnd> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
  );
  
  private onNewBookNav$: Observable<null>  = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/new')),
    map(() => null),
  );
  
  private onBookDetailsNav$: Observable<Book | undefined> = this.navEnd$.pipe(
    filter((event: NavigationEnd) => event.url.includes('/books/details')),
    switchMap(() => this.route.firstChild ? 
      this.route.firstChild.data.pipe(
        map(({ book }) => book)
      ) : EMPTY
    ),
    filter((book: Book | undefined) => !!book),
  );

  columns = ['title', 'author', 'year', 'delete'];
  searchedBooks$: Observable<Books> = this.bookService.searchedBooks$;

  constructor() {
    merge(
      this.onNewBookNav$,
      this.onBookDetailsNav$,
    ).pipe(
      switchMap((book: Book | null | undefined) =>
        this.dialog.open(BookDialogComponent, {
          data: {...book}, width: '700px'}).afterClosed()
      ),
    ).subscribe(() =>
      this.router.navigate(['../'], { relativeTo: this.route })
    );
  }

  onDelete(event: Event, bookId: string, title: string): void {
    event.stopPropagation();

    this.dialog.open(DeleteDialogComponent, {
      data: { title }, width: '500px', height: '250px'}
    ).afterClosed().subscribe((isDelete: boolean | undefined) => {
      if (isDelete) {
        this.bookService.deleteBook(bookId);
      }
    }) 
  }
}
