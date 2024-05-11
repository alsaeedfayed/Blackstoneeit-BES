import { Subject, combineLatest } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';
import { CommitteeDecisionService } from '../../services/committee-decision.service';

@Component({
  selector: 'app-send-decision-details-model',
  templateUrl: './send-decision-details-model.component.html',
  styleUrls: ['./send-decision-details-model.component.scss']
})
export class SendDecisionDetailsModelComponent implements OnInit, OnDestroy {

  @Input() decisionId = 0;
  @Input() language = '';
  @Output()  mailSent = new  EventEmitter<boolean>();
  private endSub$ = new Subject();
 
  searchSubject = new Subject<string>();

  // loading vars
  loadingCommittees: boolean = true;

  isBtnLoading: boolean = false;
  uploadingFile: boolean = false;

  form: FormGroup = new FormGroup({});
  auditTypes: any = []
  Committees: any = []

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
    private committeeDecisionService: CommitteeDecisionService,

  ) {
    //search for employees
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.employeeLoadCount = 1;
      this.employees = [];
      this.getEmployees();
    });
  }

  ngOnInit(): void {
    // initialize form controls
    this.initFormControls();
  }


  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      tos: [null, [Validators.required]],
      ccs: [null],
      externalTos: [null],
      externalCcs: [null],
      message: [null],
      attachments: [null]
    })
  }

  gettingEmployees: boolean = false;
  selectedInput: string = '';
  employees: any[] = [];

  employeeLoadCount: number = 1;

  memberSearchValue: string = '';

  toListFlag: boolean = false;
  ccListFlag: boolean = false;

  toHidden: any[] = []
  ccHidden: any[] = []

  // fetch all employees for members
  getEmployees() {
    this.gettingEmployees = true;
    this[`${this.selectedInput}ListFlag`] = true;
    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.employeeLoadCount, pageSize: 10, fullName: this.memberSearchValue })
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => {
          this.gettingEmployees = false;
          this.toListFlag = false;
          this.ccListFlag = false;
        }))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            let duplicated = false;
            if ([...this.ccHidden, ...this.toHidden].includes(emp.id)) {
              emp.disabled = true;
            }
            //check if duplicated employee exists
            for (const e of this.employees) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.employees.push(emp);
          });
        }
      });
  }
  //focus on search bar if members selection
  onFocus(inputType: string) {
    this.selectedInput = inputType;
    this.memberSearchValue = '';
    this.getEmployees();
  }

  //search on members selection
  searchEmployees(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.searchSubject.next();
    }
  }

  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getEmployees();
  }

  selected(id, type) {
    if (id?.length > 0) {
      if (this[`${type}Hidden`].length > 0) {
        //make old selected user --> disabled false
        this.employees.forEach((emp) => {
          if (this[`${type}Hidden`].includes(emp.id)) {
            emp && (emp.disabled = false);
          }
        });
        //clear disabled array
        this[`${type}Hidden`] = [];
      }
      //make new selected user --> disabled true
      this.employees.forEach((emp) => {
        if (id.includes(emp.id)) {
          emp.disabled = true;
          this[`${type}Hidden`].push(emp.id)
        }
      });
    } else {
      this.employees.forEach((emp) => {
        if (this[`${type}Hidden`].includes(emp.id)) {
          emp && (emp.disabled = false);
        }
      });
      this[`${type}Hidden`] = [];

    }
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
            .pipe( takeUntil(this.endSub$),finalize(() => { this.uploadingFile = false; }))
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


  sendDecision() {
    this.isBtnLoading = true;
    let body = {
      decisionId: this.decisionId,
      ...this.form.value,
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    }
    body.message && (body.message = this.textDirectionsService.addDirections(body.message));
    this.httpSer.post(Config.Decision.Send, body)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeDecisions.details.SendModel.successSendMsg'));
          this.closePopup();
          this.mailSent.emit(true);

        }
      })
  }
  closePopup() {
    this.form.reset();
    this.modelService.close();
    this.attachments = null;
    this.uploadedFiles = [];
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}