import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { skip } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-main-old',
  templateUrl: './dashboard-main-old.component.html',
  styleUrls: ['./dashboard-main-old.component.scss'],
})
export class DashboardMainOldComponent extends ComponentBase implements OnInit {
  isFilterDisplayed;
  searchModel: any = {
    keyword: '',
    sortBy: '',
    page: 1,
    pageSize: 1000,
  };

  data = {
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

  sectorsItems: any;
  departmentsItems: any;
  areasItems: any;
  projectsData;

  constructor(
    private dashboardService: DashboardService,
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
    this.getProjectsStatistics();
    this.handelFilter();
  }

  handelFilter() {
    this.dashboardService.advancedFilterData.pipe(skip(1)).subscribe((data) => {
      this.data = {
        managerId: data.managerId,
        categoryId: data.categoryId,
        originId: data.originId,
        types: data.types,
        sectorId: this.data.sectorId,
        departmentId: this.data.departmentId,
        year: this.data.year,
        priorityLevel: data.priorityLevel,
        fromDate: data.fromDate,
        toDate: data.toDate,
        fromBudget: data.fromBudget,
        toBudget: data.toBudget,
      };
      this.getProjectsStatistics();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.data.sectorId = id;
      this.getProjectsStatistics();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.data.departmentId = id;
      this.getProjectsStatistics();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.data.year = year;
      this.getProjectsStatistics();
    });
  }

  getProjectsStatistics() {
    this.dashboardService.getProjectsStatistics(this.data).subscribe((res) => {
      this.projectsData = res;
    });
  }
}
