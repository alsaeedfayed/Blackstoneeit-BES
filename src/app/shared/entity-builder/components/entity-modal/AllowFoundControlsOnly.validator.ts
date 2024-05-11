import { AbstractControl, ValidationErrors, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, last, map, switchMap } from 'rxjs/operators';

export function AllowFoundControlsOnly(form:FormGroup): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const valueOfControl: string = control.value;
    let isNotEqualSelect;
    return form.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(data => {
        isNotEqualSelect = data.notEqual;
        if((isNotEqualSelect && valueOfControl != '')  || (isNotEqualSelect == false || isNotEqualSelect == "false")){
          return null;
        }else{
          return { AllowFoundControlsOnly: true };  
        }
      })
    ).pipe(first());
    }
  };



