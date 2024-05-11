import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { DelegationStatus, componentModes } from '../../Enums/enums';
import { IAnalyticsWidget } from 'src/app/shared/components/analytics-widget/iAnalyticsWidget.interface';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delegations-list',
  templateUrl: './delegations-list.component.html',
  styleUrls: ['./delegations-list.component.scss'],
})
export class DelegationsListComponent implements OnInit, OnDestroy, AfterContentChecked {
  // PROPS
  /* Private */
  private endSub$ = new Subject();
  /* Public */
  public language = this.translateService.currentLang;
  public confirmMsg: string;
  public structuredStatistics: IAnalyticsWidget[] = [];
  public delegations: [] = [];
  public loadingDelegations: boolean = false;
  public totalCount: number = 0;
  public users: any[] = [];
  public delegationIdToCancel: string;
  // Utilitie Props
  public paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  public DelegationActions = [
    {
      item: this.translateService.instant('shared.edit'),
      disabled: false,
      textColor: '',
      icon: '',
    },
    {
      item: this.translateService.instant('shared.cancel'),
      disabled: false,
      textColor: '',
      icon: '',
    },
  ];
  public queryParams = {
    delegatedTo: null,
    delegator: null,
    search : ''
  };
  public dateRange = { startDate: null, endDate: null };
  public status = [
    { id: 1, label: this.translateService.instant('delegations.active') },
    { id: 2, label: this.translateService.instant('delegations.completed') },
    { id: 3, label: this.translateService.instant('delegations.cancelled') },
  ];
  editLabel = this.translateService.instant('shared.edit');
  cancelLabel = this.translateService.instant('shared.cancel');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.cancelLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-no-entry',
    },
  ];
  filterModel = {
      "delegator": "",
      "delegatedTo" : "",
      "fromDate": "",
      "toDate": "",
      "status": null
  }
  searchModel = {
    "keyword": "",
    "sortBy": "",
    "page": 1,
    "pageSize": 10000
  }
  public delegationId;
  ComonentsMode: componentModes = componentModes.addMode;

  isDelegationModelOpened: boolean = false;

  // CONSTRUCTOR
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private httpSer: HttpHandlerService,
    private confirmationPopupService: ConfirmModalService,
    private toastSer: ToastrService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private popupService: PopupService
  ) {
    this.handleLangChange();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.queryParams.delegatedTo = data.delegatedTo && data.delegatedTo != "" ? data.delegatedTo : null;
      this.queryParams.delegator = data.delegator && data.delegator != "" ? data.delegator : null;
      this.queryParams.search = data.search;
      this.filterModel.delegator = this.queryParams.delegator;
      this.filterModel.delegatedTo = this.queryParams.delegatedTo;
      this.searchModel.keyword = data.search;
      this.getUsers();
      this.getStatuses();
      this.getDelegationsList();
    });
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  getStatuses(){
    const getDelegationStatus = this.httpSer.get(Config.Lookups.getDelegationStatus);
    getDelegationStatus.subscribe(data => {
      this.status = data;
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getQueryParams() {
    return {
      "delegatedTo" : this.queryParams.delegatedTo,
      "delegator" : this.queryParams.delegator,
      "search" : this.queryParams.search
    };
  }

  private handleLangChange() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateService.currentLang;
        this.editLabel = this.translateService.instant('shared.edit');
        this.cancelLabel = this.translateService.instant('shared.cancel');
        this.options = [
          {
            item: this.editLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bxs-edit',
          },
          {
            item: this.cancelLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bx-no-entry',
          },
        ];
      });
  }

  //search on users
  searchUsers(value: string) {
    if(value) 
      this.getUsers(value?.trim());
  }

  private getUsers(value = '') {
   // this.loading = true;
    const body = {
      pageIndex: 1,
      pageSize: 30,
      fullName: value
    };

    this.httpSer
      .get(Config.UserManagement.GetAll, body)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  public getDelegationsList() {
    this.loadingDelegations = true;
    this.httpSer
      .post(
        `${Config.delegations.getAll}`,
        {
          filterModel : this.filterModel,
          searchModel : this.searchModel
        }
      )
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loadingDelegations = false))
      )
      .subscribe((res: any) => {
        if (res) {
          this.totalCount = res.total;
          this.delegations = res.data;
          this.delegations.forEach((delegation:any) => {
            delegation.delegator.name = delegation.delegator.name.en;
            delegation.delegatedTo.name = delegation.delegatedTo.name.en;
            delegation.delegator.backgroundColor = delegation.delegator.profileImage ? "" : "#5271ff";
            delegation.delegatedTo.backgroundColor = delegation.delegatedTo.profileImage ? "" : "#5271ff";
            delegation.delegator.image = delegation.delegator.profileImage;
            delegation.delegatedTo.image = delegation.delegatedTo.profileImage;              
          });
        }
      });
  }

  public cancelDelegation(delegation: any) {
    this.delegationIdToCancel = delegation?.id;
    this.confirmMsg = `${this.translateService.instant(
      'delegations.cancelDelegation'
    )} ${this.translateService.instant(
      'delegations.from' 
    )} "${delegation.delegator.name}"  ${this.translateService.instant(
      'delegations.to'
    )} "${delegation.delegatedTo.name}" ${this.translateService.instant('delegations.questionMark')} `;
    this.confirmationPopupService.open('cancel-delegation');
  }

  public onCancelDelegationConfirmed() {
    this.confirmationPopupService.close('cancel-delegation');
    this.httpSer
      .put(`${Config.delegations.cancel}/${this.delegationIdToCancel}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.toastSer.success(this.translateService.instant('delegations.cancelSuccessMsg'));
        this.getDelegationsList();
      });
  }

  public onPaginate(e) {
    this.paginationModle.pageIndex = e;
    this.getDelegationsList();
  }

  // Methods
  public navigateToAddDelegationPage() {
    this.ComonentsMode = componentModes.addMode;
    this.delegationId = null;
    this.isDelegationModelOpened = true;
    this.popupService.open('delegation-action');
  }

  public onPopupClose(){
    this.isDelegationModelOpened = false;
    this.popupService.close();
  }

  public navigateToEdit(delegation: any) {
    this.delegationId = delegation?.id;
    this.isDelegationModelOpened = true;
    this.popupService.open('delegation-action');
  }

  // Filters
  public handleSearchValueFilter(search : string){
    this.queryParams.search = search;
    this.searchModel.keyword = search;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  public handleDelegatorFilter(value: { label: string; id: string }) {
    this.queryParams.delegator = value ? value?.id : '';
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  public handleDelegatedToFilter(value: { label: string; id: string }) {
    this.queryParams.delegatedTo = value ? value?.id : '';
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  private resetPagination() {
    this.paginationModle.pageIndex = 1;
  }

  public getStatusText(state: DelegationStatus): string {
    return this.translateService.instant('delegations.' + state.toString().toLowerCase());
  }

  public getStatusClassName(state: DelegationStatus): string {
    if (state === DelegationStatus.Active) {
      return 'closed';
    } else if (state === DelegationStatus.Completed) {
      return 'active';
    } else if (state === DelegationStatus.Cancelled) {
      return 'cancelled';
    } else {
      return 'Warning';
    }
  }

  // Offset between UTC Date & LocalDate
  public getOffset() {
    let ddate = new Date()
    return ddate.getTimezoneOffset() / 60;
  }

  onOptionSelect(e, delegation) {
    if (e === this.editLabel) {
      this.navigateToEdit(delegation);
      this.ComonentsMode = componentModes.editMode;
    } else if (e === this.cancelLabel) {
      this.cancelDelegation(delegation);
    }
  }

}
