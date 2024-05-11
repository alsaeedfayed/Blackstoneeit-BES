import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { HttpHandlerService } from 'src/app/core/services/http-handler.service'
import { Config } from 'src/app/core/config/api.config'
import { ResquestsStaticsEnum } from '../../enums/enums'
import { CategoriesSLA, RequestStatics, RequestStaticsObj, RequestsStatics, RequestsUpTracking, requestsQueryParams, servicesDistributions } from '../../models/dashboard.model'
import { map } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-serviceandrequest',
  templateUrl: './serviceandrequest.component.html',
  styleUrls: ['./serviceandrequest.component.scss'],
})
export class ServiceandrequestComponent
  implements OnInit, OnDestroy, AfterViewInit {
  //TODO VARIABLES
  requestsStatics: RequestStaticsObj
  requestsClosureRateData: any
  categoriesSLA: CategoriesSLA[]
  trackingUpData: RequestsUpTracking[]
  servicesDistributionsData: servicesDistributions

  requestsParams: requestsQueryParams = {
    FromDate: null,
    ToDate: null,
    CategoryId: null,
  }

  isStaticsLoading: boolean = false
  isClosureRateLoading: boolean = false
  isCategoriesSLALoading: boolean = false
  isTrackingLoading: boolean = false
  isServiceDistributionLoading: boolean = false

  requestsSubscription: Subscription
  closureRateSubscription: Subscription
  categoriesSlaSubscription: Subscription
  trackingSubscription: Subscription
  servicesDistSubscription: Subscription

  domHeight: any
  categoryFilterScroll: boolean = false
  notifyReqIsDone: any
  notifySLAIsDone: any;
  filterCount: number = 0;
  exportLoading: boolean;

  resolveWhenRequestsIsDone = new Promise(
    (resolve) => (this.notifyReqIsDone = resolve),
  )
  resolveWhenSLAIsDone = new Promise(
    (resolve) => (this.notifySLAIsDone = resolve),
  )

  lang: any = this.translateService.currentLang;

  constructor(
    private translateService: TranslateService,
    private serviceDashboard: ServicesDashboardService,
    private http: HttpHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.domHeight = document.body.scrollHeight
  }

  ngOnInit(): void {
    //TODO GET QUERY PARAMS FOR PAGE REFRESH
    this.activatedRoute.queryParams.subscribe(
      (queryParams: requestsQueryParams) => {
        this.filterCount = Object.values(queryParams).filter(v => v != null).length;
        this.requestsParams.FromDate = queryParams.FromDate
        this.requestsParams.ToDate = queryParams.ToDate
        this.requestsParams.CategoryId = queryParams.CategoryId
      },
    )
    this.getRequestsStatics()
    this.getRequestsClosureRate()
    this.getCategoriesSLA()
    this.getRequestsUpTrackingData()
    this.getServicesDistributions()
    this.handleLangChange()
  }

  activeFilterContainer : boolean =false;
    //toggle filter container
    toggleFilterContainers() {
      setTimeout(() => {
        this.activeFilterContainer = !this.activeFilterContainer;
        document.getElementById('filters-cont').classList.toggle('filters-container-active');
      }, 500);
    }

  //TODO ACTIONS

  getQueryParams() {
    return {
      FromDate: this.requestsParams.FromDate,
      ToDate: this.requestsParams.ToDate,
      CategoryId: this.requestsParams.CategoryId,
    }
  }

  // private getCounts() {
  //   this.cardsLoading = true;
  //   const query = {
  //     pageIndex: this.paginationModel.pageIndex,
  //     pageSize: this.paginationModel.pageSize,
  //     ...this.filterData,
  //     searchKey: this.search,
  //     ...(!this.filterData.hasOwnProperty('SortDirection') && { SortDirection: followUpSortDirections.desc }),
  //     ...(!this.filterData.hasOwnProperty('SortBy') && { SortBy: followUpSortBy.CreationDate }),
  //   };

  //   this.httpHandlerService
  //     .get(Config.FollowUp.GetCardsCount, query)
  //     .pipe(finalize(() => (this.cardsLoading = false)))
  //     .subscribe((res) => {
  //       if (res) {
  //         this.totalCount = res.count;
  //         this.closureRate = res.closureRate;
  //         this.delayedRate = res.delayedRate;
  //         this.responseRate = res.onTrackRate;
  //         this.openedCount = res.openCount;
  //         this.closedCount = res.closedCount;
  //         this.delayedCount = res.delayedCount;
  //         this.onTrackCount = res.onTrackCount;
  //       }
  //     });
  // }

  getRequestsStatics()  {
    // this.requestsParams.CategoryId
    // let reqQueryParams = new HttpParams()
    // if (this.requestsParams.FromDate) {
    //   reqQueryParams.append('FromDate', this.requestsParams.FromDate)
    // }
    // if (this.requestsParams.ToDate)
    //   reqQueryParams.append('ToDate', this.requestsParams.ToDate)

    // if (this.requestsParams.CategoryId)
    //   reqQueryParams.append('categoryId', this.requestsParams.CategoryId)

    this.isStaticsLoading = true
    let params = ''
    if (this.requestsParams.FromDate)
      params += `FromDate=${this.requestsParams.FromDate}&`
    if (this.requestsParams.ToDate)
      params += `ToDate=${this.requestsParams.ToDate}&`
    if (this.requestsParams.CategoryId)
      params += `CategoryId=${this.requestsParams.CategoryId}&`
    if (params) params = params.slice(0, -1)

    this.requestsSubscription = this.http
      .get(`${Config.servicesDashboard.GetRequestsStatics}?${params}`)
      .pipe(
        map((res: RequestsStatics) => {
          let requestStaticsObj: RequestStaticsObj = {
            totalRequests: 0,
            started: 0,
            startedPercentage: 0,
            cancelled: 0,
            cancelledPercentage: 0,
            rejected: 0,
            rejectedPercentage: 0,
            closed: 0,
            closedPercentage: 0,
          }
          requestStaticsObj.totalRequests = res.totalRequests
          res.data.map((item: RequestStatics) => {
            switch (item.status) {
              case ResquestsStaticsEnum.Started:
                requestStaticsObj.started = item.total
                requestStaticsObj.startedPercentage = item.percentage
                break
              case ResquestsStaticsEnum.Canceled:
                requestStaticsObj.cancelled = item.total
                requestStaticsObj.cancelledPercentage = item.percentage
                break
              case ResquestsStaticsEnum.Rejected:
                requestStaticsObj.rejected = item.total
                requestStaticsObj.rejectedPercentage = item.percentage
                break
              case ResquestsStaticsEnum.Closed:
                requestStaticsObj.closed = item.total
                requestStaticsObj.closedPercentage = item.percentage
                break
            }
          })
          return requestStaticsObj
        }),
      )
      .subscribe({
        next: (res) => {
          this.requestsStatics = res
          this.isStaticsLoading = false
          console.log('statistics' , res)
        },
        error: (error) => {},
        complete: () => {
          //this.notifyReqIsDone()
          console.log('reqn', this.notifyReqIsDone())
        },
      })
  }

  getRequestsClosureRate() {
    this.isClosureRateLoading = true
    let params = ''
    if (this.requestsParams.FromDate)
      params += `FromDate=${this.requestsParams.FromDate}&`
    if (this.requestsParams.ToDate)
      params += `ToDate=${this.requestsParams.ToDate}&`
    if (this.requestsParams.CategoryId)
      params += `CategoryId=${this.requestsParams.CategoryId}&`
    if (params) params = params.slice(0, -1)
    this.closureRateSubscription = this.http
      .get(`${Config.servicesDashboard.GetClosureRate}?${params}`)
      .subscribe((res) => {
        this.requestsClosureRateData = res
        console.log('rate' , res)
        this.isClosureRateLoading = false
      })
  }

  getCategoriesSLA() {
    this.isCategoriesSLALoading = true
    let params = ''
    if (this.requestsParams.FromDate)
      params += `FromDate=${this.requestsParams.FromDate}&`
    if (this.requestsParams.ToDate)
      params += `ToDate=${this.requestsParams.ToDate}&`
    if (this.requestsParams.CategoryId)
      params += `CategoryId=${this.requestsParams.CategoryId}&`
    if (params) params = params.slice(0, -1)
    this.categoriesSlaSubscription = this.http
      .get(`${Config.servicesDashboard.GetCategoriesSLA}?${params}`)
      .subscribe({
        next: (res: CategoriesSLA[]) => {
          this.categoriesSLA = res
          console.log('sla' , res)
          this.isCategoriesSLALoading = false
        },
        error: (error) => {},
        complete: () => {
        //  this.notifySLAIsDone()

        },
      })
  }

  trackingDataPieChart: {onTrackCount : number ,offTrackCount : number , totalRequests : number }= {onTrackCount : 0 , offTrackCount : 0 ,totalRequests : 0 };

  getRequestsUpTrackingData() {
    this.isTrackingLoading = true
    let params = ''
    if (this.requestsParams.FromDate)
      params += `FromDate=${this.requestsParams.FromDate}&`
    if (this.requestsParams.ToDate)
      params += `ToDate=${this.requestsParams.ToDate}&`
    if (this.requestsParams.CategoryId)
      params += `CategoryId=${this.requestsParams.CategoryId}&`
    if (params) params = params.slice(0, -1)
    this.trackingSubscription = this.http
      .get(`${Config.servicesDashboard.GetRequestsTrackingCharts}?${params}`)
      .subscribe((res: any) => {
        console.log('tracking' , res)
        this.trackingUpData = res
        this.trackingDataPieChart['onTrackCount'] = res?.onTrackCount
        this.trackingDataPieChart['offTrackCount'] = res?.offTrackCount
        this.trackingDataPieChart['totalRequests'] = res?.totalRequests


        this.isTrackingLoading = false
        this.serviceDashboard.pieChartData.next(res)
      })
  }

  getServicesDistributions() {
    this.isServiceDistributionLoading = true
    let params = ''
    if (this.requestsParams.FromDate)
      params += `FromDate=${this.requestsParams.FromDate}&`
    if (this.requestsParams.ToDate)
      params += `ToDate=${this.requestsParams.ToDate}&`
    if (this.requestsParams.CategoryId)
      params += `CategoryId=${this.requestsParams.CategoryId}&`
    if (params) params = params.slice(0, -1)
    this.trackingSubscription = this.http
      .get(`${Config.servicesDashboard.GetServicesDistributions}?${params}`)
      .subscribe((res: servicesDistributions) => {
        console.log('sd' , res)
        this.servicesDistributionsData = res
        this.isServiceDistributionLoading = false
        this.translateService.onLangChange.subscribe((language) => {
          this.serviceDashboard.langSub.next(language)
        })
      })
  }

  async waiting() {
    this.getRequestsStatics()
    await this.resolveWhenRequestsIsDone
    this.getCategoriesSLA()
    await this.resolveWhenSLAIsDone
    this.scrollToDown()
  }

  //TODO HANDLE FILTERS
  handleFromDateFilter(fromDate: any) {

    // if(fromDate) {
    //   fromDate = dayjs()
    //   fromDate = new Date(fromDate?.['$d']?? fromDate).toISOString(),
    //   this.requestsParams.FromDate = fromDate
    // }
    // else { this.requestsParams.FromDate = undefined }

    this.requestsParams.FromDate = fromDate
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })
    //this.waiting()

    // this.getRequestsStatics()
    // this.getCategoriesSLA()
    // this.getServicesDistributions()


    // ;(async () => {
    //   this.getRequestsStatics()
    //   await this.resolveWhenRequestsIsDone
    //   this.getCategoriesSLA()
    // })()

    // this.getRequestsClosureRate()

    // this.getRequestsUpTrackingData()
  }

  handleToDateFilter(toDate: any) {
    // if(toDate) {
    //   toDate = dayjs()
    //   toDate = new Date(toDate?.['$d']?? toDate).toISOString(),
    //   this.requestsParams.ToDate = toDate
    // }
    // else { this.requestsParams.ToDate = undefined }
    this.requestsParams.ToDate = toDate
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })
    // this.getRequestsStatics()
    // // this.getRequestsClosureRate()
    // this.getCategoriesSLA()
    // //this.getRequestsUpTrackingData()
    // this.getServicesDistributions()
  }

  handleCategoryFilter(categoryID: any) {
    this.requestsParams.CategoryId = categoryID
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getRequestsStatics()
    // //this.getRequestsClosureRate()
    // this.getCategoriesSLA()
    // // this.getRequestsUpTrackingData()
    // this.getServicesDistributions()
  }

  handleFilter(data) {
    //if(data.fromDate)
      this.handleFromDateFilter(data.fromDate);
    //if(data.toDate)
      this.handleToDateFilter(data.toDate);
    //if(data.category)
      this.handleCategoryFilter(data.category);

    this.getRequestsStatics()
    this.getCategoriesSLA()
    this.getServicesDistributions();
    this.filterCount = Object.values(data).filter(v => v != null).length;
  }

  handleCancelFilter() {
    this.toggleFilterContainers();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      if (this.trackingUpData) {
        this.getRequestsUpTrackingData()
      }
      if (this.requestsClosureRateData) {
        this.getRequestsClosureRate()
      }
      if (this.servicesDistributionsData) {
        this.getServicesDistributions()
      }
    })
  }

  scrollToDown() {
    window.scroll(0, this.domHeight + 300)
  }

  public export(){

  }

  //TODO DESTROY
  ngOnDestroy(): void {
    this.requestsSubscription.unsubscribe()
    this.closureRateSubscription.unsubscribe()
    this.categoriesSlaSubscription.unsubscribe()
    this.trackingSubscription.unsubscribe()
  }

}
