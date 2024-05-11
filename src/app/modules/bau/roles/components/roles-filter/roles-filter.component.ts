import { debounceTime, takeUntil, finalize } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { RequestStatus } from 'src/app/modules/committees-management/enums/enums';
import { Config } from 'src/app/core/config/api.config';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { GroupModel } from '../../models/Role';

@Component({
  selector: 'app-roles-filter',
  templateUrl: './roles-filter.component.html',
  styleUrls: ['./roles-filter.component.scss']
})
export class RolesFilterComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;



  isLoadingSectors: boolean = false;
  isLoadingDepartments: boolean = false;
  isLoadingSections: boolean = false;

  sectors: GroupModel[] = [];
  departments: GroupModel[] = [];
  sections: GroupModel[] = [];


  loading: boolean = false;

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

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFiltersEmpty) {

      this.initFilterFormControls();

      // reset vars
      this.departments = [];
      this.sections = [];
      this.oldDepartment = null;
      this.oldSection = null;

      this.getDepartments();
      this.getSections();

    }
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

    this.getSectors();
    this.getDepartments();
    this.getSections();

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
      sectorId: this.fb.control(null),
      departmentId: this.fb.control(null),
      sectionId: this.fb.control(null),
    });
  }

  // get sectors
  getSectors() {
    if (this.sectors?.length > 0) return;

    this.isLoadingSectors = true;

    let query = {
      level: 2
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingSectors = false)))
      .subscribe((res) => {
        if (res) {
          this.sectors = res;
        }
      });
  }
  oldDepartment: GroupModel = null;
  checkSector(sector) {

    if (sector) {
      this.form.value.departmentId &&
        (this.oldDepartment = this.departments.find(d => d.id == this.form.value.departmentId));

      this.form.value.sectionId &&
        (this.oldSection = this.sections.find(s => s.id == this.form.value.sectionId));

      this.form.get('departmentId')?.patchValue(null);
      this.form.get('sectionId')?.patchValue(null);
      this.departments = [];
      this.sections = [];
      this.getDepartments();
    } else {

      this.oldDepartment = null;
      this.form.get('departmentId')?.patchValue(null);
      this.form.get('sectionId')?.patchValue(null);

      this.departments = [];
      this.sections = [];

      this.getDepartments();
      this.getSections();
    }
  }

  // get departments
  getDepartments() {
    if (this.departments?.length > 0) return;
    this.isLoadingDepartments = true;
    let query = {
      level: 3,
      parentId: this.form.value.sectorId
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingDepartments = false)))
      .subscribe((res) => {
        if (res) {
          this.departments = res;

          if (this.oldDepartment?.parentId == this.form.value.sectorId) {
            this.form.get('departmentId')?.patchValue(this.oldDepartment?.id);

            if (this.oldSection?.parentId == this.form.value.departmentId) {
              this.getSections();
              this.form.get('sectionId')?.patchValue(this.oldSection?.id);
            } else {
              this.oldSection = null;
            }
          } else {
            this.oldDepartment = null;
            this.oldSection = null;
          }
        }
      });
  }
  oldSection: GroupModel = null;
  checkDepartment(department) {
    if (department) {
      this.form.value.sectionId &&
        (this.oldSection = this.sections.find(s => s.id == this.form.value.sectionId));

      this.form.get('sectionId')?.patchValue(null);

      this.sections = [];
      this.getSections();
    } else {
      !this.form.value.sectorId && this.getSections();
      this.oldSection = null;
      this.form.get('sectionId')?.patchValue(null);
      this.sections = [];
    }
  }

  // get sections
  getSections() {
    if (this.sections?.length > 0) return;

    this.isLoadingSections = true;

    let query = {
      level: 4,
      parentId: this.form.value.departmentId
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingSections = false)))
      .subscribe((res) => {
        if (res) {
          this.sections = res;

          if (this.oldSection?.parentId == this.form.value.departmentId) {

            this.form.get('sectionId')?.patchValue(this.oldSection?.id);
          }
          else this.oldSection = null;

        }
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
