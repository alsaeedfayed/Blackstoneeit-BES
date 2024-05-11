import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'membersCount'
})
export class MembersCountPipe implements PipeTransform {

  transform(value: number, language: string): string {
    if (language == 'en') {
      if (value == 1) {
        return `${value} member`;
      }
      return `${value} members`;
    } else {
      if (value == 1) {
        return `عضو واحد`;
      } else if (value == 2) {
        return `عضوين`
      } else if (value > 2 && value < 10) {
        return `${value} أعضاء `;
      } else {
        return ` ${value} عضوا `;
      }
    }

  }

}
