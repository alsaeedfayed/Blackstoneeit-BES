import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorPickerComponent,
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  // PROPS
  private onChange = (value: string) => { };
  private onTouched = () => { };
  public value: string;
  public suggestedColors: string[] = [];
  // INPUTS & OUTPUTS
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() public set SuggestedColors(colors: string[]) {
    this.suggestedColors = colors;
  }
  @Input() control: FormControl | undefined;

  constructor() { }

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
    this.disabled = isDisabled;
  }

  onChangeHandler() {
    this.onChange(this.value);
    this.suggestedColors.push(this.value)
  }

  selectPredefinedColorHandler(color: string) {
    this.value = color;
    this.onChange(this.value);
  }

  // Getters & Setters
  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
}
