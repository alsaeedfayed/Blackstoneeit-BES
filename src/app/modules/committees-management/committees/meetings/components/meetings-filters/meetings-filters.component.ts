import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { MeetingStatusService } from '../../services/meeting-status/meeting-status.service';
import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';

@Component({
  selector: 'app-meetings-filters',
  templateUrl: './meetings-filters.component.html',
  styleUrls: ['./meetings-filters.component.scss']
})
export class MeetingsFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;

  // Status.
  // Objective.
  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() selectedStatus: number = null;
  @Input() isFiltersEmpty: boolean = false;
  @Input() Objectives: any = [];
  filterValues: any = {};
  setSortDirection: boolean = false;

  form: FormGroup;
  locationTypes = [
    { id: 0, name: 'Onsite', nameAr: 'المكتب' },
    { id: 1, name: 'Online', nameAr: 'افتراضي' },
  ]
  statuses = [];
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private meetingStatusService: MeetingStatusService,
  ) {
    super(translateService, translate);
  }
  ngOnChanges(changes): void {
    if (this.selectedStatus == -1)
      this.form?.get('status').enable();
    if (this.isFiltersEmpty) this.initFilterFormControls();
    if ("selectedStatus" in changes) {
      this.selectedStatus = this.selectedStatus == -1 ? null : this.selectedStatus;
      this.form.patchValue({ status: this.selectedStatus });
      setTimeout(() => {
        this.changeFilter();
        if (this.selectedStatus == MeetingStatus.UnderReview)
          this.form.get('status').disable();
      }
      );
    }
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();
    this.statuses = this.meetingStatusService.getStatuses();
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
      locationType: this.fb.control(null),
      // status: [{value: null, disabled: this.selectedStatus }],
      status: this.fb.control(null)
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

  // set status value
  setStatusValue(value) {
    this.form.controls.status.setValue(value);
    this.changeFilter()
  }

}