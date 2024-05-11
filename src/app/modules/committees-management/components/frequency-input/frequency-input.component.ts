import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FrequencyInput } from './frequency-input.model';
import {measurementType } from '../../enums/enums';

@Component({
  selector: 'app-frequency-input',
  templateUrl: './frequency-input.component.html',
  styleUrls: ['./frequency-input.component.scss'],
  providers: [FrequencyInput, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: FrequencyInputComponent,
    multi: true,
  },]
})
export class FrequencyInputComponent implements OnInit,ControlValueAccessor {
  @Input() public set Item(inputType: measurementType) {
    this.model.inputType = inputType;
  }
  @Input() disabled:boolean = false;
  @Input() allowPastDate:boolean = false;
  @Input() isSubmitted:boolean = false;
  @Input() isInlineTitle:boolean = true;
  @Input() title:string = "";
  @Input() control: FormControl | undefined;
  
  @Output() valueChanged = new EventEmitter()
  private onChange = (value: string) => { };
  private onTouched = () => { };
  value: string = '';
  constructor(public model: FrequencyInput) {
  }
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
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  ngOnInit(): void {
  }

  change() {
    this.onChange(this.value);
    this.valueChanged.emit(this.value)
  }

  changeDate(e:any){
    // const data = new Date(e.year, e.month, e.day).toISOString()
    this.value = e;
    this.change()
  }

}
