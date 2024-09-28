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
} from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../enviroments/environment';
import { runInInjectionContext, effect } from '@angular/core';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements AfterViewInit, OnInit {
  private recipeService = inject(RecipeService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

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

  fetchRecipePreparation(recipeId: number) {
    this.isFetchingPreparation[recipeId] = true;

    const subscription = this.httpClient
      .get<{ instructions: string }>(`${apiUrl}search/${recipeId}`)
      .subscribe({
        next: (recipeDet) => {
          this.recipePreparation[recipeId] = recipeDet.instructions;
        },
        complete: () => {
          this.isFetchingPreparation[recipeId] = false;
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
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
