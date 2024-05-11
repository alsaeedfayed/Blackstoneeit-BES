import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-select-states",
  templateUrl: "./select-states.component.html",
  styleUrls: ["./select-states.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectStatesComponent,
      multi: true,
    },
  ],
})
export class SelectStatesComponent implements ControlValueAccessor, OnInit {
  value: string = "";

  @Input() id: string = "";
  @Input() title: string;
  @Input() placeholder: string = "";
  @Input() control: FormControl | undefined;
  @Input() language: string;
  private _disable: boolean = false;
  public get disable(): boolean {
    return this._disable;
  }

  @Input() public set disable(value: boolean) {
    this._disable = value;
  }
  @Input() isSubmitted: boolean = false;
  @Input() length: number = 0;
  @Input() minLength: number = 0;
  @Input() showValidations: boolean = true;
  @Input() textType: string = 'text' || 'email';
  @Output() onKeyup = new EventEmitter();

  isTextNotValid: boolean = false;
  notValidMessage: string = "";
  private onChange = (value: string[]) => { };
  private onTouched = () => { };

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  states: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.states = this.states || [];
  }

  writeValue(obj: any): void {
    this.states = obj || [];
    this.onChange(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  focus() {
    this.onTouched();
  }

  change() {
    this.onChange(this.states);
    (this.value.trim() == "") && (this.isTextNotValid = false);
  }

  keyup() {
    this.onKeyup.emit(this.states);
  }

  addItem() {
    if (this.value.trim() !== "") {
      if (this.textType == "email" && !this.isEmail(this.value.trim())) {
        this.isTextNotValid = true;
        this.notValidMessage = "shared.validations.emailOnly";
        return;
      } else {
        this.isTextNotValid = false;
        this.states?.push(this.value.trim());
        this.onKeyup.emit(this.states);
        this.value = '';
      }
    }
  }
  isEmail(text: string): boolean {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test the provided text against the regex
    return emailRegex.test(text);
  }

  removeItem(index: number) {
    this.states.splice(index, 1);
    this.onKeyup.emit(this.states);
  }
}
