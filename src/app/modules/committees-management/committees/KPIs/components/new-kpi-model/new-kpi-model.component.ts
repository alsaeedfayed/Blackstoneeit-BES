import { debounceTime, finalize } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { NumbersOnly } from 'src/app/core/helpers/Numbers-Only.validator';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { KPI } from '../../../../requests/models/KPI';
import { KpiService } from '../../../../requests/services/KpiServie/kpi.service';
import { MeasurementRecurrenceService } from '../../../../requests/services/measurementRecurrence/measurement-recurrence.service';
import { MeasurementRecurrences } from '../../../../requests/models/MeasurementRecurrences';
import { PercentageOnly } from 'src/app/core/helpers/PercentageOnly';
import { DecimalNumbersOnly } from 'src/app/core/helpers/DecimalNumbers-only';
import { MeasurementTypeService } from 'src/app/modules/committees-management/requests/services/measurementType/measurement-type.service';
import { MeasurementType } from 'src/app/modules/committees-management/requests/models/MeasurementType';
import { CommitteeBasicInfoService } from 'src/app/modules/committees-management/services/committee-basic-info/committee-basic-info.service';
import moment from 'moment';

@Component({
  selector: 'app-new-kpi-model',
  templateUrl: './new-kpi-model.component.html',
  styleUrls: ['./new-kpi-model.component.scss']
})
export class NewKPIModelComponent implements OnInit {
  @Input() language: string = ''
  @Input() name: string = null;
  @Input() committeeId: number = 0;

  committeeMembers: any[] = []

  @Output() onAdd = new EventEmitter();
  isUpdating: boolean = false;
  isBtnLoading: boolean = false;
  kpi: KPI = null;

  // loading data vars
  dataLoading: boolean = true;

  form: FormGroup = new FormGroup({});

  measurementFrequencies: MeasurementRecurrences[] = [];
  measurementTypes: MeasurementType[] = [];

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
  //tabs vars
  breakpoint: string = 'lg';
  currentTabIndex: number = 0;
  validKPI: boolean = false;
  tabs: any[] = [
    {
      label: '1. KPI Information',
      labelAr: '1. معلومات المؤشر',
      active: true,
      valid: false
    },
    {
      label: '2. Target & Frequency',
      labelAr: '2. المستهدف ودورية القياس',
      active: false,
      valid: false
    },

  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modelService: ModelService,
    private router: Router,
    private attachmentService: AtachmentService,
    private kpiService: KpiService,
    private measurementRecurrenceService: MeasurementRecurrenceService,
    private measurementTypeService: MeasurementTypeService,
    private committeeBasicInfoService: CommitteeBasicInfoService,
  ) {

    // get committee members
    this.committeeBasicInfoService.committeeMembers$.subscribe(res => {
      this.committeeMembers = res
    })
  }

  ngOnInit(): void {

    this.initFormControls();

    // get enums
    this.measurementTypes = this.measurementTypeService.getMeasures();
    this.measurementFrequencies = this.measurementRecurrenceService.getMeasures();

    // check updating
    if (this.name) {
      this.updating();

    }
    else {
      this.onSelectType(this.form.value.measurementType);
      this.onSelectFrequency(this.form.value.frequency);
    }
    // check tabs validation
    this.tabsValidation();
  }
  // check tabs validation
  tabsValidation() {
    this.form.valueChanges.pipe(debounceTime(250)).subscribe((formValues) => {
      this.checkTabsValidations(formValues)
    })
  }
  checkTabsValidations(formValues:any =null) {
    this.tabs[0].valid =
      this.form.get('name').valid &&
      this.form.get('nameAr').valid;
    this.tabs[1].valid =
       (formValues.frequency == 4 ? this.form.get('dueDate').valid : true) &&
      this.form.get('target').valid;

    this.isAllTabsValid()
  }
  // check if all required data is entered correctly
  isAllTabsValid() {
    let tab = this.tabs.find((tab) => tab.valid == false);
    this.validKPI = !tab;
  }
  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      // tab 1
      name: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      formula: [null],
      risk: [null],
      achievementRequirements: [null],
      ownerId: [null],

