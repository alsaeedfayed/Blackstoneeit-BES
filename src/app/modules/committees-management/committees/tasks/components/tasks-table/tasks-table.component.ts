import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { TasksSortBy, sortDirections } from 'src/app/modules/committees-management/enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss']
})
export class TasksTableComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  committeeId: number = 0;

  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  sortKey = TasksSortBy;
  public sortedCol: TasksSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  @Output() changeHappened = new EventEmitter();
  openedTask: any;
  isDetailsModelOpened = false;

  @Output() sortFilter = new EventEmitter();

  @Input() public set SortedCol(val: TasksSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: sortDirections | null) {
    this.sortDirection = val;
  }

  @Output() onPaginateEvent = new EventEmitter();

  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];
  statuses = [
    { id: 0, name: 'Not Started', nameAr: 'لم تبدأ بعد' ,className: 'todoTask'},
    { id: 1, name: 'In Progress', nameAr: 'قيد التنفيذ' ,className: 'inProgressTask'},
    { id: 2, name: 'Done', nameAr: 'مكتملة  ' ,className: 'doneTask'},
    { id: 3, name: 'On Hold', nameAr: 'قيد الإنتظار',className: 'underReviewTask' },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private modelService: ModelService,
    private toastr: ToastrService,
    private taskService : TaskEnumsDataService,
    private confirmationPopupService: ConfirmModalService,
    private httpSer: HttpHandlerService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.committeeId = +this.route.snapshot.parent.params['id'];
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // sort requests items by column
  sort(col: TasksSortBy) {

    if (this.sortedCol === col) {
      if (this.sortDirection === sortDirections.Asc) {
        this.sortDirection = sortDirections.Desc;
      } else {
        this.sortDirection = sortDirections.Asc;
      }
    } else {
      this.sortDirection = sortDirections.Asc
    }

    this.sortedCol = col;
    this.sortFilter.emit({
      sortDirection: this.sortDirection,
      sortKey: this.sortedCol,
    });
  }

  public get ascMode(): boolean {
    return this.sortDirection === sortDirections.Asc;
  }

  public get descMode(): boolean {
    return this.sortDirection === sortDirections.Desc;
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // go to meeting details page
  goToMeetingDetails(id) {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', `${this.committeeId}`).replace(':meetingId', `${id}`);
    this.router.navigateByUrl(path);
  }

  task : any
  isUpdateProgressModelOpened:boolean = false;
  // open task details model
  openTaskDetailsModel(task) {
    this.isDetailsModelOpened = true;
    this.taskService.emitTask(task)


    this.openedTask = task;
    // open model only when come from board
    !this.isUpdateProgressModelOpened && setTimeout(() => {
      this.modelService.open("task-models");
    })
    this.isUpdateProgressModelOpened = false;
  }

  //edit
  isUpdatingTask: boolean = false
  updateTask() {

    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false
    this.isUpdatingTask = true
  }

  // close task details model
  closePopup() {
    this.changeHappened.emit();
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false;
    this.modelService.close();
  }

  // update task progress
  updateTaskProgress(task) {
    this.openedTask = task;
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = true;
  }
  onChangeHappened(){
    this.changeHappened.emit();
  }

  // delete task
  confirmMsg: string
  public deleteTask() {
    this.confirmMsg = `${this.translate.instant('committeeTasks.deleteTask')} ${this.translate.currentLang == 'ar' ? `(${this.openedTask.titleAr}) ؟` : `(${this.openedTask.title}) ?`}`;
    this.confirmationPopupService.open('delete-task');
  }

  //delete task
  // Config.Task.Update, body
  onDeleteTaskConfirmed() {
    this.confirmationPopupService.close('delete-task');
    this.httpSer
      .delete(`${Config.Task.Delete}/${this.openedTask?.id}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.deleteSuccessMsg'));
          this.changeHappened.emit();
        }
      });

  }
}
