import { Injectable } from "@angular/core";
import { measurmentType } from "../../enum";

@Injectable()
export class FrequencyInput {
  inputType: measurmentType = measurmentType.percent;
  constructor() {
  }


  public get numberType() {
    return this.inputType === measurmentType.number
  }
  public get percentType() {
    return this.inputType === measurmentType.percent
  }
  public get currencyType() {
    return this.inputType === measurmentType.currency
  }
  public get KBIType() {
    return this.inputType === measurmentType.dataKBI
  }


}
