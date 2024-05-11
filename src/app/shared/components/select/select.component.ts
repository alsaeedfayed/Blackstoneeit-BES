import {TranslateService} from '@ngx-translate/core';
import {Component, Input, OnInit, EventEmitter, Output, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit {
  @Input() bindVlaue: any = 'id';
  @Input() bindLabel: any = 'name';
  @Input() placeholder: string = '';
  @Input() noItemsText: string = 'shared.noItemsFound';
  @Input() control: FormControl | undefined;
  @Input() dropdownPosition: 'bottom' | 'top' | 'auto' = 'auto';
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = false;
  @Input() compareWith: () => boolean = null;
  @Input() search: boolean = true;
  @Input() title: string = '';
  @Input() multiple: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() showValidations: boolean = true;

  @Input() value: any;
  @Input() onDrop: boolean = true;

  @Input() set loading(value: boolean) {
    this.loadingValue = value;
  }

  @Input() set items(value: any) {
    if (value && Array.isArray(value)) {
      this.itemsList = value;
    }
  }

  @Output() change = new EventEmitter()
  @Output() onFocus = new EventEmitter()
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>()

  @ViewChild('select') select: NgSelectComponent;

  private onChange_ = (value: string) => {
  };
  private onTouched = () => {
  };
  initValue: any;
  itemsList: any[] = [];
  loadingValue: boolean = false;

  lang: string;

  constructor(private translateSer: TranslateService) {}

  ngOnInit(): void {
    this.lang = this.translateSer.currentLang;
    this.setDefaultVals();
    this.checkLangChange()
    if (this.value) {
      this.initValue = this.value;
    }
  }

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  private checkLangChange() {
    this.translateSer.onLangChange.pipe().subscribe((language) => {
      this.lang = language.lang;
      this.itemsList = [...this.itemsList]
    })
  }

  setDefaultVals() {
    // if (this.itemsList) {
    //   const selected = (this.itemsList as any[]).filter((opt) => opt.selected)
    //   if (selected && selected.length > 0) {
    //     if (this.multiple) this.initValue = selected.map((opt) => opt.id)
    //     else this.initValue = selected[0].id
    //     this.changeValue(this.initValue);
    //   }
    //   //setTimeout(() => {
    //     this.change.emit(this.initValue)
    //   //}, 1000)

    // }
  }

  writeValue(obj: any): void {
    this.initValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange_ = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  changeValue(event) {
    this.onChange_(this.initValue);
  }

  focus() {
    this.onTouched();
  }

  _onfocus() {
    this.onFocus.emit();
  }

  clearHandler(evt: any) {
    this.change.emit(this.initValue)
  }

  searchValue(value) {
    if(value && value.term.trim()) 
      this.onSearch.emit(value.term.trim())
  }

}
