import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function ArabicLettersAndNumbersOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (notAllowArabicLettersAndNumbersOnly(valueOfControl.split(" ").join(""))) {
      return null;
    } else {
      return { allowArabicLettersAndNumbersOnly: true };
    }
  };

  function notAllowArabicLettersAndNumbersOnly(identity: string) {
    // Remove HTML tags
    const cleanText = identity.replace(/<\/?[^>]+(>|$)/g, '');

    // Test if the clean text contains only Arabic characters
    return !!cleanText.match(Constant.allowArabicLettersAndNumbersOnly);
  }
}
