import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {

  @Input() id: string = '';
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() identity: any = '';

  @Output() valueChnaged: EventEmitter<boolean> = new EventEmitter()
  @Output() emitValue: EventEmitter<any> = new EventEmitter();

  @Input() value: boolean = false;

  private onChange = (value: boolean) => { };
  private onTouched = () => { };

  constructor() { }

  writeValue(obj: boolean): void {
    this.value = obj;
    this.onChange(this.value);
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

  change() {
    this.valueChnaged.emit(this.value)
    this.onChange(this.value)
  }

  ngOnInit(): void { }
}
