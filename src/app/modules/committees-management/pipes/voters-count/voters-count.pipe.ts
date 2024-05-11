import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'votersCount'
})
export class VotersCountPipe implements PipeTransform {

  transform(value: number, language: string): string {
    if (language == 'en') {
      if (value == 1) {
        return `${value} vote`;
      }
      return `${value} votes`
    } else {
      if (value == 1) {
        return `صوت واحد`;
      } else if (value == 2) {
        return `صوتين`
      } else if (value > 2 && value < 10) {
        return `${value}  أصوات `
      } else {
        return ` ${value}  صوت `
      }
    }

  }

}
