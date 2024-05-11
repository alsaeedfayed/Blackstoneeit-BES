import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { followUpMeetingsStatus } from '../../models/dashboard.model'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-follow-up-meetings-status',
  templateUrl: './follow-up-meetings-status.component.html',
  styleUrls: ['./follow-up-meetings-status.component.scss'],
})
export class FollowUpMeetingsStatusComponent implements OnInit {
  //TODO VARIABLE
  lang: string = this.translateService.currentLang
  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      //createChat
      if (this.chart) this.chart.destroy()
      this.createChart()
      this.getRequestsStatusData()
    }
  }
  data: followUpMeetingsStatus
  reqStatus: any
  shouldShowStatusChart = true

  @ViewChild('myChart') myChart
  chart: any
  canvas: any
  ctx: any

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO Actions

  createChart() {
    const chartLabels = [
      this.translateService.instant('shared.drafted'),
      this.translateService.instant('servicesDashboard.unreviewed'),
      this.translateService.instant('shared.Approved'),
    ]

    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [
            this.data?.Draft,
            this.data?.UnderReview,
            this.data?.Approved,
          ],
          backgroundColor: [
            '#717986',
            'rgba(237, 162, 91)',
            '#01db9a',
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
        status: this.translateService.instant('shared.drafted'),
        color: '#717986',
        total: this.data?.Draft,
        percentage: this.data?.draftPercentage,
      },
      {
        status: this.translateService.instant('servicesDashboard.unreviewed'),
        color: 'rgba(237, 162, 91)',
        total: this.data?.UnderReview,
        percentage: this.data?.underReviewPercentage,
      },
      {
        status: this.translateService.instant('shared.Approved'),
        color:  '#01db9a',
        total: this.data?.Approved,
        percentage: this.data?.approvedPercentage,
      }
    ]

    this.shouldShowStatusChart = this.isStatusHasPercentage()
  }

  isStatusHasPercentage(): boolean {
    return this.reqStatus.some((state) => +state.percentage !== 0)
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
    //  this.lang = language
      if (this.data) {
        this.getRequestsStatusData()
        if (this.chart) this.chart.destroy()
        this.createChart()
      }
    })
  }
}
