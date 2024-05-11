import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'
import { FollowUpPerQuarter } from '../../models/dashboard.model'

@Component({
  selector: 'app-follow-up-per-quarter',
  templateUrl: './follow-up-per-quarter.component.html',
  styleUrls: ['./follow-up-per-quarter.component.scss'],
})
export class FollowUpPerQuarterComponent implements OnInit {
  //TODO VARIABLES
  followUpQuarterData: FollowUpPerQuarter[]
  data
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  lang: any

  quarters = [];

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      let labels = []
      const notStartedData = []
      const openData = []
      const closeData = []

      this.data.map((item: FollowUpPerQuarter) => {
        labels = [...this.quarters]
        notStartedData.push(item.notStartedCount)
        openData.push(item.openCount)
        closeData.push(item.closedCount)
      })

      this.data = {
        labels: [...labels],
        datasets: [

          {
            label: this.translateService.instant('shared.open'),
            data: openData,
            borderColor: '#dc3545',
            backgroundColor: '#01db9a',
            fill: false,
            tension: 0.4,
            borderRadius: Number.MAX_VALUE,
          },
          {
            label: this.translateService.instant('shared.closed'),
            data: closeData,
            borderColor: '#eda25b',
            backgroundColor: '#fb3e7a ',
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
    this.quarters = this.lang == 'ar' ? ['الربع الاول' , 'الربع الثانى', 'الربع الثالث', 'الربع الرابع'] : ['Q1', 'Q2', 'Q3', 'Q4']
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
      this.quarters = this.lang == 'ar' ? ['الربع الاول' , 'الربع الثانى', 'الربع الثالث', 'الربع الرابع'] : ['Q1', 'Q2', 'Q3', 'Q4']

      if (this.data) {
        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      }
    })
  }
}
