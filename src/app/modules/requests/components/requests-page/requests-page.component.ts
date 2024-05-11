import {Component, OnInit, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {finalize, takeUntil} from 'rxjs/operators';
import {Config} from 'src/app/core/config/api.config';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {ServicesStatus} from 'src/app/core/models/services-status';
import {HttpHandlerService} from 'src/app/core/services/http-handler.service';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {IRequest} from '../../interfaces/request.interface';
import {IAnalyticsWidget} from './../../../../shared/components/analytics-widget/iAnalyticsWidget.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelService} from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.scss'],
})
export class RequestsPageComponent extends ComponentBase implements OnInit, AfterContentChecked {

  reqStats: IAnalyticsWidget[] = [
    {title: 'All Requests', count: 12, bgColor: '#F1F1F1'},
    {title: 'All Requests', count: 8, bgColor: '#1BE3A733'},
    {title: 'All Requests', count: 4, bgColor: '#F58C6A1A'},
  ];
  requests: IRequest[] = [];
  totalItems: number = 0;
  requestsFilter: IRequest[] = [];
  public loading: boolean = true;
  public stats: IAnalyticsWidget[] = [];
  status: number = ServicesStatus.Started;
  ownedTasks: boolean = false;
  serviceTitle: string = '';
  service: string = null;
  language: string = this.translate.currentLang;

  requestBody = {
    // 1111111111111111111111111
    pageIndex: 1,
    pageSize: 30,
    // 1111111111111111111111111
    requesterId: null,
    requestNumber: null,
    serviceId: null,
    rating: 0,
    creationDate: {
      dateFrom: null,
      dateTo: null
    },
    updatedDate: {
      dateFrom: null,
      dateTo: null
    },
    // 1111111111111111111111111
    categoryId: null,
    assignedToMe: false,
    searchKey: null,
    serviceTitle: null,
    serviceTitleAr: null
  }

