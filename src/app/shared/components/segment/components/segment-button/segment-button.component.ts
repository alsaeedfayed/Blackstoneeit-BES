import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-segment-button',
  templateUrl: './segment-button.component.html',
  styleUrls: ['./segment-button.component.scss'],
})
export class SegmentButtonComponent implements OnInit {
  @Input('title') title: string;
  @Input() icon: string;
  @Input() value: any;
  @Input() active:boolean;
  constructor() {}

  ngOnInit(): void {}
}
