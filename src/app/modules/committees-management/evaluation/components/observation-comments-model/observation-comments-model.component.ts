import { ObservationComment } from './../../models/ObservationComment';
import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-observation-comments-model',
  templateUrl: './observation-comments-model.component.html',
  styleUrls: ['./observation-comments-model.component.scss']
})
export class ObservationCommentsModelComponent implements OnInit {

  loadingComments: boolean = true;
  @Input() observationId: number = null;
  @Input() language: string = '';
  @Input() canAddComment: boolean = false;
  comments: ObservationComment[] = [];
  form: FormGroup;

  uploadedFiles: any = [];
  attachments: any[] = null;
  maxFileSizeInMB: number = 10;
  supportedAttachmentTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  sendingComment: boolean = false;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
  ) { }

  ngOnInit(): void {

    // initialize comments form controls
    this.initCommentsFormControls();

    //get task details
    this.getObservationComments();
  }


  // initialize comments form controls
  initCommentsFormControls() {
    this.form = this.fb.group({
      text: [null],
      attachments: [null],
    });
  }

  // get observation comments
  getObservationComments() {
    this.httpSer
      .get(`${Config.CommitteeObservations.GetComments}/${this.observationId}`)
      .pipe(finalize(() => (this.loadingComments = false)))
      .subscribe((res: ObservationComment[]) => {
        if (res) {
          this.comments = res;
          this.comments.forEach(comment => {
            comment.attachments = comment.attachments.map(a => (
              {
                name: a.uploadedFileName,
                extension: a.extension,
                fileName: a.fileName,
                uploadedFileName: a.uploadedFileName
              }));
          })
        }
      });
  }



  addNewComment() {
    if (this.sendingComment) return;

    this.sendingComment = true;
    let body = {
      ...this.form.value,
      auditObservationId: this.observationId,
      attachments: this.attachments,
    }
    this.httpSer
      .post(Config.CommitteeObservations.AddComment, body)
      .pipe(finalize(() => (this.sendingComment = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.detailsModel.newCommentSuccessMsg'));
          this.attachments = null;
          this.uploadedFiles = [];
          this.form.reset();
          this.getObservationComments();
        }
      });
  }


  //upload attachments for comments
  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.sendingComment = true;
      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        //check duplicated file (new or old)
        if (this.uploadedFiles.filter((item) => e.target.files[0].name === item.name).length === 0) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          };

          this.uploadedFiles.push(file);

          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => { this.sendingComment = false; }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.sendingComment = false;
      }
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  onDeleteFile(i) {
    // TODO when delete request is created
    this.uploadedFiles.splice(i, 1);
    this.attachments.splice(i, 1);
    this.toastr.success(this.translate.instant('shared.removed'));
  }

  // close task details model
  closePopup() {
    this.modelService.close();
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

}
