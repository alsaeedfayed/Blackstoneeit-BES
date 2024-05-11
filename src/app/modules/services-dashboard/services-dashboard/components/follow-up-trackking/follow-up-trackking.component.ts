import { Component, Input, OnInit, ViewChild } from '@angular/core'
import Chart from 'chart.js/auto'
import { progressTracking, progressTrackingData, trackingPie} from '../../models/dashboard.model'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-follow-up-trackking',
  templateUrl: './follow-up-trackking.component.html',
  styleUrls: ['./follow-up-trackking.component.scss'],
})

export class FollowUpTrackkingComponent implements OnInit {
  //TODO VARIABLES
  trackingUpData: progressTracking[]
  data
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  lang: any

  pieChartData: trackingPie = {
    offTrackCount: 0,
    onTrackCount: 0,
    totalRequests: 0,
  }

  months = [];

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      let labels = []
      const notStartedData = []
      const offTrack = []
      const onTrack = []
      this.pieChartData.offTrackCount = data.offTrackCount
      this.pieChartData.onTrackCount = data.onTrackCount
      this.pieChartData.totalRequests = data.totalRequests

      this.data.data.map((item: progressTrackingData) => {
        labels = [...this.months];
        notStartedData.push(item.notStartedCount)
        onTrack.push(item.onTrackCount)
        offTrack.push(item.offTrackCount)
      })

      this.data = {
        labels: [...labels],
        datasets: [
          // {
          //   label: this.translateService.instant('shared.notStarted'),
          //   data: notStartedData,
          //   borderColor: '#0075ff',
          //   backgroundColor: '#0075ff',
          //   fill: false,
          //   tension: 0.4,
          //   borderRadius: Number.MAX_VALUE,
          // },
          {
            label: this.translateService.instant('shared.onTrack'),
            data: onTrack,
            borderColor: '#dc3545',
            backgroundColor: '#01db9a ',
            fill: false,
            tension: 0.4,
            borderRadius: Number.MAX_VALUE,
          },
          {
            label: this.translateService.instant('shared.offTrack'),
            data: offTrack,
            borderColor: '#eda25b',
            backgroundColor: '#fb3e7a',
            fill: false,
            tension: 0.4,
            borderRadius: Number.MAX_VALUE,
          },
        ],
      }

      if (this.chart) this.chart.destroy()
      this.createChart(this.data)
    }
  }

  constructor(private translateService: TranslateService) {
    this.months = this.lang == 'ar' ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO ACTIONS

  createChart(data) {
    this.canvas = this.myChart.nativeElement
    this.ctx = this.canvas.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            align: 'end',
            // align: this.lang.lang == 'ar' ? 'start' : 'end',
            // rtl: this.lang.lang == 'ar' ? true : false,

            labels: {
              usePointStyle: true,
              boxWidth: 5,
              boxHeight: 5,
            },
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: this.translateService.instant(
                'servicesDashboard.requestsCount',
              ),
            },
            suggestedMin: 0,
            // suggestedMax: 200,
          },
        },
      },
    })
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.months = this.lang == 'ar' ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (this.data) {
        //  this.getUpTrackingData()
        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      }
    })
  }
}
