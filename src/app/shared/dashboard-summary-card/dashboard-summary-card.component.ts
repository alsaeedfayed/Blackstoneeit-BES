import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-summary-card',
  templateUrl: './dashboard-summary-card.component.html',
  styleUrls: ['./dashboard-summary-card.component.scss'],
})
export class DashboardSummaryCardComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() data;
  onTrackProjects: number;
  offTrackProjects: number;
  completedProjects: number;

  // @ViewChild('myChart') myChart: any;
  // canvas: any;
  // ctx: any;
  // chart;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    if (this.data) {
      this.onTrackProjects = Math.round(
        (this.data?.onTrack * this.data?.total) / 100
      );
      this.offTrackProjects = Math.round(
        (this.data?.offTrack * this.data?.total) / 100
      );
      this.completedProjects = Math.round(
        (this.data?.totalCompleted * this.data?.total) / 100
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.data) {
      // if (this.chart) this.chart.destroy();
      // this.createChart();
    }
  }

  // createChart() {
  //   const pointsData = [30, 40, 10, 20];
  //   const data = {
  //     labels: [1, 2, 3, 4],
  //     datasets: [
  //       {
  //         label: '',
  //         data: pointsData,
  //         borderColor: '#0314af',
  //         fill: false,
  //         tension: 0.4,
  //       },
  //     ],
  //   };
  //   this.canvas = this.myChart.nativeElement;
  //   this.ctx = this.canvas.getContext('2d');
  //   this.chart = new Chart(this.ctx, {
  //     type: 'line',
  //     data: data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         title: {
  //           display: false,
  //         },
  //         legend: {
  //           display: false,
  //         },
  //       },
  //       interaction: {
  //         intersect: false,
  //       },
  //       scales: {
  //         x: {
  //           display: false,
  //           title: {
  //             display: true,
  //           },
  //         },
  //         y: {
  //           display: false,
  //           title: {
  //             display: true,
  //             text: 'Value',
  //           },
  //           suggestedMin: 0,
  //           suggestedMax: 50,
  //         },
  //       },
  //       elements: {
  //         point: {
  //           radius: 0,
  //         },
  //       },
  //     },
  //   });
  // }
}
