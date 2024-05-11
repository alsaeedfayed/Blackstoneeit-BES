import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { NgxPermissionsService } from 'src/app/core/modules/permissions/service/permissions.service';
import { Permissions } from 'src/app/core/services/permissions';
import { Router } from '@angular/router';
import { IchangeRequest } from '../../interfaces/request.interface';
import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { ChangeRequestStatus } from '../chnage-request-detilas-page/components/cr-details-data/enum';

@Component({
  selector: 'performance-change-requests-table',
  templateUrl: './performance-change-requests-table.component.html',
  styleUrls: ['./performance-change-requests-table.component.scss'],
})
export class PerformanceChangeRequestsTableComponent implements OnInit {
  public lang = this.translate.currentLang;
  @Input() Requests: IchangeRequest[] = [];
  @Input() requestsCount: number = 0;
  @Input() paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  @Output() onPaginateHandler: EventEmitter<number> = new EventEmitter();

  servicesStatusEnum = ChangeRequestStatus;

  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.handleLangChnage()
  }
  private handleLangChnage() {
    this.translate.onLangChange.subscribe(()=>{
      this.lang = this.translate.currentLang
    })
  }

  allowGoToDetails: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.myRequests.details
  );

  goToDetails(id: string) {
    this.router.navigate(['/performance-change-requests/details/' + id]);
  }

  ngOnInit(): void {}
  onPaginate(e: number) {
    this.onPaginateHandler.emit(e);
  }

  public getGoalLevelText(level: LevelMode) {
    return this.translate.instant('Planning.' + LevelMode[level]);
  }
}
