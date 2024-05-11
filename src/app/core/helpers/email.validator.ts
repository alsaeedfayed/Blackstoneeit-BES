import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function EmailAddress(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (isEmailAddress(valueOfControl)) {
      return null;
    } else {
      return { emailOnly: true };
    }
  };

  function isEmailAddress(value: string) {
    // Regular expression to match decimal numbers (including integers, floats, and negative numbers)
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
  }
}
