import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
  AfterViewInit
} from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';
// import * as AOS from 'aos';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {RequestsService} from '../../services/requests.service';
import * as moment from 'moment';
import {UserService} from 'src/app/core/services/user.service';
import {finalize} from 'rxjs/operators';
import {LookupService} from 'src/app/core/services/lookup.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';
import {Config} from 'src/app/core/config/api.config';
import {ActivatedRoute, Router} from '@angular/router';
import {licenceKey} from 'src/license/license';
import {ExportFilesService} from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-requests-main',
  templateUrl: './requests-main.component.html',
  styleUrls: ['./requests-main.component.scss']
})
export class RequestsMainComponent extends ComponentBase implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
  sortItems: any = [
    {
      name: 'Newest',
      nameAr: 'الأحدث',
      isDefault: true
    },
    {
      name: 'Oldest',
      nameAr: 'الأقدم',
      isDefault: false
    },
    {
      name: 'Last updated',
      nameAr: 'آخر تحديث',
      isDefault: false
    },
  ]
  @ViewChild('cdkStepper')
  cdkStepper: CdkStepper;
  isFilterDisplayed: boolean = false
  requestsStates;
  requestsTypes: any;
  requestsList: any = [];
  requestsTotal: number = 0
  loading: boolean = true;
  searchModel = {
    keyword: null,
    page: 1,
    pageSize: 30
  }
  filterModel: any = {
    appliedFiltersCount: 0,
    hasTask: false,
    projectName: null,
    stateTitle: null,
    types: [],
    fromDate: null,
    toDate: null,
    managerId: null,
    sectorId: null,
    departmentId: null,
    priorityLevel: null,
    originId: null,
    categoryId: null,
    sortBy: "",
    sortDirection: "",
  }
  lang: any;
  popupConfig: { title: string; };
  requestsOrigins: any
  requestsCategories: any;
  requestsSectors: any;
  requestsDepartments: any;
  requestsPriorities: any;
  private subscriptions = new Subscription();
  isExport: boolean;
  isListView: boolean = true;
  totalItems = 0;

  resetFilter() {
    let item = {
      appliedFiltersCount: 0,
      hasTask: false,
      projectName: null,
      stateTitle: null,
      types: [],
      fromDate: null,
      toDate: null,
      managerId: null,
      sectorId: null,
      departmentId: null,
      priorityLevel: null,
      originId: null,
      categoryId: null,
      sortBy: "",
      sortDirection: "",
    }
    return item
  }

  constructor(private popupService: PopupService,
              private userService: UserService,
              private toastr: ToastrService,
              private lookupService: LookupService,
              private requestsService: RequestsService,
              translateService: TranslateConfigService,
              translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private cdref: ChangeDetectorRef,
              private exportFilesService: ExportFilesService
  ) {
    super(translateService, translate);
    //  AOS.init();
    this.onStateSelect(null)
  }

  ngAfterViewInit() {

  }

  async ngOnInit() {
    await this.route.queryParams.subscribe(async data => {
      this.isListView = data.isListView == undefined ? true : (data.isListView == true || data.isListView == "true");
      this.searchModel.keyword = data.keyword;
      this.filterModel.sortBy = data.sortBy;
      this.filterModel.sortDirection = data.sortDirection;
      this.filterModel.appliedFiltersCount = data.appliedFiltersCount;
      this.filterModel.hasTask = data.hasTask == true || data.hasTask == "true";
      this.filterModel.projectName = data.projectName;
      this.filterModel.stateTitle = data.stateTitle;
      this.filterModel.types = data.types && data.types != "undefined" ? Array.isArray(data.types) ? +data.types[0] : +data.types : null;
      this.filterModel.fromDate = data.fromDate;
      this.filterModel.toDate = data.toDate;
      this.filterModel.managerId = data.managerId;
      this.filterModel.sectorId = +data.sectorId;
      this.filterModel.departmentId = +data.departmentId;
      this.filterModel.priorityLevel = +data.priorityLevel;
      this.filterModel.originId = +data.originId;
      this.filterModel.categoryId = +data.categoryId;

      this.lang = this.translateService.getSystemLang()
      await this.getRequestsState();
      this.getRequests(this.searchModel, this.filterModel, false);
      this.getRequestsTypes()
      this.getSectors()
      this.getDepartments()
      this.getPriorities()

      this.subscriptions.add(this.translate.onLangChange.subscribe((language) => {
        this.lang = language.lang;
      }))
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    // log
    // this.filterModel =this.onFilterReset()
  }

  getQueryParams() {
    return {
      "keyword": this.searchModel.keyword,
      "sortBy": this.filterModel.sortBy,
      "sortDirection": this.filterModel.sortDirection,
      "appliedFiltersCount": this.filterModel.appliedFiltersCount,
      "hasTask": this.filterModel.hasTask,
      "projectName": this.filterModel.projectName,
      "stateTitle": this.filterModel.stateTitle,
      "types": this.filterModel.types,
      "fromDate": this.filterModel.fromDate,
      "toDate": this.filterModel.toDate,
      "managerId": this.filterModel.managerId,
      "sectorId": this.filterModel.sectorId,
      "departmentId": this.filterModel.departmentId,
      "priorityLevel": this.filterModel.priorityLevel,
      "originId": this.filterModel.originId,
      "categoryId": this.filterModel.categoryId,
      "isListView": this.isListView
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getRequests(searchModel, filterModel, push?) {
    this.loading = true;
    let filterData = JSON.parse(JSON.stringify(filterModel));
    // if(filterData.stateTitle){
    //   filterData.stateTitle = this.requestsStates.filter(state => {return state.id == parseInt(filterData.stateTitle)})[0].title.en;
    // }
    if (filterData.types) {
      filterData.types = [filterData.types];
    }
    if (this.isListView && filterData.sortBy) {
      filterData.sortBy = filterData.sortBy == 1 ? "Name" : filterData.sortBy == 2 ? "StartDate" : filterData.sortBy == 3 ? "EndDate" : "";
      filterData.sortDirection = filterData.sortDirection == "1" ? "Asc" : "Desc";
    } else {
      delete filterData.sortBy;
      delete filterData.sortDirection;
    }
    this.requestsService.getRequests(searchModel, filterData).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(res => {
      this.totalItems = res.total;
      res.data.forEach((element, index) => {
        let deliverablesCount = 0;
        const startDate: any = moment(new Date(element.startDate))
        const endDate: any = moment(new Date(element.endDate))
        element['duration'] = {
          year: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).years,
          month: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).months,
          day: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).days,
        }
        element.milestones.forEach(milestone => {
          deliverablesCount = milestone.deliverables.length + deliverablesCount
        });
        element['deliverablesCount'] = deliverablesCount
      });
      this.requestsTotal = res.total

      if (push) {
        this.requestsList.push(...res.data)
      } else {
        this.requestsList = res.data
      }

    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

  getRemainingDays(startTime, endtime) {
    const total = Date.parse(endtime) - Date.parse(startTime);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days
  }

  getCountdownFromDays(numberOfDays) {
    const years = Math.floor(numberOfDays / 365);
    const months = Math.floor(numberOfDays % 365 / 30);
    const days = Math.floor(numberOfDays % 365 % 30);
    return {years, months, days};
  }

  async getRequestsState() {
    this.requestsStates = await this.lookupService.getRequestsStates().toPromise();
    this.requestsStates.forEach(obj => {
      obj.name = obj?.title?.en;
      obj.nameAr = obj?.title?.ar;
    });
  }

  getRequestsTypes() {
    this.requestsService.getLookups().subscribe(res => {
      this.requestsTypes = res.find(item => item.lookupType === 'ProjectType').result;
      this.requestsTypes.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.requestsOrigins = res.find(item => item.lookupType === 'ProjectOrigin').result;
      this.requestsOrigins.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.requestsCategories = res.find(item => item.lookupType === 'ProjectCategory').result;
      this.requestsCategories.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    })
  }

  getSectors() {
    this.requestsService.getSectors().subscribe(res => {
      this.requestsSectors = res;
      this.requestsSectors.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getDepartments() {
    this.requestsService.getDepartments().subscribe(res => {
      this.requestsDepartments = res;
      this.requestsDepartments.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getPriorities() {
    this.requestsService.getPriorities().subscribe(res => {
      this.requestsPriorities = res;
      this.requestsPriorities.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  onLoadMore() {
    this.searchModel.page++
    this.getRequests(this.searchModel, this.filterModel, true)
  }

  onSort(e) {
    this.searchModel.page = 1;
    this.filterModel.sortBy = e?.name;
    this.requestsList = []
    this.requestsTotal = 0
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getRequests(this.searchModel, this.filterModel, false)
  }

  onStateSelect(e) {
    this.searchModel.page = 1;
    this.filterModel.stateTitle = e?.name;
    this.requestsList = []
    this.requestsTotal = 0
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getRequests(this.searchModel, this.filterModel, false)
  }


  onCardDropdownSelect(e) {
    if (e === 'Delete') {
      this.popupService.open('request')
    }
  }

  onFilterConfirmed(filter) {
    // this.resetFilterAndSearch()
    this.filterModel = {
      appliedFiltersCount: this.filterModel.appliedFiltersCount,
      hasTask: this.filterModel.hasTask,
      projectName: filter.projectName,
      stateTitle: filter.projectStatus,
      types: filter.projectType && filter.projectType != "undefined" ? Array.isArray(filter.projectType) ? filter.projectType : [filter.projectType] : null,
      fromDate: filter.projectStartDate ? filter.projectStartDate : null,
      toDate: filter.projectEndDate ? filter.projectEndDate : null,
      managerId: filter.managerId?.id ?? filter.managerId,
      sectorId: filter.sectorId,
      originId: filter.originId,
      priorityLevel: filter.priorityLevel,
      categoryId: filter.categoryId,
      departmentId: filter.departmentId,
    }

    this.filterModel.appliedFiltersCount = Object.values(filter).filter(val => val != null && val != false).length;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getRequests(this.searchModel, this.filterModel, false)
  }

  onFilterReset() {
    this.resetFilterAndSearch()
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getRequests(this.searchModel, this.filterModel, false)
  }

  public handleSearchFilter(keyword: string) {
    this.searchModel.keyword = keyword;
    this.searchModel.page = 1;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  onAssignedToMeChange(e) {
    this.searchModel.page = 1
    this.requestsList = []
    this.requestsTotal = 0

    if (e) {
      this.filterModel.hasTask = true
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: this.getQueryParams(),
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
      // this.getRequests(this.searchModel, this.filterModel, false)
    } else {
      this.filterModel.hasTask = false
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: this.getQueryParams(),
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
      // this.getRequests(this.searchModel, this.filterModel, false)
    }
  }

  resetFilterAndSearch() {
    this.requestsList = []
    this.requestsTotal = 0
    this.filterModel = {
      appliedFiltersCount: 0,
      hasTask: false,
      projectName: null,
      stateTitle: null,
      types: [],
      fromDate: null,
      toDate: null,
      managerId: null,
      sectorId: null,
      sortBy: "",
      sortDirection: "",
    }
    this.searchModel = {
      keyword: null,
      page: 1,
      pageSize: 30
    }
  }

  onFilter() {
    this.popupService.open("request-filter")
    this.popupConfig = {
      title: "Advanced Filter"
    }
  }

  formatDate(date) {
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }

  // go to create project page
  goToCreateProject() {
    this.router.navigateByUrl('/create-project');
  }

  exportData() {
    if (this.isExport) return;
    this.isExport = true;

    let url = `${Config.Projects.ExportRequests}`;
    let body = {searchModel: this.searchModel, filterModel: this.filterModel};
    this.exportFilesService.exportData("POST", url, 'Requests.xlsx', body).finally(() => {
      this.isExport = false;
    })
  }

  changeViewMode(mode) {
    this.isListView = mode === 'list' ? true : false;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  handleSortFilter(filter: any) {
    this.filterModel.sortDirection = filter.sortDirection;
    this.filterModel.sortBy = filter.sortBy;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getAllAgentQueue(this.requestBody);
  }

  handlePagination(page) {
    this.searchModel.page = page;
    this.getRequests(this.searchModel, this.filterModel);
  }

}
