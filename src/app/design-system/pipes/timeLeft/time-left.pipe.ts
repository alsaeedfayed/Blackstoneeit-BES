import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
@Pipe({
  name: 'timeLeft'
})
export class TimeLeftPipe implements PipeTransform {
  constructor() {
    registerLocaleData(localeAr);
  }

  transform(_date: string, startTime: string, endTime: string, language: string): string {
    let now = new Date();
    let date = this.convertUTCDateToLocalDate(_date);
    let start = this.convertUTCDateToLocalDate(startTime);
    let end = this.convertUTCDateToLocalDate(endTime);
    let day = new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.getHours(), start.getMinutes(), start.getSeconds());
    let dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), end.getHours(), end.getMinutes(), end.getSeconds());

    //  Calculate the difference in milliseconds
    const differenceInMilliseconds = day.getTime() - now.getTime();
    const differenceInMillisecondsEnd = dayEnd.getTime() - now.getTime();

    // // Convert the difference to other units if needed
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const minutesLeft = differenceInSeconds / 60;
    const hoursLeft = (minutesLeft / 60);
    const daysLeft = hoursLeft / 24;

    let days = Math.floor(daysLeft);
    let hours = Math.floor(hoursLeft);
    let minutes = Math.floor(minutesLeft);

    if (minutesLeft < 0) {
      if (differenceInMillisecondsEnd > 0)
        return language == 'en' ? 'now' : 'الآن';
      return formatDate(day, 'MMMM d, y', language);
    }
    if (days >= 1) {
      if (language == 'en') {
        if (days == 1) return `${days} day left`;
        else return `${days} days left`;
      } else {
        if (days == 1) return `باقي يوم واحد`;
        else if (days == 2) return `باقي يومان`;
        else if (days > 2 && days < 10) return `باقي ${days} أيام`;
        else return `باقي ${days} يوما`;
      }
    } else {
      if (Math.floor(hoursLeft) >= 1) {
        if (language == 'en') {
          if (hours == 1) return `${hours} hour left`;
          else return `${hours} hours left`;
        } else {
          if (hours == 1) return `باقي ساعة واحدة`;
          else if (hours == 2) return `باقي ساعتان`;
          else if (hours > 2 && hours < 10) return `باقي ${hours} ساعات`;
          else return `باقي ${hours} ساعة`;
        }
      } else {
        if (language == 'en') {

          if (minutes == 1 ) return `One minute left`;
          else return `${minutes} minutes left`;
        } else {

          if (minutes == 1  ) return `باقي دقيقة واحدة`;
          else if (minutes == 2) return `باقي دقيقتان`;
          else if (minutes > 2 && minutes < 10) return `باقي ${minutes} دقائق`;
          else return `باقي ${minutes} دقيقة`;
        }
      }
    }
  }

  convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
}