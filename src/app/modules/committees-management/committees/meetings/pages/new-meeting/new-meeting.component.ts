import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest, of } from 'rxjs';
import { concatMap, finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { RegexConfig } from 'src/app/core/config/regex.configs';
import { ActivatedRoute, Router } from '@angular/router';
import { ICommitteeMeeting } from '../../models/ICommitteeMeeting';
import { ToastrService } from 'ngx-toastr';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.scss']
})
export class NewMeetingComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  gettingCommitteeMembers: boolean = true;

  isBtnLoading: boolean = false;
  isPublishBtnClicked: boolean = false;

  isUpdating: boolean = false;
  completeRequest: boolean = true;
  meetingId?: number = null;
  meeting: ICommitteeMeeting;
  meetingData: ICommitteeMeeting;
  today = new Date();

  // Basic form vars 
  basicFormValidation: boolean = false;

  //employees loading vars
  gettingEmployees: boolean = false;
  searchSubject = new Subject<string>();
  employeeLoadCount: number = 1;
  memberSearchValue: string = '';

  //attachments vars
  messageAttachments: any[] = null;
  oldMessageAttachments: any[] = [];
  messageUploadedFiles: any = [];
  committeeId: any = null;

  form: FormGroup;

  employees: any[] = [];

  guest = this.fb.group({
    firstName: [null],
    lastName: [null],
    email: [null, [Validators.required, Validators.pattern(RegexConfig.emailRegExp)]],
  });

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


  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modelService: ModelService,
    private confirmationPopupService: ConfirmModalService,
    private attachmentService: AtachmentService

  ) {
    super(translateService, translate);
    //search for employees
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.employeeLoadCount = 1;
      this.employees = [];
      this.getEmployees();
    });
  }

  ngOnInit(): void {

    this.checkIds();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  //get meeting details
  GetMeetingDetails() {
    this.httpSer
      .get(`${Config.Meeting.GetById}/${this.meetingId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          if (res.status != MeetingStatus.Draft) {
            this.router.navigateByUrl(`committees-management/committee/${this.committeeId}/meeting/${this.meetingId}`);
          } else {
            // this.isUpdating = true;
            this.meeting = res;
            if (this.meeting.attendeeIds.length > 0)
              this.getUsersSlice();
            this.form.patchValue(this.meeting);

            if (this.meeting.externalAttendees?.length > 0) this.guests.removeAt(0);
            this.meeting.externalAttendees.forEach(attendee => {
              this.guests.push(this.fb.group({
                firstName: attendee.firstName,
                lastName: attendee.lastName,
                email: [attendee.email, [Validators.required, Validators.pattern(RegexConfig.emailRegExp)]]
              }));
            });

          }

          this.oldMessageAttachments = res.messageAttachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
        } else this.goToNotFound();
      });

  }


  //fetch a slice of  users 
  getUsersSlice() {
    this.httpSer
      .post(Config.UserManagement.GetUsersByIds, { usersIds: this.meeting.attendeeIds })
      .subscribe((res) => {
        if (res) {
          res.activeUsers.forEach((emp) => {
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
    // if (this.isUpdating && this.meeting.attendeeIds.length > 0) this.getUsersSlice();
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


  // initialize new meeting form controls
  initNewMeetingFormControls() {

    this.form = this.fb.group({
      attendeeIds: [null],
      externalAttendees: this.fb.array([
        this.guest
      ]),
      sendNotificationToAllAttendee: [false],
      sendNotificationToGuest: [false],
      includeAgenda: [false],
      includeAttachment: [false],

      notificationMessage: [null],
    });
  }

  get guests() { return this.form.get('externalAttendees') as FormArray; }

  // back to last page
  backToLastPage() {
    if (this.isUpdating) this.goToDetailsPage();
    else this.router.navigateByUrl(`/committees-management/committee-details/${this.committeeId}/meetings`);
  }

  checkIds() {
    this.committeeId = +this.route.snapshot.paramMap.get('committeeId');
    if (isNaN(this.committeeId)) {
      this.goToNotFound();
      this.committeeId = null;
    }
    else {
      // handles language change event
      this.handleLangChange();

      // initialize new meeting form controls
      this.initNewMeetingFormControls();

      if (this.router.url.includes('/edit/')) {

        //get id 
        this.isUpdating = true;
        this.meetingId = +this.route.snapshot.paramMap.get(`${RoutesVariables.Meeting.MeetingId}`);
        //check if fake id
        if (isNaN(this.meetingId)) {
          this.goToNotFound();
          this.meetingId = null;
        }
        else {
          //get meeting details
          this.GetMeetingDetails();
        }

      } else {
        // get committee members 
        this.getCommitteeMembers();
        this.loading = false;

      }
      this.removeExternalAttendee(0);
    }
  }

  getCommitteeMembers() {
    let path = Config.CommitteesManagement.GetUsers.replace('{id}', `${this.committeeId}`);
    this.httpSer
      .get(path, { pageIndex: 1, pageSize: 1000000000 })
      .pipe(finalize(() => (this.gettingCommitteeMembers = false)))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            // let duplicated = false;

            // //check if duplicated employee exists
            // for (const e of this.employees) {
            //   if (e.id == emp.id) {
            //     duplicated = true;
            //     break;
            //   }
            // }
            // if (!duplicated) 
            this.employees.push(emp);
          });
          this.form.patchValue({ attendeeIds: this.employees.map(m => m.id) })
        }
      });
  }
  // add guest
  addGuest() {
    this.guests.push(this.fb.group({
      firstName: [null],
      lastName: [null],
      email: [null, [Validators.required, Validators.pattern(RegexConfig.emailRegExp)]],
    }));
  }
  //remove guest
  removeExternalAttendee(index: number) {
    this.guests.removeAt(index);
  }

  // change controls value on switch
  onSwitchControlChange(value: boolean, control: string) {
    this.form.controls[control].setValue(value);
  }
  saveMeetingAsDraft() {
    this.isBtnLoading = true;
    const body: ICommitteeMeeting = {
      committeeId: this.committeeId,
      ...this.meetingData,
      ...this.form.value,
      messageAttachments: [...(this.messageAttachments ? this.messageAttachments : []), ...this.oldMessageAttachments],
    };

    // meeting location type is online 
    if (body.locationType == 1) delete body.location;

    for (let attendee of body.externalAttendees) {
      if (Object.values(attendee).every(o => o === null)) {
        body.externalAttendees = [];
        break;
      }
      else {
        if ((attendee.email == null || attendee.email == "") && (attendee.firstName !== null || attendee.lastName != null)) {
          this.toastr.error(this.translate.instant('committeeNewMeeting.emailRequired'));
          this.completeRequest = false;
          this.isBtnLoading = false;
          break;
        }

        let duplicateEmail = body.externalAttendees.filter(e => e.email == attendee.email);
        if (duplicateEmail.length >= 2) {
          this.completeRequest = false;
          this.isBtnLoading = false;
          this.toastr.error(this.translate.instant('committeeNewMeeting.meetingForm.duplicateEmail'));
          break;
        }
      }
    }
    body.id = this.meetingId ? this.meetingId : 0;
    //add id to request body in case of updating 
    if (this.isUpdating) body.id = this.meetingId;

    if (!this.completeRequest)
      this.completeRequest = true;

    this.httpSer
      .post(Config.Meeting.SaveDraft, body)
      .pipe(
        finalize(() => { this.isBtnLoading = false; }),
        concatMap((res) => {
          if (!this.isPublishBtnClicked) {
            if (!this.isUpdating && !body.id) this.toastr.success(this.translate.instant('committeeMeetings.saveDraftSuccessMsg'));
            else this.toastr.success(this.translate.instant('committeeMeetings.editDraftSuccessMsg'));
          }
          this.meetingId = res.id;
          body.id = res.id;
          if (this.isPublishBtnClicked) {
            return this.httpSer.put(Config.Meeting.Publish, { "id": this.meetingId })
          } else {
            this.goToDetailsPage();
            return of(null);
          }
        })
      ).subscribe((res2) => {
        if (res2) {
          this.toastr.success(this.translate.instant('committeeMeetings.publishSuccessMsg'));
          this.form.reset();
          this.goToDetailsPage();
        }
      })
  }

  publishMeetingBtn() {
    this.confirmationPopupService.open('publish-meeting');
  }

  // publish meeting
  publishMeeting() {
    this.confirmationPopupService.close('publish-meeting');
    this.isPublishBtnClicked = true;
    this.saveMeetingAsDraft();
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  goToDetailsPage() {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', this.committeeId).replace(':meetingId', `${this.meetingId}`);
    this.router.navigateByUrl(path);
  }

  //attachments functions 
  onUploadFile(e, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.fileUploading(true);
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
            .pipe(finalize(() => { this.fileUploading(false) }))
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
          this.isBtnLoading = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.fileUploading(false)
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

  onDeleteFile(i, controlName: string) {
    this[`${controlName}Attachments`].splice(i, 1);
    if (!controlName.includes('old'))
      this[`${controlName}UploadedFiles`].splice(i, 1);
    this.toastr.success(this.translate.instant('shared.removed'));
  }

  getMeetingData(meeting) {
    //UTC time
    meeting.timeFrom = new Date(meeting.timeFrom).toISOString();
    meeting.timeTo = new Date(meeting.timeTo).toISOString();
    meeting.date = new Date(meeting.date).toISOString();
    this.meetingData = meeting;
  }

  fileUploading(flag) {
    this.isBtnLoading = flag;
  }

  formValidated(flag) {
    this.basicFormValidation = flag;
  }

}
