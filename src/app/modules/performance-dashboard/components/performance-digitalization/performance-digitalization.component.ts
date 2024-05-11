import { Component, Input, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Chart } from "chart.js";

@Component({
    selector: 'performance-digitalization',
    templateUrl: './performance-digitalization.component.html',
    styleUrls: ['./performance-digitalization.component.scss']
})

export class PerformanceDigitalizationComponent {

    @ViewChild('myDigitalizationChart') myDigitalizationChart: any
    canvas: any;
    ctx: any;
    chart: any;
    chartData: any;
    _data: any;
    lang: string = this.translate.currentLang;

    @Input() set data(_data) {
      this._data = _data;
      setTimeout(() => {
        this.initializeChartData();
      }, 100);
    }

    constructor(private translate: TranslateService) {}
    
    ngOnInit(): void {
      this.handleLangChange()
    }

    initializeChartData() {
      const labels = [];
      const items = [0, 20, 60, 80 , 100];
      const datasets = [];
      this.data?.forEach(item => {
        item.goals?.forEach(goal => {
          labels.push(this.lang == 'ar' ? goal?.titleAr : goal?.title)
          datasets.push(goal?.progress)  
        });
      });

      this.chartData = {
        labels: [...labels],
        datasets: [{
          // label: this.translate.instant('performanceDashboard.Actual'),
          backgroundColor: "rgb(0, 102, 255)",
          data: datasets,
          fill: true,
          barThickness: 20
        }]
      }

      if (this.chart) this.chart.destroy()
      this.createChart(this.chartData)
    }

    createChart(data) {
        this.canvas = this.myDigitalizationChart.nativeElement
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
                // align: this.lang.lang == 'ar' ? 'start' : 'end',
                // rtl: this.lang.lang == 'ar' ? true : false,
    
                // labels: {
                //   usePointStyle: true,
                //   boxWidth: 5,
                //   boxHeight: 5,
                // },
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                // title: {
                //   display: true,
                // },
              },
              y: {
                display: true,
                // title: {
                //     display: true,
                //     text: this.translate.instant('servicesDashboard.requestsCount')
                // },
                suggestedMin: 0,
                // suggestedMax: 200,
              },
            },
          },
        })
      }

      private handleLangChange() {
        this.translate.onLangChange.subscribe((language) => {
          this.lang = language.lang;
          // if (this.data) {
            //  this.getUpTrackingData()
            if (this.chart) this.chart.destroy()
            this.createChart(this.data)
          // }
        })
    } 
}