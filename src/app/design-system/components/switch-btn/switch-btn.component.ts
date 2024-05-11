import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-switch-btn",
  templateUrl: "./switch-btn.component.html",
  styleUrls: ["./switch-btn.component.scss"],
})
export class SwitchBtnComponent implements OnInit {

  @Input() label: string;
  @Input() id: string = null;
  @Input() isRounded: boolean = true;
  private _value: any;
  public get value(): any {
    return !!this._value ? JSON.parse(this._value) : this._value;
  }
  @Input() public set value(value: any) {
    this._value = !!value ? JSON.parse(value) : value;
  }

  @Output() onChange: EventEmitter<boolean> = new EventEmitter();


  //@Input() onlyForDestroyedChart: boolean = false;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.handleLanguageChange()
  }

  sendValue(e: any) {
    this.onChange.emit(e.currentTarget.checked);
  }

  //to handle chart

  handleLanguageChange() {
    // this.translate.onLangChange.subscribe(lang => {
    //   if (this.onlyForDestroyedChart) {
    //     let xx: any = document.querySelector('.checkboxx')
    //     xx.click()
    //     xx.click()

    //   }
    // })
  }
}
