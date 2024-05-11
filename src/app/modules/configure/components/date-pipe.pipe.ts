import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormatPipe'
})
export class FilterPipe implements PipeTransform {
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
    try{
     value = datePipe.transform(value, 'MM-dd-yyyy');
     return value;
    }
    catch(exp){
      let myVar = JSON.parse(value);
      let myDate = new Date(myVar.year, myVar.month, myVar.day)
      value = datePipe.transform(myDate, 'MM-dd-yyyy');
      return value;
    
  }
}
}