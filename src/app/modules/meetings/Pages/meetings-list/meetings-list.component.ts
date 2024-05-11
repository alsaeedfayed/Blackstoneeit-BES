import { ToastrService } from 'ngx-toastr';
import { OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { ImeetingStatiitics, iMeetingsView, viewMeetingsRes } from '../../Interfaces/interfaces';
import { MeetingStatus } from '../../Enums/enums';
import { IAnalyticsWidget } from 'src/app/shared/components/analytics-widget/iAnalyticsWidget.interface';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import * as moment from 'moment';
import { MOMSortBy , MOMSortDirections } from './enum';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.scss'],
})
export class MeetingsListComponent implements OnInit, OnDestroy, AfterContentChecked {
  // PROPS
  /* Private */
  private endSub$ = new Subject();
  /* Public */
  public language = this.translateService.currentLang;
  public statistics: ImeetingStatiitics;
  public confirmMsg: string;
  public structuredStatistics: IAnalyticsWidget[] = [];
  public meetings: iMeetingsView[] = [];
  public loadingMeetings: boolean = false;
  public isDownloading: boolean = false;
  public totalCount: number = 0;
  public users: any[] = [];
  public meetingIdToDelete: string;
  // Utilitie Props
  public paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  public MeetingActions = [
    {
      item: this.translateService.instant('shared.edit'),
      disabled: false,
      textColor: '',
      icon: '',
    },
    {
      item: this.translateService.instant('shared.delete'),
      disabled: false,
      textColor: '',
      icon: '',
    },
  ];
  public queryParams = {
    appliedFiltersCount: 0,
    startDate: '',
    endDate: '',
    status: null,
    initiator: '',
    onlyMe: false,
    search: '',
    sortedCol : null,
    sortDirection : null,
    CreatedBy : null,
    Number : null,
    Title : null,
    Chairperson : null,
    commitee : null
  };
  public dateRange = { startDate: null, endDate: null };
  public status = [
    { id: 1, label: this.translateService.instant('Meetings.Draft') },
    { id: 2, label: this.translateService.instant('Meetings.UnderReview') },
    { id: 3, label: this.translateService.instant('Meetings.Approved') },
    // { id: 4, label: this.translateService.instant('Meetings.Closed') },
  ];
  editLabel = this.translateService.instant('shared.edit');
  deleteLabel = this.translateService.instant('shared.delete');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];
  isAdvancedFilterModalOpen: boolean = false;

  // CONSTRUCTOR
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private httpSer: HttpHandlerService,
    private confirmationPopupService: ConfirmModalService,
    private toastSer: ToastrService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private modelService: ModelService,
    private exportFilesService:ExportFilesService
  ) {
    this.handleLangChange();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.queryParams.appliedFiltersCount = data.appliedFiltersCount;
      this.queryParams.status = data.status ? parseInt(data.status) : null;
      this.queryParams.startDate = data.startDate;
      this.queryParams.endDate = data.endDate;
      if (this.queryParams.startDate) {
        this.dateRange.startDate = moment(this.queryParams.startDate);
      }
      if (this.queryParams.endDate) {
        this.dateRange.endDate = moment(this.queryParams.endDate);
      }
      if (!this.queryParams.startDate && !this.queryParams.endDate){
        this.dateRange = { startDate: null, endDate: null }
      }
      this.queryParams.initiator = data.initiator ?? "";
      this.queryParams.CreatedBy = data.CreatedBy ?? "";
      this.queryParams.Number = data.Number ?? "";
      this.queryParams.Title = data.Title ?? "";
      this.queryParams.Chairperson = data.Chairperson ?? "";
      this.queryParams.commitee = data.commitee ?? "";
      this.queryParams.onlyMe = data.onlyMe == true || data.onlyMe == "true";
      this.queryParams.search = data.search?? "";
      this.queryParams.sortedCol = data.sortedCol ?? null;
      this.queryParams.sortDirection = data.sortDirection ? parseInt(data.sortDirection) : (this.queryParams.sortedCol ? MOMSortDirections.asc : null);

      //this.getUsers();
      this.getMeetingsList();
      // this.getStatistics();
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getQueryParams() {
    return {
      "appliedFiltersCount" : this.queryParams.appliedFiltersCount,
      "status" : this.queryParams.status,
      "startDate" : this.queryParams.startDate,
      "endDate" : this.queryParams.endDate,
      "initiator" : this.queryParams.initiator,
      "onlyMe" : this.queryParams.onlyMe,
      "search" : this.queryParams.search,
      "sortedCol" : this.queryParams.sortedCol,
      "sortDirection" : this.queryParams.sortDirection,
      "CreatedBy" : this.queryParams.CreatedBy,
      "Number" : this.queryParams.Number,
      "Title" : this.queryParams.Title,
      'Chairperson' : this.queryParams.Chairperson,
      'commitee' : this.queryParams.commitee
    };
  }

  private handleLangChange() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateService.currentLang;
        this.status = [
          { id: 1, label: this.translateService.instant('Meetings.Draft') },
          {
            id: 2,
            label: this.translateService.instant('Meetings.UnderReview'),
          },
          { id: 3, label: this.translateService.instant('Meetings.Approved') },
          // { id: 4, label: this.translateService.instant('Meetings.Closed') },
        ];
        this.MeetingActions = [
          {
            item: this.translateService.instant('shared.edit'),
            disabled: false,
            textColor: '',
            icon: '',
          },
          {
            item: this.translateService.instant('shared.delete'),
            disabled: false,
            textColor: '',
            icon: '',
          },
        ];
        if (this.statistics) {
          this.strucutureStatistics()
        }
        this.editLabel = this.translateService.instant('shared.edit');
        this.deleteLabel = this.translateService.instant('shared.delete');
        this.options = [
          {
            item: this.editLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bxs-edit',
          },
          {
            item: this.deleteLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bx-trash',
          },
        ];
      });
    // this.editLabel = this.translateService.instant('shared.edit');
    // this.deleteLabel = this.translateService.instant('shared.delete');
    // this.options = [
    //   {
    //     item: this.editLabel,
    //     disabled: false,
    //     textColor: '',
    //     icon: 'bx bxs-edit',
    //   },
    //   {
    //     item: this.deleteLabel,
    //     disabled: false,
    //     textColor: '',
    //     icon: 'bx bx-trash',
    //   },
    // ];
  }

  private getUsers() {
    const body = {
      pageIndex: 1,
      pageSize: 2000,
    };
    this.httpSer
      .get(Config.UserManagement.GetAll, body)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  private getStatistics() {
    this.httpSer
      .get(Config.meetings.getStats)
      // .pipe(takeUntil(this.endSub$))
      .subscribe((stats) => {
        this.statistics = stats;
       // console.log('st' , this.statistics)

        this.strucutureStatistics();
      });
  }

  private strucutureStatistics() {
    //console.log(this.statistics)
    this.structuredStatistics = [
      // {

      //   title: this.translateService.instant('Meetings.Closed'),
      //   bgColor: '#F1F1F1',
      //   count: this.statistics.closedCount,
      // },

      {
        title: this.translateService.instant('Meetings.total'),
        bgColor: '#82c3f7',
        count: this.statistics.allCount,
      },

      {
        title: this.translateService.instant('Meetings.Draft'),
        bgColor: 'rgba(35, 31, 32, 0.2)',
        count: this.statistics.draftCount,
      },
      {
        title: this.translateService.instant('Meetings.underReview'),
        bgColor: 'rgb(254 214 0 / 68%)',
        count: this.statistics.underReviewCount,
      },
      {
        title: this.translateService.instant('Meetings.Approved'),
        bgColor: 'rgba(0, 219, 153, 0.2)',
        count: this.statistics.approvedCount,
      },
      {
        title: this.translateService.instant('Meetings.myAcions'),
        bgColor: 'rgb(251 193 3 / 29%)',
        count: `${this.statistics.myActionsNewCount
          } ${this.translateService.instant('Meetings.Open')} / ${this.statistics.myActionsClosedCount
          } ${this.translateService.instant('Meetings.Closed')}`,
      },
    ];
  }

  private getMeetingsList() {
    this.loadingMeetings = true;
    this.httpSer
      .get(
        `${Config.meetings.getAll}?PageIndex=${this.paginationModle.pageIndex}&PageSize=${this.paginationModle.pageSize}&DateFrom=${this.queryParams.startDate}&DateTo=${this.queryParams.endDate}&Status=${this.queryParams.status}&Initiator=${this.queryParams.initiator}&OnlyMe=${this.queryParams.onlyMe}&SearchText=${this.queryParams.search}&sortDirection=${this.queryParams.sortDirection}&sortBy=${this.queryParams.sortedCol}${this.queryParams.CreatedBy ? '&CreatedBy=' + this.queryParams.CreatedBy : ''}${this.queryParams.Number ? '&Number=' + this.queryParams.Number : ''}${this.queryParams.Title ? '&Title=' + this.queryParams.Title : ''}${this.queryParams.Chairperson ? '&Chairperson=' + this.queryParams.Chairperson : ''}${this.queryParams.commitee ? '&CommiteeId=' + this.queryParams.commitee : ''}`
      )
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loadingMeetings = false))
      )
      .subscribe((res: viewMeetingsRes) => {
        if (res) {
          if (res.statitics) {
            this.statistics = res.statitics;
            this.strucutureStatistics()
          }
          if (res.meetings) {
            this.totalCount = res.meetings.count;
            this.meetings = res.meetings.data;
          }
        }
      });
  }

  public deleteMeeting(meeting: iMeetingsView) {
    this.meetingIdToDelete = meeting.id;
    this.confirmMsg = `${this.translateService.instant(
      'Meetings.deleteMeeting'
    )} "${meeting.title}"?`;
    this.confirmationPopupService.open('delete-meeting');
  }

  public onDeleteMeetingConfirmed() {
    this.confirmationPopupService.close('delete-meeting');
    this.httpSer
      .delete(`${Config.meetings.delete}/${this.meetingIdToDelete}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.toastSer.success(this.translateService.instant('Meetings.deleteSuccessMsg'));
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: this.getQueryParams(),
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            }
          );
          let indx = this.meetings.findIndex(obj => obj.id == this.meetingIdToDelete);
          this.meetings.splice(indx, 1);
          this.totalCount--;
          // this.getMeetingsList();
        }
      });
  }

  public onPaginate(e) {
    this.paginationModle.pageIndex = e;
    this.getMeetingsList();
  }

  // Methods
  public navigateToAddMeetingPage() {
    this.router.navigate(['/meetings/meeting-form']);
  }

  public navigateToEdit(meeting: iMeetingsView) {
    this.router.navigate([`/meetings/meeting-form/${meeting.id}`]);
  }

  // Filters
  public handleStatusesFilter(state: { label: string; id: string }) {
    this.queryParams.status = state ? state.id : '';
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getMeetingsList();
  }

  public handleSearchFilter(keyword: string) {
    this.queryParams.search = keyword;
    this.resetPagination();
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getMeetingsList();
  }

  public handleCreatedByFilter(user: any) {
    this.queryParams.initiator = user ? user.id : '';
    this.resetPagination();
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getMeetingsList();
  }

  public handleDateFilter(date: any) {
    // debugger
    let isChange: boolean = this.queryParams.startDate !== date?.startDate || this.queryParams.endDate !== date?.endDate;
    if (date || (this.queryParams.startDate && this.queryParams.endDate)) {
      this.queryParams.startDate = date.startDate ?? '';
      this.queryParams.endDate = date.endDate ?? '';
    } else {
      this.queryParams.startDate = '';
      this.queryParams.endDate = '';
    }
    if (isChange) {
      this.resetPagination();
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: this.getQueryParams(),
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
      // this.getMeetingsList();
    }

  }

  public handleOnlyMeFilter(e) {
    this.queryParams.onlyMe = e;
    this.resetPagination();
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // debugger
    // this.getMeetingsList();
  }

  private resetPagination() {
    this.paginationModle.pageIndex = 1;
  }

  // Getter & setters

  public getStatusText(state: MeetingStatus): string {
    return this.translateService.instant('Meetings.' + MeetingStatus[state]);
  }

  public isDraftedMeeting(state: MeetingStatus): boolean {
    return state === MeetingStatus.Draft;
  }

  public getStatusClassName(state: MeetingStatus): string {
    if (state === MeetingStatus.Approved) {
      return 'active';
    } else if (state === MeetingStatus.Closed) {
      return 'closed';
    } else if (state === MeetingStatus.Draft) {
      return 'cancelled';
    } else {
      return 'Warning';
    }
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  // Offset between UTC Date & LocalDate
  public getOffset() {
    let ddate = new Date()
    return ddate.getTimezoneOffset() / 60;
  }

  onOptionSelect(e, meeting) {
    if (e === this.editLabel) {
      this.navigateToEdit(meeting);
    } else if (e === this.deleteLabel) {
      this.deleteMeeting(meeting);
    }

  }

  public export() {
    if (this.loadingMeetings) return;
    this.isDownloading = true;

    let data = {
      DateFrom: this.queryParams.startDate || null,
      DateTo: this.queryParams.endDate || null,
      Status: this.queryParams.status || null,
      Initiator: this.queryParams.initiator || null,
      OnlyMe: this.queryParams.onlyMe || false,
      SearchText: this.queryParams.search ? this.queryParams.search : null,
      TimeZoneOffset: this.getOffset()
    }

    let url = `${Config.meetings.exportExcel}`;
    this.exportFilesService.exportData("POST", url, 'Meetings.xlsx', data).finally(() => {
      this.isDownloading = false;
    })
  }

  sort(col: MOMSortBy) {
    if (this.queryParams.sortedCol === col) {
      if (this.queryParams.sortDirection === MOMSortDirections.asc) this.queryParams.sortDirection = MOMSortDirections.desc
      else this.queryParams.sortDirection = MOMSortDirections.asc
    } else {
      this.queryParams.sortDirection = MOMSortDirections.asc
    }
    this.queryParams.sortedCol = col;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  public get ascMode(): boolean {
    return this.queryParams.sortDirection === MOMSortDirections.asc
  }

  public get DescMode(): boolean {
    return this.queryParams.sortDirection === MOMSortDirections.desc
  }

  openAdvancedFilterPopup(){
    this.isAdvancedFilterModalOpen = true;
    this.modelService.open('filter-item');
  }

  advancedFilter(filter){
    if (filter) {
      this.queryParams = {
        ...this.queryParams,
        ...filter
      };
    }
    this.queryParams.appliedFiltersCount = Object.values(filter).filter(val => val != null && val != 0).length;
    this.paginationModle.pageIndex = 1;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  closeModal() {
    this.modelService.close();
    this.isAdvancedFilterModalOpen = false;
  }

}
