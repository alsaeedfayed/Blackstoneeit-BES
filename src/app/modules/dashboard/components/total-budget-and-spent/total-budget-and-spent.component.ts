import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'app-total-budget-and-spent',
  templateUrl: './total-budget-and-spent.component.html',
  styleUrls: ['./total-budget-and-spent.component.scss'],
})
export class TotalBudgetAndSpentComponent implements OnInit {
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

  budgetAndSpentData;

  data;
  @ViewChild('myChart') myChart: any;
  canvas: any;
  ctx: any;
  chart;
  lang: string;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.getTotalBudgetAndSpent();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.chart) {
        this.data.datasets[0].label =
          this.translateService.instant('dashboard.actual');
        this.data.datasets[1].label =
          this.translateService.instant('dashboard.planned');
        this.chart.destroy();
        this.createChart(this.data);
      }
    });
  }

  getTotalBudgetAndSpent() {
    this.dashboardService
      .getTotalBudgetAndSpent(this.requestData)
      .subscribe((res) => {
        this.budgetAndSpentData = res;
        // debugger

        const labels = [];
        const plannedData = [];
        const actualData = [];
        this.budgetAndSpentData.map((item) => {
          // const date = moment(new Date(item.date)).format('MMM, YYYY');
          const date = moment(new Date(item.date)).format('MMM');
          labels.push(date);
          plannedData.push(item.plannedBudget);
          actualData.push(item.actualBudget);
        });

        this.data = {
          labels: [...labels],
          datasets: [
            {
              label: this.translateService.instant('dashboard.actual'),
              data: actualData,
              borderColor: '#eda25b',
              backgroundColor: 'rgba(237, 162, 91, 0.2)',
              fill: false,
              tension: 0.4,
            },
            {
              label: this.translateService.instant('dashboard.planned'),
              data: plannedData,
              borderColor: '#00db99',
              backgroundColor: 'rgba(138, 255, 222, 0.2)',
              fill: true,
              cubicInterpolationMode: 'monotone',
              tension: 0.4,
            },
          ],
        };

        if (this.chart) this.chart.destroy();
        this.createChart(this.data);
      });
  }

  createChart(data) {
    this.canvas = this.myChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            align: 'end',
            labels: {
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
      this.getTotalBudgetAndSpent();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getTotalBudgetAndSpent();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getTotalBudgetAndSpent();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getTotalBudgetAndSpent();
    });
  }
}
