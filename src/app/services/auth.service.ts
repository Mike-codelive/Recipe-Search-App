import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiUrl } from '../../enviroments/environment';
import { UserData } from '../user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

const apiUrl = ApiUrl.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  userData = signal<UserData | null>(null);
  favoriteRecipes: number[] = [];

  private tokenKey = 'token';

  constructor(private snackBar: MatSnackBar) {}

  onLogIn() {
    if (this.isLoggedIn()) {
      const credentials = this.retrieveCredentials();

      if (credentials) {
        return JSON.parse(credentials);
      }
      this.httpClient.get(`${apiUrl}/users`).subscribe({
        next: (res: any) => {
          this.saveCredentials(res.userData);
          this.setUserData(res.userData);
        },
        error: (err) => {
          console.error('Failed to fetch user data', err);
        },
      });
      this.setAutoLogout();
    }
  }

  setAutoLogout() {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const timeout = expirationTime - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          this.logout();
          this.userData.set(null);
        }, timeout);
      } else {
        this.logout();
        this.userData.set(null);
      }
    }
  }

  setUserData(userCredentials: any) {
    this.saveCredentials(userCredentials);
    return this.userData.set(userCredentials);
  }

  getUserData() {
    return this.userData;
  }

  saveCredentials(profile: any) {
    localStorage.setItem('credentials', JSON.stringify(profile));
  }

  saveRecipes(recipes: any) {
    localStorage.setItem('recipes', recipes);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey) || '';
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
  }

  addFavoriteRecipe(recipeId: number) {
    this.favoriteRecipes.push(recipeId);
  }

  removeFavoriteRecipe(recipeId: number) {
    this.favoriteRecipes = this.favoriteRecipes.filter((id) => id !== recipeId);
  }

  isLoggedIn() {
    const token = this.getToken();
    const credential = this.retrieveCredentials();
    if (!token && !credential) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  logout(camefrom: boolean = false): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('credentials');
    this.userData.set(null);
    if (camefrom) {
      this.snackBar.open('Session closed', 'Close', {
        duration: 3500,
      });
    } else {
      this.snackBar.open('Session expired!', 'Close', {
        duration: 3500,
      });
    }
  }

  retrieveCredentials() {
    return localStorage.getItem('credentials') || '';
  }

  saveFavoriteRecipe(recipe: any) {
    const recipeToSend = {
      id: recipe.id,
      title: recipe.title,
      extendedIngredients: recipe.extendedIngredients.map(
        (ingredient: { name: string }) => ({
          name: ingredient.name,
        })
      ),
      instructions: recipe.instructions,
    };

    this.addFavoriteRecipe(recipe.id);
    this.snackBar.open('Recipe added to favorites', 'Close', {
      duration: 1500,
    });
    return this.httpClient.post(`${apiUrl}recipes/save`, recipeToSend);
  }

  deleteFavoriteRecipe(recipeId: number) {
    this.httpClient.delete(`${apiUrl}/recipes/user/${recipeId}`).subscribe({
      next: () => {
        this.removeFavoriteRecipe(recipeId);
        this.snackBar.open('Recipe removed from favorites', 'Close', {
          duration: 1500,
        });
      },
      error: (err) => {
        console.error('Error removing favorite', err);
        this.snackBar.open('Error removing recipe', 'Close', {
          duration: 1500,
        });
      },
    });
  }

  getFavoriteRecipes() {
    return this.httpClient.get<any>(`${apiUrl}recipes/user`);
  }
}
