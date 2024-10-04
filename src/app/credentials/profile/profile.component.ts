import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiUrl } from '../../../enviroments/environment';
import { FormValidationService } from '../../services/form-validation.service';

const apiUrl = ApiUrl.apiUrl;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ProfileComponent>);

  constructor(private validationService: FormValidationService) {}

  // userData: any;

  isProfileEdited = signal(false);

  ngOnInit() {
    // this.userData = this.authService.userData();

    const userData = this.authService.userData();
    if (userData) {
      this.editProfile.patchValue({
        username: userData.username,
        email: userData.email,
      });
    }
  }

  editProfile = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [],
    }),
  });

  get emailIsInvalid() {
    return this.validationService.isControlInvalid(
      this.editProfile.controls.email
    );
  }

  onEditProfile() {
    if (this.editProfile.invalid) {
      this.editProfile.markAllAsTouched();
      return;
    }

    this.isProfileEdited.set(true);
    const { username, email, password } = this.editProfile.value;

    const subscription = this.httpClient
      .put<{ token: string }>(`${apiUrl}users`, {
        username,
        email,
        password,
      })
      .subscribe({
        next: (resData) => {},
        error: (e) => {
          this.isProfileEdited.set(false);
          if (e.status) {
            this.editProfile.setErrors({ invalidCredentials: true });
            this.editProfile.controls.email.setErrors({ invalid: true });
            this.editProfile.controls.password.setErrors({ invalid: true });
          }
        },
        complete: () => {
          this.isProfileEdited.set(false);
          this.dialogRef.close();
          this.authService.setUserData({ username, email });
          this.snackBar.open('Profile Edited successfully!', 'Close', {
            duration: 5000,
          });
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
