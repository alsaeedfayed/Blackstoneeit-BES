import { MainTask } from 'src/app/modules/bau/taskboard/main-tasks/models/MainTask';
import { Component, Input, OnInit } from '@angular/core';
import { MainTaskStatusService } from '../../services/main-task-status/main-task-status.service';

@Component({
  selector: 'app-main-task-main-info',
  templateUrl: './main-task-main-info.component.html',
  styleUrls: ['./main-task-main-info.component.scss']
})
export class MainTaskMainInfoComponent implements OnInit {

  @Input() mainTask: MainTask = {} as MainTask;
  @Input() language: string = '';

  mainTasksPriorities: any[] = [];
  mainTaskTrackStatuses: any[] = [];

  // description see more  vars
  descTextInitialLimit = 100;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;


  constructor(private mainTaskStatusService: MainTaskStatusService) { }

  ngOnInit(): void {
    this.mainTasksPriorities = this.mainTaskStatusService.getMainTasksPriorities();
    this.mainTaskTrackStatuses = this.mainTaskStatusService.getMainTasksTrackStatus();
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }
}
