import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { combineLatest } from 'rxjs';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'app-meeting-comment',
  templateUrl: './meeting-comment.component.html',
  styleUrls: ['./meeting-comment.component.scss']
})
export class MeetingCommentComponent implements OnInit {

  @Input() meetingId: number;
  @Input() language: string;
  @Input() canAddComment: boolean;

  uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
  // logged user
  personItem: any;

  form: FormGroup;

  loading: boolean = true;
  gettingUSerData: boolean = true;

  sendingComment: boolean = false;

  //attachments vars 
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

  comments: any[] = [];
  constructor(
    private httpSer: HttpHandlerService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService,
    private userService: UserService,
    private attachmentService: AtachmentService,

  ) { }
  ngOnInit(): void {

    // initialize comments form controls
    this.initCommentsFormControls();

    //get meeting comments
    this.getMeetingComments();

    //get logged user information
    this.canAddComment && this.getProfile();
  }

  initCommentsFormControls() {
    this.form = this.fb.group({
      comment: [null, Validators.required],
      attachments: [null],
    });
  }

  //get meeting comments
  getMeetingComments() {
    this.httpSer.get(`${Config.Meeting.Comments.GetByMeetingId}/${this.meetingId}`)
      .pipe(finalize(() => { this.loading = false }))
      .subscribe((res) => {
        if (res) {
          this.comments = res.data;
          this.comments?.forEach(comment => {
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

  //Add new comments
  addNewComment() {
    if (this.sendingComment || !this.form.valid) return;
    this.sendingComment = true;
    let body = {
      meetingId: this.meetingId,
      ...this.form.value,
      attachments: this.attachments,
      mentionedUserIds:this.form.value.comment.match(this.uuidPattern)
    }

    this.httpSer.post(Config.Meeting.Comments.Add, body)
      .pipe(finalize(() => { this.sendingComment = false }))
      .subscribe((res) => {
        if (res) {
          this.form.reset();
          this.attachments = null;
          this.uploadedFiles = [];
          this.getMeetingComments();
          this.toastr.success(this.translate.instant('committeeTasks.detailsModel.newCommentSuccessMsg'));
        }
      });
  }
  getProfile() {
    const userId = this.userService.getCurrentUserId();
    this.httpSer
      .get(Config.Profile.getProfile + '?userId=' + userId)
      .pipe(finalize(() => { this.gettingUSerData = false }))
      .subscribe((res) => {
        this.personItem = {
          email: res.userName,
          fileName: res.profilePicture,
          id: res.id,
          position: res.position,
          fullName: res.fullName,
          userName: res.userName,
          roles: res.roles,
        };
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
            size: (e.target.files[0].size / (1024 * 1024)).toFixed(2),
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

  onViewLocalFile(i, type: string, commentIndex = 0) {
    if (type.includes('comment')) {
      this.attachmentService.getAttachmentURLs(this.comments[commentIndex].attachments[i].fileName).subscribe(r => {
        window.location.href = r[0].fileUrl;
      })
    }
    else {
      let file = this.uploadedFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = function (e) {
        const link = document.createElement("a");
        link.href = e.target.result.toString();
        link.download = file.name;
        link.click();
        link.remove();
      }
    }
  }

  onDeleteFile(i) {
    this.uploadedFiles.splice(i, 1);
    this.attachments.splice(i, 1);
    this.toastr.success(this.translate.instant('shared.removed'));
  }
}
