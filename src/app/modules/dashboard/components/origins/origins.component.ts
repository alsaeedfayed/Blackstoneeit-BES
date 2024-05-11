import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-origins',
  templateUrl: './origins.component.html',
  styleUrls: ['./origins.component.scss'],
})
export class OriginsComponent implements OnInit {
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
  originsData;
  data;
  colors = [
    '#EDA25B',
    '#00DB99',
    '#0314AF',
    '#586C89',
    '#165DF0',
    '#F1F1F1',
    '#E5F7FF',
  ];
  // @ViewChild('myChart') myChart: any;
  canvas: any;
  ctx: any;
  // chart;
  lang: string;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.getOriginsData();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getOriginsData() {
    this.dashboardService.getOrigins(this.requestData).subscribe((res) => {
      this.originsData = res;

      let numbers = [];

      this.originsData.map((item) => {
        numbers.push(item.count);
      });

      const total = numbers.reduce((total, number) => total + number);

      this.originsData.map((item) => {
        item.percentage = total ? `${(item.count / total) * 100}%` : 0;
      });

      // this.data = {
      //   datasets: [
      //     {
      //       label: 'My First Dataset',
      //       data: [...numbers],
      //       backgroundColor: this.colors,
      //       barThickness: 5,
      //       hoverOffset: 4,
      //     },
      //   ],
      // };

      // if (this.chart) this.chart.destroy();
      // this.createChart(this.data);
    });
  }

  // createChart(data) {
  //   this.canvas = this.myChart.nativeElement;
  //   this.ctx = this.canvas.getContext('2d');
  //   this.chart = new Chart(this.ctx, {
  //     type: 'doughnut',
  //     data: data,
  //     options: {
  //       responsive: false,
  //     },
  //   });
  // }

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
      this.getOriginsData();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getOriginsData();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getOriginsData();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getOriginsData();
    });
  }
}
