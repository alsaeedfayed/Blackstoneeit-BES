import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    const words = value.replace(/([a-z])([A-Z])/g, '$1 $2').split(/(?=[A-Z])/);

    let englishString = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (i === 0) {
        englishString += word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        englishString += word.toLowerCase();
      }
      if (i !== words.length - 1) {
        englishString += ' ';
      }
    }

    return englishString;
  }
}
