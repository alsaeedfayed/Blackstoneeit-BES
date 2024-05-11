import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-services-dashboard-closure-rate',
  templateUrl: './services-dashboard-closure-rate.component.html',
  styleUrls: ['./services-dashboard-closure-rate.component.scss'],
})
export class ServicesDashboardClosureRateComponent implements OnInit {
  //TODO VARIABLES

  data: any
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  public lang: string = this.translateService.currentLang

  months = [];

  @Input('data') set daata(data: any) {
    this.data = data
    if (data) {
     // console.log('cldata' , data)
      let labels = []
      const requestsData = []
      const closedCount = []
      data.data.map((item) => {
        // const date = moment(new Date(item.date)).format('MMM, YYYY');
        labels = [...this.months];
        requestsData.push(item?.totalCount)
        closedCount.push(item?.closedCount)
      })

      this.data = {
        labels: [...labels],
        datasets: [
          {
            label: this.translateService.instant('servicesDashboard.totalCount') ,
            data: requestsData,
            borderColor: 'rgba(0, 117, 255, 0.2)',
            backgroundColor: 'rgba(0, 117, 255, 0.2)',

            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: this.translateService.instant('servicesDashboard.closedCount') ,
            data: closedCount,
            borderColor: 'rgba(113, 121, 134, 0.2)',
            backgroundColor: 'rgba(113, 121, 134, 0.2)',

            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          }
        ],
      }

      if (this.chart) this.chart.destroy()
      this.createChart(this.data)
    }
  }

  // clousreRateData: any

  constructor(private translateService: TranslateService) { 
    this.months = this.lang == 'ar' ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO ACTIONS


  createChart(data) {
    this.canvas = this.myChart?.nativeElement
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: data,
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
              display: true,
              text: this.translateService.instant('servicesDashboard.requests'),
            },

            suggestedMin: 0,
            // suggestedMax: 200,
          },
        },
      },
    })
  }

  //TODO LANG
  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.months = this.lang == 'ar' ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (this.data) {
        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      }
    })
  }
}
