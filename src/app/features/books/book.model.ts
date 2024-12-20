import { FormControl } from "@angular/forms"

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string | null;
  coverImage?: File | null;
}

export type Books = Book[];

export type BookFormGroupValue = Omit<Book, 'id'>

export interface BookFormGroup {
  title: FormControl<string>;
  author: FormControl<string>;
  year: FormControl<number>;
  description: FormControl<string | null>;
  coverImage: FormControl<File | null>;
}