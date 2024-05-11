import { BadgeCountService } from './badge-count.service';
import { ITab } from './../../../../shared/components/tabs/ITab.interfcae';
import { takeUntil, finalize, pluck, take, map } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { componentModes } from './../../Enums/enums';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Istep } from 'src/app/shared/components/stepper/iStepper.interface';
import { MinsOfMettingComponent } from '../../Components/mins-of-metting/mins-of-metting.component';
import { Subject, combineLatest } from 'rxjs';
import {
  IMeetingDetails,
  IMinOfMeeting,
} from '../meeting-details/iMeetingDetails.interface';
import { StructureLookups } from 'src/app/utils/loockups.utils';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss'],
})
export class MeetingFormComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public createdMeetingId: string;
  public meetingDetails: IMeetingDetails = {} as IMeetingDetails;
  public isBtnLoadingSave: boolean = false;
  public isBtnLoadingSubmit: boolean = false;
  public isLoading: boolean = false;
  public ComonentsMode: componentModes = componentModes.addMode;
  // Steeper
  public activeTabIndex: number = 1;
  public tabs: ITab[] = [
    {
      tabIndex: 1,
      tabTitle: this.translateService.instant('Meetings.minutesOfTheMeetingHeader'),
      disbaled: false,
    },
    {
      tabIndex: 2,
      tabTitle: this.translateService.instant('Meetings.attendees'),
      disbaled: true,
      counter: this.meetingDetails?.attendees ? this.meetingDetails.attendees.length : 0
    },
    {
      tabIndex: 3,
      tabTitle: this.translateService.instant('Meetings.discussionItems'),
      disbaled: true,
      counter: this.meetingDetails?.discussionItems ? this.meetingDetails.discussionItems.length : 0
    },
    {
      tabIndex: 4,
      tabTitle: this.translateService.instant('Meetings.actionItems'),
      disbaled: true,
      counter: this.meetingDetails?.actionItems ? this.meetingDetails.actionItems.length : 0
    },
  ];
  // Children
  @ViewChild(MinsOfMettingComponent)
  mintsOfMeetingComponent: MinsOfMettingComponent;
  minOfMeetingData: IMinOfMeeting = {} as IMinOfMeeting;
  attendeesPoitions: any[] = [];
  taskTypes: any[]=[];
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private toaster: ToastrService,
    private httpService: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    private badgeCounterService:BadgeCountService
  ) { }

  ngOnInit(): void {
    this.handleLanguageChange();
    this.getBadgescount();
    this.getSharedLokkups();
    this.checkEditMode();
  }

  private handleLanguageChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.changeTabsStatus();
    });
  }

  private getBadgescount(){
    const attendees$ = this.badgeCounterService.attendeesCount$;
    const discussions$ = this.badgeCounterService.discussionItemsCount$;
    const actions$ = this.badgeCounterService.actionItemsCount$;
    combineLatest([attendees$,discussions$,actions$]).pipe(takeUntil(this.endSub$)).subscribe(([attendees,discussions,actions])=>{
      this.tabs[1].counter = attendees;
      this.tabs[2].counter = discussions;
      this.tabs[3].counter = actions;
    })
  }

  private getSharedLokkups(){
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const lookups$ = this.httpService.get(Config.Lookups.lookupService, queryServiceDesk);
    combineLatest([lookups$]).pipe(takeUntil(this.endSub$)).subscribe(([lookups])=>{
      this.attendeesPoitions = StructureLookups(lookups).MeetingRoleType;
      this.taskTypes = StructureLookups(lookups).TaskType
    })
  }

  private changeTabsStatus(){
    this.tabs = [
      {
        tabIndex: 1,
        tabTitle: this.translateService.instant(
          'Meetings.minutesOfTheMeetingHeader'
        ),
        disbaled: this.tabs[0].disbaled,
      },
      {
        tabIndex: 2,
        tabTitle: this.translateService.instant('Meetings.attendees'),
        disbaled: this.tabs[1].disbaled,
        counter: this.meetingDetails?.attendees ? this.meetingDetails.attendees.length : 0
      },
      {
        tabIndex: 3,
        tabTitle: this.translateService.instant('Meetings.discussionItems'),
        disbaled: this.tabs[2].disbaled,
        counter: this.meetingDetails?.discussionItems ? this.meetingDetails.discussionItems.length : 0
      },
      {
        tabIndex: 4,
        tabTitle: this.translateService.instant('Meetings.actionItems'),
        disbaled: this.tabs[3].disbaled,
        counter: this.meetingDetails?.actionItems ? this.meetingDetails.actionItems.length : 0
      },
    ];
  }

  private checkEditMode() {
    this.activatedRoute.params
      .pipe(take(1), pluck('id'))
      .subscribe((id: string) => {
        if (!!id) {
          this.ComonentsMode = componentModes.editMode;
          this.createdMeetingId = id;
          this.getMeetingDetails();
        }
      });
  }

  // // Steeper Methods
  // public onNextStep() {
  //   if (this.activeStep === 1) {
  //     this.mintsOfMeetingComponent.isSubmitted = true;
  //     if (this.mintsOfMeetingComponent.form.invalid) return;
  //     else {
  //       // Edit Mode
  //       if (this.createdMeetingId) this.activeStep++;
  //         // this.mintsOfMeetingComponent.updateMeeting(this.createdMeetingId)
  //       // Create Mode
  //       else this.mintsOfMeetingComponent.saveMeeting()
  //     }
  //     return
  //   }
  //   this.activeStep++;
  // }

  public saveMeeting() {
    this.mintsOfMeetingComponent.isSubmitted = true;
    if (this.mintsOfMeetingComponent.form.invalid) return;
    else {
      this.isBtnLoadingSave = true;
      // Edit Mode
      if (this.createdMeetingId) {
        this.mintsOfMeetingComponent.updateMeeting(this.createdMeetingId);
      }
      // Create Mode
      else this.mintsOfMeetingComponent.saveMeeting();
    }
    return;
  }

  public cancelForm() {
    this.router.navigate(['/meetings']);
  }

  // Main Logic
  public meetingCreatedHandler(createdMeetingId: string) {
    if (createdMeetingId) {
      this.createdMeetingId = createdMeetingId;
      this.isBtnLoadingSave = false;
      this.router.navigate([`/meetings/meeting-form/${this.createdMeetingId}`], { replaceUrl: true })
    }
  }

  public meetingUpdatedHandler() {
    this.isBtnLoadingSave = false;
    this.checkEditMode();
  }

  private enableAllSteps() {
    this.tabs = this.tabs.map((tab: ITab) => {
      return { ...tab, disbaled: false };
    });
  }

  public refreshAttendees(e:any){
    this.meetingDetails.attendees=e;
  }

  private getMeetingDetails() {
    this.isLoading = true;
    this.httpService
      .get(`${Config.meetings.getAll}/${this.createdMeetingId}`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res) => {
        this.meetingDetails = res;
        this.changeTabsStatus();
        this.minOfMeetingData = {
          chairpersonInfo: res.chairpersonInfo,
          initiatorInfo: res.initiatorInfo,
          commiteeId: res.commiteeId,
          location: res.location,
          title: res.title,
          date: res.date,
          timeFrom: res.timeFrom,
          timeTo: res.timeTo
        };
        this.badgeCounterService.changeAttendeesCount(this.meetingDetails.attendees.length ?? 0);
        this.badgeCounterService.changeDiscussionItemsCount(this.meetingDetails.discussionItems.length ?? 0);
        this.badgeCounterService.changeActionItemsCount(this.meetingDetails.actionItems.length ?? 0);
        this.enableAllSteps();
      });
  }

  public submit() {
    this.isBtnLoadingSubmit = true;
    this.httpService
      .put(Config.meetings.submit, {
        id: this.createdMeetingId,
      })
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoadingSubmit = false))
      )
      .subscribe((res) => {
        if (res) {
          this.toaster.success(
            this.translateService.instant('Meetings.meetingCreatedSuccessfully')
          );
          this.router.navigate(['/meetings']);
        }
      });
  }

  // Getters & Setters
  public get isSavable(): boolean {
    return (
      (this.activeTabIndex == 1 &&
        !this.isEditMode) ||
      (this.activeTabIndex == 1 && this.isEditMode &&
        this.meetingDetails.canSave)
    );
  }

  public get CanAdd(): boolean {
    return (
      (
        !this.isEditMode) ||
      (this.isEditMode &&
        this.meetingDetails.canSave)
    );
  }

  public get isSubmittable(): boolean {
    return (
      (!this.isEditMode &&
        !!this.createdMeetingId) ||
      (this.isEditMode &&
        this.meetingDetails.canSubmit)
    );
  }

  public get isEditMode(): boolean {
    return this.ComonentsMode === componentModes.editMode
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
