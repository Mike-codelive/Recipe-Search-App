import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes = signal<{} | undefined>(undefined);
}
