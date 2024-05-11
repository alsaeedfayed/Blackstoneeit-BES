import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-process-main-flow',
  templateUrl: './process-main-flow.component.html',
  styleUrls: ['./process-main-flow.component.scss']
})
export class ProcessMainFlowComponent implements OnInit {
  @Input() states: any[] = [];
  @Input() language: string='';
  constructor() { }

  ngOnInit(): void {
  }

}
