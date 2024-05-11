import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
})
export class DashboardFiltersComponent implements OnInit, OnChanges {

  lang = this.translateService.currentLang;

  @Input() filters;
  years: number[] = [];
  sectors;
  departments;
  sectorId;
  departmentId;

  constructor(
    private translateService: TranslateService,
    private dashboardService: DashboardService,
  ) {
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.getYears();
    this.getSectors();
  }

  ngOnChanges() {
    // if (this.filters) {
    //   console.log(this.filters)
    //   this.sectorId = this.filters.sectorId;
    //   this.onSelectSector({id: this.sectorId});
    //   this.departmentId = this.filters.departmentId;
    // }
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getYears() {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i < currentYear + 2; i++) {
      years.push(i);
    }
    const items = [];
    years.map((year) => {
      items.push({
        name: year,
        nameAr: year,
        id: year,
        isDefault: year === currentYear,
      });
    });

    this.years = [...items];
    this.filters.year = this.filters?.year ? this.filters?.year : currentYear;
  }

  getSectors() {
    this.dashboardService.getSectors().subscribe((res) => {
      this.sectors = res;
      this.sectors.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
      if (this.filters) {
         this.sectorId = this.sectors.find(item=> item.id == this.filters.sectorId)
        // this.sectorId = this.filters.sectorId;
        this.onSelectSector(this.sectorId);
        this.departmentId = this.filters.departmentId;
      }
    });
  }

  getDepartments() {
    if (!this.sectorId) return;

    this.dashboardService
      .getDepartmentsBySectorId(this.sectorId)
      .subscribe((res) => {
        this.departments = res;
        this.departments.forEach(obj => {
          obj.name = obj?.title?.en;
          obj.nameAr = obj?.title?.ar;
        });
      });
  }

  onSelectSector(sector) {
    // console.log(sector)
    this.departmentId = null
    this.sectorId = sector?.id ? sector?.id : null;
    this.dashboardService.sectorId.next(this.sectorId);
    this.getDepartments();
    // this.filters.departmentId = null;
    this.dashboardService.departmentId.next(this.departmentId);

  }

  onSelectDepartment(department) {
    this.departmentId = department?.id ? department?.id : null;
    this.dashboardService.departmentId.next(this.departmentId);
  }

  onSelectYear(year) {
    this.dashboardService.year.next(year?.id);
  }
}
