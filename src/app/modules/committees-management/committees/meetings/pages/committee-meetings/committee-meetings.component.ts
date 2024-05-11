import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { RoutesVariables } from '../../../../routes';
import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';

@Component({
  selector: 'app-committee-meetings',
  templateUrl: './committee-meetings.component.html',
  styleUrls: ['./committee-meetings.component.scss']
})
export class CommitteeMeetingsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  filtersLoading: boolean = true;
  committeeId: string = "";

  // filtration properties
  searchValue: string = '';
  tempFilterData: any = {};
  filterData: any = {};
  selectedStatus: number = -1;
  toggleClicked: boolean = false;
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // all items list
  list: [] = [];

  meetingsViewMode = 'list';

  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id;
    // fetch all meetings
    this.committeeId && this.getAllMeetings();
  }

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all meetings
    this.getAllMeetings();
  }

  // fetch all meetings
  private getAllMeetings() {
    this.loading = true;

    const query = {
      ...this.filterData,
    };
    if (this.meetingsViewMode == 'list') {
      query.pageIndex = this.paginationModel.pageIndex;
      query.pageSize = this.paginationModel.pageSize;
    } else {
      query.pageIndex = 1;
      query.pageSize = 100000000;
    }

    // send a request to fetch meetings
    this.httpSer
      .get(`${Config.Meeting.GetAllByCommitteeId}/${this.committeeId}`, query)
      .pipe(finalize(() => { this.loading = false; this.filtersLoading = false }))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res?.data;
        }
      });
  }

  // go to create meeting page
  goToCreateMeeting() {
    let createPath = `${RoutesVariables.Root}/${RoutesVariables.Meeting.Create}`.replace(':committeeId', this.committeeId)
    this.router.navigateByUrl(createPath);
  }

  // handel meetings filter
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      };
    }
    this.emptyFIlters = false;
    if (this.toggleClicked ) {
      this.toggleClicked = false;
      setTimeout(() => this.onSearchBtnCLicked());
    }
  }

  // Clear filters Data
  clearFilter() {
    this.selectedStatus = -1;

    if (!this.emptyFIlters) {
      this.emptyFIlters = true;

      delete this.filterData.status;
      delete this.filterData.locationType;

      this.paginationModel.pageIndex = 1;
      this.getAllMeetings();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
  }

  // get under review meetings
  getUnderReviewMeetings(isUnderReview: boolean) {
    this.toggleClicked = true;
    this.selectedStatus = isUnderReview ? MeetingStatus.UnderReview : -1;
  }

  // get search String from search input
  onSearch(searchString: string) {
    let searchFlag: boolean = false;

    if (searchString.trim() != '') {
      this.filterData = {
        ...this.filterData,
        "searchKey": searchString
      }
      searchFlag = true;
    } else {
      delete this.filterData.searchKey;
      searchFlag = true;
    }

    if (searchFlag) {
      this.paginationModel.pageIndex = 1;
      this.getAllMeetings();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllMeetings();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  // change items view mode
  changeViewMode(mode: string) {
    this.meetingsViewMode = mode;
    this.getAllMeetings();
  }

}
