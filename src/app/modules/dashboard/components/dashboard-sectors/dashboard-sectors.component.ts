import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-sectors',
  templateUrl: './dashboard-sectors.component.html',
  styleUrls: ['./dashboard-sectors.component.scss'],
})
export class DashboardSectorsComponent implements OnInit {
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
  sectorsData;
  // data;
  // @ViewChild('myChart') myChart: any;
  // canvas: any;
  // ctx: any;
  // chart;
  lang: string;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.getSectorsData();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.sectorsData?.length) {
        // let names = [];
        // this.sectorsData.map((item) => {
        //   names.push(item.groupName[this.lang]);
        // });
        // this.data.labels = [...names];
        // this.data.datasets[0].label = this.translateService.instant(
        //   'shared.totalProjects'
        // );
        // if (this.chart) this.chart.destroy();
        // this.createChart(this.data);
      }
    });
  }

  getSectorsData() {
    this.dashboardService.getSectorsData(this.requestData).subscribe((res) => {
      this.sectorsData = res;

      // let names = [];
      // let numbers = [];
      // this.sectorsData.map((item) => {
      //   names.push(item.groupName[this.lang]);
      //   numbers.push(item.totalProjects);
      // });

      // let datasets = {
      //   label: this.translateService.instant('shared.totalProjects'),
      //   backgroundColor: '#00db99',
      //   data: [...numbers],
      //   borderRadius: 5,
      //   barThickness: 10,
      //   barPercentage: 1.0,
      //   categoryPercentage: 0.8, // notice here
      // };

      // this.data = {
      //   labels: [...names],
      //   datasets: [datasets],
      // };

      // if (this.chart) this.chart.destroy();
      // this.createChart(this.data);
    });
  }

  // createChart(data) {
  //   this.canvas = this.myChart.nativeElement;
  //   this.ctx = this.canvas.getContext('2d');
  //   this.chart = new Chart(this.ctx, {
  //     type: 'bar',
  //     data: data,
  //     options: {
  //       plugins: {
  //         legend: { display: false },
  //       },
  //     },
  //   } as any);
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
      this.getSectorsData();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getSectorsData();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getSectorsData();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getSectorsData();
    });
  }
}
