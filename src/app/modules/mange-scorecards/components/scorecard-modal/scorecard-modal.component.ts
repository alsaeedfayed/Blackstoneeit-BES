import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { IScorecard } from '../../interfaces/mange-scorecards.interface';
import { scorecardModalModel } from './scorecard-modal.model';

@Component({
  selector: 'scorecard-modal',
  templateUrl: './scorecard-modal.component.html',
  styleUrls: ['./scorecard-modal.component.scss'],
  providers: [scorecardModalModel]
})
export class scorecardModalComponent implements OnInit,OnDestroy {
  @Input() public set Scorecard(scorecard:IScorecard){
    this.model.scorecard = scorecard;
  }
  @Output() newScorecardAdded = new EventEmitter()
  @Output() scorecardEdited:EventEmitter<IScorecard> = new EventEmitter()
  constructor(public model: scorecardModalModel) {
    this.model.newScorecardAdded.pipe(takeUntil(this.model.endSub$)).subscribe(()=>this.newScorecardAdded.emit())
    this.model.scorecardEdited.pipe(takeUntil(this.model.endSub$)).subscribe((data: IScorecard) => this.scorecardEdited.emit(data))
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.model.endSubs()
  }

}
