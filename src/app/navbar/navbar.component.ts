import { Component, signal } from '@angular/core';
import { LoginComponent } from '../credentials/login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isCredentialOpen = signal(true);

  onCredentials() {
    // console.log('hello login btn');
    this.isCredentialOpen.set(true);
  }

  onCloseCredentials() {
    this.isCredentialOpen.set(false);
  }
}
