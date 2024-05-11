import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meetingCount'
})
export class MeetingCountPipe implements PipeTransform {

  transform(count: number, lang: string): string {
    if (count == 1){
      return `${lang == 'en' ? 'One meeting' : ' إجتماع واحد'}`
    }
    else if (count == 2) {
      return `${lang == 'en' ? '2 meetings' : ' إجتماعان'}`
    } else if (count > 2 && count < 11) {
      return `${count}${lang == 'en' ? ' meetings' : ' إجتماعات'}`
    } else {
      return `${count}${lang == 'en' ? ' meetings' : ' أجتماع'}`
    }
  }

}
