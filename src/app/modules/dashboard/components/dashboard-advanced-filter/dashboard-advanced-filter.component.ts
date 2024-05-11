import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-advanced-filter',
  templateUrl: './dashboard-advanced-filter.component.html',
  styleUrls: ['./dashboard-advanced-filter.component.scss'],
})
export class DashboardAdvancedFilterComponent implements OnInit, OnChanges {
  @Input() filters;
  lang = this.translateService.currentLang;
  form: FormGroup;
  managers;
  categories;
  origins;
  types;
  priorityLevels;

  fromDate;
  toDate;

  constructor(
    private popupService: PopupService,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.getManagers();
    this.getExternalLookups();
    this.getPriorityLevels();
  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters(){
    if(this.filters){
      if(this.filters.managerId)
        this.form.get('managerId').setValue(this.filters.managerId);
      if(this.filters.categoryId)
        this.form.get('categoryId').setValue(+this.filters.categoryId);
      if(this.filters.originId)
        this.form.get('originId').setValue(+this.filters.originId);
      if(this.filters.types)
        this.form.get('types').setValue(+this.filters.types[0]);
      if(this.filters.priorityLevel)
        this.form.get('priorityLevel').setValue(+this.filters.priorityLevel);
      if(this.filters.fromDate)
        this.form.get('fromDate').setValue(this.filters.fromDate);
      if(this.filters.toDate)
        this.form.get('toDate').setValue(this.filters.toDate);
      if(this.filters.fromBudget || this.filters.fromBudget == "0" || this.filters.fromBudget == 0)
        this.form.get('fromBudget').setValue(this.filters.fromBudget);
      if(this.filters.toBudget)
        this.form.get('toBudget').setValue(this.filters.toBudget);
      // if(this.filters.year)
      //   this.form.get('year').setValue(this.filters.year);
    }
   
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initForm() {
    this.form = this.fb.group({
      managerId: [null],
      categoryId: [null],
      originId: [null],
      types: [null],
      priorityLevel: [null],
      fromDate: [null],
      toDate: [null],
      fromBudget: [null],
      toBudget: [null],
    });
  }

  getManagers() {
    this.dashboardService.getManagers().subscribe((res) => {
      this.managers = res.data;
    });
  }

  getExternalLookups() {
    this.dashboardService.getExternalLookups().subscribe((res) => {
      const categories = res.find((data) => data.lookupType === 'ProjectCategory');
      const origins = res.find((data) => data.lookupType === 'ProjectOrigin');
      const types = res.find((data) => data.lookupType === 'ProjectType');

      if (categories) {
        this.categories = categories.result;
        this.categories.forEach(obj => {
          obj.name = obj?.title?.en;
          obj.nameAr = obj?.title?.ar;
        });
      } else {
        this.categories = [];
      }

      if (origins) {
        this.origins = origins.result;
        this.origins.forEach(obj => {
          obj.name = obj?.title?.en;
          obj.nameAr = obj?.title?.ar;
        });
      } else {
        this.origins = [];
      }

      if (types) {
        this.types = types.result;
        this.types.forEach(obj => {
          obj.name = obj?.title?.en;
          obj.nameAr = obj?.title?.ar;
        });
      } else {
        this.types = [];
      }
    });
  }

  getPriorityLevels() {
    this.dashboardService.getPriorityLevels().subscribe((res) => {
      this.priorityLevels = res;
      this.priorityLevels.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  onPopupClose() {
    this.popupService.close();
  }

  onClear() {
    this.form.reset();
    this.fromDate = null;
    this.toDate = null;
    this.dashboardService.advancedFilterData.next(this.form.value);
    this.onPopupClose();
  }

  onFilter() {
    this.form.value.types =
      this.form.value.types !== null ? [+this.form.value.types] : null;
    this.form.value.categoryId = +this.form.value.categoryId;
    this.form.value.originId = +this.form.value.originId;
    this.form.value.priorityLevel = +this.form.value.priorityLevel;

    this.fromDate = this.form.value.fromDate
      ? `${this.form.value.fromDate.year}-${this.form.value.fromDate.month}-${this.form.value.fromDate.day}`
      : this.fromDate;
    this.toDate = this.form.value.toDate
      ? `${this.form.value.toDate.year}-${this.form.value.toDate.month}-${this.form.value.toDate.day}`
      : this.toDate;

    const data = {
      managerId: this.form.value.managerId? this.form.value.managerId : null,
      categoryId: this.form.value.categoryId? this.form.value.categoryId : null,
      originId: this.form.value.originId? this.form.value.originId : null,
      types: this.form.value.types? this.form.value.types : null,
      priorityLevel: this.form.value.priorityLevel? this.form.value.priorityLevel : null,
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromBudget: this.form.value.fromBudget ? this.form.value.fromBudget : this.form.value.fromBudget == 0 ? "0" : null,
      toBudget: this.form.value.toBudget? this.form.value.toBudget : null,
    };

    this.dashboardService.advancedFilterData.next(data);
    this.onPopupClose();
  }
}
