import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input() mode: string;
  @Input() dimensions: any;
  @Input() id: any;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
