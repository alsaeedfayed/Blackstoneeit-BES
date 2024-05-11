import { Component, Input } from "@angular/core";
import { IHorizontalStep } from "../HorizontalStep/iHorizontalStep";
import { HorizontalStepsModel } from "./horizontalSteps.model";

@Component({
    selector: 'horizontal-steps',
    templateUrl: './horizontalSteps.component.html',
    styleUrls: ['./horizontalSteps.component.scss'],
    providers: [HorizontalStepsModel]
})

export class HorizontalStepsComponent {

    //=====================Inputs====================
    @Input() public set steps(steps: Array<IHorizontalStep>) {
        this.model.steps = steps;
    }

    //====================Outputs====================

    //==================Constructor==================
    constructor(public model: HorizontalStepsModel) {}
    
}