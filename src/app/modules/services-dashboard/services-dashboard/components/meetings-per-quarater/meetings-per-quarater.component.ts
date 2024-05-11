import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MeetingsPerQuarter } from '../../models/dashboard.model'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-meetings-per-quarater',
  templateUrl: './meetings-per-quarater.component.html',
  styleUrls: ['./meetings-per-quarater.component.scss'],
})
export class MeetingsPerQuaraterComponent implements OnInit {
  //TODO VARIABLES
  MeetingsQuarterData: MeetingsPerQuarter[]
  data
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  lang: any

  @Input('lang') set langg(lang: any) {
    this.lang = lang
  }

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      let labels = []
      const draft = []
      const unreviewed = []
      const approved = []
      this.data.map((item: MeetingsPerQuarter) => {
        labels = [...this.quarters]
        draft.push(item.draftCount)
        unreviewed.push(item.unreviewedCount)
        approved.push(item.approvedCount)
      })

      this.data = {
        labels: [...labels],
        datasets: [
          {
            label: this.translateService.instant('shared.drafted'),
            data: draft,
            borderColor: '#717986',
            backgroundColor: '#717986',
            fill: false,
            tension: 0.4,
            borderRadius: Number.MAX_VALUE,
          },
          {
            label: this.translateService.instant('servicesDashboard.unreviewed'),
            data: unreviewed,
            borderColor: 'rgba(237, 162, 91)',
            backgroundColor:'rgba(237, 162, 91)',
            fill: false,
            tension: 0.4,
            borderRadius: Number.MAX_VALUE,
          },
          {
            label: this.translateService.instant('shared.Approved'),
            data: approved,
            borderColor:'#01db9a',
            backgroundColor: '#01db9a',
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

  quarters = [];

  constructor(private translateService: TranslateService) {
    this.quarters = this.lang == 'ar' ? ['الربع الاول' , 'الربع الثانى', 'الربع الثالث', 'الربع الرابع'] : ['Q1', 'Q2', 'Q3', 'Q4']
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.quarters = this.lang == 'ar' ? ['الربع الاول' , 'الربع الثانى', 'الربع الثالث', 'الربع الرابع'] : ['Q1', 'Q2', 'Q3', 'Q4']

      this.handleLangChange()

    })
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
            // align: this.lang.lang == 'ar' ? 'start' : 'end',
            // rtl: this.lang.lang == 'ar' ? true : false,
            align: 'end',
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
                'servicesDashboard.meetingsCount',
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
      this.lang = language

      if (this.data) {
        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      }
    })
  }
}
