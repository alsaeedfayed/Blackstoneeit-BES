import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { CommitteeTask } from '../../models/CommitteeTask';
import { MainTask } from 'src/app/modules/committees-management/requests/models/MainTask';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
import { TaskHistory } from '../../models/TaskHistory';

@Component({
  selector: 'task-details-model',
  templateUrl: './task-details-model.component.html',
  styleUrls: ['./task-details-model.component.scss']
})
export class TaskDetailsModelComponent implements OnInit {



  private endSub$ = new Subject();
  
// for mentions 
  uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

  language: string = this.translate.currentLang;
  loading: boolean = true;
  @Input() taskId: any;
  @Output() onUpdateProgress = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  task: CommitteeTask;

  //update progress bar vars 
  showBar: boolean = false;
  updatingTask: boolean = false;

  loadingMainTasks: boolean = false;
  loadingFiles: boolean = false;
  taskPriorities = [];
  taskStatuses = [];

  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  sendingComment: boolean = false;
  form: FormGroup;
  progressForm: FormGroup;

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

  hasComment: boolean = false;
  clearComment: boolean = false;
  // tabs vars
  breakpoint: string = 'lg';
  currentTabIndex: number = -1;
  // tabs vars
  tabs: any[] = [
    {
      label: 'Comments',
      labelAr: 'التعليقات',
      active: true
    },
    {
      label: ' Files',
      labelAr: 'الملفات',
      active: false
    },
    {
      label: 'History',
      labelAr: 'تاريخ المهمة',
      active: false
    }
  ];

  selectedComment: string = "";

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private taskEnumsDataService: TaskEnumsDataService,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize comments form controls
    this.initCommentsFormControls();

    // get task static data
    this.taskStatuses = this.taskEnumsDataService.getTaskStatuses();
    this.taskPriorities = this.taskEnumsDataService.getTasksPriorities();

    //get task details
    this.getTaskDetails();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;
    this.descTextLimit = this.isDescMoreTextDisplayed ? 1000000000000 : this.descTextInitialLimit;
  }

  // initialize comments form controls
  initCommentsFormControls() {
    this.form = this.fb.group({
      comment: [null],
      attachments: [null],
    });
  }
  get comment() { return this.form.get('comment') as FormControl; }

  //initialize update progress bar

  //get task details 
  getTaskDetails() {    
    this.httpSer
      .get(`${Config.Task.GetById}/${this.taskId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.task = res;  
          console.log(res);   

          this.task.attachments = this.task.attachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
          this.task.comments.forEach(comment => {
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

  allFiles: any[] = [];

  getTaskFiles() {
    this.httpSer
      .get(`${Config.Task.GetFiles}/${this.taskId}`)
      .pipe(finalize(() => (this.loadingFiles = false)))
      .subscribe((res) => {
        if (res) {
          this.allFiles = res.attachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }));
        }
      });
  }
  // from mention box
  getComment(comment) {
    this.clearComment = false;
    this.hasComment = (comment?.length > 0);
    this.comment.setValue(comment);
  }

  addNewComment() {
    if (this.sendingComment || !this.hasComment) return;
    this.sendingComment = true;
    let body = {
      ...this.form.value,
      committeeTaskId: this.taskId,
      attachments: this.attachments,
      mentionedUserIds: this.form?.value?.comment?.match(this.uuidPattern)
    }
    this.httpSer
      .post(Config.Task.Comment.Create, body)
      .pipe(finalize(() => (this.sendingComment = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.detailsModel.tabs.newCommentSuccessMsg'));
          this.clearComment = true;
          this.hasComment = false;
          this.attachments = null;
          this.uploadedFiles = [];
          this.form.reset();
          this.getTaskDetails();
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

  updateTaskProgress() {
    this.onUpdateProgress.emit(this.task);
  }

  editTask() {
    this.onUpdate.emit(this.task);
  }
  deleteTask() {
    this.onDelete.emit(this.task);
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
  scrollToElement(item: TaskHistory) {
    switch (item.entity) {
      case 'TaskComment':
        this.activeTab(this.tabs[0]);
        this.selectedComment = item.entityId;
        break;

      case 'CommitteeTask':
        this.scrollTOData();
        break;

      default:
        break;
    }

  }
  scrollTOData() {
    const element = this.el.nativeElement.querySelector(`#top`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

  } 
  // active tab
  activeTab(tab: any) {
   
    this.selectedComment = null;
    this.currentTabIndex = this.tabs.indexOf(tab);

    // check if files tab is selected
    if (this.currentTabIndex  ==1)
    this.getTaskFiles();

    this.tabs.forEach((tab) => tab.active = false);
    tab.active = true;
  }

}
