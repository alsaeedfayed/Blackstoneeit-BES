import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import Chart from 'chart.js/auto'
import moment from 'moment'
import {
  RequestsUpTracking,
  RequestsUpTrackingData,
  servicesDistribution,
} from '../../models/dashboard.model'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-services-dashboard-distributions',
  templateUrl: './services-dashboard-distributions.component.html',
  styleUrls: ['./services-dashboard-distributions.component.scss'],
})
export class ServicesDashboardDistributionsComponent implements OnInit, OnChanges {
  //TODO VARIABLES
  trackingUpData: RequestsUpTrackingData[]
  data
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart
  lang: any;
  language: string = this.translateService.currentLang
  categories: any
  totalCategories

  colors = [
    '#EDA25B',
    '#01DB9A',
    '#FF285C',
    '#165DF0',
    'rgb(191 180 180)',
    'rgb(147 194 215)',
    '#3c557a ',
    'rgb(113, 121, 134)',
    'rgb(126 232 235)',
    'rgb(235 126 233)',
    'rgb(126 232 235)'
  ]
  @Input('data') set daata(data: any) {

    this.data = data
    if (data) {

      this.categories = data
      this.totalCategories = this.categories.reduce(function (previousVal, currentVal) {
        return previousVal + currentVal.totalCount;
      }, 0);
      //console.log('ccc', this.totalCategories)

      this.servicesDashboard.langSub.subscribe((res) => {
        this.lang = res
      })
      const labels = []
      const totalCount = []

      // const meetSLAData = []

      this.data.map((item: servicesDistribution) => {
        // const date = moment(new Date(item.date)).format('MMM, YYYY');

        const name =
          this.lang.lang == 'en' ? item.categoryName : item.categoryNameAr
        labels.push(name)
        totalCount.push(item.percentage)

        // meetSLAData.push(item.meetSlaCount)
        //requestsData.push(item.count)
      })

      this.data = {
        labels: [...labels],
        datasets: [
          {
            label: this.translateService.instant('shared.totalCount'),
            data: [...totalCount],
            backgroundColor: [
              '#EDA25B',
              '#01DB9A',
              '#FF285C',
              '#165DF0',
              '#F1F1F1',
              '#E5F7FF',
              '#3c557a ',
              'rgb(113, 121, 134)',
              'rgb(126 232 235)'
            ],
            barThickness: 4,
            hoverOffset: 3,
            borderRadius: 10,

          },
        ],
      }

      if (this.chart) this.chart.destroy()
      this.createChart(this.data)
    }
  }

  constructor(
    private translateService: TranslateService,
    private servicesDashboard: ServicesDashboardService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {

    this.handleLangChange()
  }

  //TODO ACTIONS

  getUpTrackingData() {
    this.servicesDashboard
      .getRequestsUpTrackingData()
      .subscribe((res: RequestsUpTracking) => {
        this.trackingUpData = res.data

        const labels = []
        const notStartedData = []
        const outSLAData = []
        const meetSLAData = []

        this.trackingUpData.map((item: RequestsUpTrackingData) => {
          // const date = moment(new Date(item.date)).format('MMM, YYYY');

          const month = moment(new Date(item.month)).format('MMM')
          labels.push(month)
          notStartedData.push(item.notStartedCount)
          outSLAData.push(item.outOfSlaCount)
          meetSLAData.push(item.meetSlaCount)
          //requestsData.push(item.count)
        })

        this.data = {
          labels: [...labels],
          datasets: [
            {
              label: this.translateService.instant(
                'servicesDashboard.notsarted',
              ),
              data: notStartedData,
              borderColor: '#eda25b',
              backgroundColor: '#0075ff',
              fill: false,
              tension: 0.4,
            },
            {
              label: this.translateService.instant(
                'servicesDashboard.outofsla',
              ),
              data: outSLAData,
              borderColor: '#eda25b',
              backgroundColor: '#fb3e7a',
              fill: false,
              tension: 0.4,
            },
            {
              label: this.translateService.instant('servicesDashboard.meetsla'),
              data: meetSLAData,
              borderColor: '#eda25b',
              backgroundColor: '#01db9a',
              fill: false,
              tension: 0.4,
            },
          ],
        }

        if (this.chart) this.chart.destroy()
        this.createChart(this.data)
      })
  }

  createChart(data) {
    this.canvas = this.myChart?.nativeElement
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: data,

      options: {
        responsive: true,
        cutout: 85,
        maintainAspectRatio: false,
        // indexAxis : 'y' ,

        plugins: {
          title: {
            display: false,
          },

          legend: {
            display: false,
            // align: this.lang.lang == 'ar' ? 'start' : 'end',
            // rtl: this.lang.lang == 'ar' ? true : false,
            align: 'end',
            // labels: {
            //   usePointStyle: true,
            //   boxWidth: 5,
            //   boxHeight: 5,
            // },
          },
        },

      },
    })
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language
    })
  }
}
