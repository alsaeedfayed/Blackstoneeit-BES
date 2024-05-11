import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize, skip } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.scss'],
})
export class DetailsListComponent implements OnInit {
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

  status: number = null;

  searchModel = {
    keyword: '',
    sortBy: '',
    page: 0,
    pageSize: 20,
  };

  isLoading: boolean;
  projectStatus;
  details = [];
  totalItems;

  @Output() onExport: EventEmitter<string> = new EventEmitter();

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.getProjectStatus();
    this.getDetails();
    this.handelFilter();
  }

  resetSearchModel() {
    this.searchModel = {
      keyword: '',
      sortBy: '',
      page: 0,
      pageSize: 20,
    };
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getProjectStatus() {
    this.dashboardService.getProjectStatus().subscribe((res) => {
      this.projectStatus = res;
      this.projectStatus.unshift({
        id: null,
        code: 'All',
        title: {
          en: 'All',
          ar: 'الكل',
        },
        isSelected: true,
      });
    });
  }

  getDetails(isExport = false) {
    this.isLoading = true;

    this.searchModel = { ...this.searchModel, ...(isExport && { pageSize: 10000 }) };

    this.dashboardService
      .getDetails(this.searchModel, this.filterModel, this.status)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        this.details = res.data;
        this.totalItems = res.total;

        this.details.forEach((item) => {
          item.managerItem = {
            id: item.manager.id,
            name: item.manager.fullname,
            backgroundColor: '#0075ff',
            isActive: true,
            email: item.manager.email,
            position: item.manager.position,
          };

          if (item.status.code === 'OnTrack') {
            item.statusClass = 'primary';
          } else if (
            item.status.code === 'OffTrack' ||
            item.status.code === 'Delayed'
          ) {
            item.statusClass = 'danger';
          }
         else if (
          item.status.code === 'NotStarted'
        ) {
          item.statusClass = 'started';
        }
          else {
            item.statusClass = 'closed';
          }
        });

        isExport && setTimeout(() => this.onExport.emit());
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
      this.getDetails();
    });
    this.dashboardService.sectorId.pipe(skip(1)).subscribe((id) => {
      this.filterModel.sectorId = id;
      this.resetSearchModel();
      this.getDetails();
    });
    this.dashboardService.departmentId.pipe(skip(1)).subscribe((id) => {
      this.filterModel.departmentId = id;
      this.resetSearchModel();
      this.getDetails();
    });
    this.dashboardService.year.pipe(skip(1)).subscribe((year) => {
      this.filterModel.year = year;
      this.resetSearchModel();
      this.getDetails();
    });
  }

  onPaginate(e) {
    this.searchModel.page = e;
    this.getDetails();
  }

  progressBarType(title: string) {
    title = title.toLowerCase();
    if (title === 'on track') {
      return 'success';
    } else if (title === 'off track') {
      return 'danger';
    }
    return 'secondary';
  }

  onFilterByStatus(id: any) {
    if (this.status === id) return;
    this.projectStatus.map((status) => {
      if (status.id === id) {
        status.isSelected = true;
      } else {
        status.isSelected = false;
      }
    });
    this.status = id;
    this.resetSearchModel();

    this.getDetails();
  }
}
