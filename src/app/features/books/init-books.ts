import { InjectionToken } from "@angular/core"

import { Book } from "./book.model"

export const initialBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    description: 'A novel about racism and injustice in the American South.',
  },
];

export const INITIAL_BOOKS = new InjectionToken<Book[]>('InitialBooks');