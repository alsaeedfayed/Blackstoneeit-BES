import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICommitteeMeeting } from '../../models/ICommitteeMeeting';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { ICommitteeMeetingBasicData } from '../../models/ICommitteeMeetingBasicData';
import moment from 'moment';

@Component({
  selector: 'app-meeting-common-fields',
  templateUrl: './meeting-common-fields.component.html',
  styleUrls: ['./meeting-common-fields.component.scss']
})
export class MeetingCommonFieldsComponent extends ComponentBase implements OnInit {

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private attachmentService: AtachmentService
  ) {
    super(translateService, translate);

  }
  //check time range validation
  isInvalidTimeRange: boolean = false;
  isDateInPast: boolean = false;

  @Input() meetingData: ICommitteeMeeting;
  @Input() language: string;
  @Input() isUpdating: boolean = false;
  @Input() maxFileSizeInMB: number;
  @Input() guests: FormArray;
  @Input() actualAttendees: FormArray;
  @Output() newMeeting = new EventEmitter<ICommitteeMeetingBasicData>();
  @Output() fileUploading = new EventEmitter<boolean>();
  @Output() formValidated = new EventEmitter<boolean>();


  private endSub$ = new Subject();
  form: FormGroup;
  locations: [] = [];
  employees: [] = [];

  minDate: any = {};
  maxDate: any = {};
  //attachments that will be send with meeting data
  notesAttachments: any[] = null;
  agendaAttachments: any[] = null;

  // arrays that will store new attachments
  notesUploadedFiles: any = [];
  agendaUploadedFiles: any = [];


  //arrays that will store old attachments
  oldNotesAttachments: any[] = [];
  oldAgendaAttachments: any[] = [];


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

  ngOnInit(): void {

    this.initNewMeetingFormControls();

    this.getLocations();

    if (this.isUpdating) {
      //utc to local
      this.meetingData.timeFrom = this.convertUTCDateToLocalDate(this.meetingData.timeFrom);
      this.meetingData.timeTo = this.convertUTCDateToLocalDate(this.meetingData.timeTo);

      // this.setTimeBoundaries();

      this.form.patchValue(this.meetingData);
      // old attachments

      this.oldNotesAttachments = this.meetingData.notesAttachments.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));

      this.oldAgendaAttachments = this.meetingData.agendaAttachments.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));

      this.updateMeetingAttachments();
      //send true validation in case of update
      setTimeout(() => {
        this.formValidated.emit(true);
      });
    }

    this.form.valueChanges.pipe(debounceTime(250)).subscribe((formValues) => {

      this.checkDateTimeValidation(formValues.date, formValues.timeFrom, formValues.timeTo);

      // control allowed to be null
      let excludedList = ['agenda', 'notes', 'location'];


      //check all data fields are valid before sending it
      if (!this.hasNullOrEmptyValues(formValues, excludedList) && !this.isInvalidTimeRange) {
        this.meetingData = this.form.value;
        this.updateMeetingAttachments();
        this.formValidated.emit(true);
      } else {
        this.formValidated.emit(false);
      }
    });
  }

  //set minDate maxDate
  // setTimeBoundaries() {
  //   if (this.meetingData.status == 0) {
  //     const dateObject = new Date();
  //     dateObject.setDate(dateObject.getDate() + 1);
  //     this.minDate = moment(dateObject).format('YYYY-MM-DD');
  //     this.maxDate = '';
  //   }
  //   else if (this.meetingData.status == 1 || this.meetingData.status == 2) {
  //     this.minDate = '';
  //     this.maxDate = '';
  //   } else if (this.meetingData.status == 5) {
  //     this.minDate = '';
  //     const publishDate = new Date(this.meetingData.publishDate);
  //     publishDate.setDate(publishDate.getDate() + 1);
  //     this.maxDate = moment(publishDate).format('YYYY-MM-DD');;
  //   }
  // }

  hasNullOrEmptyValues(obj: any, excludeKeys: string[]): boolean {
    return Object.keys(obj).some((key) => {
      if (!excludeKeys.includes(key)) {
        const value = obj[key];
        return value === null || value === '';
      }
      return false;
    });
  }

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  checkDateTimeValidation(_date, _timeFrom, _timeTo) {
    const timeFrom = new Date((new Date(_date)).getFullYear(),
      (new Date(_date)).getMonth(), (new Date(_date)).getDate(),
      (new Date(_timeFrom).getHours()),
      (new Date(_timeFrom).getMinutes()),
      (new Date(_timeFrom).getSeconds())
    )
    const timeTo = new Date((new Date(_date)).getFullYear(),
      (new Date(_date)).getMonth(), (new Date(_date)).getDate(),
      (new Date(_timeTo).getHours()),
      (new Date(_timeTo).getMinutes()),
      (new Date(_timeTo).getSeconds())
    )
    // Insert the time to first to show the validation errors msg
    if (_timeTo)
      this.isInvalidTimeRange = timeFrom > timeTo
    // if (!this.isUpdating && _date && this.isToday(_date)) this.isDateInPast = _timeFrom < new Date();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  //change committee type
  onSelectLocationType() {
    this.onChangeValidation('location', this.locationType.value == 0)
  }

  //change form control validation
  onChangeValidation(FormControlName: string, enabled: boolean) {

    if (enabled) {
      this.form.controls[FormControlName].addValidators(Validators.required);
    }
    else {
      this.form.controls[FormControlName].removeValidators(Validators.required);
    }
    this.form.controls[FormControlName].updateValueAndValidity();
  }

  // initialize new meeting form controls
  initNewMeetingFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      location: [null],
      date: [null, Validators.required],
      timeFrom: [null, [Validators.required]],
      timeTo: [null, [Validators.required]],
      notes: [null],
      agenda: [null],
      locationType: [0, Validators.required],
    });
  }
  get locationType() { return this.form.get('locationType') as FormArray; }
  // get locations
  getLocations() {
    const lookups$ = this.httpSer.get(Config.Lookups.locationLookup);

    combineLatest([lookups$]).pipe(takeUntil(this.endSub$)).subscribe(([res]) => {
      if (res) {
        this.locations = res;
      }
    });
  }

  updateMeetingAttachments() {

    const year = (new Date(this.meetingData.date)).getFullYear();
    const month = (new Date(this.meetingData.date)).getMonth();
    const day = (new Date(this.meetingData.date)).getDate();

    //time from
    const hour = (new Date(this.meetingData.timeFrom)).getHours();
    const minutes = (new Date(this.meetingData.timeFrom)).getMinutes();
    const seconds = (new Date(this.meetingData.timeFrom)).getSeconds();


    this.meetingData.date = new Date(year, month, day, hour, minutes, seconds)
    this.meetingData.timeFrom = new Date(year, month, day, hour, minutes, seconds)
    this.meetingData.timeTo = new Date(year, month, day,
      (new Date(this.meetingData.timeTo)).getHours(),
      (new Date(this.meetingData.timeTo)).getMinutes(),
      (new Date(this.meetingData.timeTo)).getSeconds(),
    )

    if (this.form.valid) {
      this.meetingData.notesAttachments = [...(this.notesAttachments ? this.notesAttachments : []), ...this.oldNotesAttachments];
      this.meetingData.agendaAttachments = [...(this.agendaAttachments ? this.agendaAttachments : []), ...this.oldAgendaAttachments];
      this.newMeeting.emit(this.meetingData);
    }
  }

  //attachments functions
  onUploadFile(e, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.fileUploading.emit(true);
      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        let arrayName = controlName.charAt(0).toUpperCase() + controlName.slice(1);
        if (
          this[`${controlName}UploadedFiles`].filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0 && this[`old${arrayName}Attachments`].filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0
        ) {
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          };
          this[`${controlName}UploadedFiles`].push(file);

          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => { this.updateMeetingAttachments(), this.fileUploading.emit(false) }))
            .subscribe(
              data => {
                if (this[`${controlName}Attachments`] == null) {
                  this[`${controlName}Attachments`] = [];
                  this[`meetingData.${controlName}Attachments`]
                }
                this[`${controlName}Attachments`].push(data[0]);

                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.fileUploading.emit(false);
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      } else {
        this.fileUploading.emit(false);
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

  onViewLocalFile(i, controlName: string) {
    if (controlName.includes('old')) {
      this.attachmentService.getAttachmentURLs(this[`${controlName}Attachments`][i].fileName).subscribe(r => {
        window.location.href = r[0].fileUrl;
      })
    }
    else {
      let file = this[`${controlName}UploadedFiles`][i];
      const reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = function (e) {
        const link = document.createElement("a");
        link.href = e.target.result.toString();
        link.download = file.name;
        link.click();
        link.remove();
      }
    }
  }

  onDeleteFile(i, controlName: string) {
    this[`${controlName}Attachments`].splice(i, 1);
    if (!controlName.includes('old'))
      this[`${controlName}UploadedFiles`].splice(i, 1);
    this.updateMeetingAttachments();
    this.toastr.success(this.translate.instant('shared.removed'));

    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'

  }
}
