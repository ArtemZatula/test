import { InjectionToken } from "@angular/core"

import { Books } from "./book.model"

export const initialBooks: Books = [
  {
    id: 'e737c354-413b-4b37-862f-cbe97a2ec747',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    description: 'A novel about racism and injustice in the American South.',
  },
  {
    id: "2d12dd65-3b80-483e-9846-6c4d4b122190",
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    description: 'A dystopian novel about totalitarianism and surveillance.',
  },
  {
    id: "cf70f390-7f1b-4298-af26-fc0fa3a8d4e7",
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    description: 'A story of wealth, love, and the American dream in the 1920s.',
  },
  {
    id: "f8730195-e512-422c-ad18-c7c9b8cba523",
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    description: 'A romantic novel about manners, marriage, and society in early 19th-century England.',
  },
  {
    id: "195b67e0-fb5a-48a0-8868-52c8083e4b39",
    title: 'Moby-Dick',
    author: 'Herman Melville',
    year: 1851,
    description: 'An epic tale of obsession and revenge between a whaling captain and a white whale.',
  },
];

export const INITIAL_BOOKS = new InjectionToken<Books>('InitialBooks');