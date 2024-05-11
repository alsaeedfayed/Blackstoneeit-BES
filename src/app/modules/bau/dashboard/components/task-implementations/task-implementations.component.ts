import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { implementationTasks, ImplmentationTask } from '../../models/bau-dashboard';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import Chart, { Ticks } from 'chart.js/auto'
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';

@Component({
  selector: 'app-task-implementations',
  templateUrl: './task-implementations.component.html',
  styleUrls: ['./task-implementations.component.scss']
})
export class TaskImplementationsComponent extends ComponentBase implements OnInit, OnDestroy {

  //TODO VARiABLES
  @Input() language: string = this.translate.currentLang;
  implementationData: implementationTasks;
  chartData: any;
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart

  //TODO DISPLAY PERCENTAGE
  @ViewChild('implementationPer') implementationPer: any
  chart2: any
  canvas2: any
  ctx2: any

  //set data from parent
  @Input('data') set data(data: implementationTasks) {
    if (data) {
      //console.log('chart data', data)
      this.implementationData = data;
      if (this.chart) this.chart.destroy()
      if (this.chart2) this.chart2.destroy()

      this.createChart()


        if (this.chart2) this.chart2.destroy()
        this.createChart2()

    }





  }
  constructor(translateService: TranslateConfigService,
    translate: TranslateService,) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

  //TODO -- METHODS
  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {

      this.language = language.lang
      if (this.implementationData) {
        // this.getUpTrackingData()
        if (this.chart) this.chart.destroy()
        if (this.chart2) this.chart2.destroy()
         this.createChart()
      this.createChart2()
      }
    })
  }

  //create chart
  createChart() {

    //prepare arrs for the chart
    const LABLES = [];
    const NOTSTARTED = [];
    const INPROGRESS = [];
    const CLOSED = [];
    const CANCELLED = []

    this.implementationData?.data.map((item: ImplmentationTask) => {
      const month = moment(new Date(item.month)).locale(this.language).format('MMM')
      LABLES.push(month);
      NOTSTARTED.push(item?.notStartedCount);
      INPROGRESS.push(item?.inProgressCount);
      CLOSED.push(item?.closedCount)
      CANCELLED.push(item?.canceledCount)
    })

    //prepare chart data obj

    const chartData = {
      labels: [...LABLES],

      datasets: [

        {
          barThickness: 15,
          label: this.translate.instant('bau.notStarted'),
          data: NOTSTARTED,
          borderColor: '#ACB5C1',
          backgroundColor: '#ACB5C1',
          fill: false,
          tension: 0.4,
          borderRadius: Number.MAX_VALUE,
        },
        {
          barThickness: 15,
          label: this.translate.instant('bau.dashboard.inProgress'),
          data: INPROGRESS,
          borderColor: 'rgb(237, 162, 91)',
          backgroundColor: 'rgb(237, 162, 91)',
          fill: true,
          tension: 0.4,
          // width : '10px',
          borderRadius: Number.MAX_VALUE,

          //width : Number.MIN_VALUE
        },
        {
          barThickness: 15,

          label: this.translate.instant('bau.dashboard.closed'),
          data: CLOSED,
          borderColor: '#01db9a',
          backgroundColor: '#01db9a',
          borderRadius: Number.MAX_VALUE,
          fill: false,
          tension: 0.4,
        },
        {
          barThickness: 15,

          label: this.translate.instant('bau.dashboard.cancelled'),
          data: CANCELLED,
          borderColor: '#fb3e7a',
          backgroundColor: '#fb3e7a',
          borderRadius: Number.MAX_VALUE,
          fill: false,
          tension: 0.4,
        },
      ],

    }

    this.canvas = document.getElementById('taskImpelentationChart')
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,

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
              display: false,
              text: this.translate.instant(
                'bau.offTrack',
              ),
            },
            suggestedMin: 0,
            // suggestedMax: 200,
          },
        },
      },
    })
  }

  //TODO DISPLAY PERCENTAGE
  createChart2() {
  //  debugger

    const chartLabels = [this.translate.instant('bau.dashboard.totalNotStarted'), this.translate.instant('bau.dashboard.totalClosed'), this.translate.instant('bau.dashboard.totalInProgress') , this.translate.instant('bau.dashboard.totalCancelled')]

    const chartData = {
      labels: chartLabels,

      datasets: [
        {
          data: [ this.implementationData?.notStartedCount, this.implementationData?.closedCount,  this.implementationData?.inProgressCount, this.implementationData?.canceledCount],

          backgroundColor: ['#ACB5C1', '#01db9a', 'rgb(237, 162, 91)' , '#fb3e7a'],
          barThickness: 4,
          hoverOffset: 2,
          borderWidth: 2,
          borderColor: ['#ACB5C1', '#01db9a', 'rgb(237, 162, 91)' , '#fb3e7a']

        },
      ],
    }
    this.canvas2 = document.getElementById('implementationPer')
    this.ctx2 = this.canvas2?.getContext('2d')
    this.chart2 = new Chart(this.ctx2, {
      type: 'pie',
      data: chartData,

      options: {
        responsive: false,
        cutout: 120,
        radius: 100,


        plugins: {

          legend: {
            display: false,
          },
        },
      },
    })
  }



  ngOnDestroy(): void {
    //console.log('destroyed')
    this.chart.destroy()
    this.chart2.destroy()
  }
}
