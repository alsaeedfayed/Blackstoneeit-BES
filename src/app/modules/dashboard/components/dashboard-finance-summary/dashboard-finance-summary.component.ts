import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-finance-summary',
  templateUrl: './dashboard-finance-summary.component.html',
  styleUrls: ['./dashboard-finance-summary.component.scss'],
})
export class DashboardFinanceSummaryComponent implements OnInit {
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
  colors = { spent: '#eda25b', planned: '#00db99', budget: '#0075ff' };

  data;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getBudgetStatistics();
    this.handelFilter();
  }

  getBudgetStatistics() {
    this.dashboardService
      .getBudgetStatistics(this.requestData)
      .subscribe((res) => {
        this.data = res;
        this.data.totalSpentPercentage = this.data.totalBudget ? ((this.data.totalSpentAmount / this.data.totalBudget) * 100 + '%') : 0;
        this.data.totalPlannedPercentage = this.data.totalBudget ? ((this.data.totalPlannedAmount / this.data.totalBudget) * 100 + '%') : 0;
        this.data.totalBudgetPercentage = this.data.totalBudget ? (this.data.totalSpentAmount / this.data.totalBudget) * 100 + '%' : 0;
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
      this.getBudgetStatistics();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.requestData.sectorId = id;
      this.getBudgetStatistics();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.requestData.departmentId = id;
      this.getBudgetStatistics();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.requestData.year = year;
      this.getBudgetStatistics();
    });
  }
}
