import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit, ViewChild, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, ElementRef, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto'
import moment from 'moment';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Subscription } from 'rxjs';
import { el } from '@fullcalendar/core/internal-common';
import { emit } from 'process';

@Component({
  selector: 'app-kpis-performance-status',
  templateUrl: './kpis-performance-status.component.html',
  styleUrls: ['./kpis-performance-status.component.scss']
})
export class KpisPerformanceStatusComponent implements OnInit, OnDestroy, AfterViewInit , OnChanges {


  @Input() committeeId: number = 0;

  @Output() destroyedChart: EventEmitter<boolean> = new EventEmitter()
  // loading vars
  loadingNumbers: boolean = false;
  // loadingNumbers: boolean = true;
  loadingList: boolean = false; //changed

  // kpis numbers
  totalTasks: number = 0;
  offTrack: number = 0;
  onTrack: number = 0;
  performance: number = 0;

  // chart data
  chartLabels = [];

  plannedDataChartData = [];
  actualDataChartData = [];

  onTrackChartData = [];
  offTrackChartData = [];

  months: { ar: string; en: string }[] = [
    { ar: "يناير", en: "January" },
    { ar: "فبراير", en: "February" },
    { ar: "مارس", en: "March" },
    { ar: "إبريل", en: "April" },
    { ar: "مايو", en: "May" },
    { ar: "يونيو", en: "June" },
    { ar: "يوليو", en: "July" },
    { ar: "أغسطس", en: "August" },
    { ar: "سبتمبر", en: "September" },
    { ar: "أكتوبر", en: "October" },
    { ar: "نوفمبر", en: "November" },
    { ar: "ديسمبر", en: "December" },
  ];

  language: string = this.translateService.currentLang;
  data: any

  @ViewChild('mychart3') mychart3

  canvas: any
  ctx: any
  chart3


  constructor(
    private translateService: TranslateService,
    private router: Router,
    private httpSer: HttpHandlerService,
    private elementRef: ElementRef
  ) {

  }

  ngAfterViewInit(): void {
    this.getKPIsStatusData();

  }

  ngOnInit(): void {

    this.handleLangChange();

    //this.getKPIsStatusData();

  }


  ngOnChanges(changes: SimpleChanges): void {
    //throw new Error('Method not implemented.');
   // this.onSwitchChange(true)
  }


  trackDraw: boolean = true;



  @ViewChild('canvasContainer') canvasContainerr:ElementRef;

  private handleLangChange() {
    var html = "<canvas class='my-chart' id='mychart3' #mychart3></canvas>"
    //this.destroyedChart.emit(false)
    // this.createChart(this.data)

    this.translateService.onLangChange.subscribe((language) => {
      // setTimeout(() => {
      //   this.onSwitchChange(true)
      // }, 3000);
      this.language = language.lang

       let planned =  this.plannedDataChartData
       let act =  this.actualDataChartData



       //this.subscriptionLink.unsubscribe()
      //  if(this.chart3) {
      //   //this.chart3.destroy()
      //   this.drawNewChart(false)
      //  }
      //  else {
      //   this.drawNewChart(false)
      //  }

       //this.getKPIChartsData()
      // track rate charts data
      // let on =  this.onTrackChartData
      // let off = this.offTrackChartData
      // this.onTrackChartData = []
      // this.offTrackChartData=[]
      // this.plannedDataChartData = []
      // this.actualDataChartData = []


      //this.getKPIChartsData()
    // if(this.chart3) this.chart3.destroy()
    //this.elementRef.nativeElement.remove()
    // this.createChart(this.data)
      //  if (this.chart3) { this.chart3.destroy(), this.drawNewChart(true) }
      // this.drawNewChart(true)
      //this.createChart(this.data)
      // this.data.datasets[0].label = this.translateService.instant('committeeDashboard.kpisStatus.actual');

      // this.translateService.get('committeeDashboard.kpisStatus.actual').subscribe(res => {
      //   this.data.datasets[0].label = res
      // })

      // this.translateService.get('dashboard.planned').subscribe(res => {
      //   this.data.datasets[1].label = res
      // })

      //this.chart3.destroy()
      //this.drawNewChart()
      // this.data.datasets[0].label =
      //   this.translateService.instant('dashboard.actual');
      // this.data.datasets[1].label =
      //   this.translateService.instant('dashboard.planned');
      //this.drawNewChart();
      //this.getKPIChartsData()

    });
  }

  // @ViewChild('siwtchAppp') siwtchAppp;
  // onSwitchChange(e) {
  //   if (this.chart3) {
  //     //this.chart3.destroy()
  //     //this.destroyedChart.emit(false)
  //     this.drawNewChart(e);

  //   }

  // }

  getKPIsNumbers() {
    this.httpSer
      .get(`${Config.Dashboard.GetKpiStatistics}/${this.committeeId}`)
      .pipe(finalize(() => { this.loadingNumbers = false; }))
      .subscribe((res) => {
        if (res) {

          // all items list
          // kpis numbers
          this.totalTasks = res.totalCount;
          this.performance = res.performanceCount;
          this.offTrack = res.offTrackCount;
          this.onTrack = res.onTrackCount;
        }
      });
  }

