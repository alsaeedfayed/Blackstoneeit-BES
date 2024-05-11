import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { RequestStatus } from '../../../enums/enums';
import { EvaluationService } from '../../services/evaluationService/evaluation.service';

@Component({
  selector: 'app-evaluation-filter',
  templateUrl: './evaluation-filter.component.html',
  styleUrls: ['./evaluation-filter.component.scss']
})
export class EvaluationFilterComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;

  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() showCommittee : boolean = true;
  @Input() showDateRangeValidatorInput: boolean
  filterValues: any = {};

  form: FormGroup;
  committeeTypes: any[] = [];
  committeeChairmans: any[] = [];
  requestStatus = RequestStatus;
  statuses = [];
  committeeNames: any[] = []


  //committee chairman search
  searchSubject = new Subject<string>();
  memberSearchValue: string = '';
  employeeLoadCount: number = 1;
  gettingEmployees = false;

  years : any[] = [] ;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private evaluationService: EvaluationService

  ) {
    super(translateService, translate);

    //search for employees
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.employeeLoadCount = 1;
      this.committeeChairmans = [];
      this.getCommitteeChairmans();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFiltersEmpty) this.initFilterFormControls();
  }

  ngOnInit(): void {

    const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1
    this.years.push(currentYear , previousYear)
    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

    this.statuses = this.evaluationService.getStatuses();

    this.getCommitteeNames()
    // fetch all committees types
    //this.getSharedLockups();

    // fetch all committee chairmans
    //this.getCommitteeChairmans();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });

  }

  getCommitteeNames() {
   // this.loadingCommitteesNames = true
    this.httpSer.get(`${Config.CommitteesManagement.GetApproved}`)
      .pipe(finalize(() => {  }))
      .subscribe((res: any) => {
        this.committeeNames = res;
      });
  }


  // initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      status: [null],
      committeeId: [null],
      year: [null]
    });
  }

  // get committee types
  private getSharedLockups() {
    const queryServiceDesk = { ServiceName: 'Committee' };
    const lookups$ = this.httpSer.get(Config.Lookups.lookupService, queryServiceDesk);

    combineLatest([lookups$]).pipe(takeUntil(this.endSub$)).subscribe(([lookups]) => {
      this.committeeTypes = StructureLookups(lookups).CommitteeType;
    });
  }

  // fetch all committee chairmans
  getCommitteeChairmans() {
    this.gettingEmployees = true;

    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.employeeLoadCount, pageSize: 10, fullName: this.memberSearchValue })
      .pipe(finalize(() => { this.gettingEmployees = false }))
      .subscribe((res) => {
        if (res) {
          if (this.employeeLoadCount == 1)
            this.committeeChairmans = res.data;
          else {
            res.data.forEach(element => {
              this.committeeChairmans.push(element)
            });
          }
        }
      });
  }
  //focus on search bar if members selection
  onFocus() {
    this.memberSearchValue = '';
    this.getCommitteeChairmans();
  }
  //search on members selection
  searchEmployees(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.searchSubject.next(this.memberSearchValue);
    }
  }
  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getCommitteeChairmans();

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
    //this.form.controls.status.setValue(value);
    this.changeFilter()
  }

  setCommitteeId(value) {
    //this.form.controls.status.setValue(value);
    this.changeFilter()
  }


  setFromValue() {
    //this.form.controls.from.setValue(value);
    //this.form.controls.from.setValue((new Date(value)).toISOString())
    this.changeFilter()
  }

  setToValue() {
    // this.form.controls.to.setValue((new Date(value)).toISOString())
    this.changeFilter()
  }

  checkDateRange() {
    return (new Date(this.form.value.from)) > (new Date(this.form.value.to)) && this.form.value.from && this.form.value.to
  }


  inputChangeFrom() {

  }

  inputChangeTo(event) {
    this.setToValue()
  }
}
