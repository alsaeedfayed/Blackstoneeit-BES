import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'votesCount'
})
export class VotesCountPipe implements PipeTransform {

  transform(votesCount: number, lang: string): string {
    if (votesCount > 1) {
      if (votesCount == 2) {
        return `${lang == 'en' ? '2 votes' : ' صوتان'}`
      } else if (votesCount > 2 && votesCount < 11) {
        return `${votesCount}${lang == 'en' ? ' votes' : ' أصوات'}`
      } else {
        return `${votesCount}${lang == 'en' ? ' votes' : ' صوتا'}`
      }
    } else if (votesCount == 1) {
      return `${lang == 'en' ? '1 vote' : ' صوت واحد'}`
    } else
      return ``;
  }

}