      // tab 2
      weight: [null, [DecimalNumbersOnly(), PercentageOnly()]],
      measurementType: [1, Validators.required],
      target: [null, [Validators.required, NumbersOnly()]],
      frequency: [0, Validators.required],
       dueDate: [null],
    });
  }
  // active tab
  activeTab(tab: any) {
    this.currentTabIndex = this.tabs.indexOf(tab);
    this.tabs.forEach((tab) => tab.active = false);
    tab.active = true;
  }
  // next button clicked
  activeNextTab() {
    this.activeTab(this.tabs[this.currentTabIndex + 1]);
  }

   get dueDate() { return this.form.get('dueDate') as FormControl; }

  onSelectType(id: number) {

    // active button
    this.measurementTypes.forEach(t => t.isActive = false);
    this.measurementTypes.find(m => m.id === id).isActive = true;

    // set target Type (control & field)
    this.form.controls['measurementType'].setValue(id);
    // // number
    if (id == 2) {
      this.form.controls['target'].addValidators([DecimalNumbersOnly(), PercentageOnly()]);
      this.form.controls['target'].updateValueAndValidity();
    }
    else {
      this.form.controls['target'].clearValidators();
      this.form.controls['target'].addValidators([Validators.required, NumbersOnly()]);
      this.form.controls['target'].updateValueAndValidity();
    }
  }

  onSelectFrequency(id: number) {

    // active button
    this.measurementFrequencies.forEach(f => f.isActive = false);
    this.measurementFrequencies.find(f => f.id === id).isActive = true;

    // set frequency  (control)
    this.form.controls['frequency'].setValue(id);

    if (id == 4) {
      this.form.controls['dueDate'].addValidators(Validators.required);
      this.form.controls['dueDate'].updateValueAndValidity();
    }
    else if (this.isControlRequired('dueDate')) {
      this.form.controls['dueDate'].removeValidators(Validators.required);
      this.form.controls['dueDate'].updateValueAndValidity();
    }
  }

  // Check if a specific control is required
  isControlRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control && control.hasError('required');
  }
  //get KPI details

  updating() {
    this.isUpdating = true;
    this.kpi = this.kpiService.getKPIByName(this.name);
    this.patchForm();

    if (this.kpi.attachments) {
      this.oldAttachments = this.kpi.attachments?.map(a => (
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
       dueDate: '',
      frequency: this.kpi?.frequency,
      id: this.kpi?.id,
      // parentId: this.kpi?.parentId || 0,
      // committeeId: this.kpi?.committeeId || 0,
      name: this.kpi?.name || '',
      nameAr: this.kpi?.nameAr || '',
      weight: this.kpi?.weight.toString(),
      target: this.kpi?.target.toString(),
      formula: this.kpi?.formula || '',
      risk: this.kpi?.risk || '',
      achievementRequirements: this.kpi?.achievementRequirements || '',
      ownerId: this.kpi?.ownerId || '',
      measurementType: this.kpi?.measurementType,
    };
    this.onSelectType(this.kpi?.measurementType);
    this.onSelectFrequency(this.kpi?.frequency);

    if (formValues.frequency == 4) {
      formValues.dueDate = moment(this.kpi?.dueDate).format()
    } else {
      delete formValues.dueDate;
    }
    this.form.patchValue(formValues);
    this.checkTabsValidations(formValues);
  }
  //save
  save() {
    // this.isBtnLoading = true;
    const kpi = {
      ...this.form.value,
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };


    // if user select type -->  not Recurrence
    if (this.form.value.frequency == 4) {
      kpi.dueDate = new Date(this.form.value.dueDate).toISOString();
    } else {
      delete kpi.dueDate;
    }
    // check kpi has attachments
    if (kpi?.attachments) {
      kpi.attachments = kpi.attachments.map(a => (
        { fileName: a?.fileName, extension: a?.extension, uploadedFileName: a?.uploadedFileName }
      ));
    }

    if (this.isUpdating) {
      kpi.id = this.kpi.id;
      this.updateKPI(kpi);
    } else {
      kpi.id = 0;
      this.addNewKPI(kpi);
    }

  }

  //add new KPI locally
  addNewKPI(kpi: any) {
    if (this.kpiService.AddKPI(kpi)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.newKPIModel.successAddedMsg'));
      this.closing();
    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.newKPIModel.duplicatedTitles'));
  }

  //update KPI locally
  updateKPI(kpi: any) {
    let index = this.kpiService.getKPIIndex(this.name);

    if (this.kpiService.updateKPI(kpi, index)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.newKPIModel.successUpdatedMsg'));
      this.closing();
    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.newKPIModel.duplicatedTitles'));
  }

  // closing tasks
  closing() {
    this.form.reset();
    this.closePopup();
    this.attachments = null;
    this.uploadedFiles = [];
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
