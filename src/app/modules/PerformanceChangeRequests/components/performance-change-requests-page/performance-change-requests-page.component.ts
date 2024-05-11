import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Component, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { IAnalyticsWidget } from '../../../../shared/components/analytics-widget/iAnalyticsWidget.interface';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import {
  IchangeRequest,
  IchangeRequestListRes,
} from '../../interfaces/request.interface';
import { Observable, Subject } from 'rxjs';
import { PlanningService } from 'src/app/modules/Planning/Page/planning.service';
import { IScorecard } from 'src/app/modules/Planning/Page/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'performance-change-requests-page',
  templateUrl: './performance-change-requests-page.component.html',
  styleUrls: ['./performance-change-requests-page.component.scss'],
})
export class PerformanceChangeRequestsPageComponent implements OnInit, AfterViewInit, AfterContentChecked {

  public requests: IchangeRequest[] = [];
  public requestsFilter: IchangeRequest[] = [];
  public requestsCount: number = 0;
  public loading: boolean = true;
  public stats: IAnalyticsWidget[] = [];
  public showModel: boolean = false;
  status: number = ServicesStatus.Started;
  title: string = null;
  selectedScoreCardTitle$: Observable<string>;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  catgoryId: number = null;
  serviceId: number = null;
  ownedTasks: boolean = false;
  private destroy$ = new Subject();

  constructor(
    private httpHandlerService: HttpHandlerService,
    private popupSer: PopupService,
    private planningSer: PlanningService,
    private translate:TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
    this.selectedScoreCardTitle$ = this.planningSer.SelectedScorecard$.pipe(
      map((scorecard: IScorecard) =>
        scorecard
          ? this.translate.currentLang == 'en'
            ? scorecard.title
            : scorecard.titleAr
          : ''
      )
    );
    this.checkResetpopup();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.title = data.title;
      this.getAllRequests();
    });
  }
 
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkChnageRequest();
    }, 0);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  private checkResetpopup() {
    this.popupSer.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showModel = false;
    });
  }

  private checkChnageRequest() {
    this.planningSer.IsChnginrRequest$.pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        if (res) {
          this.openPopup();
          this.planningSer.chnageRequest(false);
        }
      }
    );
  }

  getQueryParams() {
    return {
      "title" : this.title
    };
  }

  handleSearch(keyword: string) {
    this.title = keyword;
    this.paginationModle.pageIndex = 1;
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  handleCatgoryFilter(catgoryId: number): any {
    this.catgoryId = catgoryId;
    this.handleFilter();
  }

  handleSortByFilter(serviceId: number): any {
    this.serviceId = serviceId;
    this.handleFilter();
  }

  public openPopup() {
    this.showModel = true;
    this.popupSer.open('cr-popup');
  }

  handleFilter() {
    // this.requestsFilter = this.requests.filter(
    //   (requests) =>
    //     (this.catgoryId ? requests.cateogryId == this.catgoryId : true) &&
    //     (this.serviceId ? requests.serviceId == this.serviceId : true) &&
    // );
  }

  handleStatusFilter(statusId: number) {
    this.status = statusId;
    this.getAllRequests();
  }

  handleOwnedTasksFilter(toggle: boolean): any {
    this.ownedTasks = toggle;
    this.getAllRequests();
  }

  // Get ALL Requests
  private getAllRequests() {
    this.loading = true;

    const query = {
      ...this.paginationModle,
      keyword: this.title,
      AssigneToMe: this.ownedTasks,
    };

    this.httpHandlerService
      .get(Config.chnageRequest.getAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: IchangeRequestListRes) => {
        if (res) {
          this.requestsCount = res.count || 0;
          this.requests = res.items || [];
          this.requestsFilter = res.items || [];
        }
      });
  }

  paginateHandler(pageNumber: number) {
    this.paginationModle.pageIndex = pageNumber;
  }

  // in case of added new request
  public updateListHandler() {
    this.getAllRequests();
  }
}
