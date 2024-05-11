import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'meeting-highlight-model',
  templateUrl: './meeting-highlight-model.component.html',
  styleUrls: ['./meeting-highlight-model.component.scss']
})
export class MeetingHighlightModelComponent implements OnInit {

  @Input() meetingId: any= null;
  @Input() lang: 'en' | 'ar';
  meeting:any;
  loading: boolean = true;

  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;


  constructor(
    private router: Router,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
    ) { }

  ngOnInit(): void {
    //get meeting details
    this.getMeetingDetails();
  }

  
    // go to meeting details page
    goToMeetingDetails() {
      let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', `${this.meeting.committeeId}`).replace(':meetingId', `${this.meetingId}`);
      this.router.navigateByUrl(path);
    }

  // toggle more text in description
  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }
  //Get meeting details 
  getMeetingDetails() {
    this.httpSer.get(`${Config.Meeting.GetById}/${this.meetingId}`)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe((res)=>{
      this.meeting = res;
    });
  }
  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }
  closePopup() {
    this.modelService.close();
  }
}
