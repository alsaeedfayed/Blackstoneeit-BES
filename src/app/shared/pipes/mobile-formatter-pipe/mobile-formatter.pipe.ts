import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobileFormatter'
})
export class MobileFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let formmatedValue = value.match(/.{1,3}/g).join(' ')
    return `+${formmatedValue}`;
  }

}
