import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'richTextToText'
})
export class RichTextToTextPipe implements PipeTransform {

  transform(value: string): string {

    const div = document.createElement('div');
    div.innerHTML = value;
    return (div.textContent || div.innerText || '').trim();
  }

}
