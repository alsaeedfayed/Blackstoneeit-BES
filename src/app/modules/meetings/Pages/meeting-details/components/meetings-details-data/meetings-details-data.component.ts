import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ITab } from 'src/app/shared/components/tabs/ITab.interfcae';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { IMeetingDetails, IMinOfMeeting } from './../../iMeetingDetails.interface';

@Component({
  selector: 'meetings-details-data',
  templateUrl: './meetings-details-data.component.html',
  styleUrls: ['./meetings-details-data.component.scss'],
})

export class MeetingDetailsDataComponent implements OnInit,OnDestroy {
  private endSub$ = new Subject();
  public attendeesPoitions: any[]=[];
  public taskTypes: any[]=[];

  @Input() set Data (data: IMeetingDetails ) {
    this.data = data;
    this.minOfMeetingData = {
      chairpersonInfo: data.chairpersonInfo,
      initiatorInfo: data.initiatorInfo,
      commiteeId: data.commiteeId,
      location: data.location,
      title: data.title,
      date: data.date,
      timeFrom: data.timeFrom,
      timeTo: data.timeTo
    }
    if(data){
      this.handleLangChange();
    }
  }
  personInfo: IPerson;
  lang: string = this.translateService.currentLang;
  public data = {} as IMeetingDetails;
  public tabs: ITab[] = [
    {
      tabIndex: 1,
      tabTitle: this.translateService.instant('Meetings.minutesOfTheMeetingHeader'),
      disbaled: false,
    },
    {
      tabIndex: 2,
      tabTitle: this.translateService.instant('Meetings.attendees'),
      disbaled: false,
      counter: this.data.attendees ? this.data.attendees.length : 0
    },
    {
      tabIndex: 3,
      tabTitle: this.translateService.instant('Meetings.discussionItems'),
      disbaled: false,
      counter: this.data.discussionItems ? this.data.discussionItems.length : 0
    },
    {
      tabIndex: 4,
      tabTitle: this.translateService.instant('Meetings.actionItems'),
      disbaled: false,
      counter: this.data.actionItems ? this.data.actionItems.length : 0
    },
  ];
  public minOfMeetingData = {} as IMinOfMeeting;
  public activeTabIndex:number = 1;

  constructor(
    private attachmentSrv: AtachmentService,
    private toastr: ToastrService,
    private translateService: TranslateService,private httpSer:HttpHandlerService
  ) {
    this.handleLangChange();
    this.getSharedLokkups();
  }


  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      this.lang = this.translateService.currentLang;
    });
  }

  private handleLangChange() {
    this.tabs = [
      {
        tabIndex: 1,
        tabTitle: this.translateService.instant('Meetings.minutesOfTheMeetingHeader'),
        disbaled: false,
      },
      {
        tabIndex: 2,
        tabTitle: this.translateService.instant('Meetings.attendees'),
        disbaled: false,
        counter: this.data.attendees ? this.data.attendees.length : 0
      },
      {
        tabIndex: 3,
        tabTitle: this.translateService.instant('Meetings.discussionItems'),
        disbaled: false,
        counter: this.data.discussionItems ? this.data.discussionItems.length : 0
      },
      {
        tabIndex: 4,
        tabTitle: this.translateService.instant('Meetings.actionItems'),
        disbaled: false,
        counter: this.data.actionItems ? this.data.actionItems.length : 0
      },
    ];
  }

  private getSharedLokkups() {
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const lookups$ = this.httpSer.get(Config.Lookups.lookupService, queryServiceDesk);
    combineLatest([lookups$]).pipe(takeUntil(this.endSub$)).subscribe(([lookups]) => {
      this.attendeesPoitions = StructureLookups(lookups).MeetingRoleType;
      this.taskTypes = StructureLookups(lookups).TaskType
    })
  }

  public refreshAttendees(e:any){
    this.data.attendees=e;
  }


  getFileURL(fileName: string) {
    this.attachmentSrv.getAttachmentURLs(fileName).subscribe({
      next: (res: any[]) => {
        // console.log("res ", res)
        if (res && res.length > 0) {
          window.open(res[0].fileUrl);
        }
      },
      error: (err) => {
        this.toastr.error(
          this.translateService.instant('shared.somethingWentWrong')
        );
      },
    });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }


  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}
