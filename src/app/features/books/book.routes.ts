import { Routes } from "@angular/router"

import { bookResolver } from "./book.resolver"
import BookListComponent from "./book-list/book-list.component"

export const BOOK_ROUTES: Routes = [
  {
    path: 'new',
    component: BookListComponent
  }, 
  {
    path: 'edit/:id',
    component: BookListComponent,
    resolve: { book: bookResolver }
  }
]; 