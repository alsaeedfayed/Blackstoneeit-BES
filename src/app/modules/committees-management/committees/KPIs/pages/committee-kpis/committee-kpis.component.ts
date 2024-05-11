import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'src/app/core/config/api.config';
import { KPI } from 'src/app/modules/committees-management/requests/models/KPI';
import { KpiService } from 'src/app/modules/committees-management/requests/services/KpiServie/kpi.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';

@Component({
  selector: 'app-committee-kpis',
  templateUrl: './committee-kpis.component.html',
  styleUrls: ['./committee-kpis.component.scss']
})
export class CommitteeKPIsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  KPisLoading: boolean = true;
  loading: boolean = false;

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

  //KPI model vars
  isKPIModelOpened: boolean = false;
  selectedKPI: KPI = null
  deletedName: string = null;

  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id;
    // fetch all kpis
    this.committeeId && this.getAllKPIs();
  }
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private kpiService: KpiService,
    private modelService: ModelService,
    private toastr: ToastrService,
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

  // fetch all KPIs
  private getAllKPIs() {
    this.KPisLoading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch decisions
    this.httpSer
      .get(`${Config.CommitteeKpi.GetAllByCommitteeId}/${this.committeeId}`, query)
      .pipe(finalize(() => { this.KPisLoading = false; this.loading = false }))
      .subscribe((res) => {
        if (res) {
          // total items count
          this.totalItems = res?.count;

          // all items list
          this.list = res?.data;
        }
      });
  }
  // // open new KPI model
  // openNewKPIModel(item: any = null) {
  //   this.selectedKPI = item;
  //   this.isKPIModelOpened = true;
  //   this.modelService.open('new-committee-kpi');
  // }

  // // close new KPI model
  // closeNewKPIModel() {
  //   // this.onAdd.emit(this.KPIs.length > 0);
  //   this.isKPIModelOpened = false;
  //   this.selectedKPI = null;
  //   this.modelService.close();
  // }
  isDownloading: boolean = false;
  public exportDataAsPDF() {

    // check if the button has been clicked
    if (this.isDownloading) return;
    this.isDownloading = true;


    let url = `${Config.Dashboard.ExportKPIs}?Id=${this.committeeId}`;
    const body = {

      ...this.filterData,
    };
    this.exportFilesService.exportData('POST', url, 'KPIs.pdf', body)
      .finally(() => {
        this.isDownloading = false;
      });
  }

  // // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all kpis
    this.getAllKPIs();
  }

  // handel kpis filter
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

      delete this.filterData.measurementRecurrence;
      delete this.filterData.targetFrom;
      delete this.filterData.targetTo;
      delete this.filterData.weightFrom;
      delete this.filterData.weightTo;
      delete this.filterData.sortKey;
      delete this.filterData.sortDirection;

      this.paginationModel.pageIndex = 1;
      this.getAllKPIs();
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
      this.getAllKPIs();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.filterData = this.tempFilterData;
    this.paginationModel.pageIndex = 1;
    this.getAllKPIs();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }
  exportList() {
    if (this.isDownloading) return;
    this.isDownloading = true;
    const body = {
      ...this.filterData,
    };

    body.pageIndex = 1;
    //temp
    body.pageSize = 1000000000;
    let url = `${Config.CommitteeKpi.ExportExcel}/${this.committeeId}`;
    this.exportFilesService.exportData("POST", url, 'Kpi.xlsx', body).finally(() => {
      this.isDownloading = false;
    })
  }
}
