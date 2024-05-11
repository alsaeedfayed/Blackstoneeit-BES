import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SwitchComponent,
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor, OnInit {
  @Output() ngChange: EventEmitter<boolean> = new EventEmitter();
  @Input() set checked(value: boolean) {
    this.checkedValue = value;
  }
  @Input() isFixed?:boolean;
  checkedValue: boolean = false;
  @Input() disabled: boolean;
  value: boolean = false;
  id = Math.random();
  constructor() { }

  private onChange = (value: boolean) => { };
  private onTouched = () => { };

  ngOnInit(): void { }

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  change(event) {
    this.onChange(event.target.checked);
    this.ngChange.emit(event.target.checked);
  }
}
