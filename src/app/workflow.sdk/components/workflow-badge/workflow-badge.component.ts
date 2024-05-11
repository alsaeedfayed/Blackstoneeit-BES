import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'workflow-badge',
  templateUrl: './workflow-badge.component.html',
  styleUrls: ['./workflow-badge.component.scss'],
})
export class WorkflowBadgeComponent implements OnInit {
  @Input() label: string = '';
  @Input() className: string;
  constructor() {}

  ngOnInit(): void {}
}
