import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { ImageService } from 'src/app/shared/PersonItem/image.service';

@Component({
  selector: 'app-committee-work-groups',
  templateUrl: './committee-work-groups.component.html',
  styleUrls: ['./committee-work-groups.component.scss']
})
export class CommitteeWorkGroupsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  filtersLoading: boolean = true;

  // filtration properties
  searchValue: string = '';
  tempFilterData: any = {};
  filterData: any = {};
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;
  ableToAddNewGroup: boolean = false;

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // all items list
  list: [] = [];
  committeeId: string = '';
  objectives: any = [];
  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id;
    this.objectives = val?.objectives;

    // fetch all work groups
    this.committeeId && this.getAllWorkGroups();
  }

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

    // fetch all work groups
    this.getAllWorkGroups();
  }

  // fetch all work groups
  private getAllWorkGroups() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch work groups
    this.httpSer
      .get(`${Config.WorkGroup.GetAllByCommitteeId}/${this.committeeId}`, query)
      .pipe(finalize(() => { this.loading = false; this.filtersLoading = false }))
      .subscribe((res) => {
        if (res) {

          //activation of creation of new workgroup
          this.ableToAddNewGroup = res?.canAddWorkgroup;
          // total items count
          this.totalItems = res?.workgroups?.count;
          // all items list
          this.list = res?.workgroups?.data;

          this.list.forEach((workgroup: any) => {
            if (workgroup.members) {
              workgroup.members.forEach((member) => {
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

  // go to create work group page
  goToCreateWorkGroup() {
    this.router.navigateByUrl(`committees-management/committee/${this.committeeId}/groups/new`);
  }

  // handel work groups filter
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
      delete this.filterData.objectiveId;
      delete this.filterData.sortKey;
      delete this.filterData.sortDirection;

      this.paginationModel.pageIndex = 1;
      this.getAllWorkGroups();
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
      this.getAllWorkGroups();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllWorkGroups();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }
}
