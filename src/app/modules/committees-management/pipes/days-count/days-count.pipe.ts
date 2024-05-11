import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysCount'
})
export class DaysCountPipe implements PipeTransform {

  transform(value: number, language: string): string {
    if (language == 'en') {
      if (value == 1) {
        return `One day`;
      }
      return `${value} days`
    } else {
      if (value == 1) {
        return `يوم واحد`;
      } else if (value == 2) {
        return `يومين`
      } else if (value > 2 && value < 10) {
        return `${value}  أيام `
      } else {
        return ` ${value}  يوما `
      }
    }

  }

}
