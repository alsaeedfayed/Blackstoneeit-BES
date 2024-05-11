import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize, skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-project-managers',
  templateUrl: './dashboard-project-managers.component.html',
  styleUrls: ['./dashboard-project-managers.component.scss'],
})
export class DashboardProjectManagersComponent implements OnInit {
  lang: string = this.translateService.currentLang;
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

  options = [
    {
      name: 'Score',
      nameAr: 'النسبة',
      value: true,
    },
    {
      name: 'No. of projects',
      nameAr: 'عدد المشاريع',
      value: false,
    },
  ];

  isLoading: boolean;
  managersData;
  showScore: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.handleLangChange();
    this.getProjectManagers();
    this.handelFilter();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getProjectManagers() {
    this.isLoading = true;
    this.dashboardService
      .getProjectManagers(this.data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        const data = res;

        data.sort((a, b) => {
          return b.totalProjects - a.totalProjects;
        });

        this.managersData = data.slice(0, 10); // get top 7 only
        this.managersData.map((item) => {
          item.managerItem = {
            id: item.manager.id,
            name: item.manager.fullname,
            backgroundColor: '#0075ff',
            isActive: true,
            email: item.manager.email,
            position: item.manager.position,
          };
        });
      });
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
      this.getProjectManagers();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.data.sectorId = id;
      this.getProjectManagers();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.data.departmentId = id;
      this.getProjectManagers();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.data.year = year;
      this.getProjectManagers();
    });
  }

  onSelectOption(option) {
    this.showScore = option.value;
  }
}
