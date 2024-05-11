import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-risk-rating',
  templateUrl: './risk-rating.component.html',
  styleUrls: ['./risk-rating.component.scss']
})
export class RiskRatingComponent implements OnInit, OnChanges {

  @Input() rate: any;
  @Input() formView: Boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.rate?.currentValue) {
      this.rate = this.rate.replace(/\s/g, '')
    }
  }

  ngOnInit(): void {

  }
}
