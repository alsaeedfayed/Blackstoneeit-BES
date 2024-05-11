import { OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { FollowupStatusMode } from '../../../../modules/follow-up/components/table/enums';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-update-item-progress-2',
  templateUrl: './update-item-progress.component.html',
  styleUrls: ['./update-item-progress.component.scss']
})
export class UpdateItemProgressComponent2 implements OnInit,OnDestroy {
  private endSub$ = new Subject();
  public language = this.translateService.currentLang;
  isUpdateProgress: boolean = false;
  isCloseTask: boolean = false;
  isReopenTask: boolean = false;
  attachments: any[] = [];
  itemDetails: any = null;
  @Input() item: any;
  @Output() refreshData = new EventEmitter();
  followUpStatusMode = FollowupStatusMode;
  form: FormGroup;
  btnLoading: boolean;
  closeBtnLoading:boolean = false;
  reopenBtnLoading:boolean = false;
  loading: boolean;
  constructor(private attachmentSrv: AtachmentService, private modelService: ModelService, private http: HttpHandlerService, private _http: HttpClient, private userService: UserService, private fb: FormBuilder, private toastr: ToastrService,
    private translateService: TranslateService, private attachmentService: AtachmentService
  ) {
    this.handleLangChnage()
   }

  ngOnInit(): void {
    this.getDetailsHistories();
    this.handelForm();
  }

  handelForm() {
    this.form = this.fb.group({
      notes: this.fb.control(''),
      progress: this.fb.control(0)
    })
  }

  private handleLangChnage(){
    this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.language = this.translateService.currentLang;
    })
  }


  getDetailsHistories() {
    this.loading = true;
    if(this.item?.id)
      this.http.get(`${Config.FollowUp.GetActionItem}/${this.item?.id}`).pipe(finalize(() => this.loading = false)).subscribe(res => {
        this.itemDetails = res;
        // debugger
        this.form.get('progress').setValue(this.itemDetails?.progress);
        this.form.get('notes').setValue(this.itemDetails?.notes);
      })
  }

  resetProgress(){
    this.isUpdateProgress = false;
    this.form.get('progress').setValue(this.itemDetails.progress);
    this.form.get('notes').setValue(this.itemDetails.notes);
  }

  closeTask(){
    this.closeBtnLoading = true;
    const body = {
      taskId: this.item.id,
      notes: this.form.controls['notes'].value ?? null,
      attachments: this.attachments
    }
    this.http.put(`${Config.FollowUp.closeTask}`, body).pipe(finalize(() => this.closeBtnLoading = false)).subscribe(res => {
      this.modelService.close();
      this.toastr.success(this.translateService.instant('followUp.closedSuccessfully'));
      this.item.status = this.followUpStatusMode.Closed;
      this.item.canEdit = false;
      this.item.canUpdateProgress = false
      this.refreshData.emit();
    })
  }

  reopenTask(){
    this.reopenBtnLoading = true;
    const body = {
      taskId: this.item.id,
      notes: this.form.controls['notes'].value ?? null,
      attachments: this.attachments
    }
    this.http.put(`${Config.FollowUp.reopenTask}`, body).pipe(finalize(() => this.reopenBtnLoading = false)).subscribe(res => {
      this.modelService.close();
      this.toastr.success(this.translateService.instant('followUp.reopenedSuccessfully'));
      this.item.canEdit = true;
      this.item.canUpdateProgress = true
      this.refreshData.emit();
    })
  }

  save(){
    if(this.isReopenTask){
      this.reopenTask();
      return;
    }
    if(this.isCloseTask){
      this.closeTask();
      return;
    }
    return;
  }

  updateProgress() {
    this.btnLoading = true;
    const body = {
      taskId: this.item.id,
      ...this.form.value,
      attachments: this.attachments
    }
    this.http.put(Config.FollowUp.UpdateProgress, body).pipe(finalize(() => this.btnLoading = false)).subscribe(res => {
      this.modelService.close();
      this.toastr.success(this.translateService.instant('shared.updatedSuccessfully'));
      this.item.progress = this.form.get('progress').value;
      this.item.notes = this.form.get('notes').value;
    })
  }



  closeModel() {
    this.modelService.close();
  }


  public deleteAttachment(i) {
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }


  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length - 1].file);
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


  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0]?.fileUrl, "_blank");
    })
  }

  getFileURL(fileName: string) {
    this.attachmentSrv.getAttachmentURLs(fileName).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          window.open(res[0].fileUrl)
        }
      },
      error: (err) => {
        this.toastr.error(this.translateService.instant("shared.somethingWentWrong"));
      }
    })
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }


}
