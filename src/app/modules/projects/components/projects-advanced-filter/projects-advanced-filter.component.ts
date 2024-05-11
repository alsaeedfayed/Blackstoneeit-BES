import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from 'src/app/core/services/translate.service';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../services/projects.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
@Component({
  selector: 'app-projects-advanced-filter',
  templateUrl: './projects-advanced-filter.component.html',
  styleUrls: ['./projects-advanced-filter.component.scss']
})
export class ProjectsAdvancedFilterComponent implements OnInit {
  @Input() projectsStates;
  @Input() projectsOrigins;
  @Input() projectsCategories;
  @Input() projectsSectors;
  @Input() projectsPriorities;
  @Input() projectsDepartments;
  @Input() popupConfig;
  @Input() filters;
  filterForm: FormGroup
  @Output() onFilterConfirmed: EventEmitter<any> = new EventEmitter()
  @Output() onFilterReset: EventEmitter<any> = new EventEmitter()
  lang: any;
  searching: boolean;
  projectsTypes: any;
  constructor(private fb: FormBuilder,
    private projectsService: ProjectsService,
    private popupService: PopupService,
    private translateService: TranslateService,
    private http: HttpHandlerService) {
      this.initFilterForm();
    }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.getRequestsTypes()
    this.getSectors()
    this.getDepartments()
    this.getPriorities()
  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters() {
    if (this.filters) {
      if (this.filters.projectName)
        this.filterForm.get('projectName').setValue(this.filters.projectName);
      if (this.filters.projectStatus)
        this.filterForm.get('projectStatus').setValue(this.filters.projectStatus);
      if (this.filters.sectorId)
        this.filterForm.get('sectorId').setValue(+this.filters.sectorId);
      if (this.filters.fromDate)
        this.filterForm.get('projectStartDate').setValue(this.formatDateToObject(this.filters.fromDate));
      if (this.filters.toDate)
        this.filterForm.get('projectEndDate').setValue(this.formatDateToObject(this.filters.toDate));
      if (this.filters.managerId) {
        this.getUserById(this.filters.managerId).subscribe(data => { this.filterForm.get('managerId').setValue(data); });
      }
      if (this.filters.originId)
        this.filterForm.get('originId').setValue(+this.filters.originId);
      if (this.filters.categoryId)
        this.filterForm.get('categoryId').setValue(+this.filters.categoryId);
      if (this.filters.priorityLevel)
        this.filterForm.get('priorityLevel').setValue(+this.filters.priorityLevel);
      if (this.filters.departmentId)
        this.filterForm.get('departmentId').setValue(+this.filters.departmentId);
    }
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      projectName: [null],
      projectStatus: [null],
      sectorId: [null],
      projectStartDate: [null],
      projectEndDate: [null],
      managerId: [null],
      originId: [null],
      categoryId: [null],
      priorityLevel: [null],
      departmentId: [null],
    })
  }

  getUserById(userId) {
    return this.http.get("/UserManagement/api/User/GetById", { userId })
  }

  get getFilterForm() {
    return this.filterForm.controls
  }

  onFilter() {
    this.onFilterConfirmed.emit(this.filterForm.value)
    this.popupService.close()
  }

  getRequestsTypes() {
    this.projectsService.getLookups().subscribe(res => {
      this.projectsTypes = res.find(item => item.lookupType === 'ProjectType').result;

      this.projectsOrigins = res.find(item => item.lookupType === 'ProjectOrigin').result;
      this.projectsOrigins.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.projectsCategories = res.find(item => item.lookupType === 'ProjectCategory').result;
      this.projectsCategories.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getSectors() {
    this.projectsService.getSectors().subscribe(res => {
      this.projectsSectors = res;
      this.projectsSectors.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getDepartments() {
    this.projectsService.getDepartments().subscribe(res => {
      this.projectsDepartments = res;
      this.projectsDepartments.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getPriorities() {
    this.projectsService.getPriorities().subscribe(res => {
      this.projectsPriorities = res;
      this.projectsPriorities.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  formatter = (x: any) => this.lang === 'en' ? x.fullName : x.fullName;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.projectsService.searchUsers({
          "FullName": term,
          "PageSize": 1000,
          "PageIndex": 1,
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )

  sectorsFormatter = (x: any) => this.lang === 'en' ? x.title?.en : x.title?.ar;
  searchSectors: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      // tap(() => this.searching = true),
      switchMap(term =>
        this.projectsService.searchSectors({
          "FirstName": term,
          "PageSize": 10,
          "PageIndex": 1
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )


  onFilterResetConfirmed() {
    this.filterForm.reset()
    this.onFilterReset.emit()
    this.popupService.close()
  }

  onPopupClose() {
    this.popupService.close()

  }


}
