import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IchangedGoal, scorecardGroup } from '../../../Page/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EditGoalService {
  private goalTobeEdited: BehaviorSubject<IchangedGoal> = new BehaviorSubject<IchangedGoal>(null);
  goalTobeEdited$ = this.goalTobeEdited.asObservable()

  private TotalTarget: BehaviorSubject<number> = new BehaviorSubject<number>(null)
  TotalTarget$ = this.TotalTarget.asObservable();

  private selectedGroup: BehaviorSubject<scorecardGroup | null> = new BehaviorSubject<scorecardGroup | null>(null);
  selecetedGroup$ = this.selectedGroup.asObservable();

  constructor() { }

  setGoalToBeEdited(goal:any){
    this.goalTobeEdited.next(goal)
  }

  setTotalTarget(totalTarget: number) {
    this.TotalTarget.next(totalTarget)
  }

  setGroup(group: scorecardGroup){
    this.selectedGroup.next(group)
  }

}
