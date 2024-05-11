import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ICommitteeMeeting } from '../../models/ICommitteeMeeting';
import { RoutesVariables } from '../../../../routes';
import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';
import { IOption } from '../../models/iOption.interface';
import { MeetingStatusService } from '../../services/meeting-status/meeting-status.service';


@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.scss']
})
export class MeetingDetailsComponent extends ComponentBase implements OnInit {

  // approval cycle
  public task = {};
  options: IOption[] = [];
  public instanceId: number = 0;

  private endSub$ = new Subject();


  language: string = this.translate.currentLang;

  // normal meeting loading
  loading: boolean = true;
  loadingAttendees: boolean = true;

  // mom meeting loading
  canSeeMom: boolean = false;

  afterMom: boolean = false;
  canEdit: boolean = false;
  meetingId: number = 0;
  committeeId: number = 0;
  meeting: ICommitteeMeeting = {} as ICommitteeMeeting;

  // description see more  vars
  descTextInitialLimit = 130;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;


  // meeting status
  statuses = [];

  // attendees vars
  attendees: any[] = [];
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
    {  name: 'Absent With Justification', nameAr: 'غائب مع مبرر' ,className: "mediumLevel"}

  ]

  // counts
  discussedItemsCount = 0;
  tasksCount = 0;
  decisionsCount = 0;

  form: FormGroup;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modelService: ModelService,
    private meetingStatusService: MeetingStatusService,

  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.statuses = this.meetingStatusService.getStatuses();
    // handles language change event
    this.handleLangChange();

    this.checkId();

    // initialize comments form controls
    this.initCommentsFormControls();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  checkId() {
    // get id
    this.meetingId = +this.route.snapshot.paramMap.get('meetingId');
    this.committeeId = +this.route.snapshot.paramMap.get('committeeId');

    if (isNaN(this.meetingId) || isNaN(this.committeeId)) {
      this.goToNotFound();
      this.meetingId = null;
      this.committeeId = null;
    }
    else {
      // handles language change event
      this.handleLangChange();

      // get meeting details
      this.getMeetingDetails();


    }
  }

  // initialize comments form controls
  initCommentsFormControls() {
    this.form = this.fb.group({
      comments: [null, Validators.required],
    });
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }
  // go to create meeting page
  goToCreateMeeting() {
    let createPath = `/committees-management/${RoutesVariables.Meeting.Create}`.replace(':committeeId', `${this.committeeId}`);
    this.router.navigateByUrl(createPath);
    // this.router.navigateByUrl(`committees-management/committee/${this.committeeId}/meeting/new`);
  }

  goToUpdateMeeting() {
    let path;
    if (this.meeting.status == MeetingStatus.Draft) {
      path = `/committees-management/${RoutesVariables.Meeting.Update}`.replace(':committeeId', `${this.committeeId}`)
        .replace(`:${RoutesVariables.Meeting.MeetingId}`, `${this.meetingId}`);
      this.router.navigateByUrl(path);
    } else if (this.meeting.status == MeetingStatus.PendingMOM || this.meeting.status == MeetingStatus.UnderReview || this.meeting.status == MeetingStatus.NotDueYet || this.meeting.status == MeetingStatus.Returned) {
      path = `/committees-management/${RoutesVariables.Meeting.MomUpdate}`.replace(':committeeId', `${this.committeeId}`)
        .replace(`:${RoutesVariables.Meeting.MeetingId}`, `${this.meetingId}`);
      this.router.navigateByUrl(path);
    } else {
      this.goToNotFound();

    }
  }

  // open decision details model
  openDecisionDetailsModel(item) {
    item.isDetailsOpened = true;
    this.modelService.open("decision-details" + item.id);
  }

  // set count of tabs items
  setTabsItemsCount(num: number, varName: string) {
    this[`${varName}`] = num;
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
  canComment: boolean = false;
  getMeetingDetails() {
    this.httpSer
      .get(`${Config.Meeting.GetById}/${this.meetingId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: ICommitteeMeeting) => {
          if (res) {
            this.canComment = res.canComment
            this.instanceId = res?.instanceId;
            this.meeting = res;
            //console.log('meeting details' , this.meeting)
            this.getMeetingAttendees();


            if (this.meeting.status != MeetingStatus.Draft) {
              this.canSeeMom = true;
            }
            if ([MeetingStatus.Completed, MeetingStatus.UnderReview].includes(this.meeting.status))
              this.afterMom = true;

            this.instanceId > 0 && this.getWorkflowStates();
          } else this.goToNotFound();
        });
  }
  //meeting Attendees
  getMeetingAttendees() {
    this.httpSer.get(`${Config.Meeting.Attendees.GetAllByMeetingId}/${this.meetingId}`)
      .pipe(finalize(() => { this.loadingAttendees = false; }))
      .subscribe(res => {

        this.attendees = res?.data;
        console.log('attendeees' , this.attendees)
      })
  }

  // get workflow states
  getWorkflowStates(): void {
    if (this.instanceId) {
      this.httpSer.get(`${Config.WorkflowEngine.GetInstance}/${this.instanceId}`)
        .subscribe(res => {
          this.task = res?.task;
          this.options = res?.task?.options ? res?.task?.options : [];
        });
    }
  }

  // save action on click
  saveAction(event) {
    this.router.navigateByUrl(`committees-management/committee-details/${this.committeeId}/meetings`);
  }
}
