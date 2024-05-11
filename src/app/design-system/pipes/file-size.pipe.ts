import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || isNaN(value)) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB'];
    const base = 1024;
    const power = Math.floor(Math.log(value) / Math.log(base));

    return `${(value / Math.pow(base, power)).toFixed(2)} ${units[power]}`;
  }

}
