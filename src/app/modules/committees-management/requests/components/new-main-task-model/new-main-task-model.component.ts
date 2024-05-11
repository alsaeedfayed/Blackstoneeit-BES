import { finalize } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MainTasksService } from './../../services/mainTasks/main-tasks.service';
import { Component, Input, OnInit } from '@angular/core';
import { MainTask } from '../../models/MainTask';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'app-new-main-task-model',
  templateUrl: './new-main-task-model.component.html',
  styleUrls: ['./new-main-task-model.component.scss']
})
export class NewMainTaskModelComponent implements OnInit {

  @Input() language: string = ''
  @Input() title: string = ''
  mainTask: MainTask = {} as MainTask;
  isUpdating: boolean = false;
  isBtnLoading: boolean = false;
  committeeMembers: [] = [];

  priority = [
    { id: 0, name: 'Low', nameAr: 'منخفض' },
    { id: 1, name: 'Medium', nameAr: 'متوسط' },
    { id: 2, name: 'High', nameAr: 'عالي' },
  ];

  form: FormGroup = new FormGroup({});

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
    sanitize: true,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
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
  uploadingFile: boolean = false;
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
    private toastr: ToastrService,
    private modelService: ModelService,
    private mainTasksService: MainTasksService,
    private attachmentService: AtachmentService,
  ) {

  }

  ngOnInit(): void {
    this.initFormControls();
    this.getMainTaskDetails();
  }

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      titleAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      dueDate: [null, Validators.required],
      assignedTo: [null , Validators.required],
      importanceLevel: [null, Validators.required],
      attachments: [null],
      description: [null],
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

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  //save
  save() {
    // this.isBtnLoading = true;
    const mainTask = {
      ...this.form.value,
      dueDate: new Date(this.form.value.dueDate).toISOString(),
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
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
  }

  //add new KPI
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

  closePopup() {
    this.modelService.close();
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
      this.uploadingFile = true;

      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(
            (item) => files[0].name === item.name
          ).length === 0 && this.oldAttachments.filter(
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
      }else {
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
