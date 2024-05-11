import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { toggle, up, down } from 'slide-element';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';

@Component({
  selector: 'app-page-filters',
  templateUrl: './page-filters.component.html',
  styleUrls: ['./page-filters.component.scss']
})
export class PageFiltersComponent implements OnInit, OnChanges {

  @ViewChild('advanced_filter_content') advancedFilterContent: ElementRef<HTMLElement>;

  @Input() lang: string;

  @Input() disableSearchBtn: boolean = false
  // search field properties
  @Input() hasSearch: boolean = true;
  @Input() searchValue: string;
  @Input() searchPlaceHolder: string;

  // switch button properties
  @Input() hasAssignedSwitch: boolean = false;
  @Input() assignedSwitchId: string;
  @Input() assignedSwitchLabel: string;
  @Input() assignedSwitchValue: boolean;

  //switch tasks & main tasks
  @Input() hasSwitchMainTasks : boolean = false
  @Input() SwitchMainTasksLabel : string;


  // view mode properties
  @Input() hasListViewBtn: boolean = false;
  @Input() hasCardsViewBtn: boolean = false;
  @Input() hasTreeViewBtn: boolean = false;
  @Input() hasExpandTreeBtn: boolean = false;
  @Input() isTreeExpanded: boolean = false;
  @Input() hasMapViewBtn: boolean = false;
  @Input() hasCalendarViewBtn: boolean = false;
  @Input() viewMode: 'list' | 'cards' | 'tree' | 'map' | 'calendar' = 'list';

  // advanced filter properties
  @Input() hasAdvancedFilter: boolean = false;
  @Input() popupAdvancedFilter: boolean = false;
  @Input() hasClearBtn: boolean = true;
  @Input() clearBtnLabel: string;
  @Input() cancelBtnLabel: string;
  @Input() searchBtnLabel: string;
  @Input() appliedFiltersCount: number = 0;
  @Input() IsFiltersVisible: boolean = false;
  @Input() hasFooter: boolean = true;
  @Input() hasTitle: boolean = false;
  @Input() title: string = '';
  @Input() hasSeeBtn: boolean = false;
  @Input() seeBtnTitle: string = '';

  // add button properties
  @Input() hasAddBtn: boolean = false;
  @Input() addBtnLabel: string;
  isAddAllowed: boolean = true;
  @Input()
  public set addBtnPermission(permission: number) {
    this.isAddAllowed = !!this.permissionsService.getPermission(permission);
  }


  // export button properties
  @Input() hasExportBtn: boolean = false;
  @Input() isDownloading: boolean = false;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() onSwitch: EventEmitter<boolean> = new EventEmitter();
  @Output() onSwitchMainTasksEmitter : EventEmitter<boolean> = new EventEmitter();
  @Output() onSearchBtnCLicked = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() onOpenAdvancedFilterModel = new EventEmitter();
  @Output() onAddBtnCLicked = new EventEmitter();
  @Output() onExportBtnClicked = new EventEmitter();
  @Output() onTreeExpanded = new EventEmitter();
  @Output() onViewModeChange = new EventEmitter();
  @Output() onSeeBtnClicked = new EventEmitter();

  appliedCountAppeared: boolean = false;

  constructor(private permissionsService: NgxPermissionsService,) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.appliedCountAppeared = this.appliedFiltersCount > 0 ? true : false;
    this.IsFiltersVisible ? down(this.advancedFilterContent.nativeElement) : '';
  }

  // toggle advanced filter content visibility
  toggleContentVisibility() {
    if (this.popupAdvancedFilter) {
      this.onOpenAdvancedFilterModel.emit();
    } else {
      toggle(this.advancedFilterContent.nativeElement);
    }
  }

  // close advanced filter content
  closeContentVisibility() {
    up(this.advancedFilterContent.nativeElement);
  }

  ClearFilter() {
    this.onClear.emit();
    this.appliedCountAppeared = false;
  }

  onSwitchChange(status: boolean) {
    this.onSwitch.emit(status);
  }

  onSwitchMainTasks(status : boolean){
    this.onSwitchMainTasksEmitter.emit(status)
  }



  onSearch(searchString: string) {
    this.search.emit(searchString);
  }

  searchBtnClicked() {
    this.onSearchBtnCLicked.emit()
  }

  addBtnClicked() {
    this.onAddBtnCLicked.emit()
  }
  seeBtnClicked() {
    this.onSeeBtnClicked.emit()
  }

  exportBtnClicked() {
    this.onExportBtnClicked.emit()
  }

  changeViewMode(mode) {
    this.viewMode = mode;
    this.onViewModeChange.emit(this.viewMode);
  }

  toggleTreeExpanding() {
    this.isTreeExpanded = !this.isTreeExpanded;
    this.onTreeExpanded.emit(this.isTreeExpanded);
  }
}
