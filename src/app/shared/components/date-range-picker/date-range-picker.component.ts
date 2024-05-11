import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateRangePickerComponent,
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor, OnInit {
  @Input() control: FormControl | undefined;
  @Input() disabled: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() allowPastDate: boolean = true;
  @Input() title: string;
  @Input() value: any;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();

  @Input() placeholder = [
    this.tr.instant('shared.startDate'),
    this.tr.instant('shared.endDate'),
  ]
  today = new Date();
  lang : string = "";

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  private onChange = (value: string) => { };
  private onTouched = () => { };
  constructor(private tr: TranslateService) { }

  ngOnInit(): void {
    this.lang = this.tr.currentLang;
    this.tr.onLangChange.subscribe(() => {
      this.lang = this.tr.currentLang;
      this.placeholder = [
        this.tr.instant('shared.startDate'),
        this.tr.instant('shared.endDate'),
      ]
    })

    setTimeout(() => {
    }, 6000);
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
    if (this.value.length == 0) this.value = null;
    this.onChange(this.value);
    this.onChangeEvent.emit(this.value);
  }

  disabledDate = (current: Date): boolean => {
    current.setHours(0,0,0);
    this.today.setHours(0,0,0);
    return ((current.getTime() - this.today.getTime())/(1000 * 3600 * 24)) < -1;
  }
}
