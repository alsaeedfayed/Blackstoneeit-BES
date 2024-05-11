import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { CommitteeTask } from '../../models/CommitteeTask';
import { MainTask } from 'src/app/modules/committees-management/requests/models/MainTask';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';
import { MainTasksService } from '../../../../requests/services/mainTasks/main-tasks.service';
import { CommitteeBasicInfoService } from 'src/app/modules/committees-management/services/committee-basic-info/committee-basic-info.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'create-task-model',
  templateUrl: './create-task-model.component.html',
  styleUrls: ['./create-task-model.component.scss']
})
export class CreateTaskModelComponent implements OnInit {

  @Input() committeeId: number;
  @Input() meetingId: number;
  @Input() taskId: number = 0;
  @Input() title: string = '';

  @Output() taskAdded = new EventEmitter();
  @Input() isTask: boolean = true;

  language: string = this.translate.currentLang;
  isUpdating: boolean = false;
  task: CommitteeTask = {} as CommitteeTask;
  private endSub$ = new Subject();
  // isSubTask: boolean = false;

  // loading vars
  CommitteeDataLoading: boolean = true;
  taskDataLoading: boolean = true;
  loadingMainTasks: boolean = true;

  isBtnLoading: boolean = false;
  uploadingFile: boolean = false;
  form: FormGroup = new FormGroup({});
  committeeMembers: any[] = [];
  mainTasks: MainTask[] = []
  mainTask: any

  importanceLevels: any

  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '3',
    sanitize: false,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'heading',
        'fontName',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  //attachment vars
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
  uploadedFiles: any = [];
  attachments: any[] = null;
  oldAttachments: any = [];


  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private router: Router,
    private attachmentService: AtachmentService,
    private textDirectionsService: TextDirectionsService,
    private mainTasksService: MainTasksService,
    private committeeBasicInfo: CommitteeBasicInfoService,
    private taskEnumsDataService: TaskEnumsDataService

  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    this.importanceLevels = this.taskEnumsDataService.getTasksPriorities();

    // initialize form controls
    this.initFormControls();

