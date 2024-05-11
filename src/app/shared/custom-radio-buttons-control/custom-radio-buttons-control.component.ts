import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-radio-buttons-control',
  templateUrl: './custom-radio-buttons-control.component.html',
  styleUrls: ['./custom-radio-buttons-control.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomRadioButtonsControlComponent),
    multi: true
  }]
})
export class CustomRadioButtonsControlComponent implements OnInit, ControlValueAccessor {

  @Input() items
  @Input() cardHeight
  @Input() selectedItem: any
  @Input() optionsDesc
  @Input() readOnly: boolean = false;
  lang: string
  onChangeFn = (_) => { }
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor(private translate: TranslateService) { }

  writeValue(obj: any): void {
    if(obj){
      this.selectedItem = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnInit() {
    this.lang = this.translate.currentLang

    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  onSelectItem(item) {
    if(!this.readOnly){
      this.selectedItem = item;
      this.onChangeFn(this.selectedItem)
      this.change.emit(item)
    }
  }

}
