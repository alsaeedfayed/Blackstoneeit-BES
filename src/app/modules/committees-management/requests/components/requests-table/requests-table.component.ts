import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RequestsSortBy, sortDirections, RequestStatus } from 'src/app/modules/committees-management/enums/enums';

@Component({
  selector: 'requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss']
})
export class RequestsTableComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  statuses = [
    { id: RequestStatus.Draft, name: 'Draft', nameAr: 'مسودة' ,className:'inProgress'},
    { id: RequestStatus.Pending, name: 'Pending', nameAr: 'معلق' ,className:'closed'},
    { id: RequestStatus.Rejected, name: 'Rejected', nameAr: 'مرفوض' ,className:'rejected'},
    { id: RequestStatus.Completed, name: 'Completed', nameAr: 'مكتمل' ,className:'active'},
    { id: RequestStatus.Canceled, name: 'Canceled', nameAr: 'ملغى' ,className:'cancelled'},
    { id: RequestStatus.Returned, name: 'Returned', nameAr: 'معاد' ,className:'started'},
  ];
  sortKey = RequestsSortBy;
  requestStatus = RequestStatus;
  public sortedCol: RequestsSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  @Input() public set SortedCol(val: RequestsSortBy | null) {
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
  ) { }

  ngOnInit(): void {
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
  sort(col: RequestsSortBy) {

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
