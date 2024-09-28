import { Component, signal } from '@angular/core';
import { LoginComponent } from '../credentials/login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isCredentialOpen = signal(false);

  onCredentials() {
    this.isCredentialOpen.set(true);
  }

  onCloseCredentials() {
    this.isCredentialOpen.set(false);
  }
}
