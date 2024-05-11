import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'
import { HttpHandler } from '@angular/common/http'
import moment from 'moment'
import { implementaionsStatus } from '../../models/bau-dashboard';

@Component({
  selector: 'app-implementation-status',
  templateUrl: './implementation-status.component.html',
  styleUrls: ['./implementation-status.component.scss']
})
export class ImplementationStatusComponent implements OnInit, OnDestroy {


  data: any
  implementaionsStatusData: any
  @ViewChild('implementationChart') implementationChart: any
  canvas: any
  ctx: any
  chart
  @Input() language: string = this.translate.currentLang;

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      this.implementaionsStatusData = data;
      if (this.chart) this.chart.destroy()
      this.createChart(this.data)
    }
  }


  constructor(private translate: TranslateService) { }
  ngOnDestroy(): void {
    this.chart.destroy()
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

    //TODO LANG
    private handleLangChange() {
      this.translate.onLangChange.subscribe((language) => {

        this.language = language.lang
        if (this.data) {
          if (this.chart) this.chart.destroy()
          this.createChart(this.data)
        }
      })
    }

  //TODO ACTIONS

  createChart(data) {

    const LABLES = []
    const ACTUAL = []
    const PLANNED = []
    this.implementaionsStatusData.data.map((item) => {
      const month = moment(new Date(item.month)).locale(this.language).format('MMM')
      LABLES.push(month)
      ACTUAL.push(item.actualCount)
      PLANNED.push(item?.plannedCount)
    })

    const chartData: any = {
      labels: [...LABLES],
      datasets: [
        {
          label: this.translate.instant('bau.dashboard.actual'),
          data: ACTUAL,
          borderColor: '#0066FF',
          backgroundColor: '#0066FF',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
        },
        {
          label: this.translate.instant('bau.dashboard.planned'),
          data: PLANNED,
          borderColor: '#86909c',
          backgroundColor: '#86909c',

          cubicInterpolationMode: 'monotone',
          tension: 0.4,
        }
      ],
    }


    this.canvas = document.getElementById('implementationChart')
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,

        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
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
              display: false,

            },

            suggestedMin: 0,
            // suggestedMax: 200,
          },
        },
      },
    })
  }



}
