import { Component, Input } from '@angular/core';
import { IAnalyticsWidget } from '../analytics-widget/iAnalyticsWidget.interface';

@Component({
  selector: 'analytics-widgets',
  templateUrl: './analytics-widgets.component.html',
  styleUrls: ['./analytics-widgets.component.scss'],
})

export class AnalyticsWidgetsComponent {

  @Input() Items: Array<IAnalyticsWidget>;
  
}
