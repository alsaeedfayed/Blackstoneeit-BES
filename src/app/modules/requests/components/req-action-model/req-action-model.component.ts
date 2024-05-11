import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/core/config/api.config';
import { UserService } from 'src/app/core/services/user.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from '../../../../shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'req-action-model',
  templateUrl: './req-action-model.component.html',
  styleUrls: ['./req-action-model.component.scss'],
})

export class RequestActionModelComponent implements OnChanges {
  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  @Input() option: any = {};
  @Input() task: any = {};
  @Input() instanceId: number;
  @Output() saveEvent = new EventEmitter()
  attachments: any[] = [];
  public requestId;
  public users = [];
  public steps = [];
  lang: string = this.translateService.currentLang;

  constructor(
    private fb: FormBuilder,
    private _http: HttpClient,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private model: ModelService,
    private toastr: ToastrService,
    private translateService:TranslateService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = fb.group({
      comments: this.fb.control(null),
      user: this.fb.control(null),
      step: this.fb.control(null),
    });
    this.activatedRoute.params.subscribe((params) => {
      this.requestId = params['id']
    })
    this.getUsers();
    this.getSteps();
  }

  ngAfterViewInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.option && changes.option.previousValue !== changes.option.currentValue) {
      if (this.ReassignActionType) {
        this.form.controls['user'].addValidators(Validators.required);
      }
      else {
        this.form.controls['user'].removeValidators(Validators.required);
      }
      this.form.controls['user'].updateValueAndValidity();

      if (this.OverrideActionType) {
        this.form.controls['step'].addValidators(Validators.required);
      }
      else {
        this.form.controls['step'].removeValidators(Validators.required);
      }
      this.form.controls['step'].updateValueAndValidity();

      if (this.option?.isCommentRequired) {
        this.form.controls['comments'].addValidators(Validators.required);
      }
      else {
        this.form.controls['comments'].removeValidators(Validators.required);
      }
      this.form.controls['comments'].updateValueAndValidity();

    }

  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang= language.lang;
    });
  }

  private getUsers() {
    const body = {
      pageIndex: 1,
      pageSize: 2000,
    };
    this.httpService.get(Config.UserManagement.GetAll, body)
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  private getSteps() {
    this.httpService.get(Config.Service.GetStates + '?requestId=' + this.requestId).subscribe(res => {
      this.steps = res;
    })
  }

  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length-1].file);

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
    if (attachment)
      this.attachments.splice(i, 1);
  }

  private reassignTask() {
    const body = {
      taskId: this.task.id,
      usersIds: this.form.value.user,
      comments: this.form.value.comments,
      attachments: this.attachments,
      source: "ServiceRequest"
    };
    this.httpService.post(Config.Service.ReassignTask, body)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
        this.closeModel();
        this.saveEvent.emit();
      },
      // error:()=>{
      //   this.toastr.error(this.translateService.instant('shared.somethingWentWrong'))
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
      requestId: this.requestId,
      comments: this.form.value.comments,
      attachments: this.attachments,
    };
    this.httpService.post(Config.Service.CancelReassignTask, body)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
        this.closeModel();
        this.saveEvent.emit();
      },
      // error:()=>{
      //   this.toastr.error(this.translateService.instant('shared.somethingWentWrong'))
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
    this.httpService.post(Config.Service.Override, body)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
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
    };
    this.httpService.post(Config.Service.Perform, body)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
        this.closeModel();
        this.saveEvent.emit();
      },
      // error:()=>{
      //   this.toastr.error(this.translateService.instant('shared.somethingWentWrong'))
      // }
    });
  }

  private cancelRequest() {
    const body = {
      requestId: +this.requestId,
      comments: this.form.value.comments,
      attachments: this.attachments,
    };
    this.httpService.post(Config.Service.CancelRequest, body)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
        this.closeModel();
        this.saveEvent.emit();
      }
    });
  }

  saveAction() {
    this.loading = true;

    if(this.option?.type?.toLowerCase() == 'ReassignAction'.toLowerCase())
      this.reassignTask();
    else if(this.option?.type?.toLowerCase() == 'CancelReassign'.toLowerCase())
      this.cancelReassign();
    else if(this.option?.type?.toLowerCase() == 'ForceAction'.toLowerCase())
      this.override();
    else if(this.option?.type?.toLowerCase() == 'CancelRequest'.toLowerCase())
      this.cancelRequest();
    else
      this.takeAction();
  }

  closeModel() {
    this.model.close();
  }

}
