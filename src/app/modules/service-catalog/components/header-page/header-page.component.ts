import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss'],
})
export class HeaderPageComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Input() searchKey: string;
  constructor() {}

  ngOnInit(): void {}

  changeSearch(value: string) {
    this.search.emit(value);
  }
}
