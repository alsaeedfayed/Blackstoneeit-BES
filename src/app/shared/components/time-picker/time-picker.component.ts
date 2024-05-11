import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nz-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimePickerComponent,
      multi: true,
    },
  ],
})
export class TimePickerComponent implements ControlValueAccessor, OnInit {
  @Input() disabled: boolean = false;
  @Input() placeholder: string = this.translateService.instant('shared.selectTime');
  @Input() isSubmitted: boolean = false;
  @Input() ShowTime: boolean = false;
  @Input() control: FormControl | undefined;
  @Input() title: string;
  @Input() maxDate: any;
  @Input() timeFormat: string = "h:mm a"
  @Input() use12Hr:boolean = true;
  @Input() minDate: any;
  @Input() minuteStep: number = 1;

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  private onChange = (value: string) => { };
  private onTouched = () => { };
  value: any;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
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
    this.onChangeEvent.emit(this.value);
  }
}
