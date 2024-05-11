import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'src/app/core/config/api.config';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { committeeAudits } from '../../../models/committeeAudits';

@Component({
  selector: 'app-committee-evaluation',
  templateUrl: './committee-evaluation.component.html',
  styleUrls: ['./committee-evaluation.component.scss']
})
export class CommitteeEvaluationComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false; // TODO: true
  filtersLoading: boolean = false; // TODO: true
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

  showDateRangeValidator: boolean = false
  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // all items list
  list: committeeAudits;

  auditsViewMode = 'list';

  @Input() public set committeeDetails(val: any) {
    if(val){

      this.committeeId = val?.id;

    // fetch all meetings
    this.committeeId && this.getAllAudits();
    }
  }

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute : ActivatedRoute
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    this.getAllAudits()
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
    this.getAllAudits();
  }

  // fetch all audits
  private getAllAudits() {
    this.loading = true;

    const query = {
      ...this.filterData,
    };
    if (this.auditsViewMode == 'list') {
      query.pageIndex = this.paginationModel.pageIndex;
      query.pageSize = this.paginationModel.pageSize;
    } else {
      query.pageIndex = 1;
      query.pageSize = 100000000;
    }
   // console.log('query' , query)

    // send a request to fetch meetings
    this.httpSer
      .get(`${Config.CommitteeEvaluations.GetAudit}/${this.committeeId}`, query)
      .pipe(finalize(() => { this.loading = false; this.filtersLoading = false }))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res;
        }
      });
  }

  // go to create meeting page
  goToCreateMeeting() {
    // let createPath = `${RoutesVariables.Root}/${RoutesVariables.Meeting.Create}`.replace(':committeeId', this.committeeId)
    // this.router.navigateByUrl(createPath);
  }

  // handel meetings filter
  handelFilter(filter: any) {


   // console.log('filter vals' , filter)
    if (filter) {
      this.filterData = filter
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      }
    }
    this.emptyFIlters = false;

    if (this.toggleClicked) {
      this.toggleClicked = false;
      setTimeout(() => this.onSearchBtnCLicked());
    }
  }

  // Clear filters Data
  clearFilter() {
    this.showDateRangeValidator = false;
    this.selectedStatus = -1;
    if (!this.emptyFIlters) {
      this.emptyFIlters = true;

      delete this.filterData.status;
      delete this.filterData.committeeId;
      delete this.filterData.year;
      // delete this.filterData.from;
      // delete this.filterData.to;
     // console.log('fi ,' , this.filterData)

      this.paginationModel.pageIndex = 1;
      this.getAllAudits();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
  }

  // get committees need MOM review
  getCommitteesNeedMomReview(isNeedMomReview: boolean) {
    this.toggleClicked = true;
    this.selectedStatus = isNeedMomReview ? 5 : -1;
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
      this.getAllAudits();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {

    //this.filterData = this.tempFilterData;
    if ((new Date(this.filterData.from)) > (new Date(this.filterData.to)) && this.filterData.from && this.filterData.to) {
      this.showDateRangeValidator = true
      return
    }

    else {
      this.paginationModel.pageIndex = 1;
      this.getAllAudits();
      this.appliedFiltersCount = this.filtersCount;
      this.showDateRangeValidator = false;
    }
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  // change items view mode
  changeViewMode(mode: string) {

    this.auditsViewMode = mode;
    this.getAllAudits();
  }

}

