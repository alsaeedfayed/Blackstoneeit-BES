import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-radio-box',
  templateUrl: './radio-box.component.html',
  styleUrls: ['./radio-box.component.scss'],
})
export class RadioBoxComponent implements OnInit {
  @Input() set active(value: boolean) {
    this.checked = value;
  }
  @Input() value: string = '';
  @Output() emitValue: EventEmitter<any> = new EventEmitter();
  id = Math.random();
  checked: boolean = false;
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }
}
