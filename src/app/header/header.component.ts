import { ApiUrl } from './../../enviroments/environment';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private recipeService = inject(RecipeService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  enteredIngredients = signal('');
  isFetching = signal(false);

  ingredientsInParams() {
    const ingredientsArray = this.enteredIngredients().split(' ');
    let params = new HttpParams();

    ingredientsArray.forEach((ingredient) => {
      params = params.append('ingredients', ingredient);
    });

    return params;
  }

  submitIngredients() {
    if (this.enteredIngredients() === '') return;
    this.isFetching.set(true);

    const params = this.ingredientsInParams();

    const subscription = this.httpClient
      .get<{ recipes: Recipe[] }>(`${apiUrl}search/`, { params })
      .subscribe({
        next: (resData) => {
          console.log(resData.recipes);
          this.recipeService.recipes.set(resData.recipes);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
