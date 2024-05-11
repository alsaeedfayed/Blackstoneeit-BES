import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constant } from '../config/constant';

export function AllowEnglishLanguageOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueOfControl: string = control.value;
    if (!control.value) {
      return null;
    } else if (notAllowSpecialCharacters(valueOfControl)) {
      return null;
    } else {
      return { allowEnglishLanguageOnly: true };
    }
  };

  function notAllowSpecialCharacters(identity: string) {
    return !!identity.match(Constant.allowEnglishLanguage);
  }
}
