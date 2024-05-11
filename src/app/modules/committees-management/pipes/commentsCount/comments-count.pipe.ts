import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentsCount'
})
export class CommentsCountPipe implements PipeTransform {

  transform(count: number, lang: string): string {
    if (count == 1){
      return `${lang == 'en' ? 'One comment' : ' تعليق واحد'}`
    }
    else if (count == 2) {
      return `${lang == 'en' ? '2 comments' : ' تعليقان'}`
    } else if (count > 2 && count < 11) {
      return `${count}${lang == 'en' ? ' comments' : ' تعليقات'}`
    } else {
      return `${count}${lang == 'en' ? ' comments' : ' تعليق'}`
    }
  }

}
