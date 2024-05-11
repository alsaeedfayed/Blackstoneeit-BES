import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sortDirections } from 'src/app/modules/bau/enums/enums';
import { TasksSortBy } from 'src/app/modules/committees-management/enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;


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

  importanceLevels = [];
  statuses = [];


  constructor(
    private translate: TranslateService,
    private modelService: ModelService,
    private taskEnumsDataService: TaskEnumsDataService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // TODO remove it after fix the user card
    this.list.map((task) => {
      if (task.assignedToInfo)
        task.assignedToInfo = {
          ...task.assignedToInfo,
          fullArabicName: task.assignedToInfo.fullName
        }
    });

    this.statuses = this.taskEnumsDataService.getTaskStatuses();
    this.importanceLevels = this.taskEnumsDataService.getTasksPriorities();

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


  isUpdateProgressModelOpened: boolean = false;
  // open task details model
  openTaskDetailsModel(task) {
    this.isDetailsModelOpened = true;

    this.openedTask = task;
    // open model only when come from board
    !this.isUpdateProgressModelOpened && setTimeout(() => {
      this.modelService.open("task-models");
    })
    this.isUpdateProgressModelOpened = false;
  }

  progressUpdated: boolean = false;
  // close task details model
  closePopup() {
    (this.progressUpdated || this.isStatusChanged) && this.changeHappened.emit();
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false;
    this.progressUpdated = false;
    this.isStatusChanged = false;
    this.modelService.close();
  }
  onUpdateTaskProgress() {
    this.progressUpdated = true;
    this.openTaskDetailsModel(this.openedTask);
  }

  // update task progress
  updateTaskProgress(task) {
    this.openedTask = task;
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = true;
  }
  isStatusChanged: boolean = false;
  updateTaskStatus() {
    this.isStatusChanged = true;
  }
}
