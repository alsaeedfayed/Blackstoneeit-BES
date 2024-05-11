import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'in-progress-task',
  templateUrl: './in-progress-task.component.html',
  styleUrls: ['./in-progress-task.component.scss']
})
export class InProgressTaskComponent implements OnInit {

  @Input() lang: string;
  @Input() title: string;
  @Input() progress: number;
  @Input() date: string;
  @Input() assignedTo: object;

  constructor() { }

  ngOnInit(): void {
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

}
