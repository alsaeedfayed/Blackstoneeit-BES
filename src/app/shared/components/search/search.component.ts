import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Input() searchKey: string = "";
  @Input() searchPlaceHolder: string = "";

  @Output() search: EventEmitter<string> = new EventEmitter();

  id: string;

  constructor() { }

  ngOnInit(): void {
    this.handleAddId();
    setTimeout(() => {
      this.changeValue();
    }, 500);
  }

  handleAddId() {
    this.id = String(Math.random());
  }

  changeValue() {
    const element = document.getElementById(String(this.id));
    element && fromEvent(element, 'input')
      .pipe(
        debounceTime(500),
        map((event: any) => {
          return event.target.value;
        })
      )
      .subscribe((value) => {
        this.search.emit(value);
      });
  }
}
