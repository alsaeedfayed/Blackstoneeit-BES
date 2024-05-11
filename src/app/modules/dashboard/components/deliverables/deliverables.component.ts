import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss'],
})
export class DeliverablesComponent implements OnInit , AfterViewInit {
  requestData = {
    managerId: null,
    categoryId: null,
    originId: null,
    types: null,
    sectorId: null,
    departmentId: null,
    priorityLevel: null,
    fromDate: null,
    toDate: null,
    fromBudget: null,
    toBudget: null,
    year: new Date().getFullYear(),
  };
  accepted;
  delayed;
  total;
  notDue;

  @ViewChild('myChart') myChart: any;
  chart;
  canvas: any;
  ctx: any;
  labels;
  shouldShowDeliverablesChart = true;

  constructor(
    private translateService: TranslateService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.handleLangChange();
    this.getDeliverables();
    this.handelFilter();
  }
 ngAfterViewInit() {
 }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      if (this.labels?.length) {
        this.labels[0].text =
          this.translateService.instant('dashboard.accepted');
        this.labels[1].text =
          this.translateService.instant('dashboard.delayed');
        this.labels[2].text = this.translateService.instant('dashboard.notDue');
        if (this.chart) this.chart.destroy();
        this.createChart();
      }
    });
  }

  getDeliverables() {
    this.dashboardService.getDeliverables(this.requestData).subscribe((res) => {
      this.accepted = res.accepted;
      this.delayed = res.delayed;
      this.total = res.total;
      this.notDue = this.total - (this.delayed + this.accepted);

      this.labels = [
        {
          text: this.translateService.instant('dashboard.accepted'),
          color: '#00DB99',
          value: this.accepted,
          percentage: (+(this.accepted / this.total) * 100).toFixed(2) || 0,
        },
        {
          text: this.translateService.instant('dashboard.delayed'),
          color: '#FF285C',
          value: this.delayed,
          percentage: (+(this.delayed / this.total) * 100).toFixed(2) || 0,
        },
        {
          text: this.translateService.instant('dashboard.notDue'),
          color: '#717986',
          value: this.notDue,
          percentage: (+(this.notDue / this.total) * 100).toFixed(2) || 0,
        },
      ];

      if (this.chart) this.chart.destroy();
      this.createChart();

      this.shouldShowDeliverablesChart = this.isDeliverablesHasCount();
    });
  }

  createChart() {
    const chartLabels = [];
    this.labels.forEach((label) => {
      chartLabels.push(label.text);
    });

    const data = {
      labels: [...chartLabels],
      datasets: [
        {
          label: '',
          data: [this.accepted, this.delayed, this.notDue],
          backgroundColor: ['#00DB99', '#FF285C', '#717986'],
          barThickness: 5,
          hoverOffset: 4,
          borderRadius: 10,
        },
      ],
    };

    this.canvas = this.myChart?.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: data,
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

  handelFilter() {
    this.dashboardService.advancedFilterData.pipe(skip(1)).subscribe((data) => {
      this.requestData = {
        managerId: data.managerId,
        categoryId: data.categoryId,
        originId: data.originId,
        types: data.types,
        sectorId: this.requestData.sectorId,
        departmentId: this.requestData.departmentId,
        year: this.requestData.year,
        priorityLevel: data.priorityLevel,
        fromDate: data.fromDate,
        toDate: data.toDate,
        fromBudget: data.fromBudget,
        toBudget: data.toBudget,
      };
      this.getDeliverables();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getDeliverables();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getDeliverables();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getDeliverables();
    });
  }

  isDeliverablesHasCount(): boolean {
    return this.labels.some(label => label.value !== 0);
  }
}
