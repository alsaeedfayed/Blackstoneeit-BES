import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/core/config/api.config';
import { UserService } from 'src/app/core/services/user.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from '../workflow-model/model.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { options } from '../../../shared/shared.module';
import { licenceKey } from 'src/license/license';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';

@Component({
  selector: 'workflow-action-model',
  templateUrl: './action-model.component.html',
  styleUrls: ['./action-model.component.scss'],
})

export class ActionModelComponent implements OnInit, OnChanges {

  lang: string = this.translate.currentLang;
  loading: boolean = false;
  isBtnLoading: boolean = false;

  form: FormGroup = new FormGroup({});
  attachments: any[] = [];

  public requestId;
  public selectedUsers = [];
  public users = [];
  public steps = [];

  @Input() option: any = {};
  @Input() task: any = {};
  @Input() instanceId: number;

  @Output() saveEvent = new EventEmitter();
  initt: boolean = false
  constructor(
    private fb: FormBuilder,
    private _http: HttpClient,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private model: ModelService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private textDirectionsService: TextDirectionsService,
  ) {
    this.form = fb.group({
      comments: this.fb.control(''),
      user: this.fb.control(null),
      step: this.fb.control(null),
    });

    // get current request id
    this.activatedRoute.params.subscribe((params) => {
      this.requestId = params['id'];
    });
  }

  ngOnInit(): void {
    // fetch all users
    this.getUsers();

    // fetch all steps
    this.getSteps();



  }

  formBuilderValue: any
  isValidFormBuilder: boolean = true
  isValidForm(isValid: boolean) {
    this.isValidFormBuilder = isValid
  }

  @Output() onFormBuilderValuesChange = new EventEmitter<any>();
  FormValue(formValue) {
    // input that has rich text
    let RichTextInputs = this.option?.formFields.filter(filter => filter.type == 'TextArea').map(f => f.key);
    
    RichTextInputs?.forEach(element => {
      if (formValue.hasOwnProperty(element)) {
        formValue[element]=  this.textDirectionsService.addDirections(formValue[element]) ;
      }
    });
    this.formBuilderValue = formValue
    this.onFormBuilderValuesChange.emit(formValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.option && changes.option.previousValue !== changes.option.currentValue) {

      // user control value & validity
      if (this.ReassignActionType) {
        this.form.controls['user'].addValidators(Validators.required);
      } else {
        this.form.controls['user'].removeValidators(Validators.required);
      }
      this.form.controls['user'].updateValueAndValidity();

      // step control value & validity
      if (this.OverrideActionType) {
        this.form.controls['step'].addValidators(Validators.required);
      } else {
        this.form.controls['step'].removeValidators(Validators.required);
      }
      this.form.controls['step'].updateValueAndValidity();

      if (this.option.isCommentRequired) {
        this.form.controls['comments'].addValidators(Validators.required);
      } else {
        this.form.controls['comments'].removeValidators(Validators.required);
      }
      this.form.controls['comments'].updateValueAndValidity();

    }
  }

