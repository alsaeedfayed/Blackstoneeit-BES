import { Component, Input, OnInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { PlatformLocation } from '@angular/common';
import { AppInjector } from '../../app.module';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent extends CdkStepper {
  @Input() backBtnConfig: any;
  @Input() readonly: any;
  displayComments: boolean
  ngOnInit() {
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  back(){
    AppInjector.get(PlatformLocation).back();
  }

}
