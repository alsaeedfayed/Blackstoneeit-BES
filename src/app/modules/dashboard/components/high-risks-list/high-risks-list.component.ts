import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-high-risks-list',
  templateUrl: './high-risks-list.component.html',
  styleUrls: ['./high-risks-list.component.scss'],
})
export class HighRisksListComponent implements OnInit {
  lang = this.translateService.currentLang;

  filterModel = {
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

  searchModel = {
    keyword: '',
    sortBy: '',
    page: 0,
    pageSize: 5,
  };

  risks = [];
  totalItems;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.getRisks();
    this.handelFilter();
  }

  resetSearchModel() {
    this.searchModel = {
      keyword: '',
      sortBy: '',
      page: 0,
      pageSize: 5,
    };
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getRisks() {
    this.dashboardService
      .getHighRisks(this.searchModel, this.filterModel)
      .subscribe((res) => {
        this.risks = res.data;
        this.totalItems = res.total;
        this.risks.forEach((risk) => {
          risk.personItem = {
            id: risk.owner.id,
            name: risk.owner.fullname,
            backgroundColor: '#0075ff',
            isActive: true,
            position: risk.owner.position,
          };
        });
      });
  }

  handelFilter() {
    this.dashboardService.advancedFilterData.pipe(skip(1)).subscribe((data) => {
      this.filterModel = {
        managerId: data.managerId,
        categoryId: data.categoryId,
        originId: data.originId,
        types: data.types,
        sectorId: this.filterModel.sectorId,
        departmentId: this.filterModel.departmentId,
        year: this.filterModel.year,
        priorityLevel: data.priorityLevel,
        fromDate: data.fromDate,
        toDate: data.toDate,
        fromBudget: data.fromBudget,
        toBudget: data.toBudget,
      };
      this.resetSearchModel();
      this.getRisks();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.filterModel.sectorId = id;
      this.resetSearchModel();
      this.getRisks();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.filterModel.departmentId = id;
      this.resetSearchModel();
      this.getRisks();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.filterModel.year = year;
      this.resetSearchModel();
      this.getRisks();
    });
  }

  onPaginate(e) {
    this.resetSearchModel();
    this.getRisks();
  }
}
