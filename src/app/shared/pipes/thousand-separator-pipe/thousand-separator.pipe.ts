import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator'
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value){
      return 0
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  }

}