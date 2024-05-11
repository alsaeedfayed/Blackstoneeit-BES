import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-request-stepper',
  templateUrl: './change-request-stepper.component.html',
  styleUrls: ['./change-request-stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: ChangeRequestStepperComponent }],

})
export class ChangeRequestStepperComponent extends CdkStepper {

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

}
