import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';
declare let $: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {
  show: boolean = false;
  sortState: string;
  lang
  filterState: string;
  @Input() statusData = [];
  @Output() filterBy: EventEmitter<any> = new EventEmitter()
  isFilterActive: boolean;
  constructor(private translateService: TranslationService, private cdr: ChangeDetectorRef) {
    const component = this
    $(document).mouseup(function (e: any) {
      const container = $(".filter-dropdown-box");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        component.show = false
        component.cdr.detectChanges()
      }
    });

  }

  ngOnInit(): void {
    this.lang = this.translateService.language
    if (this.lang === 'ar') {
      this.filterState = 'فرز حسب'
    } else {
      this.filterState = 'Filter by Status';
    }
  }

  onShow() {
    this.show = !this.show;
  }

  onClick(sortBy, sortLang) {
    this.isFilterActive = true
    this.filterState = sortLang;
    this.show = false;
    this.filterBy.emit(sortBy);
  }

  clear() {
    this.isFilterActive = false
    this.show = false;
    this.filterState = this.lang === 'ar' ? 'فرز حسب' : 'Filter by Status'
    this.filterBy.emit(null);
  }

}
