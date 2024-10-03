import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LoginComponent } from '../credentials/login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
// import { ApiUrl } from '../../enviroments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

// const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent, MatTooltipModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  // private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  userData = signal<string | null>(null);

  isCredentialOpen = signal(false);

  ngOnInit() {
    this.userData.set(this.authService.onLogIn());

    this.authService.onLogIn();

    // this.authService.userData$.subscribe((data) => {
    //   this.userData.set(data);
    //   this.cdr.detectChanges(); // Update the signal when userData changes
    // });

    // if (this.authService.isLoggedIn()) {
    //   const credentials = this.authService.retrieveCredentials();

    //   if (credentials) {
    //     return this.userData.set(JSON.parse(credentials));
    //   }
    //   this.httpClient.get(`${apiUrl}/users`).subscribe({
    //     next: (res: any) => {
    //       this.userData.set(res.userData);
    //       this.saveCredentials(res.userData);
    //       // console.log(res.userData);
    //     },
    //     error: (err) => {
    //       console.error('Failed to fetch user data', err);
    //     },
    //   });
    // }
  }

  onLogOut() {
    this.authService.logout();
    this.userData.set(null);
  }

  // saveCredentials(profile: any) {
  //   localStorage.setItem('credentials', JSON.stringify(profile));
  // }

  onCredentials() {
    this.isCredentialOpen.set(true);
  }

  onCloseCredentials() {
    this.isCredentialOpen.set(false);
  }
}
