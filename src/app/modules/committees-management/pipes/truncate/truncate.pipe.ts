import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, maxLength: number = 40): string {
    if (value.length <= maxLength) {
      return value;
    }

    let truncatedText = value.substr(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      truncatedText = truncatedText.substr(0, lastSpaceIndex);
    }

    return truncatedText + '...';
  }

}
