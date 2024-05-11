import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function PercentageOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (percentageOnly(valueOfControl.split(" ").join(""))) {
      return null;
    } else {
      return { allowPercentageOnly: true };
    }
  };

  function percentageOnly(identity: string) {
    return !!identity.match(Constant.allowPercentageOnly);
  }
}
