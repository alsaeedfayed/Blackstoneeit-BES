import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { LookupService } from 'src/app/core/services/lookup.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ClosureRequestsService } from '../services/closure-requests.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-closure-requests-main',
  templateUrl: './closure-requests-main.component.html',
  styleUrls: ['./closure-requests-main.component.scss']
})
export class ClosureRequestsMainComponent extends ComponentBase implements OnInit {

  isFilterDisplayed: boolean;
  sortItems: any = [
    {
      name: 'Newest',
      nameAr: 'الأحدث',
      isDefault: true,
    },
    {
      name: 'Oldest',
      nameAr: 'الأقدم',
      isDefault: false,
    },
    {
      name: 'Last updated',
      nameAr: 'آخر تحديث',
      isDefault: false,
    },
  ];

  searchModel = {
    keyword: null,
    sortBy: null,
    page: 1,
    pageSize: 30,
  };
  filterModel = {
    appliedFiltersCount: 0,
    hasTask: false,
    projectId: null,
    stateTitle: null,
    fromDate: null,
    toDate: null,
    managerId: null,
  };
  closureRequests: any;
  lang: any;
  projectsTypes: any = [];
  projectsStatus: any = [];
  closureRequestsTotal: number;
  requestActions: any;
  loading: boolean;

  loadingModalText: string = 'Loading';
  displayLoadingModal: boolean;
  requestStates: any;

  constructor(
    private toastr: ToastrService,
    private popupService: PopupService,
    private lookupService: LookupService,
    private translationService: TranslationService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private closureRequestsService: ClosureRequestsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
    super(translateService, translate);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getQueryParams(){
    return {
      "keyword" : this.searchModel.keyword,
      "sortBy" : this.searchModel.sortBy,
      "appliedFiltersCount" : this.filterModel.appliedFiltersCount,
      "hasTask" : this.filterModel.hasTask,
      "projectId" : this.filterModel.projectId,
      "stateTitle" : this.filterModel.stateTitle,
      "fromDate" : this.filterModel.fromDate,
      "toDate" : this.filterModel.toDate,
      "managerId" : this.filterModel.managerId,
    };
  }

  ngOnInit() {

    this.route.queryParams.subscribe(data => {
      this.searchModel.keyword = data.keyword;
      this.searchModel.sortBy = data.sortBy;
      this.filterModel.appliedFiltersCount = data.appliedFiltersCount;
      this.filterModel.fromDate = data.fromDate;
      this.filterModel.toDate = data.toDate;
      this.filterModel.managerId = data.managerId;
      this.filterModel.hasTask = data.hasTask == true || data.hasTask == "true";
      this.filterModel.projectId = data.projectId;
      this.filterModel.stateTitle = data.stateTitle;
      
      this.lang = this.translate.currentLang;
      this.getClosureRequests(this.searchModel, this.filterModel);
      this.getRequestStates();
  
      this.closureRequestsService.displayLoadingModal.subscribe((res) => {
        this.displayLoadingModal = res.state;
        this.loadingModalText = res.text;
      });
  
      this.translate.onLangChange.subscribe((language) => {
        this.lang = language.lang;
      })
    });
  }


  getRequestStates() {
    this.closureRequestsService.getRequestStates().subscribe(res => {
      res && res.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.requestStates = res;
    });
  }

  getClosureRequests(searchModel, filterModel) {
    this.loading = true;
    this.closureRequestsService
      .getClosureRequests(searchModel, filterModel)
      .subscribe((res) => {
        this.closureRequests = res.data;
        this.closureRequestsTotal = res.total;
        this.loading = false;
      });
  }

  onPaginate(e) {
    this.searchModel.page = e;
    this.closureRequestsTotal = 0;
    this.closureRequests = [];
    this.getClosureRequests(this.searchModel, this.filterModel);
  }

  public handleSearchFilter(keyword: string) {
    this.searchModel.keyword = keyword;
    this.searchModel.page = 1;

    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  onAssignedToMeChange(e) {
    this.searchModel.page = 1;
    this.closureRequests = [];
    this.closureRequestsTotal = 0;

    if (e) {
      this.filterModel.hasTask = true;
      this.router.navigate(
        [], 
        {
          relativeTo: this.route,
          queryParams: this.getQueryParams(), 
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
      // this.getClosureRequests(this.searchModel, this.filterModel);
    } else {
      this.filterModel.hasTask = false;
      this.router.navigate(
        [], 
        {
          relativeTo: this.route,
          queryParams: this.getQueryParams(), 
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
      // this.getClosureRequests(this.searchModel, this.filterModel);
    }
  }

  onExpandChangeRequest(changeRequest) {
    this.closureRequestsService.saveChangeRequest(changeRequest);
    this.closureRequestsService.saveLoadingModalState({
      state: true,
      text: 'Loading',
    });
    this.getActions(changeRequest.id);
  }

  getActions(id) {
    this.closureRequestsService.getActions('ChangeProjectRequest', id).subscribe(
      (res) => {
        this.requestActions = [];
        this.requestActions = res.options.reverse();
        this.closureRequestsService.saveLoadingModalState({
          state: false,
          text: 'Loading',
        });
        this.popupService.open('closure-request');
      },
      (err) => {
        if (err.message.en === "There's no available task for this request") {
          this.requestActions = [];
          this.closureRequestsService.saveLoadingModalState({
            state: false,
            text: 'Loading',
          });
          this.popupService.open('closure-request');
        }
      }
    );
  }

  onSort(e) {
    this.searchModel.page = 1;
    if (e?.name === 'All') {
      this.searchModel.sortBy = null;
    } else {
      this.searchModel.sortBy = e?.name;
    }
    this.closureRequests = [];
    this.closureRequestsTotal = 0;
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getClosureRequests(this.searchModel, this.filterModel);
  }

  onFilterConfirmed(filter) {
    const hasTask = this.filterModel.hasTask;
    this.filterModel = filter;

    this.filterModel.appliedFiltersCount = Object.values(filter).filter(val => val != null && val != false).length;

    this.filterModel.hasTask = hasTask;
    this.searchModel.page = 1;
    this.popupService.close()
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getClosureRequests(this.searchModel, this.filterModel)
  }

  onResetFilterConfirmed(e) {
    this.searchModel = {
      keyword: null,
      sortBy: null,
      page: 1,
      pageSize: 30,
    };
    this.filterModel = {
      appliedFiltersCount: 0,
      hasTask: false,
      projectId: null,
      stateTitle: null,
      fromDate: null,
      toDate: null,
      managerId: null,
    };
    this.popupService.close()
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
    // this.getClosureRequests(this.searchModel, this.filterModel)
  }

  onFilter() {
    this.closureRequestsService.savePopupConfig({
      title: {
        en: "Filter closure requests",
        ar: "تصفية طلبات الإغلاق"
      },
      mode: "filter",
      btnLabel: {
        en: "Apply",
        ar: "تطبيق"
      },
      filter: this.filterModel
    })
    this.popupService.open('closure-request')
  }


}
