import { Injectable } from "@angular/core";
import { measurementType } from "../../enums/enums";

@Injectable()
export class FrequencyInput {
  inputType: measurementType = measurementType.percent;
  constructor() {
  }


  public get numberType() {
    return this.inputType === measurementType.number
  }
  public get percentType() {
    return this.inputType === measurementType.percent
  }
  public get currencyType() {
    return this.inputType === measurementType.currency
  }



}
