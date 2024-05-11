import { Component, DoCheck, IterableDiffers, OnInit } from '@angular/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { BauDashBoardSectorPerformance, BauDashboardStatisticsModel, RoleCoverage, implementationTasks, taskStatus, MainTask, BestContributers, implementationStatutses, Budget, TasksPerQuarter, BauDashboardTasksTable, BauDashboardTaskDetails } from '../../models/bau-dashboard';
import { Event } from '@angular/router';
import { BauDashboardService } from '../../services/bau-dashboard.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-bau-dashboard',
  templateUrl: './bau-dashboard.component.html',
  styleUrls: ['./bau-dashboard.component.scss']
})
export class BauDashboardComponent extends ComponentBase implements OnInit {


  //TODO --------------------------- VARIABLES ----------------------------------------------------

  language: string = this.translate.currentLang;

  //TODO MAIN TASKS
  mainTasks: BauDashboardStatisticsModel

  //TODO TOTAL TASKS
  totalTasks: BauDashboardStatisticsModel;

  //TODO OVERALL PROGRESS
  overAllProgress: BauDashboardStatisticsModel;

  //TODO INDICATE PERFORMANCE CHART
  isMainTasksPerformance: boolean = true

  //TODO BEST CONTRIBUTERS
  bestContributers: BestContributers[]

  //TODO SECTOR PERFORMANCE MAIN TASKS
  sectorPerformance: BauDashBoardSectorPerformance[]

  //TODO SECTOR PERFORMANCE TASKS
  sectorPerformanceTasks: BauDashBoardSectorPerformance[] = [
    { name: 'internationl relation office', nameAr: 'العالمى المكتب', total: 120, onTrackPercentage: 8, offTrackPercentage: 4, notStartedPercentage: 77 },
    { name: 'internationl relation office', nameAr: 'العالمى المكتب', total: 120, onTrackPercentage: 50, offTrackPercentage: 46, notStartedPercentage: 9 },
    { name: 'internationl relation office', nameAr: 'العالمى المكتب', total: 78, onTrackPercentage: 89, offTrackPercentage: 55, notStartedPercentage: 0 },
    { name: 'internationl relation office', nameAr: 'العالمى المكتب', total: 120, onTrackPercentage: 55, offTrackPercentage: 7, notStartedPercentage: 40 }, { name: 'internationl relation office', nameAr: 'العالمى المكتب', total: 120, onTrackPercentage: 14, offTrackPercentage: 30, notStartedPercentage: 0 }

  ]


  //TODO CONTRIBUTERS
  colsDataBestContributers = [{ userField: 'employee', field1: 'mainTasksCount', field2: 'subTasksCount', header: 'Best Contributers', headerAr: 'أفضل المساهمين' }, { userField: 'basicInfo', field1: 'tasksCount', field2: 'subTasksCount', header: 'Main Tasks  Count', headerAr: ' عدد المهام الرئيسية' }]

  colsDataBestContributersTasks = [{ userField: 'employee', field1: 'subTasksCount', field2: 'subTasksCount', header: 'Best Contributers', headerAr: 'أفضل المساهمين' }, { userField: 'basicInfo', field1: 'tasksCount', field2: 'subTasksCount', header: 'Sub Tasks Count', headerAr: ' عدد المهام الفرعية' }]

  workLoadDataBestContributers: any[]

  //TODO TASK IMPLEMENTATION
  tasksImplementationData: implementationTasks

  //TODO IMPLEMENTATION STATUS
  implementationStatusData: implementationStatutses

  //TODO BUDGET
  BudgetData: Budget;

  //TODO TASKS PER QUARTER
  tasksPerQuarter: TasksPerQuarter[]

  //TODO ROLES COVERAGE
  rolesCoverage: RoleCoverage[];

  //TODO INDICATE ACTIVE
  clickedBtn: number = 0;

  //TODO TASKS LIST
  tasks: BauDashboardTaskDetails[]

