import {Component, EventEmitter, Inject, Input, OnInit, Optional, Output, Self, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-filed',
  templateUrl: './filed.component.html',
  styleUrls: ['./filed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FiledComponent,
      multi: true,
    },
  ],
})

export class FiledComponent implements ControlValueAccessor, OnInit {

  value: string = '';
  tagVal: string = '';
  @Input() tags: string[] = [];

  @Input() id: string = '';
  @Input() style: any = {};
  @Input() title: string;
  @Input() placeholder: string = '';
  @Input() dir: string = '';
  @Input() disabled: boolean = false;
  @Input() control: FormControl | undefined;
  @Input() isTagsFiled: boolean = false;
  @Input() isLongText: boolean = false;
  @Input() isPassword: boolean = false;
  @Input() isNumber: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() length: number = 0;
  @Input() minLength: number = 0;
  @Input() minValue: number = null;
  @Input() maxValue: number = null;
  @Input() showValidations: boolean = true;
  @Input() validMax: boolean = true

  @Output() onKeyup = new EventEmitter();
  @Output() onEnter = new EventEmitter();
  @Output() onBlur = new EventEmitter();

  private onChange = (value: string) => {
  };
  private onTouched = () => {
  };

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(obj);

    if (this.isTagsFiled && this.value === null) {
      this.tags = [];
    }
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

  keyup() {
    this.onKeyup.emit(this.value);
  }

  onEnterTag() {
    this.tagVal = this.tagVal.trim();

    if (this.tagVal == '') {
      return;
    }

    this.tags.push(this.tagVal);
    this.tagVal = '';
    this.value = this.tags.join(',');

    this.onEnter.emit(this.tags);
    this.change();
  }

  removeTag(item) {
    this.tags = this.tags.filter(tag => tag !== item);
    this.value = this.tags.join(',');

    this.change();
  }
}
