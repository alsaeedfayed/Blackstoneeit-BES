import {
  Component,
  Input,
  OnInit,
  forwardRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-range-control',
  templateUrl: './custom-range-control.component.html',
  styleUrls: ['./custom-range-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomRangeControlComponent),
      multi: true,
    },
  ],
})
export class CustomRangeControlComponent implements OnInit, OnChanges {
  @Input() maxRange: number;
  @Input() minRange: number;
  @Input() step: number;
  @Input() unit: number;
  @Input() preventAction: boolean;
  values = [];
  onChangeFn = (_) => {};
  selectedItem: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.maxRange) {
      let values = [];
      values = this.generateValues(this.minRange, this.maxRange, this.step);
      let generatedValues = [];
      values.forEach((item) => {
        generatedValues.push({
          value: item,
          highlighted: false,
        });
      });
      this.values = generatedValues;
      this.registerOnChange(null);
    }
  }

  writeValue(obj: any): void {
    if (obj === null) {
      this.onReset();
    }
    this.selectedItem = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    if (this.selectedItem) {
      this.values.forEach((item, i) => {
        this.values[i].highlighted = false;
        if (
          i <= this.values.findIndex((item) => item.value === this.selectedItem)
        ) {
          this.values[i].highlighted = true;
        }
      });
    }
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  onReset() {
    this.values.map((item) => (item.highlighted = false));
  }

  onSelect(index) {
    if (this.preventAction) return;
    this.selectedItem = null;
    this.values.map((item) => (item.highlighted = false));
    this.selectedItem = this.values[index];
    this.values.forEach((item, i) => {
      if (i <= index) {
        this.values[i].highlighted = true;
      }
    });
    this.onChangeFn(this.values[index].value);
  }

  generateValues(start, end, step) {
    return Array.from(
      Array.from(Array(Math.ceil((end - start + 1) / step)).keys()),
      (x) => start + x * step
    );
  }
}
