import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-project-status',
  templateUrl: './dashboard-project-status.component.html',
  styleUrls: ['./dashboard-project-status.component.scss'],
})
export class DashboardProjectStatusComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() data;
  @ViewChild('myChart') myChart: any;
  chart;
  canvas: any;
  ctx: any;
  projectStatusData;
  shouldShowStatusChart = true;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      if (this.projectStatusData?.length) {
        this.getProjectStatusData();
        if (this.chart) this.chart.destroy();
        this.createChart();
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnChanges(): void {
    if (this.data) {
      this.getProjectStatusData();

      if (this.chart) this.chart.destroy();
      this.createChart();
    }
  }

  createChart() {
    const chartLabels = [
      this.translateService.instant('dashboard.completed'),
      this.translateService.instant('dashboard.postponed'),
      this.translateService.instant('dashboard.cancelled'),
      this.translateService.instant('dashboard.merged'),
      this.translateService.instant('dashboard.activeProject'),
    ];
    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [
            this.data?.totalCompleted,
            this.data?.totalPostponed,
            this.data?.totalCanceled,
            this.data?.totalMerged,
            this.data?.totalActive,
            this.data?.notStartedTotal,
          ],
          backgroundColor: [
            '#01db9a',
            'blueviolet',
            '#eda25b',
            '#c8c8c8',
            '#fb3e7a',
            '#0075ff'
          ],
          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    };
    this.canvas = this.myChart?.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: false,
        cutout: 65,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  getProjectStatusData() {
    this.projectStatusData = [
      {
        status: this.translateService.instant('dashboard.completed'),
        color: '#01db9a',
        total: this.data?.totalCompleted,
        percentage: this.data?.total
          ? ((this.data?.totalCompleted / this.data?.total) * 100).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('dashboard.merged'),
        color: '#c8c8c8',
        total: this.data?.totalMerged,
        percentage: this.data?.total
          ? ((this.data?.totalMerged / this.data?.total) * 100).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('dashboard.postponed'),
        color: 'blueviolet',
        total: this.data?.totalPostponed,
        percentage: this.data?.total
          ? ((this.data?.totalPostponed / this.data?.total) * 100).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('dashboard.activeProject'),
        color: '#fb3e7a',
        total: this.data?.totalActive,
        percentage: this.data?.total
          ? ((this.data?.totalActive / this.data?.total) * 100).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('dashboard.cancelled'),
        color: '#eda25b',
        total: this.data?.totalCanceled,
        percentage: this.data?.total
          ? ((this.data?.totalCanceled / this.data?.total) * 100).toFixed(2)
          : 0,
      },
      {
        status: this.translateService.instant('dashboard.notStarted'),
        color: '#0075ff',
        total: this.data?.notStartedTotal,
        percentage: this.data?.total
          ? ((this.data?.notStartedTotal / this.data?.total) * 100).toFixed(2)
          : 0,
      }
    ];

    this.shouldShowStatusChart = this.isStatusHasPercentage();
  }

  isStatusHasPercentage(): boolean {
    return this.projectStatusData.some(state => +state.percentage !== 0);
  }
}
