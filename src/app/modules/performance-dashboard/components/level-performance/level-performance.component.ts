import { Component, Input, ViewChild } from "@angular/core";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import { BarController, BarElement, CategoryScale, Chart, DoughnutController, Legend, LineController, LineElement, LinearScale, PieController, PointElement, Title, Tooltip } from "chart.js";
import { LevelMode } from "src/app/modules/Planning/enum/enums";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ISubGroupPerformanceData } from "./iSubGroupPerformanceData.interface";

@Component({
    selector: 'level-performance',
    templateUrl: './level-performance.component.html',
    styleUrls: ['./level-performance.component.scss']
})

export class LevelPerformanceComponent {

    @ViewChild('myLevelChart') myLevelChart: any
    canvas: any;
    ctx: any;
    chart: any;
    chartData: any;
    _data = [] //: ISubGroupPerformanceData = {} as ISubGroupPerformanceData;
    lang: string = this.translate.currentLang;
    title: string
    private endSub$ = new Subject();
    actuals = []
    targets = []
    performances = []

    // @Input() set data(_data: []) {
    //     this._data = _data;
    //     this.title = this._data[0]?.group?.level == LevelMode.L1 ? this.translate.instant('performanceDashboard.departmentLevelPerformance'):
    //     this._data[0]?.group?.level == LevelMode.L2 ? this.translate.instant('performanceDashboard.sectionLevelPerformance') : null;
    //     setTimeout(() => {
    //         this.initializeChartData();
    //     }, 100);
    // }

