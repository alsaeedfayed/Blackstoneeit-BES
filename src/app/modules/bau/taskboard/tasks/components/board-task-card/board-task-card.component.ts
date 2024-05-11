import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'app-board-task-card',
  templateUrl: './board-task-card.component.html',
  styleUrls: ['./board-task-card.component.scss']
})
export class BoardTaskCardComponent implements OnInit {

  @Input() lang: string;
  @Input() task: any;
  taskGroup: any = '';

  importanceLevels = [];


  //see more
  descTextInitialLimit = 30;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  toggleMoreText(e: Event) {
    e.stopPropagation()
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;
    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }


  constructor(private taskEnumsDataService: TaskEnumsDataService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.importanceLevels = this.taskEnumsDataService.getTasksPriorities();
    // TODO remove it after fix the user card
    this.task.assignedToInfo = {
      ... this.task.assignedToInfo,
      fullArabicName: this.task.assignedToInfo.fullName
    }
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }





}
