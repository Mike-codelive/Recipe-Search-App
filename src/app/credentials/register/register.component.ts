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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiUrl } from '../../../enviroments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() switchForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  isRegister = signal(false);

  constructor(
    private validationService: FormValidationService,
    private snackBar: MatSnackBar
  ) {}

  get nameIsInvalid() {
    return this.validationService.isControlInvalid(
      this.formRegister.controls.username
    );
  }
  get emailIsInvalid() {
    return this.validationService.isControlInvalid(
      this.formRegister.controls.email
    );
  }

  get passwordIsInvalid() {
    return this.validationService.isControlInvalid(
      this.formRegister.controls.password
    );
  }

  formRegister = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  private invalidForm() {
    this.formRegister.setErrors({ invalidCredentials: true });
    this.formRegister.controls.username.setErrors({ invalid: true });
    this.formRegister.controls.email.setErrors({ invalid: true });
    this.formRegister.controls.password.setErrors({ invalid: true });
  }

  onRegister() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }

    this.isRegister.set(true);

    const { username, email, password } = this.formRegister.value;

    const subscription = this.httpClient
      .post<{ status: string }>(`${apiUrl}register`, {
        username,
        email,
        password,
      })
      .subscribe({
        next: () => {},
        error: (e) => {
          this.isRegister.set(false);
          if (e.status === 401) {
            this.invalidForm;
          }
          if (e.status === 400) {
            console.log(e.error.message);
            this.formRegister.controls.email.setErrors({
              duplicateEmail: true,
            });
          }
        },
        complete: () => {
          this.isRegister.set(false);
          this.close.emit();
          this.snackBar.open('Register successfully! Please log in.', 'Close', {
            duration: 5000,
          });
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    console.log(email, password, username);
  }
}
