import {Component, OnDestroy, OnInit, AfterContentChecked, ChangeDetectorRef, HostListener} from '@angular/core';
// import * as AOS from 'aos';
import {finalize} from 'rxjs/operators';
import {LookupService} from 'src/app/core/services/lookup.service';
import {ProjectsService} from '../../services/projects.service';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {TranslateService} from '@ngx-translate/core';
import {SortValues} from './enums';
import {NgxPermissionsService} from 'src/app/core/modules/permissions';
import {Permissions} from 'src/app/core/services/permissions';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-projects-main',
  templateUrl: './projects-main.component.html',
  styleUrls: ['./projects-main.component.scss']
})

export class ProjectsMainComponent extends ComponentBase implements OnInit, OnDestroy, AfterContentChecked {

  isFilterDisplayed: boolean;
  noData: boolean = false;
  isShowAssignedToMeFilter: boolean = !!this.permissionsService.getPermission(
    Permissions.PMO.AssignedToMe
  );
  sortItems: any = [
    {
      id: 1,
      name: 'Newest',
      nameAr: 'الأحدث',
      value: SortValues.newest,
      isDefault: true
    },
    {
      id: 2,
      name: 'Oldest',
      nameAr: 'الأقدم',
      value: SortValues.oldest,
      isDefault: false
    },
    {
      id: 3,
      name: 'Last updated',
      nameAr: 'آخر تحديث',
      value: SortValues.lastUpdated,
      isDefault: false
    },
  ]
  searchModel = {
    keyword: null,
    sortBy: "",
    page: 1,
    pageSize: 20,
  }
  filterModel: any = {
    appliedFiltersCount: 0,
    projectName: null,
    status: null,
    types: null,
    fromDate: null,
    toDate: null,
    managerId: null,
    sectorId: null,
    assignedToMe: false
  }
  loading: boolean
  projectsList: any = [];
  projectsTotal: number = 0;
  projectsTypes: any;
  projectsStatus: any;
  lang = this.translate.currentLang;
  private subscriptions = new Subscription();
  popupConfig: { title: string; };
  plannedPercentage: any;
  projectsStatusDropdownList: any;

  constructor(private projectsService: ProjectsService,
              private popupService: PopupService,
              private lookupService: LookupService,
              translateService: TranslateConfigService,
              translate: TranslateService, private permissionsService: NgxPermissionsService,
              private route: ActivatedRoute,
              private router: Router,
              private cdref: ChangeDetectorRef) {
    super(translateService, translate);
    // AOS.init();
    this.onStatusSelect(null)
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }


  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      this.searchModel.keyword = data.keyword;
      this.searchModel.sortBy = data.sortBy;
      this.filterModel.appliedFiltersCount = data.appliedFiltersCount;
      this.filterModel.projectName = data.projectName;
      this.filterModel.status = data.status ? +data.status : null;
      this.filterModel.types = data.types;
      this.filterModel.fromDate = data.fromDate;
      this.filterModel.toDate = data.toDate;
      this.filterModel.managerId = data.managerId;
      this.filterModel.sectorId = data.sectorId;
      this.filterModel.assignedToMe = data.assignedToMe == true || data.assignedToMe == "true";
      this.filterModel.priorityLevel = data.priorityLevel;
      this.filterModel.departmentId = data.departmentId;
      this.filterModel.originId = data.originId;
      this.filterModel.categoryId = data.categoryId;

