import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INode } from '../node';

@Component({
  selector: 'org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent implements OnInit {
  @Input() nodes: INode[];

  @Input() hasParent = false;

  @Input() direction: 'vertical' | 'horizontal' = 'vertical';

  constructor() {}

  ngOnInit(): void {}
}
