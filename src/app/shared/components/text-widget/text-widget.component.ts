import { IWidgetItem } from './IWidgetItem';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'text-widget',
  templateUrl: 'text-widget.component.html',
  styleUrls: ['text-widget.component.scss'],
})
export class TextWidgetComponent implements OnInit {
  @Input() data:IWidgetItem;
  @Input() loading:boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
