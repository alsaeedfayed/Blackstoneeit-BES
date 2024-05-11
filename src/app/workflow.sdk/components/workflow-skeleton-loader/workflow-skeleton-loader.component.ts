import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'workflow-skeleton-loader',
  templateUrl: './workflow-skeleton-loader.component.html',
  styleUrls: ['./workflow-skeleton-loader.component.scss']
})
export class WorkflowSkeletonLoaderComponent implements OnInit {
  @Input() mode;
  @Input() count;
  constructor() { }

  ngOnInit() {
  }
  
}
