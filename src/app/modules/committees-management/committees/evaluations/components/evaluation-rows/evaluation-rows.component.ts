import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  sortDirections,
  evaluationSortBy,
} from "src/app/modules/committees-management/enums/enums";
import { EvaluationService } from "src/app/modules/committees-management/evaluation/services/evaluationService/evaluation.service";
import { committeeAudits } from "../../../models/committeeAudits";
import { Evaluation, EvaluationData } from "src/app/modules/committees-management/evaluation/models/Evaluations";
@Component({
  selector: 'app-evaluation-rows',
  templateUrl: './evaluation-rows.component.html',
  styleUrls: ['./evaluation-rows.component.scss']
})
export class EvaluationRowsComponent implements OnInit {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  statuses = [];
  sortKey = evaluationSortBy;
  public sortedCol: evaluationSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  @Input() public set SortedCol(val: evaluationSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: sortDirections | null) {
    this.sortDirection = val;
  }
  @Input() list!: EvaluationData;
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private evaluationService: EvaluationService
  ) { }

  ngOnInit(): void {
    this.statuses = this.evaluationService.getStatuses();
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

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // sort requests items by column
  sort(col: evaluationSortBy) {

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
