import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysLeft'
})
export class DaysLeftPipe implements PipeTransform {

  transform(value: string): number {
    const targetDate = new Date(value);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDiff = targetDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  }
}
