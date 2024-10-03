import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiUrl } from '../../enviroments/environment';
import { UserData } from '../user.model';

const apiUrl = ApiUrl.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  userData = signal<UserData | null>(null);

  private tokenKey = 'token';

  onLogIn() {
    if (this.isLoggedIn()) {
      const credentials = this.retrieveCredentials();

      if (credentials) {
        return JSON.parse(credentials);
      }
      this.httpClient.get(`${apiUrl}/users`).subscribe({
        next: (res: any) => {
          this.saveCredentials(res.userData);
          this.userData.set(res.userData);
        },
        error: (err) => {
          console.error('Failed to fetch user data', err);
        },
      });
    }
  }

  getUserData() {
    return this.userData;
  }

  saveCredentials(profile: any) {
    localStorage.setItem('credentials', JSON.stringify(profile));
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

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('credentials');
  }

  retrieveCredentials() {
    return localStorage.getItem('credentials') || '';
  }
}