    this.checkTaskType()
  }

  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }
  checkTaskType() {
    if (this.isTask) {
      // sub task
      this.getMainTasks();
      this.GetCommitteeDetails();

      // check creating or updating
      if (this.taskId && this.taskId > 0) {
        // get task details
        this.getTaskDetails();
        this.isUpdating = true;
      } else {
        this.isUpdating = false;
      }

    } else {
      // main task
      // stop loader flags
      this.loadingMainTasks = false
      this.CommitteeDataLoading = false

      // get committee members
      this.committeeBasicInfo.committeeMembers$.subscribe(res => {
        this.committeeMembers = res
      })

      // remove main task selection 
      this.form?.controls['parentId']?.removeValidators(Validators.required);
      this.form.controls['parentId']?.updateValueAndValidity();
      // get main task details and check if it is update
      this.getMainTaskDetails();
    }
  }
  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      titleAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      dueDate: [null, Validators.required],
      assignedTo: [null, Validators.required],
      importanceLevel: [null, Validators.required],
      parentId: [null, Validators.required],
      description: [null],
      attachments: [null],
    });
  }

  //get task details
  getMainTaskDetails() {
    this.mainTask = this.mainTasksService.getMainTaskByTitle(this.title);
    if (this.mainTask) {
      this.isUpdating = true;
      this.patchForm();
      this.oldAttachments = this.mainTask.attachments?.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));
    }
  }

  // get committee details
  GetCommitteeDetails() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.committeeId}`, { includeUserDetails: true })
      .pipe(
        finalize(() => (this.CommitteeDataLoading = false)))
      .subscribe((res) => {
        if (res) {
          if (this.isTask) {
            // this.committeeMembers = res.members;
            this.committeeMembers = res.members.filter(function (member) {
              return member.memberType != 5
            })
          }
          else {
            // this.committeeMembers = this.selected_committee_members;

          }

        } else this.goToNotFound();
      });
  }
  // Main tasks list
  getMainTasks() {
    this.httpSer.get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.committeeId}/MainTasks/All`)
      .pipe(finalize(() => { this.loadingMainTasks = false }))
      .subscribe((res: MainTask[]) => {
        this.mainTasks = res;
      });
  }

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  //get task details
  getTaskDetails() {
    this.httpSer.get(`${Config.Task.GetById}/${this.taskId}`)
      .pipe(finalize(() => { this.taskDataLoading = false }))
      .subscribe((res: CommitteeTask) => {
        if (res) {
          res.dueDate = this.convertUTCDateToLocalDate(res.dueDate).toString();
          this.task = res;
          this.form.patchValue(this.task);
          // this.form.get('parentId').patchValue(this.task?.parentId)
          this.oldAttachments = this.task.attachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
        }
      });
  }

  saveNewTask() {
    this.isBtnLoading = true;

    if (this.isTask) {
      this.subTaskActions();
    } else {
      this.mainTaskActions();
    }

  }

  //////////////////////// MAIN TASK  save functions/////////////////////////////////////
  //save
  mainTaskActions() {
    const member = this.committeeMembers.find((member) => member.id === this.form.value.assignedTo);

    const mainTask = {
      ...this.form.value,
      dueDate: new Date(this.form.value.dueDate).toISOString(),
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],

      // to be shown in main task rows
      assignedToInfo: member
    };

    // check main tasks has attachments
    if (mainTask?.attachments) {
      mainTask.attachments = mainTask.attachments.map(a => (
        { fileName: a?.fileName, extension: a?.extension, uploadedFileName: a?.uploadedFileName }
      ));
    }
    if (this.isUpdating) {
      mainTask.id = this.mainTask.id;
      this.updateMainTask(mainTask);
    } else {
      mainTask.id = 0;
      this.addNewMainTask(mainTask);
    }
    this.isBtnLoading = false;
  }

  //add new MainTask
  addNewMainTask(mainTask: any) {
    if (this.mainTasksService.AddMainTask(mainTask)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.newMainTaskModel.successAddedMsg'));
      this.form.reset();
      this.closePopup();
      this.attachments = null;
      this.uploadedFiles = [];
    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.newMainTaskModel.duplicatedTitles'));
  }

  //update Main TAsk
  updateMainTask(mainTask: any) {
    let index = this.mainTasksService.getMainTaskIndex(this.title);

    if (this.mainTasksService.updateMainTask(mainTask, index)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.newMainTaskModel.successUpdatedMsg'));
      this.form.reset();
      this.closePopup();
      this.attachments = null;
      this.uploadedFiles = [];
    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.newMainTaskModel.duplicatedTitles'));
  }

  subTaskActions() {
    let body = {
      ...this.form.value,
      dueDate: new Date(this.form.value.dueDate).toISOString(),
      committeeId: this.committeeId,
      attachments: this.attachments
    }
    body.description && (body.description = this.textDirectionsService.addDirections(body.description));
    if (this.meetingId)
      body.meetingId = this.meetingId;

    if (this.isUpdating) {
      body.id = this.task.id;
      this.updateSubTask(body);
    } else {
      body.id = 0;
      this.addSubTask(body);
    }
  }
  addSubTask(task: any) {
    this.httpSer.post(Config.Task.Create, task)
      .pipe(
        finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.addModal.createSuccessMsg'));
          this.form.reset();
          this.closePopup();
          this.taskAdded.emit();
          this.attachments = null;
          this.uploadedFiles = [];

        }
      })
  }
  updateSubTask(task: any) {
    this.httpSer.post(Config.Task.Update, task)
      .pipe(
        finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.addModal.updateSuccessMsg'));
          this.form.reset();
          this.closePopup();
          this.taskAdded.emit();
          this.attachments = null;
          this.uploadedFiles = [];

        }
      })
  }


  updateTask() {
    let body = {
      ...this.form.value,
      dueDate: new Date(this.form.value.dueDate).toISOString(),
      id: this.taskId,
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    }

    this.httpSer.post(Config.Task.Update, body)
      .pipe(
        finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.addModal.updateSuccessMsg'));
          this.form.reset();
          this.closePopup();
          this.taskAdded.emit();
          this.attachments = null;
          this.uploadedFiles = [];

        }
      })
  }

  patchForm() {
    let formValues = {
      title: this.mainTask?.title,
      titleAr: this.mainTask?.titleAr,
      dueDate: this.convertUTCDateToLocalDate(this.mainTask?.dueDate).toString(),
      description: this.mainTask?.description,
      assignedTo: this.mainTask?.assignedTo,
      importanceLevel: this.mainTask?.importanceLevel,

    }
    this.form.patchValue(formValues);
  }

  closePopup() {
    this.modelService.close();
    this.mainTasksService.selectedMainTask$.next('')
    // this.attachments = null;
    this.oldAttachments = [];
    this.uploadedFiles = [];
    // this.isUpdatingMainTask = false;
    // this.isBtnLoading = false
    this.form.reset()
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.uploadingFile = true;

      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles?.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0 && this.oldAttachments?.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0
        ) {
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
            .pipe(finalize(() => { this.uploadingFile = false; }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.uploadingFile = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      } else {
        this.uploadingFile = false;
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

  onDeleteFile(i, type: string) {
    // TODO when delete request is created
    if (type == 'new') {
      this.uploadedFiles.splice(i, 1);
      this.attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant('shared.removed'));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }
}
