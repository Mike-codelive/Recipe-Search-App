import { ApiUrl } from './../../enviroments/environment';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  enteredIngredients = '';
  isFetching = signal(true);

  submitIngredients() {
    if (this.enteredIngredients === '') return;
    this.isFetching.set(true);
    const params = { ingredients: this.enteredIngredients.trim() };
    const subscription = this.httpClient
      .get<{ recipes: Recipe[] }>(`${apiUrl}search/`, { params })
      .subscribe({
        next: (resdata) => {
          console.log(resdata);
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
