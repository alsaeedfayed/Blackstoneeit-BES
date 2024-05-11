import { Component, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-textarea-filed',
  templateUrl: './textarea-filed.component.html',
  styleUrls: ['./textarea-filed.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaFiledComponent,
      multi: true,
    },
  ],
})
export class TextareaFiledComponent implements ControlValueAccessor, OnInit {
  @Input() title: string;
  @Input() disabled: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() placeholder: string = '';
  @Input() length: number = 0;
  @Input() minLength: number = 0;
  @Input() showValidations: boolean = true;

  value: string = '';
  @Input() control: FormControl | undefined;
  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  private onChange = (value: string) => { };
  private onTouched = () => { };

  constructor() { }
  ngOnInit(): void {
   // console.log(this.length)
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  change() {
    this.onChange(this.value);
  }

  focus() {
    this.onTouched();
  }
}
