import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-departments',
  templateUrl: './dashboard-departments.component.html',
  styleUrls: ['./dashboard-departments.component.scss'],
})
export class DashboardDepartmentsComponent implements OnInit {
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
  };
  sectors;
  departmentsData;
  // data;
  @ViewChild('myChart') myChart: any;
  canvas: any;
  ctx: any;
  lang: string;
  chart;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.getDepartmentsData();
    // this.getSectors();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      // if (this.departmentsData?.length) {
      //   let names = [];
      //   this.departmentsData.map((item) => {
      //     names.push(item.groupName[this.lang]);
      //   });
      //   this.data.labels = [...names];
      //   this.data.datasets[0].label = this.translateService.instant(
      //     'shared.totalProjects'
      //   );
      //   if (this.chart) this.chart.destroy();
      //   this.createChart(this.data);
      // }
    });
  }

  getSectors() {
    this.dashboardService.getSectors().subscribe((res) => {
      this.sectors = res;
    });
  }

  // onSelect(sector) {
  //   this.getDepartmentsData(sector.id);
  // }

  getDepartmentsData() {
    this.dashboardService.getDepartments(this.requestData).subscribe((res) => {
      this.departmentsData = res;

      // let names = [];
      // let numbers = [];
      // this.departmentsData.map((item) => {
      //   names.push(item.groupName[this.lang]);
      //   numbers.push(item.totalProjects);
      // });

      // let datasets = {
      //   label: this.translateService.instant('shared.totalProjects'),
      //   backgroundColor: '#3c557a',
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
  //   if (this.chart) this.chart.destroy();
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
    this.dashboardService.advancedFilterData.subscribe((data) => {
      this.requestData = {
        managerId: data?.managerId,
        categoryId: data?.categoryId,
        originId: data?.originId,
        types: data?.types,
        sectorId: this.requestData.sectorId,
        departmentId: this.requestData.departmentId,
        priorityLevel: data?.priorityLevel,
        fromDate: data?.fromDate,
        toDate: data?.toDate,
        fromBudget: data?.fromBudget,
        toBudget: data?.toBudget,
      };
      this.getDepartmentsData();
    });
    this.dashboardService.sectorId.subscribe((id) => {
      this.requestData.sectorId = id;
      this.getDepartmentsData();
    });
    this.dashboardService.departmentId.subscribe((id) => {
      this.requestData.departmentId = id;
      this.getDepartmentsData();
    });
  }
}
