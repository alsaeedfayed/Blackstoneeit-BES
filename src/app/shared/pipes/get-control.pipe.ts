import { FormGroup, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getControl'
})
export class GetControlPipe implements PipeTransform {

  transform(form: FormGroup, key:string): FormControl {
    return form.get(key) as FormControl;
  }

}
