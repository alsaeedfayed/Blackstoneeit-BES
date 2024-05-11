import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  sortDirections,
  evaluationSortBy,
  committeeAuditsSortBy,
} from "src/app/modules/committees-management/enums/enums";
import { EvaluationService } from "../../../evaluation/services/evaluationService/evaluation.service";
import { DashboardCommitteeListService } from "../../services/dashboard-committee-list.service";


@Component({
  selector: 'app-dashboard-committees-rows',
  templateUrl: './dashboard-committees-rows.component.html',
  styleUrls: ['./dashboard-committees-rows.component.scss']
})
export class DashboardCommitteesRowsComponent implements OnInit {


  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  statuses: any = [];
  sortKey = committeeAuditsSortBy;
  public sortedCol: committeeAuditsSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  @Input() public set SortedCol(val: committeeAuditsSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: sortDirections | null) {
    this.sortDirection = val;
  }
  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private dashboardService: DashboardCommitteeListService
  ) { }

  ngOnInit(): void {
    this.statuses = this.dashboardService.getActiveStatuses();
    // handles language change event
    this.handleLangChange();
    //console.log('list' , this.list)
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // sort requests items by column
  sort(col: committeeAuditsSortBy) {

    if (this.sortedCol === col) {
      if (this.sortDirection === sortDirections.Asc) {
        this.sortDirection = sortDirections.Desc;
      } else {
        this.sortDirection = sortDirections.Asc;
      }
    } else {
      this.sortDirection = sortDirections.Asc
    }

    this.sortedCol = col;
    this.sortFilter.emit({
      sortDirection: this.sortDirection,
      sortKey: this.sortedCol,
    });
  }

  public get ascMode(): boolean {
    return this.sortDirection === sortDirections.Asc;
  }

  public get descMode(): boolean {
    return this.sortDirection === sortDirections.Desc;
  }



}
