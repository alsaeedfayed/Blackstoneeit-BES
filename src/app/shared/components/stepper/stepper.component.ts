import { Component, Input, OnInit } from '@angular/core';
import { Istep } from './iStepper.interface';

@Component({
  selector: 'stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class customStepperComponent implements OnInit {
  @Input()
  steps!: Istep[];
  @Input()
  activeStep: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
