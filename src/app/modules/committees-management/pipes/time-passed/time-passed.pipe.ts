import { Pipe, PipeTransform } from '@angular/core';
const { DateTime } = require('luxon');
@Pipe({
  name: 'timePassed'
})
export class TimePassedPipe implements PipeTransform {

  transform(time: string, language: string): string {
    const now = new Date();

    const _time = new Date(time);
    const _timeAr = new DateTime(time).setLocale('ar');
    const _timeEn = new DateTime(time);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = now.getTime() - _time.getTime();

    // Convert the difference to other units if needed
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const minutesPassed = differenceInSeconds / 60;
    const hoursPassed = (minutesPassed / 60);
    const daysPassed = hoursPassed / 24;

    if (daysPassed >= 30) {
      return language == 'en' ? _timeEn.toLocaleString(DateTime.DATE_FULL) : _timeAr.toLocaleString(DateTime.DATE_FULL);
    }
    else if (daysPassed < 30 && daysPassed > 1) {
      let days = Math.floor(daysPassed);
      if (language == 'en') {
        if (days == 1) return `${days} day ago`;
        else return `${days} days ago`;
      } else {
        if (days == 1) return `منذ يوم واحد`;
        else if (days == 2) return `منذ يومان`;
        else if (days > 2 && days < 10) return `منذ ${days} أيام`;
        else return `منذ ${days} يوم`;
      }
    } else if (hoursPassed > 1 && hoursPassed < 24) {
      let hours = Math.floor(hoursPassed);
      if (language == 'en') {
        if (hours == 1) return `${hours} hour ago`;
        else return `${hours} hours ago`;
      } else {
        if (hours == 1) return `منذ ساعة واحدة`;
        else if (hours == 2) return `مضت ساعتان`;
        else if (hours > 2 && hours < 10) return `منذ ${hours} ساعات`;
        else return `منذ ${hours} ساعة`;
      }
    } else if (minutesPassed >= 1) {
      let minutes = Math.floor(minutesPassed);
      if (language == 'en') {
        if (minutes == 1) return `${minutes} minute ago`;
        else return `${minutes} minutes ago`;
      } else {
        if (minutes == 1) return `منذ دقيقة واحدة`;
        else if (minutes == 2) return `منذ دقيقتان`;
        else if (minutes > 2 && minutes < 10) return `منذ ${minutes} دقائق`;
        else return `منذ ${minutes} دقيقة`;
      }
    } else {
      return language == 'en' ? 'now' : 'الآن';
    }
  }
}
