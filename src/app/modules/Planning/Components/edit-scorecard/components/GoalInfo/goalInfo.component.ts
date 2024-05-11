import { IType } from './interfaces';
import { takeUntil } from 'rxjs/operators';
import { Component, Output, EventEmitter, OnDestroy, Input, OnInit } from "@angular/core";
import { GoalInfoModel } from './goalInfo.model';

@Component({
  selector: 'cr-goal-info',
  templateUrl: './goalInfo.component.html',
  styleUrls: ['./goalInfo.component.scss'],
  providers: [GoalInfoModel]
})

export class CRGoalInfoComponent implements OnInit,OnDestroy {
  @Input() public set selectedType(data: IType) {
    this.model.selectedType = data;
  };
  @Input() public set scorecardId(id: string) {
    this.model.scorecardId = id;
  };
  @Input() public set isChnageMode(val: boolean) {
    this.model.isChnageMode = val;
  };
  @Output() setData = new EventEmitter();
  @Output() setGoalTypeEvent = new EventEmitter();
  @Output() setPrevAtachmentEvent = new EventEmitter();
  @Output() chnageModeEvent = new EventEmitter();
  //=======================Constructor==================
  constructor(public model: GoalInfoModel) {
    model.setDataEvent.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.setData.emit(data));
    model.setGoalTypeEvent.pipe(takeUntil(this.model.endSub$)).subscribe((data)=>this.setGoalTypeEvent.emit(data))
    model.chnageModeEvent.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.chnageModeEvent.emit(data))
    model.setPrevAtachmentEvent.pipe(takeUntil(this.model.endSub$)).subscribe((data) => this.setPrevAtachmentEvent.emit(data))
  }
  ngOnInit(): void {
    this.model.getLookups();
  }


  //end subscribtions
  ngOnDestroy(): void {
    this.model.endSubs()
  }

}