  //TODO PAGINATION PROPERES
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 20,
  };
  appliedFiltersCount: number = 0;
  filterData: any = {};
  tempFilterData: any = {};
  emptyFIlters: boolean = true;
  filtersCount: number = 0;

  //TODO LOADERS INDICATORS
  isLoadingMainTasks: boolean = true;
  isLoadingTotalTasks: boolean = true;
  isLoadingOverallProgress: boolean = true;
  isLoadingMainTasksPerformance: boolean = true;
  isLoadingTasksPerformance: boolean = true;
  isLoadingContributers: boolean = true;
  isLoadingTaskImplementation: boolean = true;
  isLoadingImplelementationStatus: boolean = true;
  isLoadingTasksPerQuarter: boolean = true;
  isLoadingRolesCoverages: boolean = true;
  isLoadingTasksList: boolean = true;
  isLoadingSpcificPerformance: boolean = false;
  isLoadingBudget: boolean = true;


  //TODO ---------------------------------- CONSTRUCTOR ---------------------------------
  constructor(translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService, private iterableDiffers: IterableDiffers,
    private BAUService: BauDashboardService, private exportAsService: ExportAsService) {
    super(translateService, translate);
  }

  //TODO ----------------------------------- ONINIT --------------------------------------
  currentYear : number;
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear()
    this.filterData.Year = this.currentYear;
    this.filterData.MainTasks = true;

    //language change
    this.handleLanguageChange();

    this.GET_MAIN_TASKS()

    this.GET_TASKS()

    this.GET_OVERALL_PROGRESS()

    this.GET_SECTOR_PERFORMANCE()

    this.GET_tASK_IMPLEMENTATIONS()

    this.GET_BEST_CONTRIBUTERS()

    this.GET_IMPLEMENTATION_STATUS()

    this.GET_BUDGET()

    this.GET_TASKS_PER_QUARTER()

    this.GET_ROLES_COVERAGES()

    this.GET_TASKS_LIST()


  }

  //TODO ------------------------ INTEGRATION ACTIONS ------------------------------------
  //MAIN TASKS
  GET_MAIN_TASKS() {
    this.isLoadingMainTasks = true;
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getMainTasks, query)
      .pipe(finalize(() => (this.isLoadingMainTasks = false)))
      .subscribe((res: BauDashboardStatisticsModel) => {
        if (res) {
          this.mainTasks = res;
        }
      });
  }

  //TASKS
  GET_TASKS() {
    this.isLoadingTotalTasks;
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getTotalSubTasks, query)
      .pipe(finalize(() => (this.isLoadingTotalTasks = false)))
      .subscribe((res: BauDashboardStatisticsModel) => {
        if (res) {
          this.totalTasks = res;
        }
      });
  }

  //OVERALL_PROGRESS
  GET_OVERALL_PROGRESS() {
    this.isLoadingOverallProgress = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getOverAllProgress, query)
      .pipe(finalize(() => (this.isLoadingOverallProgress = false)))
      .subscribe((res: BauDashboardStatisticsModel) => {
        if (res) {
          this.overAllProgress = res;
        }
      });
  }

  //PERFORMANCE MAIN
  GET_SECTOR_PERFORMANCE() {
    this.isLoadingTasksPerformance = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getSectorPerformance, query)
      .pipe(finalize(() => (this.isLoadingTasksPerformance = false, this.isLoadingSpcificPerformance = false)))
      .subscribe((res: BauDashBoardSectorPerformance[]) => {
        if (res) {
          this.sectorPerformance = res;
          this.tempArr = res
        }
      });
  }

  isMainTaskscontributers : boolean = true
  //TODO SWITCH SECTOR PERFORMANCE
  onSwitchChange(isTasksSectorPerformance: boolean) {
    this.searchKey = ""
    this.isLoadingSpcificPerformance = true;
    if (isTasksSectorPerformance) {
      this.filterData.MainTasks = false;
      this.isMainTasksPerformance = false
    }
    else {
      this.filterData.MainTasks = true;
      this.isMainTasksPerformance = true
    }

    this.GET_SECTOR_PERFORMANCE()

  }


  onSwitchChangeContributers(event : boolean) {
    if(event){
      this.isMainTaskscontributers = false
      this.filterData.MainTasks = false
      this.GET_BEST_CONTRIBUTERS()
    }
    else {
      this.isMainTaskscontributers = true
      this.filterData.MainTasks = true
      this.GET_BEST_CONTRIBUTERS()
    }
  }
  tempArr : any[]
  //filteredArr = this.sectorPerformance
  searchKey : string ;
  filterPerformance(){

    if(!this.searchKey) {
      this.sectorPerformance = this.tempArr;

    }
    else{
      this.sectorPerformance = this.tempArr.filter(item => item.name.trim().toLowerCase().indexOf(this.searchKey)> -1 || item.nameAr.trim().toLowerCase().indexOf(this.searchKey)> -1);
    }

  }
  //PERFORMANCE TASKS
  // GET_PERFORMANCE_TASKS() {
  //   this.isLoadingTasksPerformance = true
  //   const query = {
  //     pageIndex: this.paginationModel.pageIndex,
  //     pageSize: this.paginationModel.pageSize,
  //     ...this.filterData,
  //   };
  //   // send a request to fetch requests
  //   this.httpSer
  //     .get(Config.BAU.Dashboard.getTotalSubTasks, query)
  //     .pipe(finalize(() => (this.isLoadingTotalTasks = false)))
  //     .subscribe((res: BauDashboardStatisticsModel) => {
  //       if (res) {
  //         this.totalTasks = res;
  //       }
  //     });
  // }

  //BEST CONTRIBUTERS
  GET_BEST_CONTRIBUTERS() {
    this.isLoadingContributers = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getBestContributers, query)
      .pipe(finalize(() => (this.isLoadingContributers = false)))
      .subscribe((res: BestContributers[]) => {
        if (res) {
          this.bestContributers = res;
        }
      });
  }

  //TASK IMPLEMENTATION
  GET_tASK_IMPLEMENTATIONS() {
    this.isLoadingTaskImplementation = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getTasksPerMontth, query)
      .pipe(finalize(() => (this.isLoadingTaskImplementation = false)))
      .subscribe((res: implementationTasks) => {
        if (res) {
          this.tasksImplementationData = res;
        }
      });
  }

  //IMPELEMENTATION STATUS
  GET_IMPLEMENTATION_STATUS() {
    this.isLoadingImplelementationStatus = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getActualVSPlannedProgress, query)
      .pipe(finalize(() => (this.isLoadingImplelementationStatus = false)))
      .subscribe((res: implementationStatutses) => {
        if (res) {
          this.implementationStatusData = res;
        }
      });
  }

  //BUDGET
  GET_BUDGET() {
    this.isLoadingBudget = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getBudgetStatistics, query)
      .pipe(finalize(() => (this.isLoadingBudget = false)))
      .subscribe((res: Budget) => {
        if (res) {
          this.BudgetData = res;
        }
      });
  }

  //TASKS STATUS
  GET_TASKS_PER_QUARTER() {
    this.isLoadingTasksPerQuarter = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getTasksStatusPerQuarter, query)
      .pipe(finalize(() => (this.isLoadingTasksPerQuarter = false)))
      .subscribe((res: TasksPerQuarter[]) => {
        if (res) {
          this.tasksPerQuarter = res;
        }
      });
  }

  //ROLES COVERAGES
  GET_ROLES_COVERAGES() {
    this.isLoadingRolesCoverages = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getRolesCoverage, query)
      .pipe(finalize(() => (this.isLoadingRolesCoverages = false)))
      .subscribe((res: RoleCoverage[]) => {
        if (res) {
          this.rolesCoverage = res;
        }
      });
  }

  //TASKS LIST
  GET_TASKS_LIST() {
    this.isLoadingTasksList = true
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
      ...this.sortTaskTableQuery
    };
    // send a request to fetch requests
    this.httpSer
      .get(Config.BAU.Dashboard.getTasksDetails, query)
      .pipe(finalize(() => (this.isLoadingTasksList = false)))
      .subscribe((res: BauDashboardTasksTable) => {
        if (res) {
          this.totalItems = res?.count;
          this.tasks = res?.data;
        }
      });
  }

  //TODO ----------------------------------- LOACL ACTIONS ---------------------------------------
  //TODO MAIN LANGUAGE CHANGE
  handleLanguageChange() {
    this.translate.onLangChange.subscribe(res => {
      this.language = res.lang
    })
  }

  //TODO EXPORT

  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'elementID', // the id of html/table element,
    options: { // html-docx-js document options
      orientation: 'landscape',
      margins: {
        top: '11'
      }
    }
  }


  export() {
    this.exportAsService.save(this.exportAsConfig, 'Bau').subscribe(() => {

    })
  }


  //TODO -- HANDLE PAGINATATE -- CALL ALL END POINTS HERE
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;
    // fetch all tasks
    //this.getAllTasks();
    this.GET_TASKS_LIST()
  }

  // TODO CLICK SEARCH FILTER BTN -- CALL ALL APPLIED FILTER METHODS HERE
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    if(!this.filterData.Year){
      this.filterData.Year = this.currentYear
    }
    // this.getAllEvaluations();
    this.appliedFiltersCount = this.filtersCount;


    this.GET_MAIN_TASKS()
    this.GET_TASKS()
    this.GET_OVERALL_PROGRESS()
    this.GET_SECTOR_PERFORMANCE()
    this.GET_tASK_IMPLEMENTATIONS()
    this.GET_BEST_CONTRIBUTERS()
    this.GET_IMPLEMENTATION_STATUS()
    this.GET_BUDGET()
    this.GET_TASKS_PER_QUARTER()
    this.GET_ROLES_COVERAGES()
    this.GET_TASKS_LIST()

  }

  //TODO HANDLE FILTER VALUES
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      }
    }
    this.emptyFIlters = false;
  }

  //TODO CLEAR FILTER DATA
  clearFilter() {
    if (!this.emptyFIlters) {
      this.emptyFIlters = true;

      delete this.filterData.SectorId;
      delete this.filterData.DepartmentId;
      delete this.filterData.SectionId;
      delete this.filterData.MainTaskId;
      delete this.filterData.Year;
      delete this.filterData.FromDate;
      delete this.filterData.ToDate;


      this.paginationModel.pageIndex = 1;
      // this.getAllEvaluations();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
      //this.sectorPerformanceMainTasks = [];
      this.BAUService.Filters$.next(true)

    }
  }

  //TODO GET FILTER COUNTS
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  //TODO FILTER TABLE WITH STATUS
  filterTasksTable(status) {
    this.clickedBtn = status
    if (status) {
      this.filterData.TrackStatus = status
      this.GET_TASKS_LIST()
    }
    else {
      delete this.filterData?.TrackStatus;
      this.GET_TASKS_LIST()
    }
  }

  updateTasksData(){
    this.GET_MAIN_TASKS()
    this.GET_TASKS()
    this.GET_OVERALL_PROGRESS()
    this.GET_SECTOR_PERFORMANCE()
    this.GET_tASK_IMPLEMENTATIONS()
    // this.GET_BEST_CONTRIBUTERS()
    this.GET_IMPLEMENTATION_STATUS()
    // this.GET_BUDGET()
    this.GET_TASKS_PER_QUARTER()
    this.GET_ROLES_COVERAGES()
    this.GET_TASKS_LIST()
  }

  sortTaskTableQuery = {
    OrderBy: null,
    OrderType: null,
  };

  handleSortTaskTableFilter(filter: any) {
    this.sortTaskTableQuery.OrderBy = filter.OrderBy ;
    this.sortTaskTableQuery.OrderType = filter.OrderType;
    this.paginationModel.pageIndex = 1;
    this.GET_TASKS_LIST();
  }
}
