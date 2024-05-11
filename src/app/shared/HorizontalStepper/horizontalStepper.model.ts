import { EventEmitter, Injectable } from "@angular/core";
import { IHorizontalStep } from "../HorizontalStep/iHorizontalStep";

@Injectable()
export class HorizontalStepperModel {

    //====================Data====================
    public steps: Array<IHorizontalStep> = new Array<IHorizontalStep>();
    
    //=================Events======================
    public onNext: EventEmitter<any> = new EventEmitter<any>();
    public onBack: EventEmitter<any> = new EventEmitter<any>();
    
    //====================Logic====================

    // To Back
    public toBack() {
        this.onBack.emit();
    }

    // To Next
    public toNext() {
        this.onNext.emit();
    }
}