import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})

export class DatepickerComponent implements OnInit {
  @Input('showClear') showClear: boolean = false
  current = new Date()
  minDate = {
    year: this.current.getFullYear(),
    month: this.current.getMonth() + 1,
    day: this.current.getDate()
  };
  @Input() date: any = '';
  @Input() disabled: any;
  @Input() allowPastDate:boolean = false;
  @Output() getSelectedDate: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter()

  onChangeFn = (_) => {}
  constructor() {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.date = obj
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  dateChange(e) {
    this.getSelectedDate.emit(e)
    this.onChangeFn(e)
  }


reset() {
  this.date = null
  this.onReset.emit(undefined)
}



}
