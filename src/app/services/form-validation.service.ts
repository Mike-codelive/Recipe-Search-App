import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  isControlInvalid(control: AbstractControl): boolean {
    return control.touched && control.dirty && control.invalid;
  }
}
