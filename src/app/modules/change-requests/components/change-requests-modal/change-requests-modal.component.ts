import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ChangeRequestsService } from '../../services/change-requests.service';

@Component({
  selector: 'app-change-requests-modal',
  templateUrl: './change-requests-modal.component.html',
  styleUrls: ['./change-requests-modal.component.scss']
})
export class ChangeRequestsModalComponent implements OnInit {
  @Input() forceActionSteps: any = []
  @Input() changeRequestData: any
  @Input() states: any
  @Input() lang: string
  @Input() filters: any;
  popupConfig: any
  confirmationForm: FormGroup
  selectedFiles: any = []
  isFormSubmitted: boolean
  @Output() actionConfirmed: EventEmitter<any> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() resetFilter: EventEmitter<any> = new EventEmitter();
  selectedAssignees: any = [];
  assignees = new FormControl(null, Validators.required)
  step = new FormControl(null, Validators.required)
  filterForm: FormGroup;

  constructor(private popupService: PopupService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translationService: TranslateConfigService,
    private changeRequestsService: ChangeRequestsService) {
      this.filterForm = this.fb.group({
        projectId: [null],
        stateTitle: [null],
        fromDate: [null],
        toDate: [null],
        managerId: [null]
      })
    }

  ngOnInit() {
    this.changeRequestsService.popupConfig.subscribe(config => {
      this.popupConfig = config

      if (config?.mode === 'workflow-form') {
        this.initConfirmationForm()
        if (config?.isCommentRequired) {
          this.confirmationForm?.controls.comment.setValidators([Validators.required])
        } else {
          this.confirmationForm?.controls.comment.setValidators([])
        }
      }
      if (config?.mode === 'filter') {
        this.initFilterForm(config?.filter)
      }
    })
  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters(){
    if(this.filters){
      if(this.filters.projectId)
        this.filterForm.get('projectId').setValue(this.filters.projectId);
      if(this.filters.stateTitle)
        this.filterForm.get('stateTitle').setValue(this.filters.stateTitle);
      if(this.filters.fromDate)
        this.filterForm.get('fromDate').setValue(this.filters.fromDate);
      if(this.filters.toDate)
        this.filterForm.get('toDate').setValue(this.filters.toDate);
      if(this.filters.managerId)
        this.filterForm.get('managerId').setValue(this.filters.managerId);
    }

  }


  onPopupClose() {
    this.popupService.close()
  }

  initConfirmationForm() {
    this.confirmationForm = this.fb.group({
      comment: [null,],
      file: [null],
    })
  }

  get getConfirmationForm() {
    return this.confirmationForm.controls
  }

  onFileChange(e) {
    this.onUploadFile(e.target.files[0])
  }

  onDeleteFile(index) {
    this.selectedFiles.splice(index, 1)
  }

  onUploadFile(file) {
    this.changeRequestsService.saveLoadingModalState(true)
    this.changeRequestsService.onUploadAttachment(file).subscribe((res: any) => {
      this.selectedFiles.push({
        title: file.name,
        extension: file.name.split('.').pop(),
        fileName: res.fileName,
        uploadedFileName: file.name
      })
      this.changeRequestsService.saveLoadingModalState(false)
    }, err => {
      this.changeRequestsService.saveLoadingModalState(false)

      this.toastr.error(err.message)
    })
  }


  onSelectAssignee(e, input) {
    e.preventDefault()
    if (this.selectedAssignees.filter(item => item.id === e.item.id).length === 0) {
      this.selectedAssignees.push(e.item)
      input.value = '';
    }
  }

  onUnselectUser(id) {
    this.selectedAssignees = this.selectedAssignees.filter(item => item.id !== id)
  }


  formatter = (x: any) => x.fullName;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.changeRequestsService.searchUsers({
          "FullName": term,
          "PageSize": 10,
          "PageIndex": 1
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )


  onPopupAction() {
    this.isFormSubmitted = true
    if (this.popupConfig?.mode === 'workflow-form') {
      if (this.confirmationForm.valid) {
        this.actionConfirmed.emit({
          action: this.popupConfig?.action,
          optionId: this.popupConfig?.optionId,
          comments: this.confirmationForm?.value?.comment,
          taskId: this.changeRequestData?.task?.id,
          usersIds: this.selectedAssignees?.map(item => item.id),
          attachments: this.selectedFiles?.map(item => ({ fileName: item?.fileName, extension: item?.extension, uploadedFileName: item.uploadedFileName })),
          stateId: this.step?.value
        })

        this.isFormSubmitted = false
      }
    }
    if (this.popupConfig?.mode === 'filter') {
      this.onFilter()
    }
  }

  initFilterForm(filter?) {
    this.filterForm = this.fb.group({
      projectId: [filter?.projectId ? this.getProjectById(filter?.projectId) : null],
      stateTitle: [filter?.stateTitle ? filter?.stateTitle : null],
      fromDate: [filter?.fromDate ? this.formatDateToObject(filter?.fromDate) : null],
      toDate: [filter?.toDate ? this.formatDateToObject(filter?.toDate) : null],
      managerId: [filter?.managerId ? this.getUserById(filter?.managerId) : null]
    })
  }

  get getFilterForm() {
    return this.filterForm.controls
  }

  projectFormatter = (x: any) => x.name ? x.name[this.lang] : "";
  searchProjects: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.changeRequestsService.searchProjects(
          {
            "keyword": term,
            "sortBy": null,
            "page": 1,
            "pageSize": 0
          }).pipe(
            catchError(() => {
              return of([]);
            }))
      ),
    )


  onFilter() {
    this.filter.emit({
      hasTask: this.filterForm.value?.hasTask,
      projectId: this.filterForm.value?.projectId?.id??this.filterForm.value?.projectId,
      stateTitle: this.filterForm.value?.stateTitle,
      fromDate: this.filterForm.value.fromDate ? this.formatDate(this.filterForm.value?.fromDate) : null,
      toDate: this.filterForm.value.toDate ? this.formatDate(this.filterForm.value?.toDate) : null,
      managerId: this.filterForm.value?.managerId?.id??this.filterForm.value?.managerId,
    })

  }

  onResetFilter() {
    this.resetFilter.emit()
  }

  getUserById(id) {
    this.changeRequestsService.getUserById(id).subscribe(res => {
      this.filterForm.controls.managerId.setValue(res)
    })
  }
  getProjectById(id) {
    this.changeRequestsService.getProjectById(id).subscribe(res => {
      this.filterForm.controls.projectId.setValue(res)
    })
  }

  formatDate(date) {
    if(typeof date == "object"){
      const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
      return moment(formattedDate, 'YYYY-MM-DD').format()
    }else{
      return date;
    }
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }




}
