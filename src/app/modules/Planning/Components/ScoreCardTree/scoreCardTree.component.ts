import { Component, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { IGoalItem } from '../GoalItem/interfaces';
import { ScoreCardTreeModel } from './scoreCardTree.model';

@Component({
  selector: 'scoreCard-tree',
  templateUrl: './scoreCardTree.component.html',
  styleUrls: ['./scoreCardTree.component.scss'],
  providers: [ScoreCardTreeModel],
})

export class ScoreCardTreeComponent implements OnDestroy {

  @Input() lang: string;
  @Input() id: string;
  @Input() isAllowedToAdd: boolean = false;

  @Input() public set goalItems(goalItems: Array<IGoalItem>) {
    if (goalItems) {
      this.model.goalItems = goalItems;
    }
  }
  @Input() public set Loading(loading: boolean) {
    this.model.loading = loading;
    if (!loading) this.model.isShowHeader = true;
  }

  // Outputs
  @Output() updateListEvent = new EventEmitter();
  @Output() filterListEvent = new EventEmitter();
  @Output() deleteGoalEvent = new EventEmitter();

  constructor(public model: ScoreCardTreeModel) { }

  updateList() {
    this.updateListEvent.emit();
  }

  changeValue(e) {
    this.filterListEvent.emit(e);
  }

  deleteGoal(goalId: string) {
    this.deleteGoalEvent.emit(goalId)
  }

  closeAddGoalNoDataModel() {
    this.model.showNoDataModel = false;
  }

  closeAddGoalModel() {
    this.model.showModel = false;
  }

  ngOnDestroy(): void {
    this.model.endSubs();
  }
}
