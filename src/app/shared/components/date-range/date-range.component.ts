import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateRangeComponent,
      multi: true,
    },
  ],
})
export class DateRangeComponent implements ControlValueAccessor, OnInit {
  @Input() title: string;
  @Input() dir: string = 'ltr';
  @Input() disabled: boolean = false;
  @Input() value: any;
  @Input() control: AbstractControl | undefined;

  @Input() placeholder: string = '';
  @Output() ngChange: EventEmitter<any> = new EventEmitter();
  private onChange = (value: any) => {};
  private onTouched = () => {};
  constructor() {}

  ngOnInit(): void {}
  writeValue(obj: any): void {
    this.value = obj;
    // console.log("this.value",this.value);
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

  change() {
    if (!this.value?.startDate) {
      this.ngChange.emit(null);
      this.onChange(null);
      return;
    }
    const rangeDate = {
      startDate: new Date(this.value?.startDate?.['$d']?? this.value?.startDate).toISOString(),
      endDate: new Date(this.value?.endDate?.['$d']?? this.value?.endDate).toISOString(),
    };
    
    // console.log("rangeDate",rangeDate);
    this.ngChange.emit(rangeDate);
    this.onChange(rangeDate);
  }
}
