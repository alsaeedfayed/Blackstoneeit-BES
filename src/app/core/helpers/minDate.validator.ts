import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function MinDate(date: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minDateMilliseconds = new Date(date).getTime();
    const valueOfControlMilliseconds = new Date(control.value).getTime();
      if (minDateMilliseconds <= valueOfControlMilliseconds) {
      return null;
    } else {
      return { minDate: true };
    }
  };
}