  isAdvancedFilterClicked: boolean = false;
  filterCount: number = 0

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
  ) {
    super(translateService, translate);
    this.modelService.closeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isAdvancedFilterClicked = false));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.requestBody.serviceTitle = data.serviceTitle;
      this.requestBody.serviceTitleAr = data.serviceTitleAr;
      this.requestBody.searchKey = data.searchKey;
      this.requestBody.categoryId = data.categoryId;
      this.requestBody.assignedToMe = data.assignedToMe;
      this.requestBody.requesterId = data.requesterId;
      this.requestBody.requestNumber = data.requestNumber;
      this.requestBody.serviceId = data.serviceId;
      this.requestBody.rating = data.rating;
      this.requestBody.creationDate = data.creationDate ?? {dateFrom: null, dateTo: null};
      this.requestBody.updatedDate = data.updatedDate ?? {dateFrom: null, dateTo: null};
      this.getAllRequests(this.requestBody);
      console.log(this.requestBody)
      this.filterCount = this.countKeysExcept(this.requestBody, ['pageSize', 'pageIndex'])
      console.log(this.filterCount)
      this.handleLangChange();
    });

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  countKeysExcept(obj, excludedKeys, condition = (value) => value !== null && value !== undefined && value !== "{}" && value !== {
    "dateFrom": null,
    "dateTo": null
  }) {
    let count = 0;

    for (const [key, value] of Object.entries(obj)) {
      if (!excludedKeys.includes(key) && condition(value)) {
        count++;
      }
    }

    return count;
  }

  getQueryParams() {
    return {
      "serviceTitle": this.requestBody.serviceTitle,
      "serviceTitleAr": this.requestBody.serviceTitleAr,
      "searchKey": this.requestBody.searchKey,
      "categoryId": this.requestBody.categoryId ?? 0,
      "assignedToMe": this.requestBody.assignedToMe,
      "requesterId": this.requestBody.requesterId,
      "requestNumber": this.requestBody.requestNumber,
      "serviceId": this.requestBody.serviceId,
      "creationDate": JSON.stringify({
        "dateFrom": this.requestBody.creationDate.dateFrom,
        "dateTo": this.requestBody.creationDate.dateTo,
      }),
      "updatedDate": JSON.stringify({
        "dateFrom": this.requestBody.updatedDate.dateFrom,
        "dateTo": this.requestBody.updatedDate.dateTo,
      }),
      "rating": this.requestBody.rating,
    };
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      if (this.stats[0])
        this.stats[0].title = this.translate.instant('requests.allRequests');
      if (this.stats[1])
        this.stats[1].title = this.translate.instant('requests.openRequests');
      if (this.stats[2])
        this.stats[2].title = this.translate.instant('requests.closedRequests');

      // this.handleFilter();
    });
  }

  // Get ALL Requests
  private getAllRequests(requestBody) {
    this.loading = true;

    const getRequestObj = (data) => {
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    }
    const creationDate = getRequestObj(requestBody.creationDate);
    const updatedDate = getRequestObj(requestBody.updatedDate);

    const apiUrl = `${Config.requests.getAll}?pageIndex=${requestBody.pageIndex}&pageSize=${requestBody.pageSize}` +
      `${requestBody.requesterId ? `&requesterId=${requestBody.requesterId}` : ''}` +
      `${requestBody.requestNumber ? `&requestNumber=${requestBody.requestNumber}` : ''}` +
      `&serviceId=${requestBody.serviceId}` +
      `${creationDate.dateFrom ? `&creationDate.DateFrom=${creationDate.dateFrom}&creationDate.DateTo=${creationDate.dateTo}` : '&creationDate=null'}` +
      `${updatedDate.dateFrom ? `&updatedDate.DateFrom=${updatedDate.dateFrom}&updatedDate.DateTo=${updatedDate.dateTo}` : '&updatedDate=null'}` +
      `&rating=${requestBody.rating}&categoryId=${requestBody.categoryId}&assignedToMe=${requestBody.assignedToMe}` +
      `${requestBody.searchKey ? `&searchKey=${requestBody.searchKey}` : ''}` +
      `${requestBody.serviceTitle ? `&serviceTitle=${requestBody.serviceTitle}` : ''}` +
      `${requestBody.serviceTitleAr ? `&serviceTitleAr=${requestBody.serviceTitleAr}` : ''}`;

    this.httpHandlerService
      .get(apiUrl)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((requests) => {
        const data = requests;
        this.stats = [
          {
            title: this.translate.instant('requests.allRequests'),
            count: data?.allRequests,
            bgColor: 'rgba(0, 117, 255, 0.2)',
          },
          {
            title: this.translate.instant('requests.openRequests'),
            count: data?.openRequests,
            bgColor: 'rgba(27, 227, 167, 0.2)',
          },
          {
            title: this.translate.instant('requests.closedRequests'),
            count: data?.closedRequests,
            bgColor: 'rgba(113, 121, 134, 0.1)',
          },
        ];
        this.requests = data?.servicesRequests || [];
        this.requestsFilter = data?.servicesRequests || [];
        this.totalItems = data.count;
      });
  }

  setRating(obj: any) {
    const query = {
      serviceRequestId: obj.request.id,
      rating: obj.rating
    };
    this.httpHandlerService
      .post(Config.requests.UpdateRating, query)
      //.pipe(finalize(() => (service.isFavouritLoading = false)))
      .subscribe((res) => {
        if (res)
          obj.request.rating = obj.rating;
      });
  }

  openAdvancedFilterModel() {
    this.isAdvancedFilterClicked = true;
    this.modelService.open('requests-filter');
  }

  handleAdvancedFilter(data) {
    this.requestBody.requesterId = data.requesterId || null;
    this.requestBody.requestNumber = data.requestNumber || null;
    this.requestBody.serviceId = data.serviceId || null;
    if (!(this.requestBody.creationDate instanceof Object)) {
      this.requestBody.creationDate = JSON.parse(this.requestBody.creationDate);
    }
    if (!(this.requestBody.updatedDate instanceof Object)) {
      this.requestBody.updatedDate = JSON.parse(this.requestBody.updatedDate);
    }
    this.requestBody.creationDate.dateFrom = data.creationDate?.startDate;
    this.requestBody.creationDate.dateTo = data.creationDate?.endDate;
    this.requestBody.updatedDate.dateFrom = data.updatedDate?.startDate;
    this.requestBody.updatedDate.dateTo = data.updatedDate?.endDate;
    this.requestBody.rating = data.rating || 0;
    this.requestBody.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getAllRequests(this.requestBody);
  }

  handleCategoryFilter(categoryId: number): any {
    this.requestBody.categoryId = categoryId || 0;
    this.requestBody.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getAllRequests(this.requestBody);
  }

  // handleServiceFilter(keyword: string): any {
  //   if(this.language === 'en') {
  //     this.requestBody.serviceTitle = keyword;
  //   } else {
  //     this.requestBody.serviceTitleAr = keyword;
  //   }
  //   this.requestBody.pageIndex = 1;
  //   this.getAllRequests(this.requestBody);
  // }

  handleSearch(keyword: string) {
    this.requestBody.searchKey = keyword;
    this.requestBody.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getAllRequests(this.requestBody);
  }

  handleAssignedToMeFilter(value: boolean) {
    this.requestBody.assignedToMe = value;
    this.requestBody.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getAllRequests(this.requestBody);
  }

  handlePagination(page) {
    this.requestBody.pageIndex = page;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    this.getAllRequests(this.requestBody);
  }

  handleOwnedTasksFilter(toggle: boolean): any {
    // this.ownedTasks = toggle;
    // this.handleFilter();
  }

  handleStatusFilter(statusId: number) {
    // this.status = statusId;
    // this.getAllRequests(this.requestBody);
  }

  // handleFilter() {
  //   if(this.language == 'en')
  //     this.requestsFilter = this.requests.filter(
  //       (requests) =>
  //         (this.catgoryId ? requests.cateogryId == this.catgoryId : true) &&
  //         (this.service ? requests.serviceName.toLowerCase().includes(this.service.toLocaleLowerCase()) : true) &&
  //         (this.ownedTasks ? requests.hasTask == this.ownedTasks : true)
  //     );
  //   else
  //     this.requestsFilter = this.requests.filter(
  //       (requests) =>
  //         (this.catgoryId ? requests.cateogryId == this.catgoryId : true) &&
  //         (this.service ? requests.serviceNameAr.includes(this.service) : true) &&
  //         (this.ownedTasks ? requests.hasTask == this.ownedTasks : true)
  //     );
  // }


  closeAdvancedFilterModel() {
    this.isAdvancedFilterClicked = false;
    this.modelService.close();
  }

}
