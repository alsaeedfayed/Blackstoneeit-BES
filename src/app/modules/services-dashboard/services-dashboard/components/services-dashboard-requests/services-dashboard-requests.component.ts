import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { ServicesDashboardService } from '../../services/services-dashboard.service';
import { RequestStaticsObj } from '../../models/dashboard.model';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-services-dashboard-requests',
  templateUrl: './services-dashboard-requests.component.html',
  styleUrls: ['./services-dashboard-requests.component.scss'],
})

export class ServicesDashboardRequestsComponent implements OnInit, OnChanges {
  //TODO VARIABLE
  private endSub$ = new Subject()
  lang: string = this.translateService.currentLang
  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      //createChat
      if (this.chart) this.chart.destroy()
      this.createChart()
      this.getRequestsStatusData()
    }
    else {
      this.showEmpty = true
    }
  }
  data: RequestStaticsObj
  showEmpty : boolean = false
  reqStatus: any
  shouldShowStatusChart = true

  @ViewChild('myChart') myChart
  chart: any
  canvas: any
  ctx: any

  constructor(
    private translateService: TranslateService,
    private serviceDashboard: ServicesDashboardService,
    private http: HttpHandlerService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO Actions

  // getServicesRequestsStatics() {
  //   this.serviceDashboard
  //     .getServicesRequests()
  //     .pipe(
  //       map((res: RequestsStatics) => {
  //         let requestStaticsObj: RequestStaticsObj = {
  //           totalRequests: 0,
  //           started: 0,
  //           startedPercentage: 0,
  //           cancelled: 0,
  //           cancelledPercentage: 0,
  //           rejected: 0,
  //           rejectedPercentage: 0,
  //           closed: 0,
  //           closedPercentage: 0,
  //         }
  //         requestStaticsObj.totalRequests = res.totalRequests
  //         res.data.map((item: RequestStatics) => {
  //           switch (item.status) {
  //             case ResquestsStaticsEnum.Started:
  //               requestStaticsObj.started = item.total
  //               requestStaticsObj.startedPercentage = item.percentage
  //               break
  //             case ResquestsStaticsEnum.Canceled:
  //               requestStaticsObj.cancelled = item.total
  //               requestStaticsObj.cancelledPercentage = item.percentage
  //               break
  //             case ResquestsStaticsEnum.Rejected:
  //               requestStaticsObj.rejected = item.total
  //               requestStaticsObj.rejectedPercentage = item.percentage
  //               break
  //             case ResquestsStaticsEnum.Closed:
  //               requestStaticsObj.closed = item.total
  //               requestStaticsObj.closedPercentage = item.percentage
  //               break
  //           }
  //         })
  //         return requestStaticsObj
  //       }),
  //     )
  //     .subscribe((res: RequestStaticsObj) => {
  //       this.data = res
  //       if (this.chart) this.chart.destroy()
  //       this.createChart()
  //       this.getRequestsStatusData()
  //     })
  // }

  createChart() {
    const chartLabels = [
      this.translateService.instant('servicesDashboard.started'),
      this.translateService.instant('servicesDashboard.cancelled'),
      this.translateService.instant('servicesDashboard.rejected'),
      this.translateService.instant('servicesDashboard.closed'),
    ]

    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [
            this.data?.started,
            this.data?.cancelled,
            this.data?.rejected,
            this.data?.closed,
          ],
          backgroundColor: [
            '#01db9a',
            'rgba(237, 162, 91)',
            '#fb3e7a',
            '#717986',
          ],
          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    }
    this.canvas = this.myChart?.nativeElement
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: false,
        cutout: 65,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }

  //TODO REQUESTS STATUS
  getRequestsStatusData() {
    this.reqStatus = [
      {
        status: this.translateService.instant('servicesDashboard.started'),
        color: '#01db9a',
        total: this.data?.started,
        percentage: this.data?.startedPercentage,
      },
      {
        status: this.translateService.instant('servicesDashboard.cancelled'),
        color: 'rgba(237, 162, 91)',
        total: this.data?.cancelled,
        percentage: this.data?.cancelledPercentage,
      },
      {
        status: this.translateService.instant('servicesDashboard.rejected'),
        color: '#fb3e7a',
        total: this.data?.rejected,
        percentage: this.data?.rejectedPercentage,
      },
      {
        status: this.translateService.instant('servicesDashboard.closed'),
        color: '#717986',
        total: this.data?.closed,
        percentage: this.data?.closedPercentage,
      },
    ]

    this.shouldShowStatusChart = this.isStatusHasPercentage()
  }

  isStatusHasPercentage(): boolean {
    return this.reqStatus.some((state) => +state.percentage !== 0)
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      if (this.data) {
        this.getRequestsStatusData()
        if (this.chart) this.chart.destroy()
        this.createChart()
      }
    })
  }
}
