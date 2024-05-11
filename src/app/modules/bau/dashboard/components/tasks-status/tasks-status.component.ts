import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { implementationTasks, ImplmentationTask, TasksPerQuarter, taskStatus } from '../../models/bau-dashboard';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import Chart, { Ticks } from 'chart.js/auto'
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-tasks-status',
  templateUrl: './tasks-status.component.html',
  styleUrls: ['./tasks-status.component.scss']
})
export class TasksStatusComponent extends ComponentBase implements OnInit , OnDestroy{

  //TODO VARiABLES
  @Input() language : string = this.translate.currentLang;
  taskStatusData : TasksPerQuarter[];
  chartData : any;
  @ViewChild('myChart') myChart: any
  canvas: any
  ctx: any
  chart

  //set data from parent
  @Input('data') set data(data : TasksPerQuarter[]) {
    if(data){
      this.taskStatusData = data;
      }

      if (this.chart) this.chart.destroy()
      this.createChart()


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
      if (this.taskStatusData) {
        // this.getUpTrackingData()
        if (this.chart) this.chart.destroy()
        this.createChart()
      }
    })
  }

//create chart
  createChart() {

     //prepare arrs for the chart
     const LABLES = [];
     const NOTSTARTED = [];
     const ONTRACK = [];
     const OFFTRACK = [];


     this.taskStatusData?.map((item : TasksPerQuarter) => {
       //const month = moment(new Date(item.month)).format('MMM')

      if(this.language == 'en')  LABLES.push('Q' + '' + item?.quarter)
      else  LABLES.push('الربع ' + '' + item?.quarter)
       //LABLES.push(month);
      //  NOTSTARTED.push(item?.notStartedCount);
       ONTRACK.push(item?.onTrackCount);
       OFFTRACK.push(item?.offTrackCount)
     })

     //prepare chart data obj

    const chartData = {
      labels: [...LABLES],

      datasets: [

        // {
        //   barThickness : 15 ,
        //   label: this.translate.instant('bau.dashboard.notDue'),
        //   data: NOTSTARTED,
        //   borderColor: '#ACB5C1',
        //   backgroundColor: '#ACB5C1',
        //   fill: false,
        //   tension: 0.4,
        //   borderRadius: Number.MAX_VALUE,
        // },
        {
          barThickness : 15 ,
          label: this.translate.instant('bau.onTrack'),
          data: ONTRACK,
          borderColor: '#0FC161',
          backgroundColor: '#0FC161',
          fill: true,
          tension: 0.4,
          // width : '10px',
          borderRadius: Number.MAX_VALUE,

          //width : Number.MIN_VALUE
        },
        {
          barThickness : 15 ,

          label: this.translate.instant('bau.offTrack'),
          data: OFFTRACK,
          borderColor: 'rgb(251, 62, 122)',
          backgroundColor: 'rgb(251, 62, 122)',
          borderRadius: Number.MAX_VALUE,
          fill: false,
          tension: 0.4,
        },
      ],

    }

    this.canvas = document.getElementById('tasksStatus')
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

ngOnDestroy(): void {
  this.chart.destroy()
}
}
