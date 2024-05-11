import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-custom-checkboxes-control',
  templateUrl: './custom-checkboxes-control.component.html',
  styleUrls: ['./custom-checkboxes-control.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomCheckboxesControlComponent),
    multi: true
  }]
})
export class CustomCheckboxesControlComponent implements OnInit, ControlValueAccessor {
  @Input() items
  @Input() cardHeight: number
  lang: string
  selectedItems: any = []
  onChangeFn = (_) => { }
  constructor(private translationService: TranslationService) { }

  writeValue(obj: any): void {
    this.selectedItems = obj;
    this.selectedItems.forEach(ele => {
      this.items && (this.items[this.items.findIndex(item => item.id == ele.id)].isActive = true);
    });
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnInit() {
    this.lang = this.translationService.language
  }


  onSelectItem(item, index) {
    if (this.selectedItems?.find(x => x.id === item.id)) {
      this.selectedItems = this.selectedItems.filter(y => y.id !== item.id)
      this.items[index].isActive = false
    } else {
      this.selectedItems.push({ ...item, isActive: true })
      this.items[index].isActive = true
    }

    this.onChangeFn(this.selectedItems)
  }


}
