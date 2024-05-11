import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { finalize, takeUntil } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { HttpHandlerService } from "./../../core/services/http-handler.service";
import { followUpSortBy, followUpSortDirections } from "./Enums/enums";
import { StructureLookups } from "src/app/utils/loockups.utils";
import { ExportFilesService } from "src/app/shared/services/export-files/export-files.service";

@Component({
  selector: "app-follow-up",
  templateUrl: "./follow-up.component.html",
  styleUrls: ["./follow-up.component.scss"],
})
export class FollowUpComponent extends ComponentBase implements OnInit {
  loading: boolean = true;
  isDownloading: boolean = false;
  cardsLoading: boolean = true;
  closureRate: number = 0;
  delayedRate: number = 0;
  responseRate: number = 0;
  openedCount: number = 0;
  totalCount: number = 0;
  closedCount: number = 0;
  delayedCount: number = 0;
  onTrackCount: number = 0;

  allowAdd: boolean = false;
  list: any[] = [];
  language: string = this.translate.currentLang;
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 10,
  };
  public sortedCol: followUpSortBy | null = followUpSortBy.CreationDate;
  public sortDirection: followUpSortDirections = followUpSortDirections.desc;
  filterData: any = {};
  appliedFiltersCount: number = 0;
  types: any[] = [];
  search: string = "";
  isAddClicked: boolean = false;
  isAdvancedFilterClicked: boolean = false;
  progressFormat = (percent: number): string => `${percent}%`;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private modelService: ModelService,
    private httpHandlerService: HttpHandlerService,
    private exportFilesService: ExportFilesService
  ) {
    super(translateService, translate);

    this.modelService.closeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isAddClicked = false));
  }

  ngOnInit(): void {
    this.getLookups();
      this.handleLangChange();
      this.getCounts();
      this.getAllFollowups();
  }

  getLookups() {
    this.loading = true;
    const queryServiceDesk = {
      ServiceName: "ServiceDesk",
    };
    //const Lookups = this.httpHandlerService.get(Config.Lookups.lookupService, queryServiceDesk);

    // const sector = this.http.get(Config.FollowUp.GetMyHirerchy)
    // const commitee = this.http.get(Config.Committees.GetAllActive);
    //const hirerchy = this.httpHandlerService.get(Config.FollowUp.GetMyHirerchy);
    //  forkJoin({ Lookups, sector, hirerchy, commitee })
    // forkJoin({ Lookups, hirerchy })
    //forkJoin({ Lookups })
    this.httpHandlerService.get(Config.Lookups.lookupService, queryServiceDesk)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        // this.sector = res.hirerchy;
        // this.lookupsMeetingType = StructureLookups(res?.Lookups)?.TaskType;
        this.types = StructureLookups(res)?.TaskType;
        // this.types = StructureLookups(res?.Lookups)?.TaskType;

        // this.types.emit(this.lookupsMeetingType);
        //  this.commitee = res.commitee;
        // this.handelOldValue()
      });
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.language = language.lang;
      //  this.getAllFollowups();
    });
  }

  openPopup() {
    this.isAddClicked = true;
    this.modelService.open("follow-up-item");
  }

  closeFollowUpItemModel() {
    this.isAddClicked = false;
    this.modelService.close();
  }

  handelTypes(types: any) {
    this.types = types;
  }

  handleSearchValueFilter(search: string) {
    this.search = search;
    this.getAllFollowups();
    this.getCounts();
  }

  onAssignedToMeChange(e) {
    this.filterData.assignedToMe = e;

    this.paginationModel.pageIndex = 1;

    this.getAllFollowups();
    this.getCounts();
  }

  handelFilter(filter: any) {
    if (filter) {
      this.filterData = {
        ...this.filterData,
        ...filter,
      };
    }

    this.appliedFiltersCount = Object.values(filter).filter(
      val => val != null
    ).length;

    this.paginationModel.pageIndex = 1;
    this.getAllFollowups();
    this.getCounts();
  }

  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.SortBy;
      this.sortDirection = filter.SortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter,
    };

    this.getAllFollowups();
    this.getCounts();
  }

  handlePaginationchange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;
    this.getAllFollowups();
    this.getCounts();
  }

  refreshData(resetPagination: boolean = false) {
    if (resetPagination) {
      this.paginationModel.pageIndex = 1;
    }

    this.getAllFollowups();
    this.getCounts();
  }

  private getCounts() {
    this.cardsLoading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
      searchKey: this.search,
      ...(!this.filterData.hasOwnProperty("SortDirection") && {
        SortDirection: followUpSortDirections.desc,
      }),
      ...(!this.filterData.hasOwnProperty("SortBy") && {
        SortBy: followUpSortBy.CreationDate,
      }),
    };
    this.httpHandlerService
      .get(Config.FollowUp.GetCardsCount, query)
      .pipe(finalize(() => (this.cardsLoading = false)))
      .subscribe(res => {
        if (res) {
          this.totalCount = res.count;
          this.closureRate = res.closureRate;
          this.delayedRate = res.delayedRate;
          this.responseRate = res.onTrackRate;
          this.openedCount = res.openCount;
          this.closedCount = res.closedCount;
          this.delayedCount = res.delayedCount;
          this.onTrackCount = res.onTrackCount;
        }
      });
  }

  private getAllFollowups() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
      searchKey: this.search,
      ...(!this.filterData.hasOwnProperty("SortDirection") && {
        SortDirection: followUpSortDirections.desc,
      }),
      ...(!this.filterData.hasOwnProperty("SortBy") && {
        SortBy: followUpSortBy.CreationDate,
      }),
    };

    this.httpHandlerService
      .get(Config.FollowUp.Get, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res) {
          // this.closureRate = res.closureRate;
          // this.delayedRate = res.delayedRate;
          // this.responseRate = res.onTrackRate;
          // this.openedCount = res.openCount;
          // this.closedCount = res.closedCount;
          // this.delayedCount = res.delayedCount;
          // this.onTrackCount = res.onTrackCount;
          this.totalItems = res.paginationCount;
          this.allowAdd = res.canAddFollowUpItem;
          this.list = res.followUpItems;
          this.list?.map(item => {
            item.creator = { ...item.creator, fileName: null };
            item.owner = { ...item.owner, fileName: null };
          });
        }
      });
  }

  openAdvancedFilterPopup() {
    this.modelService.open("filter-item");
    this.isAdvancedFilterClicked = true;
  }

  public export() {
    if (this.isDownloading) return;
    this.isDownloading = true;

    const data = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
      dueDate: {
        dateFrom: this.filterData["DueDate.dateFrom"] || null,
        dateTo: this.filterData["DueDate.dateTo"] || null,
      },
      creationDate: {
        dateFrom: this.filterData["CreationDate.DateFrom"] || null,
        dateTo: this.filterData["CreationDate.dateTo"] || null,
      },
      closeDate: {
        dateFrom: this.filterData["CloseDate.DateFrom"] || null,
        dateTo: this.filterData["CloseDate.DateTo"] || null,
      },
      searchKey: this.search,
    };
    delete data["DueDate.dateFrom"];
    delete data["DueDate.dateTo"];
    delete data["CreationDate.DateFrom"];
    delete data["CreationDate.dateTo"];
    delete data["CloseDate.DateFrom"];
    delete data["CloseDate.DateTo"];

    // let data = {
    //   TypeCode: this.queryParams.FromDate || null,
    //   GroupId: this.queryParams.ToDate || null,
    //   DueDate: {
    //     DateFrom : "",
    //     DateTo:""
    //   },
    //   CreationDate: {
    //     DateFrom: "",
    //     DateTo:""
    //   },
    //   Status: this.queryParams.initiator || null,
    //   AssignedToMe: this.queryParams.onlyMe || false,
    //   SearchKey: this.queryParams.search ? this.queryParams.search : null,
    //   SortDirection:true? 1:2,
    //   FollowUpSortBy: true ?1:2,
    //   Assignee : null,
    //   ResponseStatus : true ?null:1
    // }

    let url = `${Config.FollowUp.ExportExcel}`;
    this.exportFilesService
      .exportData("POST", url, "Followup List.xlsx", data)
      .finally(() => {
        this.isDownloading = false;
      });
  }
}
