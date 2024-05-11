import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function EnglishLettersAndNumbersOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (notAllowEnglishLettersAndNumbersOnly(valueOfControl.split(" ").join(""))) {
      return null;
    } else {
      return { englishLettersAndNumbersOnly: true };
    }
  };

  function notAllowEnglishLettersAndNumbersOnly(identity: string) {
    return !!identity.match(Constant.englishLettersAndNumbersOnly);
  }
}
