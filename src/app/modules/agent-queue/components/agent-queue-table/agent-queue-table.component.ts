import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { AgentQueueStatusMode } from './enums';
import { NgxPermissionsService } from 'src/app/core/modules/permissions/service/permissions.service';
import { Permissions } from 'src/app/core/services/permissions';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgentQueueSortBy, AgentQueueSortDirection } from '../../enums/enums';

@Component({
  selector: 'agent-queue-table',
  templateUrl: './agent-queue-table.component.html',
  styleUrls: ['./agent-queue-table.component.scss'],
})
export class AgentQueueTableComponent implements OnInit, OnChanges {
  @Input() agentQueueList: any[] = [];
  @Input() totalItems;
  @Input() paginationModel;
  @Input() public set SortedCol(val: AgentQueueSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: AgentQueueSortDirection | null) {
    this.sortDirection = val;
  }

  @Output() onPaginate = new EventEmitter();
  @Output() onSort = new EventEmitter();

  lang: string = this.translate.currentLang;
  agentQueueStatusMode = AgentQueueStatusMode;
  @Input() sortedCol: AgentQueueSortBy | null = null;
  @Input() sortDirection: AgentQueueSortDirection = AgentQueueSortDirection.Asc;

  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  ngOnChanges(){
    if(typeof this.sortedCol == "string"){
      this.sortedCol = parseInt(this.sortedCol);
    }
    if(typeof this.sortDirection == "string"){
      this.sortDirection = parseInt(this.sortDirection);
    }
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  allowGoToDetails: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.myRequests.details
  );

  goToDetails(id: string) {
    this.router.navigateByUrl('/requests/request-details/' + id);
  }

  onPageChange(e) {
    this.onPaginate.emit(e);
  }

  getLabel(currentStatus, label) {
    if (this.lang === 'en') {
      return currentStatus?.en ? `${label} - ${currentStatus?.en}` : label;
    } else {
      if (label === 'Opened') {
        let text = this.translate.instant('shared.open');
        return currentStatus?.ar ? `${text} - ${currentStatus?.ar}` : text;
      } else {
        label = label.toLowerCase();
        let text = this.translate.instant('shared.' + label);
        return currentStatus?.ar ? `${text} - ${currentStatus?.ar}` : text;
      }
    }
  }

  sort(col: AgentQueueSortBy) {
    if (this.sortedCol === col) {
      if (this.sortDirection === AgentQueueSortDirection.Asc) this.sortDirection = AgentQueueSortDirection.Desc
      else this.sortDirection = AgentQueueSortDirection.Asc
    } else {
      this.sortDirection = AgentQueueSortDirection.Asc
    }
    this.sortedCol = col;
    this.onSort.emit({ sortDirection: this.sortDirection, sortBy:  this.sortedCol });
  }

  public get ascMode(): boolean {
    return this.sortDirection === AgentQueueSortDirection.Asc
  }

  public get DescMode(): boolean {
    return this.sortDirection === AgentQueueSortDirection.Desc
  }

  floor(number){
    return Math.round(number * 10) / 10
  }
}