  get isUsersRequired() {
    const validator = this.form.controls['user'].validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    } else {
      return false;
    }
  }

  setSelectedUsers(selectedUsers) {
    this.selectedUsers = selectedUsers;
    this.form.controls['user'].setValue(selectedUsers.map(user => user.id));
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  // fetch all users
  private getUsers() {
    this.loading = true;

    const body = {
      pageIndex: 1,
      pageSize: 2000,
    };

    this.httpService.get(Config.UserManagement.GetAll, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  // fetch all steps
  private getSteps() {
    this.loading = true;

    this.httpService.get(`${Config.WorkflowEngine.GetStates}/${this.instanceId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        this.steps = res;
      });
  }

  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length - 1].file);

    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key': licenceKey.valid
        }),
      })
      .subscribe((res: any) => {
        this.attachments.push({
          extension: res.extension,
          fileName: res.fileName,
          uploadedFileName: res.uploadedFileName
        });
      });
  }

  public deleteAttachment(i) {
    let attachment = this.attachments[i];

    attachment && this.attachments.splice(i, 1);
  }

  private reassignTask() {
    const body = {
      taskId: this.task.id,
      usersIds: this.form.value.user,
      comments: this.form.value.comments,
      attachments: this.attachments,
      source: "ServiceRequest"
    };

    this.httpService.post(Config.WorkflowEngine.Reassign, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('manageWorkflow.successfullyDone', { action: this.option.label[this.lang] }));
          this.closeModel();
          this.saveEvent.emit();
        },
        // error:()=>{
        //   this.toastr.error(this.translate.instant('manageWorkflow.somethingWentWrong'))
        // }
      });
  }

  public get ReassignActionType() {
    return this.option?.type?.toLowerCase() == 'ReassignAction'.toLowerCase();
  }

  public get OverrideActionType() {
    return this.option?.type?.toLowerCase() == 'ForceAction'.toLowerCase();
  }

  private cancelReassign() {
    const body = {
      // requestId: this.requestId,
      instanceId: this.instanceId,
      comments: this.form.value.comments,
      attachments: this.attachments,
    };

    this.httpService.post(Config.WorkflowEngine.ReassignCancel, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('manageWorkflow.successfullyDone', { action: this.option.label[this.lang] }));
          this.closeModel();
          this.saveEvent.emit();
        },
        // error:()=>{
        //   this.toastr.error(this.translate.instant('manageWorkflow.somethingWentWrong'))
        // }
      });
  }

  private override() {
    const body = {
      instanceId: this.instanceId,
      stateId: this.form.value.step,
      comments: this.form.value.comments,
      attachments: this.attachments,
    };

    this.httpService.post(Config.WorkflowEngine.Override, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('manageWorkflow.successfullyDone', { action: this.option.label[this.lang] }));
          this.closeModel();
          this.saveEvent.emit();
        }
      });
  }

  private takeAction() {
    const body = {
      optionId: this.option.id,
      comments: this.form.value.comments,
      attachments: this.attachments,
      formFields: this.formBuilderValue
    };


    this.httpService.post(Config.WorkflowEngine.Perform, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('manageWorkflow.successfullyDone', { action: this.option.label[this.lang] }));
          this.closeModel();
          this.saveEvent.emit();
        },
        // error:()=>{
        //   this.toastr.error(this.translate.instant('manageWorkflow.somethingWentWrong'))
        // }
      });
  }

  private cancelRequest() {
    const body = {
      requestId: +this.requestId,
      instanceId: +this.instanceId,
      comments: this.form.value.comments,
      attachments: this.attachments,
    };

    this.httpService.post(Config.WorkflowEngine.PerformCancel, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('manageWorkflow.successfullyDone', { action: this.option.label[this.lang] }));
          this.closeModel();
          this.saveEvent.emit();
        }
      });
  }

  saveAction() {
    this.isBtnLoading = true;

    if (this.option?.type?.toLowerCase() == 'ReassignAction'.toLowerCase())
      this.reassignTask();
    else if (this.option?.type?.toLowerCase() == 'CancelReassign'.toLowerCase())
      this.cancelReassign();
    else if (this.option?.type?.toLowerCase() == 'ForceAction'.toLowerCase())
      this.override();
    else if (this.option?.type?.toLowerCase() == 'CancelRequest'.toLowerCase())
      this.cancelRequest();
    else
      this.takeAction();
  }

  closeModel() {
    this.model.close();

    // Sort the users array based on whether they are selected or not
    this.users.sort((a, b) => {
      const aSelected = this.selectedUsers.some(selectedUser => selectedUser.id === a.id);
      const bSelected = this.selectedUsers.some(selectedUser => selectedUser.id === b.id);

      if (aSelected && !bSelected) {
        return -1; // a should come before b
      } else if (!aSelected && bSelected) {
        return 1; // b should come before a
      } else {
        return a.id - b.id; // maintain original order if both are selected or not selected
      }
    });
  }

}
