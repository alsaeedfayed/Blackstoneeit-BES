import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizeDate',
  pure: false
})
export class LocalizeDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) { }
  transform(value: any, pattern: string = 'mediumDate'): any {
    const datePipe: DatePipe = new DatePipe(this.translateService.currentLang == "en" ? "" : "ar-EG-u-nu-latn");
    return datePipe.transform(value, pattern);
  }

}
