import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-states-filter',
  templateUrl: './states-filter.component.html',
  styleUrls: ['./states-filter.component.scss']
})
export class StatesFilterComponent implements OnInit {
  @Input() states: any
  constructor() { }

  ngOnInit() {
  }

}
