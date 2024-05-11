import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (value && value.length > maxLength) {
      return { maxLength: { requiredLength: maxLength, actualLength: value.length } };
    }

    return null;
  };
}
