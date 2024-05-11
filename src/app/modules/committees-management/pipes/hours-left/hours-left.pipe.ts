import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursLeft'
})
export class HoursLeftPipe implements PipeTransform {

  transform(value: number, language: string): string {
    
    let hours = Math.ceil(value/ (1000 * 60 * 60))
    if (language == 'en') {
      if (hours == 1) {
        return `an hour`;
      }
      return `${hours} hours`
    } else {
      if (hours == 1) {
        return 'ساعة واحدة';
      } else if (hours == 2) {
        return 'ساعتين';
      } else if (hours > 2 && hours < 10) {
        return `${hours} ساعات `
      } else {
        return ` ${hours}  ساعة`
      }
    }
  }
}
