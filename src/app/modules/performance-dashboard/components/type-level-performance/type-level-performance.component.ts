import {Component, Input, ViewChild} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Chart} from "chart.js";
import {
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {BreakdownStatus} from "../data-breakdown/enums";

@Component({
  selector: 'type-level-performance',
  templateUrl: './type-level-performance.component.html',
  styleUrls: ['./type-level-performance.component.scss']
})

export class TypeLevelPerformanceComponent {

  // @ViewChild('myTypeChart') myTypeChart: any
  // canvas: any;
  // ctx: any;
  // chart: any;
  // chartData: any;
  _goals = [];
  _type;
  lang: string = this.translate.currentLang;
  public status = BreakdownStatus;
  @Input() set goals(_goals) {
    const arrayLength = _goals.length
    this._goals = _goals;
    this._goals = _goals.map((element, index) => {
      return {"color": this.setCssClass(element.progress), ...element}
    })
    console.log(this._goals)

    // setTimeout(() => {
    //   this.initializeChartData();
    // }, 100);
  }

  @Input() set type(_type) {
    this._type = _type;
  }

  constructor(private translate: TranslateService) {
  }
  getLabel(label) {
    return this.translate.instant('shared.' + label)
  }
  ngOnInit(): void {
    this.handleLangChange()
  }

  setCssClass(progress) {
    let progressItem = Number(progress)
    if (progressItem <= 78) {
      return 'red'
    } else if (progressItem > 78 && progressItem <= 93) {
      return 'yellow'
    } else if (progressItem > 93 && progressItem <= 100) {
      return 'green'
    } else {
      return 'blue'
    }
  }

  // initializeChartData() {
  //   const labels = [];
  //   //const items = [0, 20, 60, 80 , 100];
  //   const datasets = [];
  //   this._goals?.forEach(goal => {
  //      // labels.push(goal?.goalId)
  //       labels.push(this.lang == 'ar' ? goal?.titleAr : goal?.title)
  //       // datasets.push(+(goal?.progress?.toFixed(2)))
  //       //datasets.push(Math.round(goal?.progress * 100) / 100)
  //       datasets.push(goal?.progress);
  //       this.chartData = {
  //         labels: [...labels],
  //         datasets: [{
  //             label: this._type?.name + ' (%) ',
  //             backgroundColor: this._type?.color,
  //             data: datasets,
  //             fill: true,
  //             barThickness: 20,
  //             borderColor: '#fff',
  //             borderWidth: 1,
  //             datalabels: {
  //               //anchor: 'end',
  //               //align: 'center',
  //               display: true,
  //               labels: {
  //                 value: {
  //                   color: 'white'
  //                 }
  //               },
  //               formatter: function(value, context) {
  //                 return value + '%';
  //                // return context.dataIndex + ': ' + Math.round(value*100) + '%';
  //               }
  //             },
  //             //categoryPercentage: 0.1,
  //            // barPercentage: 1.0,
  //             // maintainAspectRatio: false,
  //             // gridLines: {
  //             //   display: true,
  //             //   drawBorder: true,
  //             // },
  //         }]
  //       }
  //   });

  //   if (this.chart) this.chart.destroy()
  //   this.createChart(this.chartData, this._goals, this.lang)
  // }

  // createChart(data, goals, lang) {
  //     this.canvas = this.myTypeChart.nativeElement
  //     this.ctx = this.canvas.getContext('2d');
  //     Chart.register(CategoryScale, BarController, DoughnutController, LineController, PieController, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);
  //     this.chart = new Chart(this.ctx, {
  //       type: 'bar',
  //       plugins: [ChartDataLabels],
  //       data: data,
  //       options: {
  //         responsive: true,
  //         maintainAspectRatio: false,
  //         plugins: {
  //           title: {
  //             display: false,
  //           },
  //           legend: {
  //             display: true,
  //             align: 'end',
  //             // align: this.lang.lang == 'ar' ? 'start' : 'end',
  //             // rtl: this.lang.lang == 'ar' ? true : false,

  //             // labels: {
  //             //   usePointStyle: true,
  //             //   boxWidth: 5,
  //             //   boxHeight: 5,
  //             // },
  //           },
  //           // tooltip: {
  //           //   callbacks: {
  //           //     label: function(context) {
  //           //       var elementProgress = context.dataset.data.find(progress => progress == context.parsed.y)
  //           //       var goal = goals.find(goal => goal.progress == elementProgress)
  //           //       var label = lang == 'ar' ? goal?.titleAr : goal?.title //context.dataset.label || '';
  //           //       if (label) {
  //           //         label += ' (%) : ';
  //           //       }
  //           //       label += context.parsed.y;
  //           //       return label;
  //           //     }
  //           //   }
  //           // }
  //         },
  //         interaction: {
  //           intersect: false,
  //         },
  //         scales: {
  //           x: {
  //             display: true,
  //             // title: {
  //             //   display: true,
  //             // },

  //           },
  //           y: {
  //             display: true,
  //             // title: {
  //             //     display: true,
  //             //     text: this.translate.instant('servicesDashboard.requestsCount')
  //             // },
  //             suggestedMin: 0,
  //             // suggestedMax: 200,

  //             ticks: {
  //               crossAlign: 'far',
  //               font: {
  //                 size: 14,
  //                 weight: 'bold'
  //               }
  //               //autoSkip: false,
  //               // maxTicksLimit: 12,
  //               //fontSize: 11

  //             },
  //           },
  //         },
  //         indexAxis: 'y',
  //       },
  //     })
  // }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      // if (this.data) {
      //  this.getUpTrackingData()
      // if (this.chart) this.chart.destroy()
      // this.createChart(this.chartData, this._goals, this.lang)
      // }
    })
  }

}
