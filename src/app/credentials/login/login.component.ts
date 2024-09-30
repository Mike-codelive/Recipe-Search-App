import { Component, EventEmitter, Output, signal } from '@angular/core';
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

import { RegisterComponent } from '../register/register.component';
import { FormValidationService } from '../../services/form-validation.service';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log(email, password);
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
