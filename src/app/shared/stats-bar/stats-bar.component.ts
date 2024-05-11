import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.scss']
})
export class StatsBarComponent implements OnInit, OnChanges {
  @Input() items
  totalItems: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items?.currentValue) {
      this.totalItems = Object.keys(this.items).filter(key => this.items[key] !== 0).length - 1
    }
  }

  ngOnInit() {
  }

}
