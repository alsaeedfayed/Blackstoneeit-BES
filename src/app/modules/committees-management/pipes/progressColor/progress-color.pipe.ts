import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressColor'
})
export class ProgressColorPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) return 'none';
    else if (value > 0 && value <= 50) return 'half';
    else if (value > 50 && value <= 99) return 'afterHalf';
    else return 'done';

  }

}
