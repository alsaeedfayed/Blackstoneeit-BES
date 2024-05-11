import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NumbersOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (isDecimal(valueOfControl)) {
      return null;
    } else {
      return { numbersOnly: true };
    }
  };

  function isDecimal(value: string) {
    // Regular expression to match decimal numbers (including integers, floats, and negative numbers)
    return /^-?\d*\.?\d+$/.test(value);
  }
}
