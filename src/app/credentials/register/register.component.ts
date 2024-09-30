import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() switchForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private validationService: FormValidationService) {}

  get nameIsInvalid() {
    return this.validationService.isControlInvalid(
      this.formRegister.controls.name
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
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }
    const email = this.formRegister.value.email;
    const name = this.formRegister.value.name;
    const password = this.formRegister.value.password;
    console.log(email, password, name);
  }
}
