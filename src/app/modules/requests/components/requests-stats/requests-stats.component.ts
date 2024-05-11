import { Component, Input, OnInit } from '@angular/core';
import { IAnalyticsWidget } from './../../../../shared/components/analytics-widget/iAnalyticsWidget.interface';

@Component({
  selector: 'requests-stats',
  templateUrl: './requests-stats.component.html',
  styleUrls: ['./requests-stats.component.scss']
})
export class RequestsStatsComponent implements OnInit {

  @Input() reqStats: IAnalyticsWidget[] = [];
  @Input() loading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
