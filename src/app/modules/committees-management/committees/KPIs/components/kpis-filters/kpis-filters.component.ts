import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { sortDirections } from 'src/app/modules/committees-management/enums/enums';
import { MeasurementRecurrences } from 'src/app/modules/committees-management/requests/models/MeasurementRecurrences';
import { MeasurementRecurrenceService } from 'src/app/modules/committees-management/requests/services/measurementRecurrence/measurement-recurrence.service';
import { NumbersOnly } from 'src/app/core/helpers/Numbers-Only.validator';
import { DecimalNumbersOnly } from 'src/app/core/helpers/DecimalNumbers-only';
import { PercentageOnly } from 'src/app/core/helpers/PercentageOnly';

@Component({
  selector: 'app-kpis-filters',
  templateUrl: './kpis-filters.component.html',
  styleUrls: ['./kpis-filters.component.scss']
})
export class KpisFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();
  measurementRecurrences: MeasurementRecurrences[] = null;

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

  sortKeys = [
    { key: 'name', name: 'English Name', nameAr: "الأسم بالإنجليزي" },
    { key: 'nameAr', name: 'Arabic Name', nameAr: " الأسم بالعربي" },
    { key: 'weight', name: 'Weight', nameAr: "الوزن" },
    { key: 'measurementRecurrence', name: 'Frequency', nameAr: "يقاس كل" },
    { key: 'target', name: 'Target', nameAr: "الهدف" },
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
    private measurementRecurrenceService: MeasurementRecurrenceService
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

    this.measurementRecurrences = this.measurementRecurrenceService.getMeasures();

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
      measurementRecurrence: this.fb.control(null),
      targetFrom: this.fb.control(null),
      targetTo: this.fb.control(null),
      weightFrom: this.fb.control(null),
      weightTo: this.fb.control(null),
      sortKey: this.fb.control(null),
    });
  }

  // emit filter values
  public updateFilter() {
    this.filter.emit(this.filterValues);
    this.isFiltersEmpty = false;
    let filterCounts = Object.values(this.filterValues).filter(v => (v != null && v != '' && v != undefined)).length;
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
  setFrequencyValue(value) {
    this.form.controls.measurementRecurrence.setValue(value);
    this.changeFilter()
  }

  resetSort() {
    this.sortDisabled = true;
    this.sortDirection = sortDirections.Asc;
    delete this.filterValues.sortDirection;
  }
}
