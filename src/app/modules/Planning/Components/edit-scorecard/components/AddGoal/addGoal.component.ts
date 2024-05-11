import { CrTargetAndFrequencyComponent } from './../TargetAndFrequency/targetAndFrequency.component';
import { takeUntil } from 'rxjs/operators';
import { CRGoalInfoComponent } from './../GoalInfo/goalInfo.component';
import { Component,Input,Output,ViewChild, EventEmitter, OnDestroy } from "@angular/core";
import { AddGoalModel } from "./addGoal.model";

@Component({
    selector: 'cr-add-goal',
    templateUrl: './addGoal.component.html',
    styleUrls: ['./addGoal.component.scss'],
    providers: [AddGoalModel]
})

export class ChangeRequestAddGoalComponent implements OnDestroy{
  @ViewChild(CRGoalInfoComponent) comp: CRGoalInfoComponent;
  @ViewChild(CrTargetAndFrequencyComponent) FrequencyComp: CrTargetAndFrequencyComponent;
  @Input() public set id(data: string) {
    this.model.scoreCardId = data;
  };
  @Output() update = new EventEmitter()
  @Output() setEditedGoal = new EventEmitter()
    //=======================Constructor==================
    constructor(public model: AddGoalModel) {
      this.model.update.pipe(takeUntil(this.model.endSub$)).subscribe(()=> this.update.emit())
      this.model.setEditedGoal.pipe(takeUntil(this.model.endSub$)).subscribe((goal) => this.setEditedGoal.emit(goal))
    }

  ngAfterContentChecked(): void {
    this.model.goalInfoComp = this.comp
    this.model.FrequencyComp = this.FrequencyComp
  }

  ngOnDestroy(): void {
    this.model.endSubs()
  }


}
