import { Component, computed, inject } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  private recipeService = inject(RecipeService);
  recipes = computed(() => this.recipeService.recipes() as Recipe[]);

  // trackByFn(index: number, recipe: any): number {
  //   return recipe.id;
  // }
}
