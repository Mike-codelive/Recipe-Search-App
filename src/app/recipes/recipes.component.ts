import { Component, computed, inject } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  private recipeService = inject(RecipeService);
  recipes = computed(() => this.recipeService.recipes());

  roundDecimal(figure: number) {
    const roundedNumber = Math.ceil(figure * 10) / 10;
    return roundedNumber;
  }

  // removeSpaceFrom;
}
