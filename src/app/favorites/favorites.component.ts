import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  authService = inject(AuthService);
  favoriteRecipes = computed(() => this.authService.favoriteRecipes());

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getFavoriteRecipes().subscribe({
        next: (response) => {
          this.authService.populateFavorites(response.favorites);
          // this.favoriteRecipes = response.favorites.map(
          //   (favorite: any) => favorite.recipe
          // );
        },
        error: (err) => {
          console.error('Error fetching favorite recipes:', err);
        },
      });
    }
  }

  recipeChunks() {
    const allRecipes = this.favoriteRecipes();
    return this.chunkArray(allRecipes, 4);
  }

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
