import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FollowUpPerQuarter, MeetingsPerQuarter, TopLoadedUsers, closureRate, followUpItem, followUpItems, followUpMeetingsStatus, followUpQueryParams, followUpStatics, progressTracking } from '../../models/dashboard.model'
import { Observable, Subject, Subscription, forkJoin } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { HttpHandlerService } from 'src/app/core/services/http-handler.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Config } from 'src/app/core/config/api.config'
import { map } from 'rxjs/operators'
import { meetingsStatus } from '../../enums/enums'

@Component({
  selector: 'app-services-dashboard-followup',
  templateUrl: './services-dashboard-followup.component.html',
  styleUrls: ['./services-dashboard-followup.component.scss'],
})
export class ServicesDashboardFollowupComponent implements OnInit, OnDestroy, AfterViewInit {
  //TODO VARIABLES
  followUpPerQuarterData: FollowUpPerQuarter[]
  meetingsPerQuarterData: MeetingsPerQuarter[]
  progressTrackingData: progressTracking
  ClosureRateDate: closureRate[]
  followUpItemsData: followUpItems
  meetingStatusData: followUpMeetingsStatus
  topLoadedEmployees: TopLoadedUsers[]
  items$: Subject<any> = new Subject()
  topLoadedEmps$: Subject<any> = new Subject()
  status$: Subject<any> = new Subject()

  //scrolls
  handleSectorScroll: boolean = false
  handleDeptScroll: boolean = false
  handleFromScroll: boolean = false
  handleToScroll: boolean = false

  handleItemsScroll: boolean = false
  handleStatusScroll: boolean = false
  handleEmpsScroll: boolean = false

  followUpParams: followUpQueryParams = {
    FromDate: null,
    ToDate: null,
    SectorId: null,
    DepartmentId: null,
    SectionId: null
  }

  isfollowUpPerQuarterLoading: boolean = false
  isMeetingsPerQuarterLoading: boolean = false
  isProgressTrackingLoading: boolean = false
  isClosureRateLoading: boolean = false
  isFollowUpItemsLoading: boolean = false
  isFollowUpMeetingsStatus: boolean = false
  isTopLoadedEmpsLoading: boolean = false

  followUpPerQuarterSubscription: Subscription
  meetingsPerQuarterSubscription: Subscription
  progressTrackingSubscription: Subscription
  closureRateSubscription: Subscription
  itemsSubscription: Subscription
  meetingsStatusSubscription: Subscription
  topLoadedSubscription: Subscription

  domHeight: any
  lang: any = this.translateService.currentLang
  langSub: Subscription;
  filterCount: number = 0;
  exportLoading: boolean;

  cardsLoading: boolean = false;
  closureRate: number = 0;
  delayedRate: number = 0;
  responseRate: number = 0;
  openedCount: number = 0;
  totalCount: number = 0;
  closedCount: number = 0;
  delayedCount: number = 0;
  onTrackCount: number = 0;

  constructor(
    private translateService: TranslateService,
    private serviceDashboard: ServicesDashboardService,
    private http: HttpHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.domHeight = document.body.scrollHeight
  }

  ngOnInit(): void {

    this.handleLangChange();

    //TODO GET QUERY PARAMS FOR PAGE REFRESH
    this.activatedRoute.queryParams.subscribe(
      (queryParams: followUpQueryParams) => {
        this.filterCount = Object.values(queryParams).filter(v => v != null).length;
        this.followUpParams.FromDate = queryParams.FromDate
        this.followUpParams.ToDate = queryParams.ToDate
        this.followUpParams.SectorId = queryParams.SectorId
        this.followUpParams.DepartmentId = queryParams.DepartmentId
        this.followUpParams.SectionId = queryParams.SectionId
      },
    )

    this.langSub = this.translateService.onLangChange.subscribe((lang) => {
      this.lang = lang
      console.log('parent lang', this.lang)
    })

    this.getFollowUpData()
    this.getMeetingsPerQuarter()
    this.getProgressTrackingData()
    this.getClosureRateData()
    this.getItems()
    this.getMeetingsStatus()
    this.getTopLoadedEmployees()
  }

  //TODO ACTIONS

