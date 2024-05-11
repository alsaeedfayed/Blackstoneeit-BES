import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { DecimalNumbersOnly } from 'src/app/core/helpers/DecimalNumbers-only';
import { PercentageOnly } from 'src/app/core/helpers/PercentageOnly';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { EvaluationStatistics } from '../../models/EvaluationStatistics';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';

@Component({
  selector: 'app-approve-and-close-evaluation-model',
  templateUrl: './approve-and-close-evaluation-model.component.html',
  styleUrls: ['./approve-and-close-evaluation-model.component.scss']
})
export class ApproveAndCloseEvaluationModelComponent implements OnInit {


  @Input() language: string = ''
  @Input() evaluationId: number = 0;
  @Input() evaluationStatistics: EvaluationStatistics ={} as EvaluationStatistics;

  @Output() onClose = new EventEmitter();

  isUpdating: boolean = false;
  isBtnLoading: boolean = false;

  // loading data vars
  dataLoading: boolean = true;

  form: FormGroup = new FormGroup({});


  // description & attachments vars 
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
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
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

  saveBtnLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modelService: ModelService,
    private attachmentService: AtachmentService,
    private httpSer: HttpHandlerService,
    private confirmationPopupService: ConfirmModalService,
    private textDirectionsService: TextDirectionsService,
  ) {

  }

  ngOnInit(): void {
    this.initFormControls();
  }

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      kpiProgress: [
        { value: this.evaluationStatistics.kpIsPerformance, disabled: true },
        [ DecimalNumbersOnly(), PercentageOnly()]],
      mainTasksProgress: [
        { value: this.evaluationStatistics.tasksProgress, disabled: true },
        [ DecimalNumbersOnly(), PercentageOnly()]],
      attendanceRate: [
        { value: this.evaluationStatistics.attendanceRate, disabled: true },
        [ DecimalNumbersOnly(), PercentageOnly()]],
      recommendation: [null],
    });
  }
  get recommendation() { return this.form.get('recommendation') as FormControl; }

    // cancel evaluation button clicked
    closeEvaluationBtn() {
      this.confirmationPopupService.open('close-evaluation');
    }
  
  //close evaluation 
  closeEvaluation() {
    // this.confirmationPopupService.close('close-evaluation');
    this.isBtnLoading = true;

    const body = {
      ...this.form.value,
      recommendationAttachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };

    body.recommendation && (body.recommendation = this.textDirectionsService.addDirections(body.recommendation));
    this.httpSer
      .put(`${Config.CommitteeEvaluations.CloseAndApprove}/${this.evaluationId}`, body)
      .pipe(finalize(() => { this.isBtnLoading = false; }))
      .subscribe((res: any) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesEvaluations.details.closeModel.sussesClose'));
          this.onClose.emit();
          this.closePopup();
        }
      });
  }

  // closing tasks
  closing() {
    this.recommendation.setValue(null);
    this.attachments = null;
    this.uploadedFiles = [];
  }

  closePopup() {
    this.closing();
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
