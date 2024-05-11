import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'receivers'
})

export class ReceiversPipe implements PipeTransform {

  transform(count: number, lang: string): string {
    if (count == 1){
      return `${lang == 'en' ? 'One Receiver' : ' مستلم واحد'}`
    }
    else if (count == 2) {
      return `${lang == 'en' ? '2 Receivers' : ' مستلمان'}`
    } else if (count > 2 && count < 11) {
      return `${count}${lang == 'en' ? ' Receivers' : ' مستلمون'}`
    } else {
      return `${count}${lang == 'en' ? ' Receivers' : ' مستلم'}`
    }
  }

}
