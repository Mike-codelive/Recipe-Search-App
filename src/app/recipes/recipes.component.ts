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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);
  isFavorited = signal(false);

  @ViewChild('recipesSection') recipesSection!: ElementRef;

  recipes = computed(() => this.recipeService.recipes() || []);

  isFetchingPreparation: { [recipeId: number]: boolean } = {};
  recipePreparation: { [recipeId: number]: string | undefined } = {};

  ngOnInit() {
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

  async toggleFavoriteRecipe(recipeId: number) {
    try {
      const fullRecipe = await this.fetchRecipePreparation(recipeId, false);
      console.log(fullRecipe);
      if (true) {
        this.authService.saveFavoriteRecipe(fullRecipe).subscribe({
          next: () => {
            this.snackBar.open('Recipe saved!', 'Close', { duration: 1500 });
          },
          error: () => {
            this.isFavorited.set(false);
          },
        });
      } else {
        // this.authService.removeFavoriteRecipe(recipeId).subscribe();
      }
    } catch (error) {
      console.log(error);
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
