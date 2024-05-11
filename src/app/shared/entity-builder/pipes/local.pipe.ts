import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'local'
})
export class LocalPipe implements PipeTransform {
  constructor() {

  }
  transform(value: string, valueAr: string, leng: string): any {
    if (!!value && leng == 'en') {
      return value
    } else if (!!valueAr) {
      return valueAr
    }
    return null;
  }

}
