import { UserService } from 'src/app/core/services/user.service';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { environment } from 'src/environments/environment';
import { IAnalyticsWidget } from './../../../../shared/components/analytics-widget/iAnalyticsWidget.interface';
import { IAgentQueueItem } from './iAgentQueueItem.interface';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { licenceKey } from 'src/license/license';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'agent-queue-page',
  templateUrl: './agent-queue-page.component.html',
  styleUrls: ['./agent-queue-page.component.scss'],
})
export class AgentQueuePageComponent extends ComponentBase implements OnInit, AfterContentChecked {
  pageTitle: string = 'Agent Queue';
  loading: boolean = true;
  isDownloading: boolean = false;
  agentQueueItems: IAnalyticsWidget[] = [];
  agentQueueList: IAgentQueueItem[] = [];
  agentQueueListFilter: IAgentQueueItem[] = [];
  totalItems: number = 0;
  data: any;

  requestBody = {
    appliedFiltersCount: 0,
    pageIndex: 1,
    pageSize: 30,
    requesterId: null,
    requestNumber: null,
    serviceId: 0,
    creationDate: {
      dateFrom: null,
      dateTo: null
    },
    updatedDate: {
      dateFrom: null,
      dateTo: null
    },
    rating: 0,
    categoryId: 0,
    status: null,
    assignedToMe: false,
    HasSlaOn: false,
    searchKey: null,
    sortDirection: 0,
    sortBy: 0,
  }

  language: string = this.translate.currentLang;

