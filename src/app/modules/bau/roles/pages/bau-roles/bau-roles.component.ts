import { RoleSortBy } from 'src/app/modules/bau/enums/enums';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Permissions } from 'src/app/core/services/permissions';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { sortDirections } from 'src/app/modules/roles/components/roles-table/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Subject } from 'rxjs';
import { Role } from '../../models/Role';

@Component({
  selector: 'app-bau-roles',
  templateUrl: './bau-roles.component.html',
  styleUrls: ['./bau-roles.component.scss']
})
export class BauRolesComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  isLoading: boolean = true;

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

  // roles list
  roles: Role[] = [];

  canAddRole: boolean = true;
  addRolePermission = Permissions.BAU.Roles.create;

  public orderBy: RoleSortBy | null = null;
  public orderType: sortDirections = sortDirections.Asc;

  // modal properties
  isNewModalOpen: boolean = false;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,

  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch roles
    this.getAllRoles()
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all roles matching search criteria
  handleSearchValueFilter(search: string) {
    this.searchValue = search;

    // reset pagination
    this.paginationModel.pageIndex = 1;

    // fetch all roles
    this.getAllRoles();
  }

  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.orderBy = filter.orderBy;
      this.orderType = filter.orderType;
    }

    this.filterData = {
      ...this.filterData,
      ...filter
    };

    // fetch all roles
    this.getAllRoles();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all roles
    this.getAllRoles();
  }

  // fetch all roles
  private getAllRoles() {
    this.isLoading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    // send a request to fetch roles
    this.httpSer
      .get(Config.BAU.Roles.getRoles, query)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          // all items list
          this.roles = res?.data;
          // count
          this.totalItems = res?.total;
        }
      });
  }


  // handel roles filter
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

      delete this.filterData.sectorId;
      delete this.filterData.departmentId;
      delete this.filterData.sectionId;

      this.paginationModel.pageIndex = 1;
      this.getAllRoles();
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
        "keyword": searchString
      }
      searchFlag = true;
    } else {
      delete this.filterData.keyword;
      searchFlag = true;
    }

    if (searchFlag) {
      this.paginationModel.pageIndex = 1;
      this.getAllRoles();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    this.getAllRoles();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  // open new role model
  openNewRoleModel() {
    this.modelService.open('new-role');
    this.isNewModalOpen = true;
  }

  closeModal() {
    this.modelService.close();
    this.isNewModalOpen = false;
  }

  onChanges() {
    this.isNewModalOpen = false;
    // reset pagination
    this.paginationModel.pageIndex = 1;

    // fetch all roles
    this.getAllRoles();
  }
}
