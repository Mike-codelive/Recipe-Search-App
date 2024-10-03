import { AuthService } from './../../services/auth.service';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RegisterComponent } from '../register/register.component';
import { FormValidationService } from '../../services/form-validation.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../../enviroments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RegisterComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  isLogin = signal(false);

  @Output() closeCredentials = new EventEmitter<void>();
  openRegister = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(private validationService: FormValidationService) {}

  get emailIsInvalid() {
    return this.validationService.isControlInvalid(this.form.controls.email);
  }

  get passwordIsInvalid() {
    return this.validationService.isControlInvalid(this.form.controls.password);
  }

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLogin.set(true);
    const { email, password } = this.form.value;

    const subscription = this.httpClient
      .post<{ token: string }>(`${apiUrl}login`, {
        email,
        password,
      })
      .subscribe({
        next: (resData) => {
          this.authService.saveToken(resData.token);
        },
        error: (e) => {
          this.isLogin.set(false);
          if (e.status === 401) {
            this.form.setErrors({ invalidCredentials: true });
            this.form.controls.email.setErrors({ invalid: true });
            this.form.controls.password.setErrors({ invalid: true });
          }
        },
        complete: () => {
          this.authService.onLogIn();
          this.isLogin.set(false);
          this.close();
          this.snackBar.open('Log-in successfully!', 'Close', {
            duration: 5000,
          });
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

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
