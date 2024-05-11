import { Component, Input } from '@angular/core';
import { IAnalyticsWidget } from './iAnalyticsWidget.interface';

@Component({
  selector: 'analytics-widget',
  templateUrl: './analytics-widget.component.html',
  styleUrls: ['./analytics-widget.component.scss'],
})

export class AnalyticsWidgetComponent {

  @Input() Item: IAnalyticsWidget;
  constructor() { }
  
}
