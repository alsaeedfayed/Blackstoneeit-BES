import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { measurementType } from 'src/app/modules/committees-management/enums/enums';
import { KPI } from 'src/app/modules/committees-management/requests/models/KPI';
import { MeasurementRecurrences } from 'src/app/modules/committees-management/requests/models/MeasurementRecurrences';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-kpi-details-model',
  templateUrl: './kpi-details-model.component.html',
  styleUrls: ['./kpi-details-model.component.scss']
})
export class KpiDetailsModelComponent implements OnInit {


  @Input() language: string = '';
  @Input() measurementRecurrences: MeasurementRecurrences[] = null;
  @Input() kpiId: number = null;
  @Input() committeeId: number = null;
  @Input() commingMeasurmentType: measurementType;
  measurmentType = measurementType;

  
  loadingData: boolean = true;
  kpi: KPI = null;
  progress: any
  @Input() KPIId: number
  @Output() refreshTable: EventEmitter<any> = new EventEmitter();
  @Input('progress') set progresss(progress: any) {
    if (progress) {
      this.progress = progress
      this.oldAttachments = progress.attachments.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));
    }
  }
  progressForm: FormGroup = new FormGroup({});

  updatingProgress: boolean = false;
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
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private router: Router,
    private attachmentService: AtachmentService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {    
    // initialize form controls
    this.initFormControls();    
  }

  // initialize form controls
  initFormControls() {
    this.progressForm = this.fb.group({
      progress: [this.progress?.progress, Validators.required],
      actual: [this.progress.actual, Validators.required],
      attachments: [null],
    });
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

  updateProgress() {
    let body = {
      id: this.KPIId,
      period: this.progress.period,
      ...this.progressForm.value,
      evidences: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    }
    this.updatingProgress = true;
    this.httpSer
      .put(`${Config.CommitteeKpi.UpdateProgress}`, body)
      .pipe(finalize(() => { this.updatingProgress = false; }))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesNewRequest.newKPIModel.successUpdatedMsg'));
          this.closing();
          this.refreshTable.emit()
          this.closePopup()
        }
      });
  }
  // closing tasks
  closing() {
    this.attachments = null;
    this.uploadedFiles = [];
  }


  closePopup() {
    this.modelService.close();
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
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
