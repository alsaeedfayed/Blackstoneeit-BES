import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-actual-target-statistics-submission',
  templateUrl: './actual-target-statistics-submission.component.html',
  styleUrls: ['./actual-target-statistics-submission.component.scss'],
})

export class ActualTargetStatisticsSubmissionComponent implements OnInit {
  
  @Input() actual:number = 0;
  @Input() target:number = 0;
  @Input() performance:number = 0;
  @Input() toolTips:any = {}; 

  constructor() {}

  ngOnInit(): void {}

  public get ActualTip(){
    return this.toolTips?.actual; 
  }

  public get TargetTip(){
    return this.toolTips?.target; 
  }
}
