import { finalize } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Role } from '../../models/Role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';

@Component({
  selector: 'app-new-role-modal',
  templateUrl: './new-role-modal.component.html',
  styleUrls: ['./new-role-modal.component.scss']
})
export class NewRoleModalComponent implements OnInit {

  @Output() onChange: EventEmitter<boolean> = new EventEmitter();
  @Input() language: string = ''

  @Input() role: Role = null;
  @Input() isUpdating: boolean = false;
  isBtnLoading: boolean = false;
  form: FormGroup = new FormGroup({});

  isLoadingSectors: boolean = false;
  isLoadingDepartments: boolean = false;
  isLoadingSections: boolean = false;

  isLoadingData: boolean = false;
  sectors: any[] = [];
  departments: any[] = [];
  sections: any[] = [];

  oldSectorId: number = 0;
  oldDepartmentId: number = 0;
  oldSectionId: number = 0;

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
    private attachmentService: AtachmentService,
    private httpSer: HttpHandlerService,
    private textDirectionsService: TextDirectionsService,
  ) {

  }

  ngOnInit(): void {
    this.initFormControls();
    this.FormatRoleData();
  }

  // initialize form controls
  initFormControls() {

    this.form = this.fb.group({
      nameEn: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      sectorId: [null, Validators.required],
      departmentId: [null, Validators.required],
      sectionId: [null],
      description: [null],
    });
  }

  getCurrent(id: number): Observable<any> {
    return this.httpSer.get(Config.Lookups.getGroupById, { groupId: id })
  }

  //format role details
  FormatRoleData() {
    if (!!this.role) {
      this.isUpdating = true;
      this.oldAttachments = this.role.attachments?.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));

      this.sectors.push(this.role?.sector)
      this.departments.push(this.role?.department)
      !!this.role?.section && this.sections.push(this.role?.section)

      this.patchForm();

    }
  }


  patchForm() {
    let formValues = {
      nameEn: this.role?.nameEn,
      nameAr: this.role?.nameAr,
      sectorId: this.role?.sector?.id,
      departmentId: this.role?.department?.id,
      sectionId: this.role?.section?.id,
      description: this.role?.description
    }
    console.log(formValues);
    this.form.patchValue(formValues);
    this.getSections();
  }

  // get sectors
  getSectors() {

    this.isLoadingSectors = true;

    let query = {
      level: 2
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingSectors = false)))
      .subscribe((res) => {
        if (res) {
          this.sectors = res.map(sector => ({ id: sector.id, name: sector.name, arabicName: sector.arabicName }));
        }
      });
  }
  sectorCheckCount: number = 0;
  checkSector(sector) {
    this.sectorCheckCount++;
    if (this.sectorCheckCount == 1) return;
    // console.log(sector);
    // reset source lists and form controls
    this.departments = [];
    this.sections = [];
    this.form.get('departmentId')?.patchValue(null)
    this.form.get('sectionId')?.patchValue(null)

    // !!sector && this.getDepartments();

  }
  // get departments
  getDepartments() {
    if (!this.form.value.sectorId) return;

    this.isLoadingDepartments = true;
    let query = {
      level: 3,
      parentId: this.form.value.sectorId
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingDepartments = false)))
      .subscribe((res) => {
        if (res) {
          this.departments = res.map(department => ({ id: department.id, name: department.name, arabicName: department.arabicName }));
        }
      });
  }
  departmentCheckCount: number = 0;
  checkDepartment(department) {
    this.departmentCheckCount++;
    if (this.departmentCheckCount == 1) return;
    // reset source lists and form controls
    this.sections = [];
    this.form.get('sectionId')?.patchValue(null)

    !!department && this.getSections();

  }
  // get sections
  getSections() {
    if (!this.form.value.departmentId) return;
    this.isLoadingSections = true;
    let query = {
      level: 4,
      parentId: this.form.value.departmentId
    };

    this.httpSer
      .get(Config.Lookups.getGetGroupByLevel, query)
      .pipe(finalize(() => (this.isLoadingSections = false)))
      .subscribe((res) => {
        if (res) {
          this.sections = res.map(section => ({ id: section.id, name: section.name, arabicName: section.arabicName }));
        }
      });
  }
  //save
  save() {
    this.isBtnLoading = true;
    const body = {
      ...this.form.value,

      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };
    !!this.form.value.description && (body.description = this.textDirectionsService.addDirections(this.form.value.description))
    // check main tasks has attachments
    if (body?.attachments) {
      body.attachments = body.attachments.map(a => (
        { fileName: a?.fileName, extension: a?.extension, uploadedFileName: a?.uploadedFileName }
      ));
    }
    if (this.isUpdating) {
      body.id = this.role.id;
      this.updateRole(body);
    } else {
      body.id = 0;
      this.addRole(body);
    }
  }

  //add new role
  addRole(role: any) {
    this.httpSer
      .post(Config.BAU.Roles.create, role)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('bau.roles.modal.successAddMsg'));
          this.form.reset();
          this.closePopup();
          this.onChange.emit();
          this.attachments = null;
          this.uploadedFiles = [];
        }
      });

  }

  //update Role
  updateRole(role: any) {
    this.httpSer
      .put(Config.BAU.Roles.update, role)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('bau.roles.modal.successUpdateMsg'));
          this.form.reset();
          this.closePopup();
          this.onChange.emit();
          this.attachments = null;
          this.uploadedFiles = [];
        }
      });
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
