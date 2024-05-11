import {Pipe, PipeTransform} from '@angular/core';
import {NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {an} from "@fullcalendar/core/internal-common";

@Pipe({
  name: 'DatePipe'
})
export class DateFormatPipe implements PipeTransform {
  constructor(public ngbDateParserFormatter: NgbDateParserFormatter) {
  }

  transform(value: any): any {
   if (value) return this.ngbDateParserFormatter.parse(value)
  }

}
