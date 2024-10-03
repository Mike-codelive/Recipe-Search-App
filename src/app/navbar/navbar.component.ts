import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginComponent } from '../credentials/login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent, MatTooltipModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  userData = this.authService.getUserData();

  isCredentialOpen = signal(false);

  ngOnInit() {
    this.userData.set(this.authService.onLogIn());

    this.authService.onLogIn();
  }

  onLogOut() {
    this.authService.logout();
    this.userData.set(null);
  }

  onCredentials() {
    this.isCredentialOpen.set(true);
  }

  onCloseCredentials() {
    this.isCredentialOpen.set(false);
  }
}
