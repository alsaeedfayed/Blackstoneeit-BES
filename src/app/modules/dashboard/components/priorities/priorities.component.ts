import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { skip, every } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.scss'],
})
export class PrioritiesComponent implements OnInit {
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
  prioritiesData;
  data;
  shouldShowPrioritiesChart = true;
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
    this.getPrioritiesData();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.prioritiesData?.length) {
        if (this.chart) this.chart.destroy();
        this.data.labels = [];
        this.prioritiesData.map((item) => {
          this.data.labels.push(item.title[this.lang]);
        });
        this.createChart(this.data);
      }
    });
  }

  getPriorityColor(code) {
    if (code === 'Low') {
      return '#85a2cb';
    } else if (code === 'Medium') {
      return '#586c89';
    } else {
      return '#7f5b93';
    }
  }

  getPrioritiesData() {
    this.dashboardService.getPriorities(this.requestData).subscribe((res) => {
      this.prioritiesData = res.map((priority) => {
        return {
          count: priority.count,
          title: priority.priority.title,
          color: this.getPriorityColor(priority.priority.code),
          percentage: priority.percentage,
        };
      });

      let labels = [];
      let numbers = [];
      let colors = [];

      this.prioritiesData.map((item) => {
        labels.push(item.title[this.lang]);
        numbers.push(item.count);
        colors.push(item.color);
      });

      let datasets = {
        label: '',
        backgroundColor: [...colors],
        data: [...numbers],
        barThickness: 5,
        hoverOffset: 4,
      };

      this.data = {
        labels: [...labels],
        datasets: [datasets],
      };

      if (this.chart) this.chart.destroy();
      this.createChart(this.data);

      this.shouldShowPrioritiesChart = this.isPrioritiesHasPercentage();
    });
  }

  createChart(data) {
    this.canvas = this.myChart?.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    } as any);
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
      this.getPrioritiesData();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getPrioritiesData();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getPrioritiesData();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getPrioritiesData();
    });
  }

  isPrioritiesHasPercentage(): boolean {
    return this.prioritiesData.some(priority => priority.percentage !== 0);
  }
}
