import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateAgo',
  pure: false,
})
export class DateAgoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29)
        // less than 30 seconds ago will show as 'Just now'
        return this.translateService.instant(`date-localization.justNow`);
      const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (this.translateService.currentLang == 'en') {
            return (
              counter +
              this.translateService.instant(`date-localization.${i}`) +
              ' ' +
              this.translateService.instant(`date-localization.ago`)
            );
          } else {
            return (
              this.translateService.instant(`date-localization.ago`) +
              ' ' +
              counter +
              ' ' +
              this.translateService.instant(`date-localization.${i}`)
            );
          }
      }
    }
    return value;
  }
}
