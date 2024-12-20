import { inject } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router"
import { map, of, tap, withLatestFrom } from "rxjs"

import { Book, Books } from "./book.model"
import { BookService } from "./book.service"

export const bookResolver: ResolveFn<Book | undefined> = (
  route: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const bookService = inject(BookService);
  const id = route.params['id'];

  return of(id).pipe(
    withLatestFrom(bookService.books$),
    map(([id, books]: [string, Books]) => books.find(b => b.id === id)),
    tap((book: Book | undefined) => {
      if (!book) {
        snackBar.open(`Book with id = ${id} not found`, 'Redirect to books').afterDismissed()
          .subscribe(() => router.navigate(['../']));
      }
    }),
  );
};