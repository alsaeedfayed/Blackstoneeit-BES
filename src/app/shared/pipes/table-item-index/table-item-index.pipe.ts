import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableItemIndex'
})
export class TableItemIndexPipe implements PipeTransform {

  transform(index: number, pageSize: number, pageIndex: number): number {
    return index + (pageSize * (pageIndex - 1)) + 1
  }

}
