import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
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
  categoriesData;
  shouldShowCategoriesChart = true;
  colors = [
    '#EDA25B',
    '#01DB9A',
    '#0075FF',
    '#FF285C',
    '#165DF0',
    '#F1F1F1',
    '#E5F7FF',
  ];
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
    this.getCategoriesData();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.chart) {
        this.chart.destroy();
        this.createChart();
      }
    });
  }

  getCategoriesData() {
    this.dashboardService.getCategories(this.requestData).subscribe((res) => {
      this.categoriesData = res;

      if (this.chart) this.chart.destroy();
      this.createChart();

      this.shouldShowCategoriesChart = this.isCategoriesHasCount();
    });
  }

  createChart() {
    const numbers = [];
    const labels = [];
    this.categoriesData.map((item) => {
      numbers.push(item.count);
      labels.push(item.category.title[this.lang]);
    });
    const data = {
      labels: [...labels],
      datasets: [
        {
          label: '',
          data: [...numbers],
          backgroundColor: this.colors,
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
      this.getCategoriesData();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getCategoriesData();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getCategoriesData();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getCategoriesData();
    });
  }

  isCategoriesHasCount(): boolean {
    return this.categoriesData.some(category => category.count !== 0);
  }
}
