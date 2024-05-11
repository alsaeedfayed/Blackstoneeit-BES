import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uTCToLocalDate'
})
export class UTCToLocalDatePipe implements PipeTransform {

  transform(date: any): Date {
    const lastDate = new Date(date)
    const newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

}
