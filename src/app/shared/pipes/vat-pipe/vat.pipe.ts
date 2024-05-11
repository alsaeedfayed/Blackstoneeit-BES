import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vat'
})
export class VatPipe implements PipeTransform {

  transform(value: any, args?: any): any {  
    const vatAdded = (value * args) / 100
    return value + vatAdded ;
  }

}
