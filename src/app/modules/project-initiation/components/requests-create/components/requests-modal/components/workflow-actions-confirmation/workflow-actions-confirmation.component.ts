import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';
import { RequestsCreateService } from '../../../../services/requests.service';

@Component({
  selector: 'app-workflow-actions-confirmation',
  templateUrl: './workflow-actions-confirmation.component.html',
  styleUrls: ['./workflow-actions-confirmation.component.scss']
})
export class WorkflowActionsConfirmationComponent implements OnInit, OnChanges {
  @Input() isCommentRequired: boolean
  @Input() isReassignOption: boolean
  @Input() isFormSubmitted: boolean
  @Input() action
  @Input() lang: string
  confirmationForm: FormGroup
  selectedFiles: any = []
  assignees = new FormControl(null, Validators.required)
  step = new FormControl(null, Validators.required)
  forceActionSteps: any;
  selectedAssignees: any = [];
  constructor(private fb: FormBuilder, private toastr: ToastrService, private translationService: TranslateConfigService, private requestsCreateService: RequestsCreateService,
  ) {
    this.initConfirmationForm()

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCommentRequired) {
      this.confirmationForm?.controls.comment.setValidators([Validators.required])
    } else {
      this.confirmationForm?.controls.comment.setValidators([])
    }
  }

  ngOnInit() {
    this.requestsCreateService.forceActionSteps.subscribe(res => {
      if (res) {
        this.forceActionSteps = res
      }
    })
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
    this.requestsCreateService.saveLoadingModalState(true)
    this.requestsCreateService.onUploadAttachment(file).subscribe((res: any) => {
      this.selectedFiles.push({
        title: file.name,
        extension: file.name.split('.').pop(),
        fileName: res.fileName,
        uploadedFileName: file.name
      })
      this.requestsCreateService.saveLoadingModalState(false)
    }, err => {
      this.requestsCreateService.saveLoadingModalState(false)

      this.toastr.error(err.message)
    })
  }

  formatter = (x: any) => x.fullName + ' | ' + x.email + ' | ' + x.position;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.requestsCreateService.searchUsers({
          "FullName": term,
          "PageSize": 10,
          "PageIndex": 1
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )


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



}
