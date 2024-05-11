import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UTCTOLOCAL'
})
export class DateTransformPipe implements PipeTransform {

  transform(date: any): Date {

    let lastDate = new Date(date);
    var hourOffset = lastDate.getTimezoneOffset() / 60;
    lastDate.setHours( lastDate.getHours() + hourOffset );
    var newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset()*60*1000);
    var offset = lastDate.getTimezoneOffset() / 60;
    var hours = lastDate.getHours();
    newDate.setHours(hours - offset);
    return newDate;

  }

}





