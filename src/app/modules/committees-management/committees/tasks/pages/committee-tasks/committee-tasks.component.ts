import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksSortBy, sortDirections } from '../../../../enums/enums';
import { UserService } from 'src/app/core/services/user.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import * as moment from 'moment';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
@Component({
  selector: 'app-committee-tasks',
  templateUrl: './committee-tasks.component.html',
  styleUrls: ['./committee-tasks.component.scss']
})
export class CommitteeTasksComponent extends ComponentBase implements OnInit, OnDestroy {

  private endSub$ = new Subject();
  private subscriptions: Subscription[] = [];
  language: string = this.translate.currentLang;
  loading: boolean = false;

  filteredWorkgroupId: number = null;

  //export var
  isDownloading: boolean = false;

  // filtration properties
  searchValue: string = '';
  tempFilterData: any = {};
  filterData: any = {};
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;
  committeeId: number = 0;
  committeeName: { en: string, ar: string } = null;

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

  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id
    this.committeeName = { en: val.name, ar: val.nameAr };
  }


  //task to be edited or deleted.
  task : any;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userSer: UserService,
    private exportFilesService: ExportFilesService,
    private taskService : TaskEnumsDataService
  ) {
    super(translateService, translate);
    this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
      if (Object.entries(params).length > 0) {
        if (params['workgroupId'])
          this.filteredWorkgroupId = JSON.parse(params['workgroupId']);

        this.filterData.workgroupId = JSON.parse(params['workgroupId']);
      }
      setTimeout(() => this.getTasksWithFiltersFromQueryParams());
    }))
  }

  ngOnInit(): void {
    //get id
    this.committeeId = +this.activatedRoute.snapshot.parent.paramMap.get('id');

    this.getTasksWithFiltersFromQueryParams();
    // handles language change event
    this.handleLangChange();

    //listen to data service
    this.taskService.data$.subscribe((data) => {
      this.task = data
    })

    this.getMainTasks(false)
  }


  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');

    // get actions options
    getItems(item): any[] {
      const options = [];
      this.editLabel = this.translate.instant('shared.edit');
      this.deleteLabel = this.translate.instant('shared.delete');

      options.push({
        item: this.editLabel,
        icon: 'bx bx-edit',
      });
      options.push({
        item: this.deleteLabel,
        icon: 'bx bx-trash',
      });

      return options;
    }

    // on select action option
    onOptionSelect(e, item) {
      // if (e === this.editLabel) {
      //   this.openEditPopup(item);

      // } else if (e === this.deleteLabel) {
      //   this.itemDeletedHandler.emit(item);
      // }
    }

    // open edit voting template modal
    openEditPopup(voting) {
      voting.edit = true;
      this.modelService.open('edit-voting' + voting.id);
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
  exportList() {
    if (this.isDownloading) return;
    this.isDownloading = true;
    const body = {
      ...this.filterData,
    };
    if (this.tasksViewMode != 'cards') {
      body.pageIndex = this.paginationModel.pageIndex;
      body.pageSize = this.paginationModel.pageSize;
    } else {
      body.pageIndex = 1;
      //temp
      body.pageSize = 1000000000;
    }
    let url = `${Config.Task.ExportExcel}/${this.committeeId}`;
    let fileName =  this.committeeName[this.language]+ '- Tasks -'+ moment(new Date()).locale(this.language).format('MMM d, y, H:m');
    this.exportFilesService.exportData("POST", url, fileName, body).finally(() => {
      this.isDownloading = false;
    })
  }
  // fetch all tasks
  getAllTasks() {
    this.loading = true;
this.openTask = false;
    const query = {
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
      .get(`${Config.Task.GetAllByCommitteeId}/${this.committeeId}`, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.hasFilters = this.filteredWorkgroupId != null;
          // all tasks items
          this.tasks = res?.data;
          this.totalItems = res?.count;
        }
      });
  }
  openTask : boolean = false
  // open create task model
  openCreateTaskModel() {
    this.openTask = true
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
      delete this.filterData.workgroupId;
      delete this.filterData.mainTaskId;

      this.filteredWorkgroupId = null;
      this.getAllTasks();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;

      this.setQueryParams()
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

  //get main task
  isMainTask : boolean = true
  getMainTasks(isMainTask : boolean){
    if(isMainTask){
      this.isMainTask = true
      this.filterData = {
        ...this.filterData,
        "MainTask": true
      }
    }
    else {
      this.isMainTask = false
      delete this.filterData?.MainTask;
      this.filterData = {
        ...this.filterData,
        //"MainTask": false
      }
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
        "searchKey": searchString
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

  //get tasks by filters from Url Queries
  getTasksWithFiltersFromQueryParams() {
    if (Object.entries(this.filterData).length > 0) {
      this.appliedFiltersCount = Object.entries(this.filterData).length;
      this.emptyFIlters = false;
    }
    this.getAllTasks();
  }

  setQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: null,
      }
    );
  }

  closePopup() {
    this.openTask = false;
    this.modelService.close();
  }
}
