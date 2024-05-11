import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})

export class SearchPipe implements PipeTransform {
   transform(value: any, args?: any): any {
    if(!value)return null;
    if(!args || args === " ") return value;
    //if(/\s/.test(args)) return value;
    args = args?.toLowerCase();
    const {parse, stringify} = require('flatted');
    return value?.filter(data=>{
        return stringify(Object.values(data))?.toLowerCase()?.includes(args);
    });
  }
}
