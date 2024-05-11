import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TranslateService } from "@ngx-translate/core";
import { id } from "@swimlane/ngx-charts";
import { ToastrService } from "ngx-toastr";
import { Subject, combineLatest, from } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { AtachmentService } from "src/app/core/services/atachment.service";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { EvaluationService } from "../../services/evaluationService/evaluation.service";

@Component({
  selector: "app-create-evaluation-model",
  templateUrl: "./create-evaluation-model.component.html",
  styleUrls: ["./create-evaluation-model.component.scss"],
})
export class CreateEvaluationModelComponent
  implements OnInit, OnChanges, DoCheck
{
  language: string = this.translate.currentLang;

  @Input() selectedEvaluation: any;
  @Output() evaluationAdded = new EventEmitter();

  validateDateRang: boolean = false;

  private endSub$ = new Subject();

  // loading vars
  loadingCommittees: boolean = true;
  lookupsLoading: boolean = true;

  isBtnLoading: boolean = false;
  uploadingFile: boolean = false;
  showDates: boolean = false;

  form: FormGroup = new FormGroup({});
  auditTypes: any = [];
  Committees: any = [];

  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "150px",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "3",
    sanitize: true,
    outline: false,
    toolbarPosition: "top",
    toolbarHiddenButtons: [
      [
        "subscript",
        "superscript",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "heading",
        "fontName",
      ],
      [
        "textColor",
        "backgroundColor",
        "customClasses",
        "insertImage",
        "insertVideo",
        "insertHorizontalRule",
        "removeFormat",
        "toggleEditorMode",
      ],
    ],
  };

  //attachment vars
  maxFileSizeInMB: number = 10;
  supportedAttachmentTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  uploadedFiles: any = [];
  attachments: any[] = null;
  oldAttachments: any[] = [];
  createEvaluationForm: FormGroup;
  isUpdating: boolean = false;

  isUpdate: boolean = false;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private router: Router,
    private attachmentService: AtachmentService,
    private evaluationService: EvaluationService
  ) {}
  ngDoCheck(): void {
    // this.patchEdit()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.patchEdit();
  }

  ngOnInit(): void {
    //this.evaluationService.isUpdating.next(false)
    this.evaluationService.isUpdating.subscribe(res => {
      if (res) {
        this.isUpdating = true;
      } else {
        this.isUpdating = false;
      }
    });

    // handles language change event
    this.handleLangChange();

    // initialize form controls
    this.initEvaluationFormControls();

    this.getCommitteeNames();

    this.getSharedLockups();

    this.patchEdit();
  }

  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  initEvaluationFormControls() {
    this.createEvaluationForm = this.fb.group({
      committeeId: [null, [Validators.required]],
      typeId: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      description: [null],
      attachments: [null],
    });
  }

  // load lookups data
  private getSharedLockups() {
    let auditType = "AuditType";
    const body = { ServiceName: "committee" };
    this.httpSer
      .get(`${Config.Lookups.GetByLookupType}/${auditType}`, body)
      .pipe(finalize(() => (this.lookupsLoading = false)))
      .subscribe(res => {
        this.auditTypes = res;
        //  console.log('audits' , this.auditTypes)
      });
  }

  getCommitteeNames() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetApproved}`)
      .pipe(
        finalize(() => {
          this.loadingCommittees = false;
        })
      )
      .subscribe((res: any) => {
        this.Committees = res;
      });
  }

  // drag drop events
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // Add styles to indicate the drag-over state (e.g., change background color)
    event.dataTransfer.dropEffect = "copy"; // Set the cursor icon
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
    if (_files) files = _files;
    if (files?.length > 0) {
      this.uploadingFile = true;
      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(item => files[0].name === item.name)
            .length === 0 &&
          this.oldAttachments.filter(item => files[0].name === item.name)
            .length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            extension: files[0].name.split(".").pop(),
          };

          this.uploadedFiles.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(
              finalize(() => {
                this.uploadingFile = false;
              })
            )
            .subscribe(data => {
              //push into array of files to be  with the new decision request
              if (this.attachments == null) this.attachments = [];
              this.attachments.push(data[0]);
              this.toastr.success(
                this.translate.instant("shared.documentWasSuccessfullyAdded")
              );
            });
        } else {
          this.uploadingFile = false;
          this.toastr.error(
            this.translate.instant("shared.validations.fileAlreadyUploaded")
          );
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
    this.toastr.error(this.translate.instant("shared.fileSizeErrMsg"));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant("shared.fileTypeErrMsg"));
    return false;
  }

  onDeleteFile(i, type: string) {
    // TODO when delete request is created
    if (type == "new") {
      this.uploadedFiles.splice(i, 1);
      this.attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant("shared.removed"));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }

  saveNewAudit() {
    this.isBtnLoading = true;
    if (this.isUpdating) {
      this.updateEvaluation();
      return;
    }

    let body: any;
    if (this.createEvaluationForm.value.typeId == "Ad-Hoc") {
      body = {
        committeeId: this.createEvaluationForm.value.committeeId,
        type: this.createEvaluationForm.value.typeId,
        from: new Date(this.createEvaluationForm.value.fromDate).toISOString(),
        to: new Date(this.createEvaluationForm.value.toDate).toISOString(),
        description: this.createEvaluationForm.value.description,
        attachments: this.attachments,
      };
    } else {
      body = {
        committeeId: this.createEvaluationForm.value.committeeId,
        type: this.createEvaluationForm.value.typeId,
        from: null,
        to: null,
        description: this.createEvaluationForm.value.description,
        attachments: this.attachments,
      };
    }

    if (!this.showDates) {
      delete body.from;
      delete body.to;
    }

    this.httpSer
      .post(Config.CommitteeEvaluations.Add, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(
            this.translate.instant("committeesEvaluations.modal.successAddMsg")
          );
          this.createEvaluationForm.reset();
          this.closePopup();
          this.evaluationAdded.emit();
          this.attachments = null;
          this.uploadedFiles = [];
        }
      });
  }

  patchForm() {
    let formValues = {
      id: this.selectedEvaluation?.id,
      committeeId: this.selectedEvaluation?.committeeId,
      typeId: this.selectedEvaluation?.type,
      fromDate: this.selectedEvaluation?.from,
      toDate: this.selectedEvaluation?.to,
      description: this.selectedEvaluation?.description,
    };
    this.createEvaluationForm?.patchValue(formValues);
  }

  selEv: any;
  patchEdit() {
    // this.isUpdate = true;
    //this.isUpdating = true;
    if (this.selectedEvaluation?.attachments) {
      this.oldAttachments = this.selectedEvaluation?.attachments?.map(a => ({
        name: a.uploadedFileName,
        extension: a.extension,
        fileName: a.fileName,
        uploadedFileName: a.uploadedFileName,
      }));
    }
    this.patchForm();

    // this.selEv = this.selectedEvaluation
    // console.log('sel' , this.selEv)
    if (this.selectedEvaluation?.type == "Ad-Hoc") {
      this.createEvaluationForm?.controls["fromDate"]?.addValidators(
        Validators.required
      );
      this.createEvaluationForm?.controls["fromDate"]?.updateValueAndValidity();
      this.createEvaluationForm?.controls["toDate"]?.addValidators(
        Validators.required
      );
      this.createEvaluationForm?.controls["toDate"]?.updateValueAndValidity();
      this.showDates = true;
    }
    //  console.log('selected patch' , this.selectedEvaluation)
  }

  updateEvaluation() {
    let body = {
      id: this.selectedEvaluation?.id,
      // ...this.createEvaluationForm.value,
      committeeId: this.createEvaluationForm.value.committeeId,
      type: this.createEvaluationForm.value.typeId,
      from: new Date(this.createEvaluationForm.value.fromDate).toISOString(),
      to: new Date(this.createEvaluationForm.value.toDate).toISOString(),
      description: this.createEvaluationForm.value.description,
      //attachments: this.attachments
      //  dueDate: new Date(this.form.value.dueDate).toISOString(),

      attachments: [
        ...(this.attachments ? this.attachments : []),
        ...this.oldAttachments,
      ],
    };

    this.httpSer
      .put(Config.CommitteeEvaluations.Update, body)
      .pipe(
        finalize(() => ((this.isBtnLoading = false), (this.isUpdating = false)))
      )
      .subscribe(res => {
        if (res) {
          this.toastr.success(
            this.translate.instant("committeesEvaluations.updateSuccessMsg")
          );
          this.form.reset();
          this.closePopup();
          this.evaluationAdded.emit();
          this.attachments = null;
          this.uploadedFiles = [];
          this.evaluationService.isUpdating.next(false);
        }
      });
  }

  closePopup() {
    // this.createEvaluationForm.reset();
    this.showDates = false;
    this.validateDateRang = false;
    this.modelService.close();
    this.attachments = null;
    this.uploadedFiles = [];
    this.isUpdate = false;
    this.isUpdate = false;
    this.isUpdating = false;
    this.evaluationAdded.emit();
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  checkDateRange(): boolean {
    let validDateRange;
    if (
      new Date(this.createEvaluationForm.value.fromDate) !== null &&
      new Date(this.createEvaluationForm.value.toDate) !== null
    ) {
      validDateRange =
        new Date(this.createEvaluationForm.value.toDate) >
        new Date(this.createEvaluationForm.value.fromDate);
    }
    if (!validDateRange) {
      this.validateDateRang = true;
    } else {
      this.validateDateRang = false;
    }
    return validDateRange;
  }

  onSelectType(event) {
    this.showDates = false;
    this.validateDateRang = false;
    if (event == "End of year" || event == "Mid Year") {
      this.createEvaluationForm.controls["fromDate"].removeValidators(
        Validators.required
      );
      this.createEvaluationForm.controls["fromDate"].updateValueAndValidity();
      this.createEvaluationForm.controls["toDate"].removeValidators(
        Validators.required
      );
      this.createEvaluationForm.controls["toDate"].updateValueAndValidity();
    } else {
      this.createEvaluationForm.controls["fromDate"].addValidators(
        Validators.required
      );
      this.createEvaluationForm.controls["fromDate"].updateValueAndValidity();
      this.createEvaluationForm.controls["toDate"].addValidators(
        Validators.required
      );
      this.createEvaluationForm.controls["toDate"].updateValueAndValidity();
      this.showDates = true;
      this.checkDateRange();
    }
  }

  isControlRequired(controlName: string): boolean {
    const control = this.createEvaluationForm.get(controlName);
    return control && control.hasError("required");
  }
}
