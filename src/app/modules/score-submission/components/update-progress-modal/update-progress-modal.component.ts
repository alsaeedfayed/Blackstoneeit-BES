import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-update-progress-modal',
  templateUrl: './update-progress-modal.component.html',
  styleUrls: ['./update-progress-modal.component.scss'],
})

export class UpdateProgressModalComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() goalId: any;
  @Input() scoreCardSubmissionId: any;

  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  attachments: any[] = [];
  lang: string = this.translateService.currentLang;
  public prevUploadedFiles: { fileName: string; extension: string }[] = [];

  @Output() update: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private _http: HttpClient,
    private httpService: HttpHandlerService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private userService: UserService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.handleLangChange();
    if (!!this.data) {
      this.setFormValues()
    }
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', Validators.required),
      actual: this.fb.control('', Validators.required),
      correctiveAction: this.fb.control(''),
      target: this.fb.control(''),
      actualDate: this.fb.control(''),
      targetDate: this.fb.control('')
    });
  }

  ngOnChanges(): void {
    if (this.showCorrectiveActionInput)
      this.form.controls['correctiveAction']?.addValidators(Validators.required);
    else
      this.form.controls['correctiveAction']?.removeValidators(Validators.required);

    this.form.controls['correctiveAction']?.updateValueAndValidity();
  }
  get DateKPIType() {
    return this.data.title == 'Date' //this.translateService.instant('scoreSubmission.Date')
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date)
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  setFormValues() {
    if(this.DateKPIType) {
      this.form.controls['target'].setValue(this.data?.obj?.submission?.target || 0)
      this.form.controls['actual'].setValue(this.data?.obj?.submission?.actualValue || 0)
      this.form.controls['correctiveAction'].setValue(this.data?.obj?.submission?.correctiveAction)
      this.form.controls['comment'].setValue(this.data?.obj?.submission?.comment);
      this.form.controls['actualDate'].setValue(new Date(this.data?.obj?.submission?.updatedDate));
      this.form.controls['targetDate'].setValue(new Date(this.convertUTCDateToLocalDate(this.data?.obj?.kpiDate2).toLocaleString()));
      this.prevUploadedFiles = this.data?.obj?.submission.attachments;
    }
    else {
      this.form.controls['target'].setValue(this.data?.obj?.target || 0)
      this.form.controls['actual'].setValue(this.data?.obj?.actualValue || 0)
      this.form.controls['correctiveAction'].setValue(this.data?.obj?.correctiveAction)
      this.form.controls['comment'].setValue(this.data?.obj?.comment);
      // this.form.controls['actualDate'].setValue(new Date(this.data?.obj?.updatedDate));
      // this.form.controls['targetDate'].setValue(new Date(this.data?.obj?.kpiDate2));
      this.prevUploadedFiles = this.data?.obj?.attachments;
    }
  }

  get showCorrectiveActionInput() {
    if(!this.DateKPIType) {
      const actual = this.form.controls['actual'] ? this.form.controls['actual'].value : 0;
      const target = this.data?.obj?.target || 0;
      return (actual < target);
    }
    else {
      const actualDate = this.form.controls['actualDate']?.value;
      const targetDate = this.form.controls['targetDate']?.value;
      return (actualDate > targetDate);
    }
  }

  public uploadFile(evt: Array<any>) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length-1].file);
    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key': licenceKey.valid
        }),
      }).subscribe((res: any) => {
        this.attachments.push({
          extension: res.extension,
          fileName: res.fileName,
          uploadedFileName: res.uploadedFileName
        });
      });
  }

  save() {
    if (this.form.valid) {
      if (!this.attachments || this.attachments.length == 0) {
        this.toastr.error(this.translateService.instant('scoreSubmission.supportingEvidenceRequired'));
        return;
      }

      this.updateProgress();
    }
  }

  private updateProgress() {
    this.loading = true;
    let actualDate = null;
    if (this.DateKPIType)
      actualDate = this.form.value.actualDate;
    else
      actualDate = new Date();

    let targetDate = null;
      if (this.DateKPIType)
        targetDate = this.form.value.targetDate;
      else
        targetDate = new Date();

    const body = {
      goalId: this.goalId,
      scoreCardSubmissionId: this.scoreCardSubmissionId,
      actual: this.DateKPIType ? 100 : this.form.value.actual,
      comments: this.form.value.comment,
      attachments: this.attachments,
      correctiveAction: this.form.value.correctiveAction,
      actualDate: actualDate,
      targetDate: targetDate
    };

    this.httpService
      .put(Config.Performance.UpdateProgress, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.update.emit();
        this.closeModal();
      });
  }

  // Popup cancel
  closeModal() {
    this.popupService.close();
    //this.form.reset();
  }

  public get EnableSave() {
    let res = !this.form.invalid && !this.loading && this.attachments && this.attachments.length > 0;
    return res;
  }

  public deleteAttachment(i) {
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }

}