  handleFilter(data) {

    this.handleFromDateFilter(data.fromDate);
    this.handleToDateFilter(data.toDate);
    this.handleSectorFilter(data.sector);
    this.handleDepartmentFilter(data.department);
    this.handleSectionFilter(data.section);

    this.getItems();
    this.getTopLoadedEmployees();
    this.getMeetingsStatus();

    this.filterCount = Object.values(data).filter(v => v != null).length;
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

  handleCancelFilter() {
    this.toggleFilterContainers();
  }

  getQueryParams() {
    return {
      FromDate: this.followUpParams.FromDate,
      ToDate: this.followUpParams.ToDate,
      SectorId: this.followUpParams.SectorId,
      DepartmentId: this.followUpParams.DepartmentId,
      SectionId: this.followUpParams.SectionId
    }
  }

  getFollowUpData() {
    this.isfollowUpPerQuarterLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`

    if (params) params = params.slice(0, -1)
    this.followUpPerQuarterSubscription = this.http
      .get(`${Config.servicesDashboard.GetFolloUpPerQuartar}?${params}`)
      .subscribe((res: FollowUpPerQuarter[]) => {
        console.log('follow res', res)
        this.followUpPerQuarterData = res
        this.isfollowUpPerQuarterLoading = false
      })
  }

  getMeetingsPerQuarter() {
    this.isMeetingsPerQuarterLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`

    if (params) params = params.slice(0, -1)

    this.followUpPerQuarterSubscription = this.http
      .get(`${Config.servicesDashboard.GetMeetingsPerQuartar}?${params}`)
      .subscribe((res: MeetingsPerQuarter[]) => {
        this.meetingsPerQuarterData = res
        this.isMeetingsPerQuarterLoading = false
      })
  }

  getProgressTrackingData() {
    this.isProgressTrackingLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`

    if (params) params = params.slice(0, -1)
    this.progressTrackingSubscription = this.http
      .get(`${Config.servicesDashboard.GetFollowUpTrackingChart}?${params}`)
      .subscribe((res: progressTracking) => {
        this.progressTrackingData = res
        this.isProgressTrackingLoading = false

        this.serviceDashboard.pieChartFollowUpData.next(res)
      })
  }

  getClosureRateData() {
    this.isClosureRateLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`
    if (params) params = params.slice(0, -1)
    this.closureRateSubscription = this.http
      .get(`${Config.servicesDashboard.GetFollowUpClosureRate}?${params}`)
      .subscribe((res) => {
        this.ClosureRateDate = res
        this.isClosureRateLoading = false
      })
  }

  getItems() {
    this.isFollowUpItemsLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`
    if (this.followUpParams.SectionId)
      params += `SectionId=${this.followUpParams.SectionId}&`
    if (params) params = params.slice(0, -1)
    this.itemsSubscription = this.http
      .get(`${Config.servicesDashboard.GetFollowUpItems}?${params}`)
      .subscribe((res: followUpItems) => {
        console.log('fre', res)
        this.followUpItemsData = res
        this.isFollowUpItemsLoading = false
      })
  }

  getMeetingsStatus() {
    this.isFollowUpMeetingsStatus = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`
    if (this.followUpParams.SectionId)
      params += `SectionId=${this.followUpParams.SectionId}&`
    if (params) params = params.slice(0, -1)

    this.meetingsStatusSubscription = this.http
      .get(`${Config.servicesDashboard.GetFollowUpMeetingsStatus}?${params}`)
      .pipe(
        map((res: followUpStatics) => {
          let requestStaticsObj: followUpMeetingsStatus = {
            total: 0,
            Approved: 0,
            approvedPercentage: 0,
            Closed: 0,
            closedPercentage: 0,
            Draft: 0,
            draftPercentage: 0,
            UnderReview: 0,
            underReviewPercentage: 0
          }
          requestStaticsObj.total = res.total
          res.data.map((item: followUpItem) => {
            switch (item.status) {
              case meetingsStatus.Draft:
                requestStaticsObj.Draft = item.count
                requestStaticsObj.draftPercentage = item.percentage
                //requestStaticsObj.startedPercentage = item.percentage
                break
              case meetingsStatus.Approved:
                requestStaticsObj.Approved = item.count
                requestStaticsObj.approvedPercentage = item.percentage
                //requestStaticsObj.UnderReview = item.count
                break
              case meetingsStatus.Closed:
                requestStaticsObj.Closed = item.count
                requestStaticsObj.closedPercentage = item.percentage
                //  requestStaticsObj.rejectedPercentage = item.percentage
                break
              case meetingsStatus.UnderReview:
                requestStaticsObj.UnderReview = item.count
                requestStaticsObj.underReviewPercentage = item.percentage
                //requestStaticsObj.closedPercentage = item.percentage
                break
            }
          })
          return requestStaticsObj
        }),
      )
      .subscribe((res) => {
        this.meetingStatusData = res
        this.isFollowUpMeetingsStatus = false
      })
  }

  getTopLoadedEmployees() {
    this.isTopLoadedEmpsLoading = true
    let params = ''
    if (this.followUpParams.FromDate)
      params += `FromDate=${this.followUpParams.FromDate}&`
    if (this.followUpParams.ToDate)
      params += `ToDate=${this.followUpParams.ToDate}&`
    if (this.followUpParams.SectorId)
      params += `SectorId=${this.followUpParams.SectorId}&`
    if (this.followUpParams.DepartmentId)
      params += `DepartmentId=${this.followUpParams.DepartmentId}&`
    if (this.followUpParams.SectionId)
      params += `SectionId=${this.followUpParams.SectionId}&`
    if (params) params = params.slice(0, -1)
    this.topLoadedSubscription = this.http
      .get(`${Config.servicesDashboard.GetFollowUpLoadedEmp}?${params}`)
      .subscribe((res: TopLoadedUsers[]) => {
        console.log('topL', res)
        this.topLoadedEmployees = res
        this.isTopLoadedEmpsLoading = false
        this.handleEmpsScroll = true
      })
  }

  //TODO HANDLE FILTERS
  handleFromDateFilter(fromDate: any) {
    // if (fromDate) {
    //   //fromDate = dayjs()
    //   fromDate = new Date(fromDate?.['$d'] ?? fromDate).toISOString(),
    //     this.followUpParams.FromDate = fromDate
    // }
    // else { this.followUpParams.FromDate = undefined }
    this.followUpParams.FromDate = fromDate
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getItems()
    // this.getTopLoadedEmployees()
    // this.getMeetingsStatus()
    this.handleFromScroll = true
  }

  handleToDateFilter(toDate: any) {
    // if (toDate) {
    //   //toDate = dayjs()
    //   toDate = new Date(toDate?.['$d'] ?? toDate).toISOString(),
    //     this.followUpParams.ToDate = toDate
    // }
    // else { this.followUpParams.ToDate = undefined }
    this.followUpParams.ToDate = toDate
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getItems()
    // this.getTopLoadedEmployees()
    // this.getMeetingsStatus()

    //this.handleToScroll = true
  }

  handleScroll(): Observable<any> {
    return forkJoin([
      this.getItems(),
      this.getTopLoadedEmployees(),
      this.getMeetingsStatus(),
    ])
  }
  handleSectorFilter(SectorId: any) {
    // debugger
    this.followUpParams.SectorId = SectorId
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getItems()
    // this.getTopLoadedEmployees()
    // this.getMeetingsStatus()
    this.handleSectorScroll = true
  }

  handleDepartmentFilter(DepartmentId: any) {
    this.followUpParams.DepartmentId = DepartmentId
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getItems()
    // this.getTopLoadedEmployees()
    // this.getMeetingsStatus()
    // //this.handleDeptScroll = true
  }

  handleSectionFilter(sectionId: number) {
    this.followUpParams.SectionId = sectionId
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.getQueryParams(),
      queryParamsHandling: 'merge',
    })

    // this.getItems()
    // this.getTopLoadedEmployees()
    // this.getMeetingsStatus()
  }
  scrollToDown() {
    window.scroll(0, this.domHeight + 300)
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang
      if (this.followUpPerQuarterData) {
        this.getFollowUpData()
      }
      if (this.ClosureRateDate) {
        this.getClosureRateData()
      }
      if (this.meetingsPerQuarterData) {
        this.getMeetingsPerQuarter()
      }
      if (this.progressTrackingData) {
        this.getProgressTrackingData()
      }
    })
  }


  activeFilterContainer : boolean =false

  //toggle filter container
  toggleFilterContainers(){
   setTimeout(() => {
    this.activeFilterContainer = !this.activeFilterContainer
    document.getElementById('filters-cont').classList.toggle('filters-container-active')
   }, 500);

  }

  public export(){

  }

  //TODO DESTROY
  ngOnDestroy(): void {
    this.followUpPerQuarterSubscription.unsubscribe()
    this.langSub.unsubscribe()
  }
}
