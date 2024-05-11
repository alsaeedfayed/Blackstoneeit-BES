import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { UserService } from 'src/app/core/services/user.service';
import { TasksSortBy, sortDirections } from 'src/app/modules/bau/enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
import { RoutesVariables } from 'src/app/modules/bau/routes';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent extends ComponentBase implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  language: string = this.translate.currentLang;

  @Output() changeHappened = new EventEmitter();
  // loading vars
  isLoadingMainTaskDetails: boolean = true;
  isLoadingTasks: boolean = false;

  // filtration properties
  searchValue: string = '';
  tempFilterData: any = {};
  filterData: any = {};
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;
  mainTaskId: number = 0;

  hasFilters: boolean = false;

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  public sortedCol: TasksSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;
  // all tasks items
  tasks: [] = [];


  //TODO need to be changed
  tasksViewMode = 'cards';

  //task to be edited or deleted.
  task: any;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userSer: UserService,
    private exportFilesService: ExportFilesService,
    private taskService: TaskEnumsDataService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.mainTaskId = +this.activatedRoute.snapshot.parent.paramMap.get('id');
    // handles language change event
    this.handleLangChange();

    this.getAllTasks();

  }

  ngOnDestroy(): void {
    // Perform cleanup tasks and unsubscribe from any subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all meetings
    this.getAllTasks();
  }
  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.sortKey;
      this.sortDirection = filter.sortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter
    };

    // fetch all tasks
    this.getAllTasks();
  }

  // fetch all tasks
  getAllTasks() {
    this.isLoadingTasks = true;

    const query = {
      mainTaskId: this.mainTaskId,
      ...this.filterData,
    };
    if (this.tasksViewMode != 'cards') {
      query.pageIndex = this.paginationModel.pageIndex;
      query.pageSize = this.paginationModel.pageSize;
    } else {
      query.pageIndex = 1;
      //temp
      query.pageSize = 1000000000;
    }

    // send a request to fetch tasks
    this.httpSer
      .get(`${Config.BAU.Tasks.getTasks}`, query)
      .pipe(finalize(() => (this.isLoadingTasks = false)))
      .subscribe((res) => {
        if (res) {
          // all tasks items
          this.tasks = res?.data;
          this.totalItems = res?.total;
        }
      });
  }

  // open create task model
  openCreateTaskModel() {
    this.modelService.open('create-task');
  }

  // handel tasks filter
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      };
    }
    this.emptyFIlters = false;
  }

  // Clear filters Data
  clearFilter() {
    if (!this.emptyFIlters) {
      this.emptyFIlters = true;

      delete this.filterData.importanceLevel;

      this.getAllTasks();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;

    }
  }

  // get tasks assigned to me
  getTasksAssignedToMe(isAssignedToMe: boolean) {
    if (isAssignedToMe) {
      this.filterData = {
        ...this.filterData,
        "assignedToMe": true
      }
    } else {
      delete this.filterData.assignedToMe;
    }
    this.paginationModel.pageIndex = 1;
    this.getAllTasks();
  }


  // get search String from search input
  onSearch(searchString: string) {
    let searchFlag: boolean = false;

    if (searchString.trim() != '') {
      this.filterData = {
        ...this.filterData,
        "keyword": searchString
      }
      searchFlag = true;
    } else {
      delete this.filterData.searchKey;
      searchFlag = true;
    }

    if (searchFlag) {
      this.getAllTasks();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllTasks();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  // change items view mode
  changeViewMode(mode: string) {
    this.tasksViewMode = mode;
    this.getAllTasks();
  }

  onChangeHappened() {
    this.changeHappened.emit();
    this.getAllTasks();
  }
}
