import { takeUntil } from 'rxjs/operators';
import { TargetAndFrequencyComponent } from './../TargetAndFrequency/targetAndFrequency.component';
import { GoalInfoComponent } from './../GoalInfo/goalInfo.component';
import { AfterContentChecked, AfterViewInit, Component,Input,Output,OnChanges,SimpleChanges,ViewChild, EventEmitter, OnDestroy } from "@angular/core";
import { AddGoalModel } from "./addGoal.model";

@Component({
    selector: 'add-goal',
    templateUrl: './addGoal.component.html',
    styleUrls: ['./addGoal.component.scss'],
    providers: [AddGoalModel]
})

export class AddGoalComponent implements OnDestroy{
  @ViewChild(GoalInfoComponent) comp: GoalInfoComponent;
  @ViewChild("goalInfo") measurableComp: GoalInfoComponent;
  @ViewChild(TargetAndFrequencyComponent) freqComp: TargetAndFrequencyComponent;
  @Input() public set id(data: string) {
    this.model.scoreCardId = data;
  };
  @Input() public set isEditScoreCard(value: boolean) {
    this.model.isEditScoreCard = value;
    if(value){
      setTimeout(() => {
        this.model.checkEditScoreacrdMode();
      }, 1000);
    }
  };
  @Input() public set ShowParents(value: boolean) {
    this.model.showParents = value;
  };
  @Input() public set Parents(value: []) {
    this.model.parents = value;
  };
  @Output() update = new EventEmitter()
  @Output() setAddedGoal = new EventEmitter()
    //=======================Constructor==================
    constructor(public model: AddGoalModel) {
      this.model.update.pipe(takeUntil(this.model.endSub$)).subscribe(()=> this.update.emit())
      this.model.setAddedGoal.pipe(takeUntil(this.model.endSub$)).subscribe((data)=> this.setAddedGoal.emit(data))
    }

  ngAfterContentChecked(): void {
    this.model.goalInfoComp = this.comp
    this.model.measurableGoalInfo = this.measurableComp;
    this.model.freqComp = this.freqComp;
  }

  ngOnDestroy(): void {
    this.model.endSubs()
  }


}
