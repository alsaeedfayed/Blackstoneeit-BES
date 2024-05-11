import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';

@Component({
  selector: 'app-other-control',
  templateUrl: './other-control.component.html',
  styleUrls: ['./other-control.component.scss']
})
export class OtherControlComponent implements OnInit, ControlValueAccessor {

  _formDataDetails;
  @Input() other: any;
  @Input() set formDataDetails(_formDataDetails){
    this._formDataDetails = _formDataDetails;
    this._formDataDetails?.forEach(control => {
      if(control?.other) {
        this.other.value = control?.other;
      }
    });
  }
  controlTypeEnum = ControlTypeMode;
  @Output() handelChange: EventEmitter<any> = new EventEmitter();

  onChange: any = () => { };
  onTouch: any = () => { };

  constructor(public translateService: TranslateService) { }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }


  changeValue(val) {
    if(this.controlTypeEnum.Checkbox == this.other.type ||
      this.controlTypeEnum.RadioButton == this.other.type ||
      this.controlTypeEnum.SingleSelect == this.other.type ||
      this.controlTypeEnum.MultipleSelect == this.other.type){
        this.handelChange.emit(this?.other?.values?.find(item => item?.id == val || item?.id == val?.id  || (Array.isArray(val) && item?.id == val[0]) )?[this?.other?.values?.find(item => item?.id == val || item?.id == val?.id || (Array.isArray(val) && item?.id == val[0]) )]:null);
      }else{
        this.handelChange.emit(val);
      }
  }

}
