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
import { EvaluationService } from '../../../evaluation/services/evaluationService/evaluation.service';
@Component({
  selector: 'app-committees-filter',
  templateUrl: './committees-filter.component.html',
  styleUrls: ['./committees-filter.component.scss']
})
export class CommitteesFilterComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;

  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() showDateRangeValidatorInput: boolean
  filterValues: any = {};

  form: FormGroup;
  committeeTypes: any[] = [];
  committeeChairmans: any[] = [];
  requestStatus = RequestStatus;
  statuses = [];
  categories = [];

  //types filter
  types : any[]= [
    {id : 1 , name : 'permanant' , nameAr : 'دائمه'},
    {id : 2 , name : 'temporary' , nameAr : 'مؤقته'}
  ]

  //year filter
  years : any[]=[]

  //committee chairman search
  searchSubject = new Subject<string>();
  memberSearchValue: string = '';
  employeeLoadCount: number = 1;
  gettingEmployees = false;


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

    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFiltersEmpty) this.initFilterFormControls();
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

    this.statuses = this.evaluationService.getStatuses();

    //categories filter
    this.getCommitteeCategories()
    // fetch all committees types
    //this.getSharedLockups();

    // fetch all committee chairmans
    //this.getCommitteeChairmans();

    // set current & previous year
    const currentYear = new Date().getFullYear();
    const previousYear =  currentYear-1;
    this.years.push(currentYear,previousYear)

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
      Type: [null],
      Category: [null],
      Year : [null]
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


  //focus on search bar if members selection
  onFocus() {
    this.memberSearchValue = '';

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
  setTypeValue(value) {
    //this.form.controls.status.setValue(value);
    this.changeFilter()
  }

  setCategoryValue(value) {
    //this.form.controls.status.setValue(value);
    this.changeFilter()
  }

  setYearValue(value){
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



  inputChangeTo(event) {
    this.setToValue()
  }

    //get committees categories
    committeesCategories : any[] = []
    getCommitteeCategories() {
      this.httpSer.get(Config.committeesDashboard.GetCommitteesCategories).pipe(finalize(() => {
      })).subscribe((res: any) => {
        this.committeesCategories = res?.date
      })
    }



}
