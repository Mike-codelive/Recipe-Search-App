import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() switchForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
