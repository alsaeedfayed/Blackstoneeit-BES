import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Config } from 'src/app/core/config/api.config';
import { Router } from '@angular/router';
import { RequestsSortBy, sortDirections } from 'src/app/modules/committees-management/enums/enums';
import { RoutesVariables } from '../../../routes';
import { Permissions } from 'src/app/core/services/permissions';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

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

  createCommitteePermission =  Permissions.Committees.Requests.create;
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
    this.getAllRequests();
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
    this.getAllRequests();
  }

  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.sortKey;
      this.sortDirection = filter.sortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter
    };

    // fetch all requests
    this.getAllRequests();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all requests
    this.getAllRequests();
  }

  // fetch all requests
  private getAllRequests() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch requests
    this.httpSer
      .get(Config.CommitteesManagement.GetAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          // analytics properties
          this.totalRequests = res?.totalRequests;
          this.pendingRequests = res?.pendingRequests;
          this.rejectedRequests = res?.rejectedRequests;
          this.approvedRequests = res?.approvedRequests;

          // total items count
          this.totalItems = res?.committees?.count;

          // all items list
          this.list = res?.committees?.data;
        }
      });
  }

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
      delete this.filterData.status;
      delete this.filterData.chairman;
      delete this.filterData.committeeType;
      this.paginationModel.pageIndex = 1;
      this.getAllRequests();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
  }

  // get assigned to me Committees
  getMyCommittees(isAssignToMe: boolean) {
    if (isAssignToMe) {
      this.filterData = {
        ...this.filterData,
        "assignedToMe": true
      }
    } else {
      delete this.filterData.assignedToMe;
    }
    this.paginationModel.pageIndex = 1;
    this.getAllRequests();
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
      this.getAllRequests();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    this.getAllRequests();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }
}
