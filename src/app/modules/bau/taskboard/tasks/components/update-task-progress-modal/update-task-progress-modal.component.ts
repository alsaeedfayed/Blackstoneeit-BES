import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'app-update-task-progress-modal',
  templateUrl: './update-task-progress-modal.component.html',
  styleUrls: ['./update-task-progress-modal.component.scss']
})
export class UpdateTaskProgressModalComponent implements OnInit {

  @Input() task: any = {};
  @Input() language: string = '';

  @Output() onBack = new EventEmitter();
  @Output() onUpdate = new EventEmitter();

  taskStatuses = [];
  form: FormGroup;
  isUpdatingTask: boolean = false;
  IsSendingComment: boolean = false;
  isUploadingFile: boolean = false;

  uploadedFiles: any = [];
  attachments: any[] = null;
  maxFileSizeInMB: number = 2;
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

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private httpSer: HttpHandlerService,
    private taskEnumsDataService: TaskEnumsDataService,
  ) { }

  ngOnInit(): void {
    // get task static data
    this.taskStatuses = this.taskEnumsDataService.getTaskStatuses();

    this.initProgressFormControls();
  }

  initProgressFormControls() {
    this.form = this.fb.group({
      progress: [this.task.progress, [Validators.required]],
      comment: [null],
    });
  }

  onBackBtnClick() {
    this.onBack.emit();
  }

  //update progress bar
  updateProgress() {
    this.isUpdatingTask = true;
    let body = {
      taskId: this.task.id,
      ...this.form.value,
      attachments: this.attachments ? this.attachments : []
    }
    this.httpSer.put(Config.BAU.Tasks.updateProgress, body)
      .pipe(finalize(() => { this.isUpdatingTask = false; }))
      .subscribe(() => {
        this.toastr.success(this.translate.instant('bau.bauTasks.updateProgress.updateProgressSuccessMsg'));
        this.onUpdate.emit();
      })
  }

  // drag drop events
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // Add styles to indicate the drag-over state (e.g., change background color)
    event.dataTransfer.dropEffect = 'copy'; // Set the cursor icon
  }
  // drag drop events
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any drag-over styles
  }
  // drop event
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any drag-over styles

    const files = event.dataTransfer.files;
    this.onUploadFile(event, files);
  }

  onUploadFile(e, _files = null) {
    const inputElement = e.target as HTMLInputElement;
    let files: FileList | null = inputElement.files;

    if (_files)
      files = _files;

    if (files?.length > 0) {
      this.isUploadingFile = true;

      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(
            (item) => files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            extension: files[0].name.split('.').pop(),
          };

          this.uploadedFiles.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => { this.isUploadingFile = false; }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.isUploadingFile = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.isUploadingFile = false;
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
    this.uploadedFiles.splice(i, 1);
    this.attachments.splice(i, 1);
    this.toastr.success(this.translate.instant('shared.removed'));
  }


}
