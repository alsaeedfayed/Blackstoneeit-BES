import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss'],
})
export class HeaderPageComponent implements OnInit {

  @ViewChild('search') searchComponent: SearchComponent;

  @Input() title: string = '';
  @Input() titleBtn: string = '';
  @Input() isSearch: boolean = false;
  @Input() searchKey: string = "";
  @Input() hasAdvancedFilter: boolean = false;
  @Input() isAddBtn: boolean = true;
  @Input() showButtons = true;
  @Input() backButton = false;
  @Input() isStartServiseTitle = false;
  @Input() totalItems = 0;
  @Input() showTotalItems = true;
  @Input() showTotalFilterAdvanced = false;
  @Input() filterCount = 0;
  @Input() backTo: string = ''

  @Output() btnClick: EventEmitter<void> = new EventEmitter();
  @Output() customBtnClick: EventEmitter<number> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() onAdvancedFilter: EventEmitter<string> = new EventEmitter();

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void { }

  evnet() {
    this.btnClick.emit();
    event.preventDefault();
  }

  clickEvent(btnAction: number) {
    this.customBtnClick.emit(btnAction)
  }

  changeSearch(value: string) {
    this.search.emit(value);
  }

  back() {
    if (this.backTo.length > 0) {
      this.router.navigateByUrl(this.backTo);
    } else {
      this.location.back();
    }
  }

  advancedFilter() {
    this.onAdvancedFilter.emit();
  }

}
