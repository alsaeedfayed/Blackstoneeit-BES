import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { IUpcomingMeeting } from '../../models/IUpcomingMeeting';
import { RoutesVariables } from '../../../routes';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'committee-highlight-model',
  templateUrl: './committee-highlight-model.component.html',
  styleUrls: ['./committee-highlight-model.component.scss']
})
export class CommitteeHighlightModelComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

  @Input() item: any;
  upcomingMeetings: IUpcomingMeeting[] = [];
  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;


  meetingStatuses = [
    { id: 0, name: 'Draft', nameAr: 'مسودة', className: 'draft' },
    { id: 1, name: 'Not Due yet', nameAr: 'منشور', className: 'notDueYet' },
    { id: 2, name: 'Pending MOM', nameAr: 'بانتظار نقاط الاجتماع ', className: 'pendingMom' },
    { id: 3, name: 'MOM Reviewed', nameAr: 'تمت المراجعة', className: 'momReviewed' },
    { id: 4, name: 'Completed', nameAr: 'منتهي', className: 'complete' },
    { id: 5, name: 'Need MOM Review', nameAr: 'بإنتظار مراجعة نقاط الاجتماع', className: 'needMOMReview' },
  ];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
  ) {}

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // committee Details
    this.getCOmmitteeDetails();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }
  getCOmmitteeDetails() {
    this.httpSer.get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.item.id}`, { includeUserDetails: true })
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((res) => {
        this.upcomingMeetings = res.upcomingMeetings;
      })
  }
  // go to committee details page
  goToCommitteeDetails(id) {
    this.router.navigateByUrl(`committees-management/committee-details/${id}`);
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 1000000000 : this.descTextInitialLimit
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }
  // go to meeting details page
  goToMeetingDetails(id) {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', `${this.item.id}`).replace(':meetingId', `${id}`);
    this.router.navigateByUrl(path);
  }
  closePopup() {
    this.modelService.close();
  }
}
