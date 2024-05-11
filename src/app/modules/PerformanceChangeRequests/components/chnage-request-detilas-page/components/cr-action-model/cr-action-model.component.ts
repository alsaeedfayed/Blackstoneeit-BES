import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'cr-action-model',
  templateUrl: './cr-action-model.component.html',
  styleUrls: ['./cr-action-model.component.scss']
})
export class CrActionModelComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  @Input() option: any = {};
  @Input() task: any = {};
  @Output() saveEvent = new EventEmitter()
  attachments: any[] = [];
  public requestId;
  public users = [];
  lang: string = this.translateService.currentLang;

  constructor(private fb: FormBuilder,
    private _http: HttpClient,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private model: ModelService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,) {

    this.form = fb.group({
      comments: this.fb.control('', Validators.required),
      user: this.fb.control(null),
    });
    this.activatedRoute.params.subscribe((params) => {
      this.requestId = params['id']
    })
    this.getUsers();
  }

  ngOnInit(): void {
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
    }

  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
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
  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length-1].file);
    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key' :licenceKey.valid
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
      usersIds: [this.form.value.user],
      comments: this.form.value.comments,
      attachments: this.attachments,
      source: "ChangeRequest"
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
          this.toastr.success(this.translateService.instant('cr.successfullyDone'));
          this.closeModel();
          this.saveEvent.emit();
        },
        // error:()=>{
        //   this.toastr.error(this.translateService.instant('shared.somethingWentWrong'))
        // }
      });
  }

  private takeAction() {
    const body = {
      performAction: {
        optionId: this.option.id,
        comments: this.form.value.comments,
        attachments: this.attachments,
      }
    };
    this.httpService.post(Config.Performance.Perform, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translateService.instant('cr.successfullyDone'));
          this.closeModel();
          this.saveEvent.emit();
        },
        // error:()=>{
        //   this.toastr.error(this.translateService.instant('shared.somethingWentWrong'))
        // }
      });
  }

  saveAction() {
    this.loading = true;

    if (this.option?.type?.toLowerCase() == 'ReassignAction'.toLowerCase())
      this.reassignTask();
    else if (this.option?.type?.toLowerCase() == 'CancelReassign'.toLowerCase())
      this.cancelReassign();
    else
      this.takeAction();
  }

  closeModel() {
    this.model.close();
  }

}
