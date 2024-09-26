import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Output() closeCredentials = new EventEmitter<void>();
  openRegister = signal(false);

  close() {
    this.closeCredentials.emit();
  }

  openRegisterForm() {
    this.openRegister.set(true);
  }

  switchToLogin() {
    this.openRegister.set(false);
  }
}
