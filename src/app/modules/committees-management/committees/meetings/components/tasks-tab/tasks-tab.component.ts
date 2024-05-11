import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'tasks-tab',
  templateUrl: './tasks-tab.component.html',
  styleUrls: ['./tasks-tab.component.scss']
})
export class TasksTabComponent implements OnInit {
  @Input() isUpdating: boolean = true;
  @Input() committeeId: number;
  @Input() meetingId: number;

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

  list = [];
  totalItems: number = 0;
  @Output() count = new EventEmitter();

  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];

  // task model properties
  taskItem: any;
  isTaskModelOpened = false;

  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch all tasks
    this.getAllTasks();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all tasks
  getAllTasks() {
    if (!this.meetingId) { return; }

    this.loading = true;

    const query = {
      pageIndex: 1,
      pageSize: 1000000000,
    };

    // send a request to fetch tasks
    this.httpSer
      .get(`${Config.Task.GetMeeting}/${this.meetingId}`, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.list = res?.data;
          this.totalItems = res?.count;
          this.count.emit(this.totalItems);
        }
      });
  }

  // open create/edit task model
  openCreateTaskModel(item?: any) {
    this.taskItem = item;
    this.isTaskModelOpened = true;
    this.modelService.open('create-task');
  }

  // close create/edit task model
  closeCreateTaskModel() {
    this.taskItem = null;
    this.isTaskModelOpened = false;
    this.modelService.close();
  }

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

}
