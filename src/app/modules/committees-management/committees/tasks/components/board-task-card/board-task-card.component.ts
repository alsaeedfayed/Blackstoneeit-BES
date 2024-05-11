import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommitteeTask } from '../../models/CommitteeTask';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'board-task-card',
  templateUrl: './board-task-card.component.html',
  styleUrls: ['./board-task-card.component.scss']
})
export class BoardTaskCardComponent implements OnInit {

  @Input() lang: string;
  @Input() task: any;
  @Output() subTaskDetails : EventEmitter<any> = new EventEmitter()
  taskGroup: any = '';

  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];


  //see more
  descTextInitialLimit = 30;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  toggleMoreText(e: Event) {
    e.stopPropagation()
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;
    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }


  constructor(private taskService : TaskEnumsDataService , private translate : TranslateService) { }

  ngOnInit(): void {
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }


  showSubTasksToggler : boolean = false;
  showSubTasks(e : any) {
    e.stopPropagation()
    this.showSubTasksToggler = !this.showSubTasksToggler;

  }

  openSubTaskDetails(event , subTask) {
    event.stopPropagation()
    this.subTaskDetails.emit(subTask)
  }


}
