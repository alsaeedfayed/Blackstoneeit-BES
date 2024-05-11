import { takeUntil } from "rxjs/operators";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { ModelService } from "src/app/shared/components/model/model.service";
import { BauDashboardService } from "../../services/bau-dashboard.service";
import { BauDashboardTaskDetails } from "../../models/bau-dashboard";
import { TaskEnumsDataService } from "../../../taskboard/tasks/services/taskEnumsData/task-enums-data.service";
@Component({
  selector: "app-tasks-rows",
  templateUrl: "./tasks-rows.component.html",
  styleUrls: ["./tasks-rows.component.scss"],
})
export class TasksRowsComponent implements OnInit {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  committeeId: number = 0;



  @Input() list: BauDashboardTaskDetails[] = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 10,
  };
  //sortKey = TasksSortBy;
  //public sortedCol: TasksSortBy | null = null;
  //public sortDirection: sortDirections = sortDirections.Asc;

  @Output() changeHappened = new EventEmitter();
  openedTask: any;
  isDetailsModelOpened = false;

  @Output() sortFilter = new EventEmitter();

  // @Input() public set SortedCol(val: TasksSortBy | null) {
  //   this.sortedCol = val;
  // }
  // @Input() public set SortDirection(val: sortDirections | null) {
  //   this.sortDirection = val;
  // }

  @Output() onPaginateEvent = new EventEmitter();

  taskStatuses: any[] = [];
  taskTrackStatuses: any[] = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: BauDashboardService,
    private modelService: ModelService,
    private taskEnumsDataService: TaskEnumsDataService
  ) {}

  ngOnInit(): void {
    this.restFilters();
    // handles language change event
    //this.committeeId = +this.route.snapshot.parent.params['id'];
    this.handleLangChange();
    this.taskStatuses = this.taskEnumsDataService.getTaskStatuses();
    this.taskTrackStatuses = this.taskEnumsDataService.getTaskTrackStatus();

    this.list.forEach(task => {
      task.group = this.getGroupName(task);
    });
  }
  getGroupName(task): any {
    let group = { en: "", ar: "" };
    if (task?.section) {
      group = { en: task.section.name, ar: task.section.arabicName };
    } else if (task?.department) {
      group = { en: task.department.name, ar: task.department.arabicName };
    } else {
      group = { en: task.sector.name, ar: task.sector.arabicName };
    }
    return group;
  }
  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  // sort requests items by column
  // sort(col: TasksSortBy) {

  //   if (this.sortedCol === col) {
  //     if (this.sortDirection === sortDirections.Asc) {
  //       this.sortDirection = sortDirections.Desc;
  //     } else {
  //       this.sortDirection = sortDirections.Asc;
  //     }
  //   } else {
  //     this.sortDirection = sortDirections.Asc
  //   }

  //   this.sortedCol = col;
  //   this.sortFilter.emit({
  //     sortDirection: this.sortDirection,
  //     sortKey: this.sortedCol,
  //   });
  // }

  // public get ascMode(): boolean {
  //   return this.sortDirection === sortDirections.Asc;
  // }

  // public get descMode(): boolean {
  //   return this.sortDirection === sortDirections.Desc;
  // }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date);
    const newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );

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
    !this.isUpdateProgressModelOpened &&
      setTimeout(() => {
        this.modelService.open("task-models");
      });
    this.isUpdateProgressModelOpened = false;
  }

  progressUpdated: boolean = false;
  isStatusChanged: boolean = false;
  // close task details model
  closePopup() {
    (this.progressUpdated || this.isStatusChanged) &&
      this.changeHappened.emit();
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

  updateTaskStatus() {
    this.isStatusChanged = true;
  }

  @Input() sortQuery;
  lastUpdateSortOrder: string = "normal";
  // rest sort direction to curent sort direction
  restFilters() {
    if (
      this.sortQuery.OrderBy == 'UpdatedDate' ||
      this.sortQuery.OrderBy == null
    )
      this.lastUpdateSortOrder =
        this.sortQuery.OrderType == null
          ? 'normal'
          : this.sortQuery.OrderType == 1
          ? 'sorted'
          : 'reversed';
  }

  // handle  emiting values to parent to call new data
  onLastUpdateSort() {
    switch (this.lastUpdateSortOrder) {
      case "normal":
        // Sort in ascending order by default
        this.sortFilter.emit({ OrderBy: "UpdatedDate", OrderType: 1 });
        break;
      case "sorted":
        // Sort in descending order
        this.sortFilter.emit({ OrderBy: "UpdatedDate", OrderType: 2 });
        break;
      case "reversed":
        // Revert to the original order (normal)
        this.sortFilter.emit({ OrderBy: null, OrderType: null });
        break;
      default:
        break;
    }
  }
}
