import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { LoginComponent } from '../credentials/login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { ProfileComponent } from '../credentials/profile/profile.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LoginComponent,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatMenuTrigger,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  userData = this.authService.getUserData();

  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  isCredentialOpen = signal(false);

  onEditProfile() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      restoreFocus: false,
    });

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

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
