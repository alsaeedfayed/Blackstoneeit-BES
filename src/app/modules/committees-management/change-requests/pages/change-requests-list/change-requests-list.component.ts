import { Component, OnInit } from '@angular/core';
import { RoutesVariables } from '../../../routes';
import { Config } from 'src/app/core/config/api.config';
import { finalize, takeUntil } from 'rxjs/operators';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RequestsSortBy, sortDirections } from '../../../enums/enums';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-change-requests-list',
  templateUrl: './change-requests-list.component.html',
  styleUrls: ['./change-requests-list.component.scss']
})
export class ChangeRequestsListComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  //statisticsLoader : boolean = true;

  // filtration properties
  searchValue: string = '';
  filterData: any = {};
  tempFilterData: any = {};
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // analytics properties
  totalRequests: number = 0;
  pendingRequests: number = 0;
  rejectedRequests: number = 0;
  approvedRequests: number = 0;

  // all items list
  list: [] = [];

  public sortedCol: RequestsSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch all requests
    this.getAllChangeRequests();

    // fetch all CRs
    this.getAllChangeRequests()

    // fetch statistics
  //  this.getStatistics()

  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all requests matching search criteria
  handleSearchValueFilter(search: string) {
    this.searchValue = search;

    // reset pagination
    this.paginationModel.pageIndex = 1;

    // fetch all requests
    this.getAllChangeRequests();
  }

  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.SortKey;
      this.sortDirection = filter.SortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter
    };

    // fetch all requests
    this.getAllChangeRequests();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all requests
    this.getAllChangeRequests();
  }

  // fetch all change requests
  private getAllChangeRequests(){
    this.loading = true


    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch requests
    this.httpSer
      .get(Config.chnageRequest.getAllCR, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.totalRequests = res?.totalCount;
          this.pendingRequests = res?.pendingCount;
          this.rejectedRequests = res?.rejectedCount;
          this.approvedRequests = res?.approvedCount;

          // total items count
          this.totalItems = res?.changeRequests?.count;
          // all items list
          this.list = res?.changeRequests?.data;
        }
      });

  }

  // fetch all statistics
  // private getStatistics() {

  //   const query = {
  //     pageIndex: this.paginationModel.pageIndex,
  //     pageSize: this.paginationModel.pageSize,
  //     ...this.filterData,
  //   };

  //   // send a request to fetch requests
  //   this.httpSer
  //     .get(Config.chnageRequest.getStatistics, query)
  //     .pipe(finalize(() => (this.statisticsLoader = false)))
  //     .subscribe((res) => {
  //       if (res) {
  //         // analytics properties
  //         this.totalRequests = res?.totalCount;
  //         this.pendingRequests = res?.pendingCount;
  //         this.rejectedRequests = res?.rejectedCount;
  //         this.approvedRequests = res?.approvedCount;
  //       }
  //     });


  // }


  // go to add committee page
  goToAddCommittee() {
    this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}/${RoutesVariables.Requests.Create}`);
  }

  // handel requests filter
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      }
    }
    this.emptyFIlters = false;
  }

  // Clear filters Data
  clearFilter() {
    if (!this.emptyFIlters) {
      this.emptyFIlters = true;
      delete this.filterData.Status;
      delete this.filterData.Chairman;
      delete this.filterData.CommitteeId;
      delete this.filterData.CreationFrom;
      delete this.filterData.CreationTo;
      this.paginationModel.pageIndex = 1;
      this.getAllChangeRequests();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
  }

  // get assigned to me Committees
  getMyCommittees(isAssignToMe: boolean) {
    if (isAssignToMe) {
      this.filterData = {
        ...this.filterData,
        "AssignedToMe": true
      }
    } else {
      delete this.filterData.AssignedToMe;
    }
    this.paginationModel.pageIndex = 1;
    this.getAllChangeRequests();
  }

  // get search String from search input
  onSearch(searchString: string) {
    let searchFlag: boolean = false;

    if (searchString.trim() != '') {
      this.filterData = {
        ...this.filterData,
        "SearchKey": searchString
      }
      searchFlag = true;
    } else {
      delete this.filterData.SearchKey;
      searchFlag = true;
    }

    if (searchFlag) {
      this.paginationModel.pageIndex = 1;
      this.getAllChangeRequests();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    this.getAllChangeRequests();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }
}