  constructor(
    private httpHandlerService: HttpHandlerService,
    private userSer: UserService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private exportFilesService: ExportFilesService
  ) {
    super(translateService, translate);
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.handleAgentQueueItems();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.requestBody.appliedFiltersCount = data.appliedFiltersCount;
      this.requestBody.searchKey = data.searchKey;
      this.requestBody.status = data.status;
      this.requestBody.categoryId = data.categoryId;
      this.requestBody.assignedToMe = data.assignedToMe;
      this.requestBody.sortDirection = data.sortDirection;
      this.requestBody.sortBy = data.sortBy;
      this.requestBody.requesterId = data.requesterId;
      this.requestBody.requestNumber = data.requestNumber;
      this.requestBody.serviceId = data.serviceId;
      this.requestBody.rating = data.rating;
      this.requestBody.HasSlaOn = data.HasSlaOn;
      this.requestBody.creationDate = data.creationDate ?? { dateFrom: null, dateTo: null };
      this.requestBody.updatedDate = data.updatedDate ?? { dateFrom: null, dateTo: null };
      this.getAllAgentQueue(this.requestBody);
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getQueryParams() {
    return {
      "appliedFiltersCount": this.requestBody.appliedFiltersCount,
      "searchKey": this.requestBody.searchKey,
      "status": this.requestBody.status,
      "categoryId": this.requestBody.categoryId,
      "assignedToMe": this.requestBody.assignedToMe,
      "sortDirection": this.requestBody.sortDirection,
      "sortBy": this.requestBody.sortBy,
      "requesterId": this.requestBody.requesterId,
      "requestNumber": this.requestBody.requestNumber,
      "serviceId": this.requestBody.serviceId,
      "HasSlaOn": this.requestBody.HasSlaOn,
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

  handleStatusesFilter(status: number) {
    this.requestBody.status = status;
    this.requestBody.pageIndex = 1;
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

  handleCategoriesFilter(categoryId: number) {
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
    // this.getAllAgentQueue(this.requestBody);
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
    // this.getAllAgentQueue(this.requestBody);
  }

  handlePagination(page) {
    this.requestBody.pageIndex = page;
    this.getAllAgentQueue(this.requestBody);
  }

  handleSearchFilter(keyword: string) {
    this.requestBody.searchKey = keyword.toLocaleLowerCase() || null;
    this.requestBody.pageIndex = 1;
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

  handleSortFilter(filter: any) {
    this.requestBody.sortDirection = filter.sortDirection;
    this.requestBody.sortBy = filter.sortBy;
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

  // Get ALL Agent Queue
  private getAllAgentQueue(requestBody) {
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

    const apiUrl = `${Config.AgentQueue.GetAll}?pageIndex=${requestBody.pageIndex}&pageSize=${requestBody.pageSize}` +
      `${requestBody.requesterId ? `&requesterId=${requestBody.requesterId}` : ''}` +
      `${requestBody.requestNumber ? `&requestNumber=${requestBody.requestNumber}` : ''}` +
      `&serviceId=${requestBody.serviceId}` +
      `${creationDate.dateFrom ? `&creationDate.DateFrom=${creationDate.dateFrom}&creationDate.DateTo=${creationDate.dateTo}` : '&creationDate=null'}` +
      `${updatedDate.dateFrom ? `&updatedDate.DateFrom=${updatedDate.dateFrom}&updatedDate.DateTo=${updatedDate.dateTo}` : '&updatedDate=null'}` +
      `&rating=${requestBody.rating}&categoryId=${requestBody.categoryId}&status=${requestBody.status}&assignedToMe=${requestBody.assignedToMe}` +
      `${requestBody.searchKey ? `&searchKey=${requestBody.searchKey}` : ''}` +
      `&sortDirection=${requestBody.sortDirection}&sortBy=${requestBody.sortBy}&HasSlaOn=${requestBody.HasSlaOn}`;

    this.httpHandlerService
      .get(apiUrl)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          this.handleAgentQueueItems();
          this.agentQueueListFilter = this.data.agentList || [];
          this.agentQueueList = this.data.agentList || [];
          this.totalItems = this.data.count;
        }
      });
  }

  exportDataHandler() {
    if (this.isDownloading) return;
    this.isDownloading = true;

    let data = {
      requesterId: this.requestBody.requesterId || null,
      requestNumber: this.requestBody.requestNumber || null,
      serviceId: this.requestBody.serviceId || 0,
      categoryId: this.requestBody.categoryId || 0,
      rating: this.requestBody.rating || 0,
      updatedDate: this.requestBody.updatedDate?.dateFrom ? this.requestBody.updatedDate : null,
      creationDate: this.requestBody.creationDate?.dateFrom ? this.requestBody.creationDate : null,
      assignedToMe: this.requestBody.assignedToMe || false,
      status: this.requestBody.status || 0,
      searchKey: this.requestBody.searchKey || null,
      hasSlaOn: this.requestBody.HasSlaOn || false,
      sortDirection: this.requestBody.sortDirection || 0,
      sortBy: this.requestBody.sortBy || 0,
    }
    if (!data.requesterId) {
      delete data.requesterId
    }
    if (!data.requestNumber) {
      delete data.requestNumber
    }
    if (!data.searchKey) {
      delete data.searchKey
    }
    let url = `${Config.AgentQueue.export}`;
    this.exportFilesService.exportData("POST", url, 'Agents.xlsx', data).finally(() => {
      this.isDownloading = false;
    })
  }

  handleAgentQueueItems() {
    this.agentQueueItems = [
      {
        title: this.translate.instant('agentQueue.allRequests'),
        count: this.data?.count,
        bgColor: 'rgba(0, 117, 255, 0.2)'
      },
      {
        title: this.translate.instant('agentQueue.assignedToMe'),
        count: this.data?.assignedToMeRequestCount,
        bgColor: 'rgba(255, 207, 109, 0.33)',
      },
      // {
      //   title: this.translate.instant('agentQueue.unassignedRequests'),
      //   count: this.data?.unAssignedRequestsCount,
      //   bgColor: 'rgba(255, 126, 159, 0.2)',
      // },
      // {
      //   title: 'Out of SLA',
      //   count: data?.slaRequestsCount,
      //   bgColor: 'rgba(255, 207, 109, 0.33)'
      // },
      {
        title: this.translate.instant('agentQueue.inProgress'),
        count: this.data?.openRequestsCount,
        bgColor: 'rgba(27, 227, 167, 0.2)',
      },
      {
        title: this.translate.instant('agentQueue.closed'),
        count: this.data?.closedRequestsCount,
        bgColor: 'rgba(113, 121, 134, 0.1)',
      },
    ];
  }

  handleAdvancedFilter(data: any) {
    this.requestBody.appliedFiltersCount = Object.values(data).filter(val => val != null && val != 0).length;
    this.requestBody.requesterId = data.requesterId || null;
    this.requestBody.requestNumber = data.requestNumber || null;
    this.requestBody.serviceId = data.serviceId || 0;
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
    // this.getAllAgentQueue(this.requestBody)
  }

  // handelFilter() {
  //   const requesterId = this.filterData.requesterId;
  //   const serviceId = this.filterData.serviceId;
  //   const startDate = new Date(this.filterData.date.startDate).getTime();
  //   const endDate = new Date(this.filterData.date.endDate).getTime();
  //   const categoryId = this.filterData.categoryId;
  //   const status = this.filterData.status;
  //   const keyword = this.filterData.keyword;

  //   this.agentQueueListFilter = this.agentQueueList.filter(
  //     (agent: IAgentQueueItem) => {
  //       const date = new Date(agent.creationDate).getTime();
  //       const requester = agent.requester;
  //       return (
  //         (requesterId ? agent.requester.id === requesterId : true) &&
  //         (serviceId ? agent.serviceId === serviceId : true) &&
  //         (startDate ? startDate <= date : true) &&
  //         (endDate ? date <= endDate : true) &&
  //         (categoryId ? agent.categoryId === categoryId : true) &&
  //         (status ? agent.status === status : true) &&
  //         (keyword
  //           ? agent.id.toString().includes(keyword) ||
  //           agent.title.includes(keyword) ||
  //           agent.serviceName.includes(keyword)
  //           : true)
  //       );
  //     }
  //   );
  // }

  openAdvancedFilterModel() {
    this.popupService.open('agent-filter');
  }

  handleSLAFilter(value: boolean) {
    this.requestBody.HasSlaOn = value;
    this.requestBody.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // console.log("request",this.requestBody);
    // this.getAllAgentQueue(this.requestBody);
  }

  resolve(params) {
    if (params.HasSlaOn) {
      params.HasSlaOn = (params.HasSlaOn === "true" || params.HasSlaOn === true);
    }
    if (params.assignedToMe) {
      params.assignedToMe = (params.assignedToMe === "true" || params.assignedToMe === true);
    }
    return params;
  }

}
