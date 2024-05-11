import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getType'
})
export class GetTypePipe implements PipeTransform {

  transform(value: string, types: any[]): unknown {
   // console.log(types.find(type => type.code == value))
    if (!!value) {
      return types.find(type => type.code == value);

    }
    return null;
  }

}
