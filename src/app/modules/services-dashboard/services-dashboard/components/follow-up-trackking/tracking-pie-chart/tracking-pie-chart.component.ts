import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'
import { ServicesDashboardService } from '../../../services/services-dashboard.service'
import { trackingPie } from '../../../models/dashboard.model'

@Component({
  selector: 'app-tracking-pie-chart',
  templateUrl: './tracking-pie-chart.component.html',
  styleUrls: ['./tracking-pie-chart.component.scss'],
})
export class TrackingPieChartComponent implements OnInit {
  //TODO VARIABLE

  @Input('data') set daata(data: any) {
    this.servicesDashboard.pieChartFollowUpData.subscribe((res) => {
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

  data: trackingPie

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

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO Actions
  createChart() {
    const chartLabels = []

    const chartData = {
      labels: [],
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
        status: this.translateService.instant('shared.onTrack'),
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
        status: this.translateService.instant('shared.offTrack'),
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
