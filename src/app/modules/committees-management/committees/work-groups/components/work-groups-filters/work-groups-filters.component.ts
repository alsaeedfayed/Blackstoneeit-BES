import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { sortDirections } from 'src/app/modules/committees-management/enums/enums';
@Component({
  selector: 'app-work-groups-filters',
  templateUrl: './work-groups-filters.component.html',
  styleUrls: ['./work-groups-filters.component.scss']
})
export class WorkGroupsFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;
  sortDisabled: boolean = true;

  sortDirection: sortDirections = sortDirections.Asc;
  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() Objectives: any = [];
  filterValues: any = {};
  setSortDirection: boolean = false;

  form: FormGroup;
  statuses = [
    { id: 0, name: 'Inactive', nameAr: 'غير فعالة',className :'closed' },
    { id: 1, name: 'Active', nameAr: 'فعالة' ,className :'active' },
  ];
  sortKeys = [
    { key: 'name', name: 'Name', nameAr: "عنوان المجموعة" },
    { key: 'creationDate', name: 'Creation Date', nameAr: "تاريخ الإنشاء" },
    { key: 'membersCount', name: 'Members Count', nameAr: "عدد الأعضاء" },
    { key: 'tasksCount', name: 'Tasks Count', nameAr: " عدد المهام" },
  ];

  get ascMode(): boolean {
    return this.sortDirection === sortDirections.Asc;
  }

  get descMode(): boolean {
    return this.sortDirection === sortDirections.Desc;
  }
  sort() {

    if (this.sortDirection === sortDirections.Asc) {
      this.sortDirection = sortDirections.Desc;
    } else {
      this.sortDirection = sortDirections.Asc;
    }
    this.filterValues.sortDirection = this.sortDirection;
    this.updateFilter();
  }
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
  ) {
    super(translateService, translate);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFiltersEmpty) {
      this.initFilterFormControls();
      this.resetSort();
    }

  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });

  }

  // initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      objectiveId: this.fb.control(null),
      status: this.fb.control(null),
      sortKey: this.fb.control(null),
    });
  }


  // emit filter values
  public updateFilter() {
    this.filter.emit(this.filterValues);
    this.isFiltersEmpty = false;
    let filterCounts = Object.values(this.filterValues).filter(v => v != null).length;
    this.filtersNumber.emit(filterCounts)
  }

  // change filter values
  changeFilter() {
    if (this.form.value.sortKey) this.sortDisabled = false;
    else this.resetSort();

    this.filterValues = {
      ...this.filterValues,
      ...this.form.value,
    };
    this.updateFilter();
  }

  // set status value
  setStatusValue(value) {
    this.form.controls.status.setValue(value);
    this.changeFilter()
  }

  // get status class name
  getStatusClassName(id) {
    switch (id) {
      case 0:
        return 'closed';
      case 1:
        return 'active';
      default:
        return '';
    }
  }
  resetSort() {
    this.sortDisabled = true;
    this.sortDirection = sortDirections.Asc;
    delete this.filterValues.sortDirection;
  }
}
