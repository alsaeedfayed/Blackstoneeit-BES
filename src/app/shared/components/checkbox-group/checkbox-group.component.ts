import { IOption } from './../../../core/models/form-builder.interfaces';
import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CheckboxComponent } from './checkbox/checkbox.component';

@Component({
  selector: 'checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxGroupComponent,
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {
  @Input() title: string = '';
  @Input() options: IOption[] = [];
  @Input() disabled: boolean = false;
  @Input() control: FormControl | undefined;
  @Output() valueChanged = new EventEmitter();
  @ContentChildren(CheckboxComponent) checkBoxs: QueryList<CheckboxComponent>;

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  public selectedItems: any[] = [];

  private onChange = (value: any[]) => { };
  private onTouched = () => { };
  constructor(private translateService: TranslateService) { }

  isArLang() {
    return this.translateService.currentLang == 'ar';
  }
  writeValue(obj: any): void {
    this.selectedItems = obj;
    this.handleInitValue();
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

  ngOnInit(): void {
    setTimeout(() => {
      this.handleInitValue();
      this.handelCheckBoxes();
    }, 0);
  }

  handleInitValue() {
    this.checkBoxs?.forEach((check) => {
      if (this.selectedItems?.includes(check.identity)) {
        check.value = true;
      }
    });
  }

  handelCheckBoxes() {
    this.checkBoxs.forEach((check) => {
      check.emitValue.subscribe((identity) => {
        setTimeout(() => {
          this.setData(identity, check.value);
        }, 0);
      });
    });
  }

  setData(identity, isChecked: boolean) {
    if(!this.selectedItems){
      this.selectedItems = [];
    }
    if (isChecked) {
      this.selectedItems.push(identity);
    } else {
      this.selectedItems = this.selectedItems?.filter((id) => id != identity);
    }
    this.onChange(this.selectedItems);
    this.valueChanged.emit(this.selectedItems)
  }
}
