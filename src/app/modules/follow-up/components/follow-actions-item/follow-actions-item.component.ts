import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-follow-actions-item',
  templateUrl: './follow-actions-item.component.html',
  styleUrls: ['./follow-actions-item.component.scss']
})
export class FollowActionsItemComponent implements OnInit, OnDestroy, OnChanges {
  public form: FormGroup;
  public btnLoading : boolean = false;
  public loading : boolean = false;
  public language = this.translateService.currentLang;
  private endSub$ = new Subject();
  public attachments = [];
  @Input() item: any;
  @Output() refreshData = new EventEmitter();
  initValue : any;

  constructor(private popupService : PopupService , private _http: HttpClient,private userService: UserService,private http: HttpHandlerService, private fb: FormBuilder, private translateService: TranslateService, private modelService: ModelService, private toastr: ToastrService) {
    this.handelForm();
   }

  json(data){
    return JSON.stringify(data);
  }

  ngOnInit(): void {
    this.handleLangChnage();
  }

  ngOnChanges() {
    if(this.item){
      this.form.get('progress').setValue(this.item.progress);
      this.initValue = this.form.value;
    }
  }

  private handleLangChnage(){
    this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.language = this.translateService.currentLang;
    })
  }

  handelForm() {
    this.form = this.fb.group({
      notes: this.fb.control(''),
      progress : this.fb.control(0),
    })
    this.initValue = this.form.value;
  }

  onPopupClose() {
    this.popupService.close();
  }

  submit(){
    this.btnLoading = true;
    const body = {
      taskId: this.item.id,
      ...this.form.value,
      attachments: this.attachments
    }
    this.http.put(this.item.isCloseTask ? Config.FollowUp.closeTask : this.item.isReopenTask ? Config.FollowUp.reopenTask : Config.FollowUp.UpdateProgress, body).pipe(finalize(() => this.btnLoading = false)).subscribe(res => {
      this.modelService.close();
      this.toastr.success(this.item.isCloseTask ? this.translateService.instant('followUp.closedSuccessfully') : this.item.isReopenTask ? this.translateService.instant('followUp.reopenedSuccessfully') : this.translateService.instant('followUp.updatedSuccessfully'));
      this.item.notes = this.form?.get('notes')?.value;
      this.item.progress = this.form?.get('progress')?.value;
      this.refreshData.emit();
    })
  }

  deleteAttachment(i){
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }

  public uploadFile(evt: any) {
    console.log("upload file");
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

  closeModel() {
    this.modelService.close();
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}
