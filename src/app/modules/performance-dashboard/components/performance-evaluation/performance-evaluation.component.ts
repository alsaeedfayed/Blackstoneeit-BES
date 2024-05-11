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
import {PerformanceDashboardService} from "../../pages/performance-dashboard/performance-dashboard.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'performance-evaluation',
  templateUrl: './performance-evaluation.component.html',
  styleUrls: ['./performance-evaluation.component.scss']
})

export class PerformanceEvaluationComponent {

  private endSub$ = new Subject();
  @ViewChild('myEvalChart') myEvalChart: any;
  canvas: any;
  ctx: any;
  chart: any;
  lang: string = this.translate.currentLang;
  public chartData;
  public _data; //: IPerformanceEvaluationData = {} as IPerformanceEvaluationData;

  // @Input() set data(_data: any) {
  //     this._data = _data;
  //     setTimeout(() => {
  //         this.initializeChartData();
  //     }, 100)
  // }

  constructor(private performanceDashboardService: PerformanceDashboardService, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event) => {
      this.lang = event.lang;
      this.translate.use(this.lang);
    });
    this.performanceDashboardService.performanceEvaluationData$.pipe(takeUntil(this.endSub$)).subscribe((data) => {
      this._data = data;
      setTimeout(() => {
        this.initializeChartData();
        this.handleLangChange();
      }, 100)
    })
  }

  ngOnInit(): void {

  }

  initData() {
    const labels = [];
    const plannedData = [];
    const actualData = [];
    this._data?.map((item) => {
      // const date = moment(new Date(item.date)).format('MMM, YYYY');
      //  const date = moment(new Date(item.date)).format('MMM');
      labels.push(this.lang == 'ar' ? item?.periodAr : item?.periodName);
      plannedData.push((item?.targetScore)?.replace('٫', '.'));
      actualData.push((item?.actualScore)?.replace('٫', '.'));
    });

    this.chartData = {
      labels: [...labels],
      datasets: [
        {
          label: this.translate.instant('performanceDashboard.Actual'),
          data: actualData,
          borderColor: '#1be3a7',
          backgroundColor: '#1be3a7',
          // fill: true,
          // tension: 0.4,
          datalabels: {
            anchor: 'end',
            align: 'end',
            display: true,
            labels: {
              value: {
                color: 'black'
              }
            }
          }
        },
        {
          label: this.translate.instant('performanceDashboard.planned'),
          data: plannedData,
          borderColor: '#878fa7',
          backgroundColor: '#878fa7',
          // fill: true,
          // cubicInterpolationMode: 'monotone',
          // tension: 0.4,
          datalabels: {
            anchor: 'end',
            align: 'end',
            display: true,
            labels: {
              value: {
                color: 'black'
              }
            }
          }
        },
      ],
    };
  }

  initializeChartData() {
    this.initData();
    if (this.chart) this.chart.destroy();
    setTimeout(e => {
      this.createChart();
    }, 2000)

  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.translate.use(this.lang);
      this.initData()
      this.chartData.datasets[0].label = this.translate.instant('performanceDashboard.Actual');
      this.chartData.datasets[1].label = this.translate.instant('performanceDashboard.planned');
      if (this._data) {
        if (this.chart) this.chart.destroy();
        this.createChart();
      }
    });
  }

  createChart() {
    this.canvas = this.myEvalChart?.nativeElement;
    this.ctx = this.canvas?.getContext('2d');
    Chart.register(CategoryScale, BarController, DoughnutController, LineController, PieController, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);
    this.chart = new Chart(this.ctx, {
      type: 'line',
      plugins: [ChartDataLabels],
      data: this.chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            align: 'end',
            labels: {
              usePointStyle: false,
              boxWidth: 12,
              boxHeight: 12
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
            display: false,
            title: {
              display: true,
              text: 'Value',
            },
            suggestedMin: 0,
            // suggestedMax: 200,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}
