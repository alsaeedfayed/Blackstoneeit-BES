import { Component, Input } from "@angular/core";
import { HorizontalStepModel } from "./horizontalStep.model";
import { IHorizontalStep } from "./iHorizontalStep";

@Component({
    selector: 'horizontal-step',
    templateUrl: './horizontalStep.component.html',
    styleUrls: ['./horizontalStep.component.scss'],
    providers: [HorizontalStepModel]
})

export class HorizontalStepComponent {

    //=====================Inputs====================
    @Input() public set data(data: IHorizontalStep) {
        this.model.data = data;
    }

    //====================Outputs====================

    //==================Constructor==================
    constructor(public model: HorizontalStepModel) {}

}