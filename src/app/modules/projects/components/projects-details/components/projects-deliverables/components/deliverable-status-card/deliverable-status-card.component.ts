import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deliverable-status-card',
  templateUrl: './deliverable-status-card.component.html',
  styleUrls: ['./deliverable-status-card.component.scss']
})
export class DeliverableStatusCardComponent implements OnInit {
  @Input() data
  @Input() theme
  constructor() { }

  ngOnInit() {
  }

}
