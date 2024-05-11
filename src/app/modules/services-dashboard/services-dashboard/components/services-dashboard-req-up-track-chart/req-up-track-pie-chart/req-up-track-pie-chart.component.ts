import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'
import { ServicesDashboardService } from '../../../services/services-dashboard.service'

@Component({
  selector: 'app-req-up-track-pie-chart',
  templateUrl: './req-up-track-pie-chart.component.html',
  styleUrls: ['./req-up-track-pie-chart.component.scss'],
})
export class ReqUpTrackPieChartComponent implements OnInit, OnChanges {
  //TODO VARIABLE
  @Input('data') set daata(data: any) {
    this.servicesDashboard.pieChartData.subscribe((res) => {
      this.data = res
      if (this.chart) this.chart.destroy()
      this.createChart()
      this.getRequestsStatusData()
    })
    this.data = data

    // setTimeout(() => {
    //   if (data) 
    //     console.log('dds', data)
    // }, 10000)
  }

  data: any

  reqStatus: any
  shouldShowStatusChart = true

  @ViewChild('myChart') myChart
  chart: any
  canvas: any
  ctx: any

  constructor(
    private translateService: TranslateService,
    private servicesDashboard: ServicesDashboardService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO Actions
  createChart() {
    const chartLabels = [this.translateService.instant('servicesDashboard.onTrack'),this.translateService.instant('servicesDashboard.offTrack')]

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: [this.data?.onTrackCount, this.data?.offTrackCount],
          backgroundColor: ['#01db9a', '#fb3e7a'],
          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    }
    this.canvas = this.myChart?.nativeElement
    this.ctx = this.canvas.getContext('2d')
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
        status: this.translateService.instant('servicesDashboard.onTrack'),
        color: '#01db9a',
        total: this.data?.onTrackCount,
        percentage: this.data?.totalRequests
          ? (
              (this.data?.onTrackCount / this.data?.totalRequests) *
              100
            ).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('servicesDashboard.offTrack'),
        color: '#fb3e7a',
        total: this.data?.offTrackCount,
        percentage: this.data?.totalRequests
          ? (
              (this.data?.offTrackCount / this.data?.totalRequests) *
              100
            ).toFixed(2)
          : 0,
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
