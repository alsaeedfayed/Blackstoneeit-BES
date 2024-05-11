import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest, of } from 'rxjs';
import { finalize, takeUntil, concatMap } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICommitteeMeeting } from '../../models/ICommitteeMeeting';
import { ToastrService } from 'ngx-toastr';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ICommitteeMeetingBasicData } from '../../models/ICommitteeMeetingBasicData';
import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';

@Component({
  selector: 'app-edit-mom-meeting',
  templateUrl: './edit-mom-meeting.component.html',
  styleUrls: ['./edit-mom-meeting.component.scss']
})
export class EditMomMeetingComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  loadingAttendee: boolean = true;
  isBtnLoading: boolean = false;
  isPublishBtnClicked: boolean = false;

  completeRequest: boolean = true;
  meetingId?: number = null;
  meeting: ICommitteeMeeting = {} as ICommitteeMeeting;
  basicMeetingData: ICommitteeMeetingBasicData = {} as ICommitteeMeetingBasicData;
  today = new Date();

  // Basic form vars
  basicFormValidation: boolean = false;

  //employees loading vars
  gettingEmployees: boolean = false;
  searchSubject = new Subject<string>();
  employeeLoadCount: number = 1;
  memberSearchValue: string = '';

  //attachments vars
  generalNotesAttachments: any[] = null;
  oldGeneralNotesAttachments: any[] = [];
  generalNotesUploadedFiles: any = [];
  committeeId: any = null;

  // attendees vars
  attendeesType = [
    { name: "Chairman", nameAr: "رئيس الجلسة" },
    { name: "Vice Chairman", nameAr: "نائب رئيس  الجلسة" },
    {name : 'Secretary' , nameAr : 'مقرر'},
    { name: "Member", nameAr: "عضو" },
    { name: "Guest", nameAr: "ضيف" },
    {name : 'User' , nameAr : 'مستخدم'},
  ]
  attendeeStatuses = [
    { name: "Present", nameAr: "حاضر", className: "active" },
    { name: "Absent ", nameAr: "غائب", className: "highLevel" },
    { name: 'Absent With Justification', nameAr: 'غائب مع مبرر' ,className: 'mediumLevel'}
  ]
  isAttendeeModelOpened = false;
  selectedAttendee: any = null;

  //meeting data
  discussedItemsCount = 0;
  tasksCount = 0;
  decisionsCount = 0;

  form: FormGroup;

  attendees: any[] = [];

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
      .subscribe((res: ICommitteeMeeting) => {
        if (res) {
          if ([MeetingStatus.Draft, MeetingStatus.Completed].includes(this.meeting.status)) {
            this.router.navigateByUrl(`/committees-management/committee/${this.committeeId}/meeting/${this.meetingId}`);
          } else {
            this.meeting = res;
            this.form.patchValue(res);
            this.getMeetingAttendees();
          }

          this.oldGeneralNotesAttachments = res.generalNotesAttachments.map(a => (
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
  mappedAttendees: any[] = [];
  //meeting Attendees
  getMeetingAttendees() {
    this.httpSer.get(`${Config.Meeting.Attendees.GetAllByMeetingId}/${this.meetingId}`)
      .pipe(finalize(() => { this.loadingAttendee = false; }))
      .subscribe((res) => {
        this.attendees = res.data;
        console.log('att' , this.attendees)
        this.mappedAttendees = res.data.filter(a => a.attendeeType == 1 || a.attendeeType == 2 || a.attendeeType == 0)
      })
  }


  // open new attendee model
  openNewAttendeeModel(item: any = null) {
    this.selectedAttendee = item;
    this.isAttendeeModelOpened = true;
    this.modelService.open('new-attendee');
  }

  // close new attendee model
  closeNewAttendeeModel() {
    this.isAttendeeModelOpened = false;
    this.selectedAttendee = null;
    this.modelService.close();
  }

  // initialize new meeting form controls
  initNewMeetingFormControls() {

    this.form = this.fb.group({
      generalNotes: [null],
    });
  }
  // back to last page
  backToLastPage() {
    this.goToDetailsPage();
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
      //get id
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
    }
  }

  save() {
    this.isBtnLoading = true;
    const body = {
      ...this.basicMeetingData,
      ...this.form.value,
      id: this.meetingId,
      generalNotesAttachments: [...(this.generalNotesAttachments ? this.generalNotesAttachments : []), ...this.oldGeneralNotesAttachments],
    };

    // meeting location type is online
    if (body.locationType == 1) delete body.location;

    if (!this.completeRequest)
      this.completeRequest = true;
    this.httpSer
      .post(Config.Meeting.SaveMom, body)
      .pipe(
        finalize(() => {  this.isBtnLoading = false; }),
        concatMap((res) => {
          if (res) {

            if (!this.isPublishBtnClicked) {
              this.toastr.success(this.translate.instant('committeeMeetings.saveMomSuccessMsg'));
              this.goToDetailsPage();
            }
            else
              return this.httpSer.put(Config.Meeting.PublishForReview, { "id": this.meetingId })
          }
          return of(null);
        })
      ).subscribe((res2) => {
        if (res2) {
          this.toastr.success(this.translate.instant(this.meeting.resumeWorkflowAction ? 'committeeMeetings.republishSuccessMsg' : 'committeeMeetings.publishMomSuccessMsg'));
          this.form.reset();
          this.goToDetailsPage();
        }
      })
  }

  publishMeetingForReviewBtn() {
    this.confirmationPopupService.open('publish-meeting');
  }

  // publish meeting
  publishMeetingForReview() {
    this.confirmationPopupService.close('publish-meeting');
    this.isPublishBtnClicked = true;
    this.save();
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  goToDetailsPage() {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', this.committeeId).replace(':meetingId', `${this.meetingId}`);
    this.router.navigateByUrl(path);
  }

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  // set count of tabs items
  setTabsItemsCount(num: number, varName: string) {
    this[`${varName}`] = num;
  }
  //attachments functions
  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.fileUploading(true);
      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        if (
          this.generalNotesUploadedFiles.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0 && this.oldGeneralNotesAttachments.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0
        ) {
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          };
          this.generalNotesUploadedFiles.push(file);

          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => { this.fileUploading(false) }))
            .subscribe(
              data => {
                if (this.generalNotesAttachments == null) {
                  this.generalNotesAttachments = [];
                }
                this.generalNotesAttachments.push(data[0]);

                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.isBtnLoading = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.isBtnLoading = false;
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
    meeting.timeFrom = new Date(meeting.timeFrom).toISOString();
    meeting.timeTo = new Date(meeting.timeTo).toISOString();

    this.basicMeetingData.agenda = meeting.agenda;
    this.basicMeetingData.agendaAttachments = meeting.agendaAttachments;
    this.basicMeetingData.notes = meeting.notes;
    this.basicMeetingData.notesAttachments = meeting.notesAttachments;
    this.basicMeetingData.name = meeting.name;
    this.basicMeetingData.date = meeting.date;
    this.basicMeetingData.location = meeting.location;
    this.basicMeetingData.locationType = meeting.locationType;
    this.basicMeetingData.timeFrom = meeting.timeFrom;
    this.basicMeetingData.timeTo = meeting.timeTo;
  }

  fileUploading(flag) {
    this.isBtnLoading = flag;
  }

  formValidated(flag) {
    this.basicFormValidation = flag;
  }

}
