import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumKeyByValue'
})
export class EnumKeyByValuePipe implements PipeTransform {

  transform(enumObj: any, enumValue: any): string | undefined {
    const keys = Object.keys(enumObj).filter(key => enumObj[key] === enumValue);
    return keys.length > 0 ? keys[0] : undefined;
  }
}
