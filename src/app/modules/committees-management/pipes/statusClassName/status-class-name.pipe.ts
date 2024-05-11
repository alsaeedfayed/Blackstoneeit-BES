import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusClassName'
})
export class StatusClassNamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
