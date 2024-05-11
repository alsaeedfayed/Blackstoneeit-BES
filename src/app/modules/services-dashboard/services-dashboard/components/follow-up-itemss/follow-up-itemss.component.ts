import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { followUpItems } from '../../models/dashboard.model'
import { TranslateService } from '@ngx-translate/core'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { HttpHandlerService } from 'src/app/core/services/http-handler.service'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-follow-up-itemss',
  templateUrl: './follow-up-itemss.component.html',
  styleUrls: ['./follow-up-itemss.component.scss'],
})
export class FollowUpItemssComponent implements OnInit {
  //TODO VARIABLE
  lang: string = this.translateService.currentLang
  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      //createChat
      if (this.chart) this.chart.destroy()
      this.createChart()
      this.getFollowUpItesmData()
    }
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
    private serviceDashboard: ServicesDashboardService,
    private http: HttpHandlerService,
  ) { }

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO Actions

  createChart() {
    const chartLabels = [
      this.translateService.instant('shared.open'),
      this.translateService.instant('shared.closed'),
    ]

    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [this.data?.openCount, this.data?.closedCount],
          backgroundColor: ['#01db9a', 'rgb(113, 121, 134)'],
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
  getFollowUpItesmData() {
    this.reqStatus = [
      {
        status: this.translateService.instant('shared.open'),
        color: '#01db9a',
        total: this.data?.openPrcentage,
        percentage: this.data?.openPercentage
        ,
      },
      {
        status: this.translateService.instant('shared.closed'),
        color: 'rgb(113, 121, 134)',
        total: this.data?.closedPercentage,
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
      this.lang = language.lang
      if (this.data) {
        this.getFollowUpItesmData()
        if (this.chart) this.chart.destroy()
        this.createChart()
      }
    })
  }
}