      this.getProjects(this.searchModel, this.filterModel, false);
      // this.getProjectsTypes()
      this.getProjectsStatus()
    });
    this.handleLangChange();

  }

  handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
      this.getProjectsStatus()
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getQueryParams() {
    return {
      "keyword": this.searchModel.keyword,
      "sortBy": this.searchModel.sortBy,
      "appliedFiltersCount": this.filterModel.appliedFiltersCount,
      "projectName": this.filterModel.projectName,
      "status": this.filterModel.status,
      "types": this.filterModel.types,
      "fromDate": this.filterModel.fromDate,
      "toDate": this.filterModel.toDate,
      "managerId": this.filterModel.managerId,
      "sectorId": this.filterModel.sectorId,
      "assignedToMe": this.filterModel.assignedToMe,
      "priorityLevel": this.filterModel.priorityLevel,
      "departmentId": this.filterModel.departmentId,
      "originId": this.filterModel.originId,
      "categoryId": this.filterModel.categoryId,
    };
  }

  getProjects(searchModel, filterModel, push) {
    !this.loadingExtra && (this.loading = true)
    this.subscriptions.add(this.projectsService.getProjects(searchModel, filterModel).pipe(
        finalize(() => {
        })
      ).subscribe(res => {
        this.noData = res.data.length == 0;
        res.data.forEach((element, index) => {
          element.deliverablesCount = 0;
          element.tasksCount = 0;
          element.milestones.forEach(milestone => {
            element.deliverablesCount = milestone.deliverables?.length ? milestone.deliverables.length + element.deliverablesCount : element.deliverablesCount
            element.tasksCount = milestone.tasks?.length ? milestone.tasks.length + element.tasksCount : element.tasksCount
          });
          this.plannedPercentage = element.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).map(item => item.weight).length === 0 ? 0 : element.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).map(item => item.weight).reduce((prev, next) => prev + next)

          // if (element?.status?.code === 'Closed') {
          //   element['status'] = {
          //     title: {
          //       en: "Closed",
          //       ar: "مغلق",
          //     }
          //   }
          // } else {
          //   element['status'] = {
          //     title: {
          //       en: this.plannedPercentage > element.progress ? "Off Track" : "On Track",
          //       ar: this.plannedPercentage > element.progress ? "متأخر" : "وفق الخطة"
          //     }
          //   }
          // }

          if (element?.status?.code === 'Closed') {
            element['status'] = {
              title: {
                en: "Closed",
                ar: "مغلق",
              }
            }
          } else if (element?.status?.code === 'Delayed' || element?.status?.code === 'OffTrack') {
            element['status'] = {
              title: {
                en: "Off Track",
                ar: "متأخر"
              }
            }
          } else if (element?.status?.code === 'OnTrack') {
            element['status'] = {
              title: {
                en: "On Track",
                ar: "وفق الخطة"
              }
            }
          }
        });
        this.loading = true;
        this.loadingExtra = true;
        if (push) {
          setTimeout(() => {
            this.loading = false;
            this.loadingExtra = false;
            this.projectsList.push(...res.data)
            this.projectsTotal = res.total
          }, 1000)

          this.cdref.detectChanges()
        } else {
          setTimeout(() => {
            this.loading = false;
            this.loadingExtra = false;
            this.projectsList = [...res.data]
            this.projectsTotal = res.total
          }, 1000)
          this.cdref.detectChanges()
        }

      }, err => {
        this.loading = false;
        this.loadingExtra = false;
      })
    )
  }

  getProjectsTypes() {
    this.lookupService.getProjectsTypes().subscribe(res => {
      this.projectsTypes = res
      this.projectsTypes.unshift({
        title: {
          en: "All",
          ar: "الجميع"
        },
        isDefault: true
      })
    })
  }

  getProjectsStatus() {
    this.lookupService.getProjectsStatus().subscribe(res => {
      this.projectsStatus = [...res]
      this.projectsStatusDropdownList = [...res];
      this.projectsStatusDropdownList.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  loadingExtra: boolean = false

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = Math.floor((document.documentElement.scrollTop || document.body.scrollTop)
      + document.documentElement.offsetHeight);
    let max = document.documentElement.scrollHeight;

    if (pos + 1 >= max) {
      (!this.loadingExtra) && this.onLoadMore();
    }
  }

  onLoadMore() {
    if (this.projectsList.length == this.projectsTotal) return;
    this.loadingExtra = true;
    this.searchModel.page++
    this.getProjects(this.searchModel, this.filterModel, true)
  }

  onSort(e) {
    this.searchModel.page = 1
    this.searchModel.sortBy = e.value
    this.projectsList = []
    this.projectsTotal = 0
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  onTypeSelect(e) {
    if (e.en === 'All') {
      this.filterModel.types = null
    } else {
      this.filterModel.types = [e.en]
    }
    this.projectsList = []
    this.projectsTotal = 0
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  onStatusSelect(e) {
    this.filterModel.status = e?.id;
    this.projectsList = []
    this.projectsTotal = 0;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  onFilter() {
    this.popupConfig = {
      title: this.translate.instant('shared.advancedFilter')
    }
    this.popupService.open('project-filter')
  }

  onFilterConfirmed(filter) {
    // this.resetFilterAndSearch()
    this.filterModel = {
      appliedFiltersCount: filter.appliedFiltersCount,
      projectName: filter.projectName,
      fromDate: filter.projectStartDate ? this.formatDate(filter.projectStartDate) : null,
      toDate: filter.projectEndDate ? this.formatDate(filter.projectEndDate) : null,
      managerId: filter.managerId?.id,
      sectorId: filter.sectorId,
      priorityLevel: filter.priorityLevel,
      departmentId: filter.departmentId,
      originId: filter.originId,
      categoryId: filter.categoryId,
      status: this.filterModel.status,
      assignedToMe: this.filterModel.assignedToMe
    }

    this.filterModel.appliedFiltersCount = Object.values(filter).filter(val => val != null).length;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  formatDate(date) {
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }

  resetFilterAndSearch() {
    this.projectsList = []
    this.projectsTotal = 0

    this.searchModel = {
      keyword: null,
      sortBy: this.searchModel.sortBy,
      page: 1,
      pageSize: 20,
    }

    this.filterModel = {
      appliedFiltersCount: 0,
      projectName: null,
      status: this.filterModel.status,
      types: null,
      fromDate: null,
      toDate: null,
      managerId: null,
      sectorId: null,
      priorityLevel: null,
      departmentId: null,
      originId: null,
      categoryId: null,
      assignedToMe: false
    }
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
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  onPaginate(e) {
    this.searchModel.page = e;
    this.projectsTotal = 0;
    this.projectsList = [];
    this.getProjects(this.searchModel, this.filterModel, false);
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
    this.filterModel.assignedToMe = e;
    this.projectsList = []
    this.projectsTotal = 0;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getProjects(this.searchModel, this.filterModel, false)
  }

  public resolveSort(val) {
    if (val == '') {
      return 1;
    } else if (val == 'old') {
      return 2;
    } else if (val == 'update') {
      return 3;
    } else {
      return "";
    }
  }

}
