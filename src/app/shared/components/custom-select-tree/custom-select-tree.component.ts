import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'custom-select-tree',
  templateUrl: './custom-select-tree.component.html',
  styleUrls: ['./custom-select-tree.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectTreeComponent,
      multi: true,
    },
  ],
})

export class CustomSelectTreeComponent implements ControlValueAccessor, OnInit, OnChanges {

  @Input() title: string;
  @Input() dir: string = '';
  @Input() disabled: boolean = false;
  value: string = '';
  @Input() control: FormControl | undefined;
  @Input() placeholder: string = '';
  @Input() isSubmitted: boolean = false;

  @Output() onKeyup = new EventEmitter();
  @Input() showValidations: boolean = true;
  @Output() onBlur = new EventEmitter();

  @Input() set items(value: any) {
    if (value) {
      this.itemsList = value;
    }
  }
  
  initValue: any = [];
  itemsList: any[] = [];
  nodes: [] = [];

  lang: string;

  private onChange = (value: any) => { };
  private onTouched = () => { };
  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  
  constructor(private translateService: TranslateService) {
    this.lang = this.translateService.currentLang;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initValue = this.control?.value;
  }

  toggle(item:any){
    item.expand = !item.expand;
  }

  toggleCheck(item:any){
    if(item.checked){
      this.initValue = this.initValue.filter(ele => ele != item?.id)
    }else{
      if(this.initValue == null)
        this.initValue = [];
      this.initValue.push(item?.id);
    }
    item.checked = !item.checked;
    let x = Array.from(new Set(this.initValue));
    this.onChange(x);
  }

  check(item:any){
    let result = this?.control?.value?.includes(item.id);
    if(result){
      item.checked = true;
    }else{
      item.checked = false;
    }
    this.checkChildren(item);
    return result;
  }

  checkChildren(item:any){
    for(let index=0;index<item?.children?.length;index++){
      if(this.initValue?.includes(item?.children[index]?.id) || item?.children[index]?.expand){
        item.expand = true;
        if(item?.children?.length > 0)
          this.checkChildren(item?.children);
      }
    }
    return;
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
  }

  focus() {
    this.onTouched();
  }

  keyup() {
    this.onKeyup.emit(this.value);
  }
}
