import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectRequestsSortBy , ProjectRequestsSortDirection } from '../enums/eunm';

@Component({
  selector: 'requests-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class RequestsTableComponent implements OnInit , OnChanges {
  
  lang: string = this.translate.currentLang;

  @Input() list = [];
  @Input() paginationModel;
  @Input() totalItems;
  @Input() sortedCol: ProjectRequestsSortBy | null = null;
  @Input() sortDirection: ProjectRequestsSortDirection = ProjectRequestsSortDirection.Asc;

  @Output() onSort = new EventEmitter();

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.handleLangChange();
  }

  ngOnChanges(){
    if (typeof this.sortDirection == "string") {
      this.sortDirection = parseInt(this.sortDirection); 
    }
  
    if (typeof this.sortedCol == "string") {
      this.sortedCol = parseInt(this.sortedCol); 
    }
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  sort(col: ProjectRequestsSortBy) {
    if (this.sortedCol === col) {
      if (this.sortDirection === ProjectRequestsSortDirection.Asc) this.sortDirection = ProjectRequestsSortDirection.Desc
      else this.sortDirection = ProjectRequestsSortDirection.Asc
    } else {
      this.sortDirection = ProjectRequestsSortDirection.Asc
    }
    this.sortedCol = col;

    this.onSort.emit({ sortDirection: this.sortDirection, sortBy:  this.sortedCol });
  }

  public get ascMode(): boolean {
    return this.sortDirection === ProjectRequestsSortDirection.Asc
  }

  public get DescMode(): boolean {
    return this.sortDirection === ProjectRequestsSortDirection.Desc
  }

}