    constructor(private performanceDashboardService: PerformanceDashboardService, private translate: TranslateService) {
      this.translate.onLangChange.subscribe((event) => {
        this.lang = event.lang;
      });
      this.performanceDashboardService.subGroupPerformanceData$.pipe(takeUntil(this.endSub$)).subscribe((data: Array<ISubGroupPerformanceData>) => {
        this._data = data;
        this.title = this._data[0]?.group?.level == LevelMode.L1 ? this.translate.instant('performanceDashboard.departmentLevelPerformance'):
        this._data[0]?.group?.level == LevelMode.L2 ? this.translate.instant('performanceDashboard.sectionLevelPerformance') : null;
        this._data.forEach(item => {
          item.actual = (item.actual).replace('٫','.')
          item.target = (item.target).replace('٫','.')
          item.performance = (item.performance).replace('٫','.')
        })
        // setTimeout(() => {
        //     // this.initializeChartData();
        // }, 100);
      })
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

    ngOnInit(): void {
      this.handleLangChange()
    }

    initializeChartData() {
        const labels = []
        const actuals = []
        const targets = []
        const performances = [];
        let performanceColor = 'gray';
        const performanceColors = []

        this._data?.forEach(item => {
            labels.push(this.lang == 'ar' ? item?.group?.arabicName : item?.group?.name)
            actuals.push(item?.actual)
            targets.push(item?.target);
            performances.push(item?.performance)
            performanceColor = (item?.performance >= 0 && item?.performance < 79) ? 'red':
                              (item?.performance >= 79 && item?.performance < 94) ? 'orange':
                              (item?.performance >= 94 && item?.performance < 101) ? 'green':
                              (item?.performance >= 101) ? 'blue' : 'gray';
            performanceColors.push(performanceColor)
        });

        this.actuals = actuals;
        this.targets = targets;
        this.performances = performances;

        this.chartData = {
            labels: [...labels],
            datasets: [
              // {
              //     label: this.translate.instant('performanceDashboard.Actual')+ ' (%) ',
              //     backgroundColor: "rgb(52, 179, 241)",
              //     data: actuals,
              //     borderRadius: 100,
              //     fill: true,
              //     barThickness: 30,
              //     datalabels: {
              //       anchor: 'end',
              //       align: 'end',
              //       display: true,
              //       labels: {
              //         value: {
              //           color: 'black'
              //         }
              //       }
              //     }
              // },
              // {
              //     label: this.translate.instant('performanceDashboard.Target')+ ' (%) ',
              //     backgroundColor: "#000",
              //     data: targets,
              //     borderRadius: 100,
              //     fill: true,
              //     barThickness: 30,
              //     datalabels: {
              //       anchor: 'end',
              //       align: 'end',
              //       display: true,
              //       labels: {
              //         value: {
              //           color: 'black'
              //         }
              //       }
              //     }
              // },
              {
                label: this.translate.instant('performanceDashboard.performance')+ ' (%) : ',
                backgroundColor: performanceColors,
                data: performances,
                borderRadius: 100,
                fill: true,
                barThickness: 40,
                // datalabels: {
                //   anchor: 'end',
                //   align: 'end',
                //   display: true,
                //   labels: {
                //     value: {
                //       color: 'black'
                //     }
                //   }
                // }
                datalabels: {
                    //anchor: 'end',
                    //align: 'center',
                    display: true,
                    font: {
                      size: 10
                    },
                    labels: {
                      value: {
                        color: 'white'
                      }
                    },
                    formatter: function(value, context) {
                      return value + '%';
                      // return context.dataIndex + ': ' + Math.round(value*100) + '%';
                    }
                },
            }],
        }

        if (this.chart) this.chart.destroy()
        this.createChart(this.chartData, actuals, targets, performances, this.translate.instant('performanceDashboard.Actual'), this.translate.instant('performanceDashboard.Target'))
    }

    private handleLangChange() {
        this.translate.onLangChange.subscribe((language) => {
            this.lang = language.lang;
            if (this.chart) this.chart.destroy()
            this.chartData.datasets[0].label = this.translate.instant('performanceDashboard.Actual');
            this.chartData.datasets[1].label = this.translate.instant('performanceDashboard.Target');
            this.chartData.datasets[2].label = this.translate.instant('performanceDashboard.performance');
            this.createChart(this.chartData, this.actuals, this.targets, this.performances, this.translate.instant('performanceDashboard.Actual'), this.translate.instant('performanceDashboard.Target'))
        })
    }

    createChart(data, actuals, targets, performances, actualText, targetText) {
        this.canvas = this.myLevelChart?.nativeElement
        this.ctx = this.canvas.getContext('2d')
        Chart.register(CategoryScale, BarController, DoughnutController, LineController, PieController, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);
        this.chart = new Chart(this.ctx, {
            type: 'bar',
            plugins: [ChartDataLabels],
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: false,
                  },
                  legend: {
                    display: false,
                    align: 'end',
                    // align: this.lang.lang == 'ar' ? 'start' : 'end',
                    // rtl: this.lang.lang == 'ar' ? true : false,

                    labels: {
                        usePointStyle: false,
                        boxWidth: 12,
                        boxHeight: 12,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        var label;
                          var performanceIndex = performances?.findIndex(performance => performance == context.formattedValue) ;
                          label = `${context.dataset.label} ${context.formattedValue} , ${actualText} (%) :  ${actuals[performanceIndex]} , ${targetText} (%) : ${targets[performanceIndex]}`

                        return label;
                      }
                    }
                  }
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
                      //text: ''
                    },
                    suggestedMin: 0,
                    // suggestedMax: 200,
                  },
                },
              },
        });
    }

    // createChart(data) {
    //     this.canvas = this.myLevelChart?.nativeElement
    //     this.ctx = this.canvas.getContext('2d')
    //     Chart.register(CategoryScale, BarController, DoughnutController, LineController, PieController, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
    //     this.chart = new Chart(this.ctx, {
    //         type: 'bar',
    //         data: data,
    //         options: {
    //             scales: {
    //                 x: {
    //                     stacked: true,
    //                 },
    //                 y: {
    //                     stacked: true
    //                 }
    //             },
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             plugins: {
    //                 title: {
    //                     display: false,
    //                 },
    //                 legend: {
    //                     display: true,
    //                     align: 'end',
    //                     labels: {
    //                         // color : 'green',
    //                         usePointStyle: false,
    //                         boxWidth: 12,
    //                         boxHeight: 12,
    //                     }
    //                 },
    //             },
    //         }
    //     });
    // }

}
