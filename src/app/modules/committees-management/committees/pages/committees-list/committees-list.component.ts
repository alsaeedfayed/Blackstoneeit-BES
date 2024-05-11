import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/PersonItem/image.service';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { Permissions } from 'src/app/core/services/permissions';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.scss']
})
export class CommitteesListComponent extends ComponentBase implements OnInit {

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

  // all items list
  list: [] = [];
  createCommitteePermission =  Permissions.Committees.Requests.create;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private imageService: ImageService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch all committees
    this.getAllCommittees();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all committees matching search criteria
  handleSearchValueFilter(search: string) {
    this.searchValue = search;

    // reset pagination
    this.paginationModel.pageIndex = 1;

    // fetch all committees
    this.getAllCommittees();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all committees
    this.getAllCommittees();
  }

  // fetch all committees
  private getAllCommittees() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch committees
    this.httpSer
      .get(Config.CommitteesManagement.GetList, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res?.data;
          this.list.forEach((committee: any) => {
            if (committee.members) {
              committee.members.forEach((member) => {
                if (member.fileName?.length > 0) {
                  member.image = null;
                  this.imageService.setFileURL(member.fileName).subscribe(imgUrl => {

                    // add member image to the member object
                    member.image = imgUrl[0]?.fileUrl;
                  });
                }
              });
            }
          });
        }
      });
  }

  // go to add committee page
  goToAddCommittee() {
    this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}/${RoutesVariables.Requests.Create}`);

  }

  // handel committees filter
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter
      };
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
      this.getAllCommittees();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
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
      this.getAllCommittees();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllCommittees();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }
}
