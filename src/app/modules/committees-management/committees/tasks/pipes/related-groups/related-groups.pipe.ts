import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'relatedGroups'
})
export class RelatedGroupsPipe implements PipeTransform {

  constructor() {}

  transform(value: any, lang: string): string {
    let groupsCount = value.length;
    if (groupsCount > 1) {
      if (groupsCount == 2) {
        return `${lang == 'en' ? '2 groups' : ' مجموعتان'}`
      } else if (groupsCount > 2 && groupsCount < 11) {
        return `${groupsCount}${lang == 'en' ? ' groups' : ' مجموعات'}`
      } else {
        return `${groupsCount}${lang == 'en' ? ' groups' : ' مجموعة'}`
      }
    } else {
      return value[0];
    }
  }
}