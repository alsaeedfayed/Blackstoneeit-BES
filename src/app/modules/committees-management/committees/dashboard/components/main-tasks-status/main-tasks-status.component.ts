import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { MainTasksStatus } from '../../models/MainTasksStatus';

@Component({
  selector: 'app-main-tasks-status',
  templateUrl: './main-tasks-status.component.html',
  styleUrls: ['./main-tasks-status.component.scss']
})
export class MainTasksStatusComponent implements OnInit {
  @Input() committeeId = 0;
  @Input() totalItems: number;
  @Input() language: string;

  filterData: any = {};

  // loading vars 
  loadingNumbers: boolean = true;
  loadingList: boolean = true;

  // main task status Counts 
  mainTasksStatus: MainTasksStatus = {} as MainTasksStatus;
  statusCounts: any = {};
  mainTasks: any[] = []

  // filter data
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private httpSer: HttpHandlerService) { }

  ngOnInit(): void {

    this.handleLangChange();

    this.getMainTaskData();
  }
  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  handelFilter(e) {
    this.filterData = e;
    this.appliedFiltersCount = e.workgroupId == null ? 0 : 1;
    this.getMainTaskData();
  }

  getMainTaskNumbers() {
    this.loadingNumbers = true;
    this.httpSer
      .get(`${Config.Dashboard.GetMainTaskStatus}/${this.committeeId}`, this.filterData)
      .pipe(finalize(() => { this.loadingNumbers = false; }))
      .subscribe((res: MainTasksStatus) => {
        if (res) {
          this.mainTasksStatus = res;
        }
      });
  }
  getTasksList() {
    this.loadingList = true;
    this.httpSer
      .get(`${Config.Dashboard.GetTaskStatusList}/${this.committeeId}`, this.filterData)
      .pipe(finalize(() => { this.loadingList = false; }))
      .subscribe((res) => {
        if (res) {
          this.mainTasks = res.slice(0, 5);
        }
      });
  }
  getMainTaskData() {
    this.getMainTaskNumbers();
    this.getTasksList();
  }

  goToTasks() {
    let path = `/committees-management/committee-details/${this.committeeId}/tasks`;
    this.router.navigateByUrl(path);
  }



}
