import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart, { Ticks } from 'chart.js/auto'
import { RequestsUpTrackingData, trackingPie } from '../../models/dashboard.model'

@Component({
  selector: 'app-services-dashboard-req-up-track-chart',
  templateUrl: './services-dashboard-req-up-track-chart.component.html',
  styleUrls: ['./services-dashboard-req-up-track-chart.component.scss']
})

export class ServicesDashboardReqUpTrackChartComponent implements OnInit {
  //TODO VARIABLES
  trackingUpData: RequestsUpTrackingData[]
  pieChartData: trackingPie = {
    offTrackCount: 0,
    onTrackCount: 0,
    totalRequests: 0,
  }
  data
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  lang: string;

  months = [];

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
      this.pieChartData.offTrackCount = data.offTrackCount
      this.pieChartData.onTrackCount = data.onTrackCount
      this.pieChartData.totalRequests = data.totalRequests

      let labels = []
      // const notStartedData = []
      const outSLAData = []
      const meetSLAData = []

      this.data.data.map((item: RequestsUpTrackingData) => {
        labels = [...this.months];
        //notStartedData.push(item.notStartedCount)
        outSLAData.push(item.outOfSlaCount)
        meetSLAData.push(item.meetSlaCount)
        //requestsData.push(item.count)
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
            label: this.translateService.instant('servicesDashboard.outofsla'),
            data: outSLAData,
            borderColor: '#dc3545',
            backgroundColor: '#fb3e7a',
            fill: true,
            tension: 0.4,
            // width : '10px',
            borderRadius: Number.MAX_VALUE,

            //width : Number.MIN_VALUE
          },
          {
            label: this.translateService.instant('servicesDashboard.meetsla'),
            data: meetSLAData,
            borderColor: '#eda25b',
            backgroundColor: '#01db9a',
            borderRadius: Number.MAX_VALUE,
            fill: false,
            tension: 0.4,
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
    this.canvas = this.myChart?.nativeElement
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
            labels: {
              // color : 'green',
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
            //stacked : true,
            // ticks : {color : 'red'},

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
        // this.getUpTrackingData()
        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      }
    })
  }
}
