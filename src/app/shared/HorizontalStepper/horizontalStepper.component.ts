import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IHorizontalStep } from "../HorizontalStep/iHorizontalStep";
import { HorizontalStepperModel } from "./horizontalStepper.model";

@Component({
    selector: 'horizontal-stepper',
    templateUrl: './horizontalStepper.component.html',
    styleUrls: ['./horizontalStepper.component.scss'],
    providers: [HorizontalStepperModel]
})

export class HorizontalStepperComponent {

    //=====================Inputs====================
    @Input() public set steps(steps: Array<IHorizontalStep>) {
        this.model.steps = steps;
    }
    
    //===================Outputs======================
    @Output() public onNext: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onBack: EventEmitter<any> = new EventEmitter<any>();

    //==================Constructor==================
    constructor(public model: HorizontalStepperModel) {
        this.model.onNext.subscribe((data) => this.onNext.emit(data));
        this.model.onBack.subscribe((data) => this.onBack.emit(data));
    }
    
}