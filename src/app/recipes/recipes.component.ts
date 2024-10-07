import { AuthService } from './../services/auth.service';
import {
  Component,
  computed,
  inject,
  DestroyRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../enviroments/environment';
import { runInInjectionContext, effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements AfterViewInit, OnInit {
  authService = inject(AuthService);
  private recipeService = inject(RecipeService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  @ViewChild('recipesSection') recipesSection!: ElementRef;

  recipes = computed(() => this.recipeService.recipes() || []);

  isFetchingPreparation: { [recipeId: number]: boolean } = {};
  recipePreparation: { [recipeId: number]: string | undefined } = {};
  isFavoritedMap = new Map<number, boolean>();

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.getFavoriteRecipes().subscribe({
        next: (response) => {
          this.populateFavorites(response.favorites);
        },
        error: (err) => {
          console.error('Error fetching favorite recipes:', err);
        },
      });
    }

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const recipeData = this.recipes();
        if (recipeData && recipeData.length > 0) {
          this.scrollToRecipes();
        }
      });
    });
  }

  ngAfterViewInit() {}

  scrollToRecipes() {
    setTimeout(() => {
      if (this.recipesSection) {
        this.recipesSection.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 0);
  }

  populateFavorites(favorites: any[]): void {
    this.authService.favoriteRecipes = favorites.map(
      (favorite: any) => favorite.recipe.id
    );

    favorites.forEach((favorite: any) => {
      this.isFavoritedMap.set(favorite.recipe.id, true);
    });
  }

  isFavorited(recipeId: number): boolean {
    return this.isFavoritedMap.get(recipeId) || false;
  }

  async toggleFavoriteRecipe(recipe: any) {
    const isFavorited = this.authService.favoriteRecipes.includes(
      Number(recipe)
    );

    if (isFavorited) {
      this.authService.deleteFavoriteRecipe(recipe);
      this.isFavoritedMap.set(recipe, false);
    } else {
      const fullRecipe = await this.fetchRecipePreparation(recipe, false);

      this.authService.saveFavoriteRecipe(fullRecipe).subscribe({
        next: () => {
          this.isFavoritedMap.set(recipe, true);
        },
        error: (err) => {
          console.error('Error saving favorite recipe:', err);
        },
      });
    }
  }

  fetchRecipePreparation(
    recipeId: number,
    fetchedFromBtn: boolean = true
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isFetchingPreparation[recipeId] = true;

      const subscription = this.httpClient
        .get<{ instructions: string }>(`${apiUrl}search/${recipeId}`)
        .subscribe({
          next: (recipeDet: any) => {
            this.isFetchingPreparation[recipeId] = false;
            if (fetchedFromBtn) {
              this.recipePreparation[recipeId] = recipeDet.instructions;
            }
            resolve(recipeDet);
          },
          error: (err) => {
            this.isFetchingPreparation[recipeId] = false;
            reject(err);
          },
        });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    });
  }

  recipeChunks = computed(() => {
    const allRecipes = this.recipes();
    return this.chunkArray(allRecipes, 4);
  });

  chunkArray(arr: any[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  roundDecimal(figure: number) {
    const roundedNumber = Math.ceil(figure * 10) / 10;
    return roundedNumber;
  }
}
