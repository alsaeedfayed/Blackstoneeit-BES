import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length?: number, start: number = 0): string {
    if (!length || length <= 0) {
      return value;
    }

    if (value && value.length > length) {
      return value.substring(start, start + length) + '...';
    }

    return value;
  }

}
