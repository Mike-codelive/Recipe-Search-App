import { Injectable, signal } from '@angular/core';
import { Recipe } from '../recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes = signal<Recipe[] | undefined>(undefined);
}
