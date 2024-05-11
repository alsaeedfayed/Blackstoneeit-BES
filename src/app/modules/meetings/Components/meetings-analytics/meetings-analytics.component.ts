import { Component, OnInit, Input } from '@angular/core';
import { IAnalyticsWidget } from 'src/app/shared/components/analytics-widget/iAnalyticsWidget.interface';

@Component({
  selector: 'meetings-analytics',
  templateUrl: './meetings-analytics.component.html',
  styleUrls: ['./meetings-analytics.component.scss']
})
export class MeetingsAnalyticsComponent implements OnInit {

  @Input() items: IAnalyticsWidget[] = [];
  @Input() loading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
