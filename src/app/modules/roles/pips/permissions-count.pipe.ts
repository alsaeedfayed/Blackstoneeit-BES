import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissionsCount'
})
export class PermissionsCountPipe implements PipeTransform {
  transform(permissionsGroup: any[]): number {
    if (!permissionsGroup) {
      return 0;
    }

    return permissionsGroup.reduce((count: number, group: any) => {
      return count + (group.children?.length ?? 0);
    }, 0);
  }
}
