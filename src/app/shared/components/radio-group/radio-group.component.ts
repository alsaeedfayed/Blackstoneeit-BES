import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { RadioBoxComponent } from './radio-box/radio-box.component';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioGroupComponent,
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit {
  
  @Input() control: FormControl | undefined;
  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  @ContentChildren(RadioBoxComponent) radioBoxs: QueryList<RadioBoxComponent>;
  @Input() disabled: boolean = false;
  value: any;
  @Input() title: string;
  @Output() valueChanged = new EventEmitter()

  private onChange = (value: boolean) => { };
  private onTouched = () => { };
  constructor() { }

  writeValue(obj: boolean): void {
    this.onChange(obj);
    setTimeout(() => {
      this.activeRadio(obj);
      this.handelRadioBoxes();
    }, 500);
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

  ngOnInit(): void {


  }

  handelRadioBoxes() {
    this.radioBoxs.forEach((radio) => {
      radio.emitValue.subscribe((value) => {
        this.value = value;
        this.onChange(this.value);
        this.activeRadio(value);
        this.valueChanged.emit(this.value);
      });
    });
  }

  activeRadio(value: any) {
    this.radioBoxs.forEach((radio) => {
      if (this.disabled) {
        radio.disabled = true;
      }
      if (radio.value == value) {
        radio.active = true;
      } else {
        radio.active = false;
      }
    });
  }
}
