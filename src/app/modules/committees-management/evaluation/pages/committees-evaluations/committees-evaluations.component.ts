import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { Config } from "src/app/core/config/api.config";
import { finalize, takeUntil } from "rxjs/operators";
import { RoutesVariables } from "../../../routes";
import { RequestsSortBy, evaluationSortBy, sortDirections } from "../../../enums/enums";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { UserService } from "src/app/core/services/user.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { ExportFilesService } from "src/app/shared/services/export-files/export-files.service";
import { Permissions } from "src/app/core/services/permissions";
import { EvaluationService } from "../../services/evaluationService/evaluation.service";

@Component({
  selector: "app-committees-evaluations",
  templateUrl: "./committees-evaluations.component.html",
  styleUrls: ["./committees-evaluations.component.scss"],
})
export class CommitteesEvaluationsComponent
  extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

  addEvaluationPermission = Permissions.Committees.Evaluations.create;
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

  public sortedCol: evaluationSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private userSer: UserService,
    private modelService: ModelService,
    private exportFilesService: ExportFilesService,
    private evaluationService : EvaluationService

  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // fetch all requests
    // this.getAllRequests();
    this.getAllEvaluations()
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
    this.getAllEvaluations();
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
    this.getAllEvaluations();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all requests
    this.getAllEvaluations();
  }

  canAddEvaluation: boolean = false;
  // fetch all evaluations
  private getAllEvaluations() {
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch requests
    this.httpSer
      .get(Config.CommitteeEvaluations.GetAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          // all items list
          this.list = res?.data;
          // count
          this.totalItems = res?.count;
          this.canAddEvaluation = res?.canAddAudit;
        }
      });
  }


  // go to add committee page
  goToAddCommittee() {
    this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}/${RoutesVariables.Requests.Create}`);
  }

  addEvaluations() { }

  isDownloading: boolean = false

  exportList() {

    // check if the button has been clicked
    if (this.isDownloading) return;
    this.isDownloading = true;
    const body = {
      ...this.filterData,
    };
    let url = `${Config.CommitteeEvaluations.ExportExcel}`;

    this.exportFilesService.exportData('POST', url, 'Evaluations.xlsx', body)
      .finally(() => {
        this.isDownloading = false;
      });
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
      delete this.filterData.year;

      delete this.filterData.committeeId;


      this.paginationModel.pageIndex = 1;
      this.getAllEvaluations();
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
    this.getAllEvaluations();
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
      this.getAllEvaluations();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    this.getAllEvaluations();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  // open create task model
  openCreateEvaluationModel() {
    this.evaluationService.isUpdating.next(false)
    this.modelService.open('create-evaluation');
  }

  isEditEvaluation : boolean = false;

  editEvaluation(event : any){
    //console.log(event)
    this.modelService.open('create-evaluation');
  }




  evaluationAdded() {
    this.getAllEvaluations()
  }

  refreshList() {
    this.getAllEvaluations()
  }


}
