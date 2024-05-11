import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assignedTo'
})
export class AssignedToPipe implements PipeTransform {

  transform(value: any): string {
    if (value?.length > 0) {
      if (value.length == 1)
        return value[0].fullName;
      else
        return (`${value.length}`);
    }
    return ('-');
  }
}