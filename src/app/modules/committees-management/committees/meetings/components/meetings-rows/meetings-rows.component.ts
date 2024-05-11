import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationType, MeetingStatus, getEnumKeyByValue } from 'src/app/modules/committees-management/enums/enums';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { MeetingStatusService } from '../../services/meeting-status/meeting-status.service';

@Component({
  selector: 'meetings-rows',
  templateUrl: './meetings-rows.component.html',
  styleUrls: ['./meetings-rows.component.scss']
})
export class MeetingsRowsComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  locationType: LocationType;
  meetingStatus: MeetingStatus;
  committeeId: number = 0;

  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() onPaginateEvent = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private meetingStatusService: MeetingStatusService,
  ) { }

  locationTypes = [
    { id: 0, name: 'Onsite', nameAr: 'المكتب' },
    { id: 1, name: 'Online', nameAr: 'افتراضي' },
  ]
  statuses = [];
  ngOnInit(): void {

    // handles language change event
    this.committeeId = +this.route.snapshot.parent.params['id'];
    this.handleLangChange();
    this.statuses = this.meetingStatusService.getStatuses();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // go to meeting details page
  goToMeetingDetails(id) {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`.replace(':committeeId', `${this.committeeId}`).replace(':meetingId', `${id}`);
    this.router.navigateByUrl(path);
  }
  getLocationType(value: number) {
    return getEnumKeyByValue(LocationType, value);
  }

}
