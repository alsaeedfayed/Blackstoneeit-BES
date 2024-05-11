import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function ArabicLettersAndSpecialChars(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (
      notAllowArabicLettersAndSpecialChars(
        valueOfControl.split(" ").join("")
      ) &&
      valueOfControl.match(Constant.allowArabicLetters)
    ) {
      return null;
    } else {
      return { allowArabicLettersAndSpecialChars: true };
    }
  };

  function notAllowArabicLettersAndSpecialChars(identity: string) {
    // Remove HTML tags
    const cleanText = identity.replace(/<\/?[^>]+(>|$)/g, '');

    // Test if the clean text contains only Arabic characters
    return !!cleanText.match(Constant.allowArabicLettersAndSpecialChars);
  }
}
