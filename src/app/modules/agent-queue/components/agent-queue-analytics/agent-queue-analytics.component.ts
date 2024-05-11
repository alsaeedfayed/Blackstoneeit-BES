import { Component, Input } from '@angular/core';
import { IAnalyticsWidget } from './../../../../shared/components/analytics-widget/iAnalyticsWidget.interface';

@Component({
  selector: 'agent-queue-analytics',
  templateUrl: './agent-queue-analytics.component.html',
  styleUrls: ['./agent-queue-analytics.component.scss']
})
export class AgentQueueAnalyticsComponent {

  @Input() agentQueueItems: IAnalyticsWidget[]=[];
  @Input() loading:boolean;

  constructor() { }

}
