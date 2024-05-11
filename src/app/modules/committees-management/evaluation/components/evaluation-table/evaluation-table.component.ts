import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  sortDirections,
  evaluationSortBy,
} from "src/app/modules/committees-management/enums/enums";
import { EvaluationService } from "../../services/evaluationService/evaluation.service";
import { Permissions } from "src/app/core/services/permissions";
import { committeeAudit } from '../../../committees/models/committeeAudits';
import { ModelService } from "src/app/shared/components/model/model.service";

@Component({
  selector: "app-evaluation-table",
  templateUrl: "./evaluation-table.component.html",
  styleUrls: ["./evaluation-table.component.scss"],
})
export class EvaluationTableComponent implements OnInit {


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
  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();

  @Output() openEditModal = new EventEmitter();

  @Output() refrshTable : EventEmitter<any> = new EventEmitter()
  editEvaluationPermission = Permissions.Committees.Evaluations.edit;

  constructor(
    private translate: TranslateService,
    private evaluationService:EvaluationService,
    private modelService: ModelService,

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

  isUpdatingEValuation : boolean = false
  selectedEvaluation : any ;
  //emit row to open modal
  editTitle : string
  openUpdateEvaluationModal(row : any) {
    this.evaluationService.isUpdating.next(true)
    this.isUpdatingEValuation = true
    this.selectedEvaluation = row;
    this.editTitle = this.language == "en" ? row?.typeName : row?.typeNameAr
    this.modelService.open('edit-evaluation');
    //console.log(row)
    //this.openEditModal.emit(row);
  }
  refreshe(event : any) {
    this.refrshTable.emit()
  }
}
