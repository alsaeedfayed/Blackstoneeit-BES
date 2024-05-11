import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-stats-widget',
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.scss'],
})
export class StatsWidgetComponent implements OnInit {

  @Input() id: string;
  @Input() WidgetColorType: 'normal' | 'colorFul' = 'normal';
  @Input() count: number;
  @Input() title: string;
  @Input() icon: string;
  @Input() type: 'default' | 'primary' | 'warning' | 'success' | 'danger';
  @Input() iconColor: string = 'black';
  @Input() iconBGColor: string = 'white';
  @Input() iconContainerColor: string = 'white';
  @Input() widgetColor: string = 'black';
  @Input() hasBorder: boolean = false;
  @Input() borderColor: string = 'white';
  @Input() textColor: string = 'white';
  @Input() hasPercentage: boolean = false;
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  emitStatId() {
    this.onClick.emit(this.id);
  }
}
