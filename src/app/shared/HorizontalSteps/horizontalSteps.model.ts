import { Injectable } from "@angular/core";
import { IHorizontalStep } from "../HorizontalStep/iHorizontalStep";

@Injectable()
export class HorizontalStepsModel {

    //====================Data====================
    public steps: Array<IHorizontalStep> = new Array<IHorizontalStep>();

    
}