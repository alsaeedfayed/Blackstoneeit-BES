import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from 'src/app/core/services/translate.service';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { RequestsService } from '../../services/requests.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
@Component({
  selector: 'app-requests-advanced-filter',
  templateUrl: './requests-advanced-filter.component.html',
  styleUrls: ['./requests-advanced-filter.component.scss']
})
export class RequestsAdvancedFilterComponent implements OnInit, OnChanges {
  @Input() requestsTypes;
  @Input() requestsStates;
  @Input() requestsOrigins;
  @Input() requestsCategories;
  @Input() requestsSectors;
  @Input() requestsPriorities;
  @Input() requestsDepartments;
  @Input() popupConfig;
  @Input() lang: any;
  @Input() filters: any;
  filterForm: FormGroup
  @Output() onFilterConfirmed: EventEmitter<any> = new EventEmitter()
  @Output() onFilterReset: EventEmitter<any> = new EventEmitter()
  searching: boolean;

  constructor(private fb: FormBuilder,
    private requestsService: RequestsService,
    private popupService: PopupService,
    private translationService: TranslationService,
    private translateService: TranslateService,
    private http: HttpHandlerService) {
      this.initFilterForm()
    }

  ngOnInit() {

  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      projectName: [null],
      projectType: [null],
      projectStatus: [null],
      sectorId: [null],
      projectStartDate: [null],
      projectEndDate: [null],
      managerId: [null],
      originId: [null],
      priorityLevel: [null],
      categoryId: [null],
      departmentId: [null],
    })

  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters(){
    if(this.filters){
      if(this.filters.projectName)
        this.filterForm.get('projectName').setValue(this.filters.projectName);
      if(this.filters.types)
        this.filterForm.get('projectType').setValue(this.filters.types);
      if(this.filters.stateTitle){
        this.filterForm.get('projectStatus').setValue(this.filters.stateTitle);
      }else{
        this.filterForm.get('projectStatus').setValue(null);
      }

      if(this.filters.sectorId)
        this.filterForm.get('sectorId').setValue(this.filters.sectorId);
      if(this.filters?.fromDate)
        this.filterForm.get('projectStartDate').setValue(this.formatDateToObject(this.filters?.fromDate));
      if(this.filters?.toDate)
        this.filterForm.get('projectEndDate').setValue(this.formatDateToObject(this.filters?.toDate));
      if(this.filters.managerId){
        this.getUserById(this.filters.managerId).subscribe(data=>{this.filterForm.get('managerId').setValue(data);})
      }
      if(this.filters.originId)
        this.filterForm.get('originId').setValue(this.filters.originId);
      if(this.filters.priorityLevel)
        this.filterForm.get('priorityLevel').setValue(this.filters.priorityLevel);
      if(this.filters.categoryId)
        this.filterForm.get('categoryId').setValue(this.filters.categoryId);
      if(this.filters.departmentId)
        this.filterForm.get('departmentId').setValue(this.filters.departmentId);
    }
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  formatDate(date) {
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }

  get getFilterForm() {
    return this.filterForm.controls
  }

  onFilter() {
    let data = this.filterForm.value;
    if(data?.projectStartDate)
      data.projectStartDate = this.formatDate(data.projectStartDate);
    if(data?.projectEndDate)
      data.projectEndDate = this.formatDate(data.projectEndDate);
    this.onFilterConfirmed.emit(data);
    this.popupService.close()
  }

  getUserById(userId) {
    return this.http.get("/UserManagement/api/User/GetById", { userId })
  }

  formatter = (x: any) => x.fullName + ' | ' + x.email;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.requestsService.searchUsers({
          "FullName": term,
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
