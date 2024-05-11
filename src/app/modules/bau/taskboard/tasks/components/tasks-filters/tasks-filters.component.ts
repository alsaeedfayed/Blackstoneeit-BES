import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { MainTask } from 'src/app/modules/bau/dashboard/models/bau-dashboard';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'app-tasks-filters',
  templateUrl: './tasks-filters.component.html',
  styleUrls: ['./tasks-filters.component.scss']
})
export class TasksFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();


  language: string = this.translate.currentLang;
  loading: boolean = false;

  // Status.
  // Objective.
  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() filteredWorkgroupId: number = null;

  filterValues: any = {};
  setSortDirection: boolean = false;

  form: FormGroup;

  importanceLevel = [
    { id: 1, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 2, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 3, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private taskEnumsDataService: TaskEnumsDataService,
  ) {
    super(translateService, translate);
  }
  ngOnChanges(changes): void {
    if (this.isFiltersEmpty) this.initFilterFormControls();

    if (this.filteredWorkgroupId) {
      setTimeout(() => { this.changeFilter() });
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
      importanceLevel: this.fb.control(null),
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
    this.filterValues = {
      ...this.filterValues,
      ...this.form.value,
    };
    this.updateFilter();
  }

  // set importance level value
  setImportanceLevelValue(value) {
    this.form.controls.importanceLevel.setValue(value);
    this.changeFilter()

  }
}