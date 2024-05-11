import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IButtonSelect } from './iBtnSelect.interface';

@Component({
  selector: 'app-button-select',
  templateUrl: './button-select.component.html',
  styleUrls: ['./button-select.component.scss']
})
export class ButtonSelectComponent implements OnInit {

  constructor() { }

  @Input() data: IButtonSelect = {} as IButtonSelect;
  @Input() language = "";
  @Output() onSelect: EventEmitter<IButtonSelect> = new EventEmitter();

  ngOnInit(): void {
  }
  getButton() {
    this.onSelect.emit(this.data)
  }
}
