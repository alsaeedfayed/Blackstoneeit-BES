import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';

@Component({
  selector: 'meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss']
})
export class MeetingCardComponent implements OnInit {

  @Input() lang: 'en' | 'ar';
  @Input() meeting;
  @Input() committeeId;

  constructor( private router: Router) { }

  meetingStatuses = [
    { id: 0, name: 'Draft', nameAr: 'مسودة', className: 'draft' },
    { id: 1, name: 'Not Due yet', nameAr: 'منشور', className: 'notDueYet' },
    { id: 2, name: 'Pending MOM', nameAr: 'بانتظار نقاط الاجتماع ', className: 'pendingMom' },
    { id: 3, name: 'MOM Reviewed', nameAr: 'تمت المراجعة', className: 'momReviewed' },
    { id: 4, name: 'Completed', nameAr: 'منتهي', className: 'complete' },
    { id: 5, name: 'Need MOM Review', nameAr: 'بإنتظار مراجعة نقاط الاجتماع', className: 'needMOMReview' },
  ];
  ngOnInit(): void {
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }
  goToMeeting(){

    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', this.committeeId).replace(':meetingId', `${this.meeting.id}`);
    this.router.navigateByUrl(path);
  }

}
