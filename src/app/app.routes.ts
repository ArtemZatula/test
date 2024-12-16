import { Routes } from '@angular/router'

import PageNotFoundPage from './pages/page-not-found/page-not-found.page'

export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('./features/books/book-list/book-list.component'),
  },
  {
    path: '',
    redirectTo: '/books',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundPage
  }, 
]
