import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import arLocale from '@fullcalendar/core/locales/ar';

@Component({
  selector: 'meetings-calendar',
  templateUrl: './meetings-calendar.component.html',
  styleUrls: ['./meetings-calendar.component.scss'],
})
export class MeetingsCalendarComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  @Input() list: any[] = []
  calendarEvents: any[] = [];

  calendarPlugins = [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ];

  calendarOptions: CalendarOptions = {
    locale: this.language == 'ar' ? arLocale : null,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },
    initialView: 'timeGridWeek',
    navLinks: true,
    nowIndicator: true,
    weekNumbers: true,
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [0, 1, 2, 3, 4], // Sunday - Thursday
      startTime: '09:00', // a start time (9am in this example)
      endTime: '17:00', // an end time (5pm in this example)
    },
    eventClick: this.openMeetingHighlightModel.bind(this),
    plugins: this.calendarPlugins,
    events: this.calendarEvents,
    datesSet: this.onToggleCalendarView.bind(this),
  };

  isDayView = false;

  meetingId: any = null;
  isMeetingHighlighted = false;

  constructor(
    private translate: TranslateService,
    private modelService: ModelService,

  ) { }

  meetingStatusColors: any[] = [
    { color: 'rgb(150, 166, 189)' }, //draft
    { color: 'rgb(41, 45, 50)' }, //notDueYet
    { color: 'rgb(235, 148, 0)' }, //pendingMom
    { color: 'rgb(196, 214, 0)' }, //momReviewed
    { color: 'rgb(15, 193, 97)' }, //complete
    { color: 'rgb(60, 166, 189)' }, //needMOMReview
  ]
  ngOnInit(): void {
    this.list.forEach(meeting => {
      let calendarMeeting = {
        id: meeting.id,
        title: meeting.name,
        description: '',
        location: meeting.locationType,
        start: this.getTimeWithCorrectDate(meeting.date, meeting.timeFrom),
        end: this.getTimeWithCorrectDate(meeting.date, meeting.timeTo),
        meetingStart: this.getTimeWithCorrectDate(meeting.date, meeting.timeFrom),
        meetingEnd: this.getTimeWithCorrectDate(meeting.date, meeting.timeTo),
        color: this.meetingStatusColors[meeting.status]['color'],
        creator: meeting.creatorInfo,
        momRecordedBy: meeting.creatorInfo
      }
      this.calendarEvents.push(calendarMeeting);
    });
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;

        // update FullCalendar options
        this.updateFullCalendarOptions();
      });
  }

  // update FullCalendar options
  updateFullCalendarOptions() {
    this.fullcalendar.getApi().setOption('locale', this.language == 'ar' ? arLocale : null);

    // forces the calendar to readjusts its size after updating
    setTimeout(() => this.fullcalendar.getApi().updateSize());
  }

  // actions on toggle calendar view
  onToggleCalendarView(info) {
    this.isDayView = info.view.type === 'timeGridDay' ? true : false;

    // forces the calendar to readjusts its size after updating
    setTimeout(() => this.fullcalendar.getApi().updateSize());
  }

  // open meeting highlight model
  openMeetingHighlightModel(meeting) {
    this.isMeetingHighlighted = true;
    this.meetingId = meeting?.event?.id;
    this.modelService.open("meeting-highlight");
  }

  // close meeting highlight model
  closeMeetingHighlightModel() {
    this.isMeetingHighlighted = false;
  }


  getTimeWithCorrectDate(dateString: string, timeString: string): string {
    const date = new Date(dateString)
    const time = new Date(timeString)

    let correctTimeUTC = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    const correctTimeLocal = new Date(correctTimeUTC.getTime() - correctTimeUTC.getTimezoneOffset() * 60 * 1000);
    return correctTimeLocal.toISOString();
  }

}
