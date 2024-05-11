import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IButtonSelect } from '../button-select/iBtnSelect.interface';

@Component({
  selector: 'app-buttons-select',
  templateUrl: './buttons-select.component.html',
  styleUrls: ['./buttons-select.component.scss']
})
export class ButtonsSelectComponent implements OnInit {

  @Input() buttons: Array<IButtonSelect> = new Array<IButtonSelect>();
  @Input() selected: string = '';
  @Input() language: string = '';
  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.buttons.forEach(button => button.clicked = button.className == this.selected);
  }
  getButton(e) {
    this.onSelect.emit(e.className);
    this.buttons.forEach(button => button.clicked = button.className == e.className);
  }
}
