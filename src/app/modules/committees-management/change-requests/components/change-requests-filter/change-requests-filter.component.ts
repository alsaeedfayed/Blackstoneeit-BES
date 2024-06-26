import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { RequestStatus } from 'src/app/modules/committees-management/enums/enums';
import { StructureLookups } from 'src/app/utils/loockups.utils';
@Component({
  selector: 'app-change-requests-filter',
  templateUrl: './change-requests-filter.component.html',
  styleUrls: ['./change-requests-filter.component.scss']
})
export class ChangeRequestsFilterComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;


  loadingCommitteesNames: boolean = false
  committeeNames: any[] = []

  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  filterValues: any = {};

  form: FormGroup;
  committeeTypes: any[] = [];
  committeeChairmans: any[] = [];
  requestStatus = RequestStatus;
  statuses = [
    { id: RequestStatus.Draft, name: 'Draft', nameAr: 'مسودة', className: 'inProgress' },
    { id: RequestStatus.Pending, name: 'Pending', nameAr: 'معلق', className: 'closed' },
    { id: RequestStatus.Rejected, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
    { id: RequestStatus.Completed, name: 'Completed', nameAr: 'مكتمل', className: 'active' },
    { id: RequestStatus.Canceled, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },
    { id: RequestStatus.Returned, name: 'Returned', nameAr: 'معاد', className: 'started' },
  ];

  //creation date
  CreationDate: { FromDate: string, ToDate: string }
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

    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

    // fetch all committees types
    this.getSharedLockups();

    // fetch all committee names
    this.getCommitteeNames()

    // fetch all committee chairmans
    this.getCommitteeChairmans();
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
      CommitteeId: this.fb.control(null),
      Chairman: this.fb.control(null),
      CreationFrom: this.fb.control(null),
      CreationTo: this.fb.control(null),
      Status: this.fb.control(null),
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

  // fetch all committee names

  getCommitteeNames() {
    this.loadingCommitteesNames = true
    this.httpSer.get(`${Config.CommitteesManagement.GetApproved}`)
      .pipe(finalize(() => { this.loadingCommitteesNames = false }))
      .subscribe((res: any) => {
        this.committeeNames = res;
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
    this.form.controls.Status.setValue(value);
    this.changeFilter()
  }

  // set from date value to utc
  setFromValue() {
    let current = new Date();
    let fromValue = new Date(this.form.value.CreationFrom);

    this.form.controls.CreationFrom.setValue(
      new Date(fromValue.getFullYear(),
        fromValue.getMonth(), fromValue.getDate(),
        (12),
        (current.getMinutes()),
        (current.getSeconds())
      ).toISOString())
    this.changeFilter()
  }

  // set to date to utc
  setToValue() {
    let current = new Date();
    let toValue = new Date(this.form.value.CreationTo);

    this.form.controls.CreationTo.setValue(
      new Date(toValue.getFullYear(),
        toValue.getMonth(), toValue.getDate(),
        (12),
        (current.getMinutes()),
        (current.getSeconds())
      ).toISOString())
    this.changeFilter()
  }


}
