import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { Subject, combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RegexConfig } from 'src/app/core/config/regex.configs';
import { AtachmentService } from 'src/app/core/services/atachment.service';

@Component({
  selector: 'new-attendee-model',
  templateUrl: './new-attendee-model.component.html',
  styleUrls: ['./new-attendee-model.component.scss']
})
export class NewAttendeeModelComponent implements OnInit {

  @Input() meetingId: number;
  @Input() attendee: any = null;
  @Output() attendeeAdded = new EventEmitter();

  language: string = this.translate.currentLang;
  isUpdating: boolean = false;
  private endSub$ = new Subject();

  isBtnLoading: boolean = false;

  //changed value for justification
  justificationValue : string = ''
  // employee vars
  gettingEmployees: boolean = false;
  searchSubject = new Subject<string>();
  employeeLoadCount: number = 1;
  memberSearchValue: string = '';
  employees: any[] = [];

  form: FormGroup = new FormGroup({});
  //remove chairman & vicechairman from adding
  // { id: 0, name: 'Chairman', nameAr: 'رئيس الجلسة ' },
  // { id: 1, name: 'ViceChairman', nameAr: 'نائب رئيس الجلسة ' },
  attendanceTypes = [

    { id: 2, name: 'Member', nameAr: 'عضو' },
  ];
  attendanceStatus = [
    { id: 0, name: 'Present', nameAr: 'حاضر' },
    { id: 1, name: 'Absent', nameAr: 'غائب' },
    { id: 2, name: 'Absent With Justification', nameAr: 'غائب مع مبرر' }
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private modelService: ModelService,
    private attachmentService: AtachmentService
  ) {
    //search for employees
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.employeeLoadCount = 1;
      this.employees = [];
      this.getEmployees();
    });
  }


  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // initialize form controls
    this.initFormControls();

    if (this.attendee) {
    //  console.log('attendee', this.attendee)
      this.isUpdating = true;
      this.form.addControl('attendeeStatus', new FormControl(this.attendee?.attendeeStatus, [
        Validators.required,
      ]));
      if (this.attendee?.attendeeType == 3)
        this.hasController('attendeeType') ? this.form.removeControl('attendeeType') : '';
      else
        this.form.addControl('attendeeType', new FormControl(this.attendee?.attendeeType, [
          Validators.required,
        ]));

      if (this.attendee?.attendeeStatus == 2) {
        this.form.addControl('justificationReason', new FormControl(this.attendee?.justificationReason, [
          Validators.required,
        ]));

        if (this.attendee?.justificationAttachments) {
          this.oldAttachments = this.attendee?.justificationAttachments?.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
        }
      }
    }


    else {
      this.attendanceTypes.push({ id: 3, name: 'Guest', nameAr: 'ضيف' });
      this.form.addControl('attendeeType', new FormControl(2, [
        Validators.required,
      ]));
      //complete form controls
      this.formChanges();

    }

    this.form.get("attendeeStatus").valueChanges.subscribe(res => {

      if (res == 2) {
        if(this.attendee?.attendeeStatus ==2){
         if(this.justificationValue){
          this.form.addControl('justificationReason', new FormControl(this.justificationValue, [
            Validators.required,
          ]));
         }
         else {
          this.form.addControl('justificationReason', new FormControl(this.attendee?.justificationReason, [
            Validators.required,
          ]));
         }
          // this.form.get("justificationReason").valueChanges.subscribe(justValueChanged => {
          //   console.log('chaned value' , justValueChanged)
          // })
        }
        else {

            this.form.addControl('justificationReason', new FormControl(null, [
              Validators.required,
            ]));

        }
      }
      else {
        this.hasController('justificationReason') ? this.form.removeControl('justificationReason') : '';
      }
    })

  }

  getChangedValue(justValue : string) {
   // console.log(justValue)
    this.justificationValue = justValue
  }
  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all employees for members
  getEmployees() {
    this.gettingEmployees = true;
    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.employeeLoadCount, pageSize: 10, fullName: this.memberSearchValue })
      .pipe(finalize(() => (this.gettingEmployees = false)))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            let duplicated = false;

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
  onFocus() {
    this.memberSearchValue = '';
    this.getEmployees();
  }
  //search on members selection
  searchEmployees(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.searchSubject.next(this.memberSearchValue);
    }
  }
  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getEmployees();
  }

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
    });
  }
  //listen to form changes
  formChanges() {
    this.manageConditionalControls();

    // subscribe to attendance type value
    this.attendanceType.valueChanges.subscribe(value => this.manageConditionalControls(value));
  }

  get attendanceType() { return this.form.get('attendeeType') as AbstractControl; }

  manageConditionalControls(value = this.attendanceType.value) {
    if (value == 3) {
      this.hasController('memberId') ? this.form.removeControl('memberId') : '';

      this.form.addControl('firstName', new FormControl(null, []));
      this.form.addControl('lastName', new FormControl(null, []));
      this.form.addControl('email', new FormControl(null, [
        Validators.pattern(RegexConfig.emailRegExp),
        Validators.required,
      ]));


    } else {
      this.hasController('firstName') ? this.form.removeControl('firstName') : '';
      this.hasController('lastName') ? this.form.removeControl('lastName') : '';
      this.hasController('email') ? this.form.removeControl('email') : '';

      this.form.addControl('memberId', new FormControl(null, [
        Validators.required,
      ]));
    }
  }
  // check control exists
  hasController(controllerName: string): boolean {
    return this.form.contains(controllerName);
  }
  //save
  save() {
    console.log('attendee' , this.attendee)
    this.isBtnLoading = true;
    const body = {
      ...this.form.value,
      ...(this.meetingId && { meetingId: this.meetingId }),
      ...(this.attendee && { id: this.attendee?.id }),
    };
    if (this.isUpdating) {
      //console.log('form' , this.form.value)
      body.attendeeType = this.attendee?.attendeeType


      this.updateAttendee(body);
    } else {
      this.addNewAttendee(body);
    }
  }
  //add new attendee
  addNewAttendee(body: any) {
    this.httpSer.post(Config.Meeting.Attendees.Add, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeNewMeeting.newAttendeeModel.successAddedMsg'));
          this.attendeeAdded.emit();
          this.form.reset();
          this.closePopup();
        }
      });
  }
  //update an attendee
  updateAttendee(body: any) {
    if(body?.attendeeStatus == 2) {
      body['justificationAttachments'] = [...(this.attachments ? this.attachments : []), ...this.oldAttachments]
    }
    else {
      //clear justification evidence in case absent or present
      body['justificationAttachments'] = []
    }
    // else {
    //    delete body.justificationAttachments
    // }
    //add attachments
   // body['justificationAttachments'] = [...(this.attachments ? this.attachments : []), ...this.oldAttachments]
    this.httpSer.put(Config.Meeting.Attendees.Update, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeNewMeeting.newAttendeeModel.successUpdatedMsg'));
          this.attendeeAdded.emit();
          this.form.reset();
          this.closePopup();
        }
      });
  }

  closePopup() {
    this.modelService.close();
  }


  uploadingFile: boolean = false;
  uploadedFiles: any = [];
  attachments: any[] = null;
  oldAttachments: any[] = [];
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
