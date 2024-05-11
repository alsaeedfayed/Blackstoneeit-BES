import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function NumbersOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (allowNumbersOnly(valueOfControl.split(" ").join(""))) {
      return null;
    } else {
      return { allowNumbersOnly: true };
    }
  };

  function allowNumbersOnly(identity: string) {
    return !!identity.match(Constant.allowNumbersOnly);
  }
}
