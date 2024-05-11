import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function CapitalLetterOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (capitalLetterOnly(valueOfControl)) {
      return null;
    } else {
      return { capitalLetter: true };
    }
  };

  function capitalLetterOnly(identity: string) {
    return !!identity.match(Constant.capitalLetterOnly);
  }
}
