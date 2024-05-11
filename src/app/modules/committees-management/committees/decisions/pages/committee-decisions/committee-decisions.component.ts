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
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-committee-decisions',
  templateUrl: './committee-decisions.component.html',
  styleUrls: ['./committee-decisions.component.scss']
})
export class CommitteeDecisionsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  loading: boolean = true;
  loadingDecisions: boolean = true;

  committeeId: string = "";

  // filtration properties
  searchValue: string = '';
  tempFilterData: any = {};
  filterData: any = {};
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

  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id;
    // fetch all decisions
    this.committeeId && this.getAllDecisions();
  }

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private exportFilesService: ExportFilesService

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

    // fetch all decisions
    this.getAllDecisions();
  }

  // fetch all decisions
  private getAllDecisions() {
    this.loadingDecisions = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch decisions
    this.httpSer
      .get(`${Config.Decision.GetAllByCommitteeId}/${this.committeeId}`, query)
      .pipe(finalize(() => { this.loadingDecisions = false; this.loading = false }))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res?.data;
        }
      });
  }

  // go to create decision page
  goToCreateDecision() {
    let createPath = `/committees-management/${RoutesVariables.Decision.Create}`.replace(':committeeId', this.committeeId)
    this.router.navigateByUrl(createPath);
  }

  // handel decisions filter
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
      delete this.filterData.sortKey;
      delete this.filterData.sortDirection;

      this.paginationModel.pageIndex = 1;
      this.getAllDecisions();
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
      this.getAllDecisions();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllDecisions();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }


  //export descisions
  isDownloading: boolean = false
  exportList() {
    // check if the button has been clicked
    if (this.isDownloading) return;
    this.isDownloading = true;
    const body = {
      ...this.filterData,
    };
    //TODO Add route
    let url = `${Config.CommitteeEvaluations.ExportExcel}`;

    this.exportFilesService.exportData('POST', url, 'decisions.pdf', body)
      .finally(() => {
        this.isDownloading = false;
      });
  }


}