  subscriptionLink: Subscription
  getKPIChartsData() {
    this.subscriptionLink = this.httpSer
      .get(`${Config.Dashboard.GetKpiStatisticsList}/${this.committeeId}`)
      .pipe(finalize(() => { this.loadingList = false; }))
      .subscribe((res) => {
        console.log('chartdata' , res)
        if (res) {
          res.map((kpi) => {
            // const date = moment(new Date(kpi.date)).format('MMM');
            const date = this.months[kpi.month - 1];
            this.chartLabels.push(date);
            // not track rate charts data
            this.plannedDataChartData.push(kpi.planned);
            this.actualDataChartData.push(kpi.actual);
            // track rate charts data
            this.onTrackChartData.push(kpi.onTrackCount);
            this.offTrackChartData.push(kpi.offTrackCount);
          })

         // this.drawNewChart();

        }
      });
  }

  // get charts data
  // drawNewChart(trackRate: boolean = false) {
  //   // this.destroyedChart.emit(false)
  //   if (trackRate) {
  //     this.data = {
  //       labels: [...(this.chartLabels.map(label => label[this.language]))],
  //       datasets: [
  //         {
  //           label: this.language === "en" ? "On Track" : "وفق الخطة ",
  //           data: this.onTrackChartData,
  //           borderColor: '#31c22e',
  //           backgroundColor: '#31c22e',
  //           fill: false,
  //           tension: 0.4,
  //           pointHoverRadius: 6,
  //           pointHoverBackgroundColor: '#ffffff',
  //           hoverBorderWidth: 3
  //         },
  //         {
  //           label: this.language === "en" ? "Off Track" : "متأخرة ",
  //           data: this.offTrackChartData,
  //           borderColor: '#e72e2e',
  //           backgroundColor: '#e72e2e',
  //           borderDash: [10, 5],
  //           //fill: true,
  //           cubicInterpolationMode: 'monotone',
  //           tension: 0.4,
  //           pointHoverRadius: 6,
  //           pointHoverBackgroundColor: '#ffffff',
  //           hoverBorderWidth: 3
  //         },
  //       ],
  //     };
  //   } else {
  //     this.data = {
  //       labels: [...(this.chartLabels.map(label => label[this.language]))],
  //       datasets: [
  //         {
  //           label: this.language === "en" ? "Actual" : "الفعلى",
  //           data: this.actualDataChartData,
  //           borderColor: '#0066FF',
  //           borderDash: [10, 5],
  //           backgroundColor: '#0066FF',
  //           fill: false,
  //           tension: 0.4,
  //           pointHoverRadius: 6,
  //           pointHoverBackgroundColor: '#ffffff',
  //           hoverBorderWidth: 3
  //         },
  //         {
  //           label: this.language === "en" ? "Planned" : "المخطط",
  //           data: this.plannedDataChartData,
  //           borderColor: '#000000',
  //           backgroundColor: '#000000',
  //           fill: false,
  //           cubicInterpolationMode: 'monotone',
  //           tension: 0.4,
  //           pointHoverRadius: 6,
  //           pointHoverBackgroundColor: '#ffffff',
  //           hoverBorderWidth: 3
  //         },
  //       ],
  //     };
  //   }


  //   //create chart after init
  //   if (this.chart3) this.chart3.destroy();
  //   this.mychart3 && this.createChart(this.data);
  //  // this.destroyedChart.emit(true)


  // }

  // draw the chart
  // createChart(data) {
  //   //if(this.chart3) this.chart3.destroy()
  //   // debugger
  //   //this.canvas.destroy()
  //   this.canvas = this.mychart3?.nativeElement;
  //   this.ctx = this.canvas.getContext('2d');
  //   this.chart3 = new Chart(this.ctx, {
  //     type: 'line',
  //     data: data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         title: {
  //           display: false,
  //         },
  //         legend: {
  //           display: true,
  //           align: 'end',
  //           labels: {
  //             usePointStyle: true,
  //             boxWidth: 5,
  //             boxHeight: 5,
  //           },
  //         },
  //       },
  //       interaction: {
  //         intersect: false,
  //       },
  //       scales: {
  //         x: {
  //           display: true,
  //           title: {
  //             display: true,
  //           },
  //           ticks: {
  //             padding: 20
  //           },
  //           grid: {
  //             display: false,
  //             drawBorder: false,
  //           },

  //         },
  //         y: {

  //           display: true,
  //           title: {
  //             display: false,
  //             text: 'Value',
  //           },
  //           ticks: {
  //             padding: 20
  //           },
  //           suggestedMin: 0,
  //           grid: {
  //             display: true,
  //             drawBorder: false,
  //           },
  //         },
  //       },
  //       elements: {
  //         point: {
  //           radius: 0
  //         }
  //       }
  //     },
  //   });

  //   this.destroyedChart.emit(true)
  // }

  getKPIsStatusData() {
     this.getKPIsNumbers();
   // this.getKPIChartsData();
  }


  ngOnDestroy(): void {
    this.elementRef.nativeElement.remove();
    //this.loadingList = true;
    //this.subscriptionLink.unsubscribe()
    // this.chart3.destroy()
    if (this.chart3) {
      // console.log('destroyed')
      this.chart3.destroy()
      //this.destroyedChart.emit(false)
    }

  }

  goToKpis() {
    let path = `/committees-management/committee-details/${this.committeeId}/KPIs`;
    this.router.navigateByUrl(path);
  }

}
