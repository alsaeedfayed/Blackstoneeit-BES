import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';

@Component({
  selector: 'app-committees-filters',
  templateUrl: './committees-filters.component.html',
  styleUrls: ['./committees-filters.component.scss']
})
export class CommitteesFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  filterValues: any = {};

  form: FormGroup;
  committeeTypes: any[] = [];
  committeeChairmans: any[] = [];


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
    //this.getSharedLockups();
    //this.getCommitteeCategoriess()

    this.getCategoriesLookUpCommittee()
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
      committeeType: this.fb.control(null),
      chairman: this.fb.control(null),
    });
  }

  // getCommitteeCategoriess() {
  //   this.httpSer.get(Config.committeesDashboard.GetCommitteesCategories).pipe(finalize(() => {
  //   })).subscribe((res: any) => {
  //     console.log('types', res)

  //     this.committeeTypes = res?.date
  //   })
  // }

  // get committee categories
  private getCategoriesLookUpCommittee() {
    const queryServiceDesk = { ServiceName: 'Committee' };

    this.httpSer.get(`${Config.Lookups.getLooktypeByServiceName}CommitteeType` , queryServiceDesk).pipe(finalize(() => {
    })).subscribe((res: any) => {

      this.committeeTypes = res
    })



  }


  // get committee types
  // private getSharedLockups() {
  //   const queryServiceDesk = { ServiceName: 'Committee' };
  //   const lookups$ = this.httpSer.get(Config.Lookups.lookupService, queryServiceDesk);

  //   combineLatest([lookups$]).pipe(takeUntil(this.endSub$)).subscribe(([lookups]) => {
  //     this.committeeTypes = StructureLookups(lookups).CommitteeType;
  //   });
  // }

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
}
