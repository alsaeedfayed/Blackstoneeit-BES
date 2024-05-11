import { AbstractControl, ValidatorFn } from '@angular/forms';

export function yearValidator(selectedYear: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDateString = control.value;

    if (selectedDateString) {
      const selectedDate = new Date(selectedDateString);
      const selectedDateYear = selectedDate.getFullYear();
      if (selectedDateYear != selectedYear) {
        return { 'invalidYear': true };
      }
    }

    return null;
  };
}
