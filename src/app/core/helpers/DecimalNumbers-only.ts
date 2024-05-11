import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function DecimalNumbersOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (decimalNumbersOnly(valueOfControl.split(" ").join(""))) {
      return null;
    } else {
      return { allowDecimalNumbersOnly: true };
    }
  };

  function decimalNumbersOnly(identity: string) {
    return !!identity.match(Constant.allowDecimalNumbersOnly);
  }

}
