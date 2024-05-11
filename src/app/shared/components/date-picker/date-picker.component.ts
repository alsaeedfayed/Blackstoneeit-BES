import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nz-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateComponent,
      multi: true,
    },
  ],
})
export class DateComponent implements ControlValueAccessor, OnInit {
  @Input() disabled: boolean = false;
  @Input() placeholder: string = this.translateService.instant('shared.selectDate');
  @Input() isSubmitted: boolean = false;
  @Input() ShowTime: boolean = false;
  @Input() control: FormControl | undefined;
  @Input() title: string;
  @Input() maxDate: any;
  @Input() minDate: any;
  @Input() ShowToday: boolean = true;

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  private onChange = (value: string) => { };
  private onTouched = () => { };
  value: any;
  disabledDate = (dateValue: Date) => {
   // dateValue.setHours(0, 0, 0);
   // let minDate = new Date(this.minDate);
   // minDate.setHours(0, 0, 0);

    if (!this.minDate && !this.maxDate) {
      return false;
    }
    if (this.minDate == 'today') {
      return dateValue.getTime() > new Date(this.maxDate).getTime() || new Date().getTime() > (dateValue.getTime() + (24 * 60 * 60 * 1000));
    }
    if (this.minDate == 'yesterday') {
      return dateValue.getTime() > new Date(this.maxDate).getTime() || new Date(Date.now() - 86400000).getTime() > (dateValue.getTime() + (24 * 60 * 60 * 1000));
    }
    //return dateValue.getTime() > new Date(this.maxDate).getTime() || minDate.getTime() > (dateValue.getTime() + (24 * 60 * 60 * 1000));
    // return dateValue.getTime() > new Date(this.maxDate).getTime() || new Date(this.minDate).getTime() > dateValue.getTime();
    return dateValue.getTime() > new Date(this.maxDate).getTime() || new Date(this.minDate).getTime() > (dateValue.getTime() + (24 * 60 * 60 * 1000));
  }
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() onInputChange: EventEmitter<any> = new EventEmitter();


  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    // console.log(this.maxDate)
  }

  writeValue(obj: any): void {
    if (obj == "1970-01-01T00:00:00.000Z") {
      this.value = null;
      this.onChange(null);
      return;
    }
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
    // console.log();
    this.onChange(this.value);
    this.onChangeEvent.emit(this.value);
    // console.log("from change ", this.value)
  }

  inputChange() {
    this.onChange(this.value);
    this.onInputChange.emit(this.value);
  }

}
