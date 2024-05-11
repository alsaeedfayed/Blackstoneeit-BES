import { LevelMode } from './../enum/enums';
import { IScorecard, scorecardGroup } from './interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IGoalView, IGoalItem } from '../Components/GoalItem/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private SelectedScorecard: BehaviorSubject<IScorecard> = new BehaviorSubject(null);
  SelectedScorecard$ = this.SelectedScorecard.asObservable()

  public selectedGroup: BehaviorSubject<scorecardGroup> = new BehaviorSubject(null);
  selectedGroup$ = this.selectedGroup.asObservable();

  public currentLevel: BehaviorSubject<LevelMode> = new BehaviorSubject(null);
  currentLevel$ = this.currentLevel.asObservable();

  currentEditedGoal: BehaviorSubject<IGoalView> = new BehaviorSubject(null)
  currentEditedGoal$ = this.currentEditedGoal.asObservable()

  expnadedArraySub = new BehaviorSubject([]);
  expnadedArraySub$ = this.expnadedArraySub.asObservable()

  expandSub = new Subject();
  expandSub$ = this.expandSub.asObservable()

  private isNewScorecardAdded: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isNewScorecardAdded$ = this.isNewScorecardAdded.asObservable()

  private IsChnginrRequest: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  IsChnginrRequest$ = this.IsChnginrRequest.asObservable()

  private currentGoalsList: BehaviorSubject<IGoalItem[]> = new BehaviorSubject<IGoalItem[]>(null);
  currentGoalsList$ = this.currentGoalsList.asObservable()

  private TotalTarget:BehaviorSubject<number> = new BehaviorSubject<number>(null)
  TotalTarget$ = this.TotalTarget.asObservable()
  constructor() { }


  selectScoreCard(scorecard: IScorecard) {
    this.SelectedScorecard.next(scorecard)
  }

  setSelectedGroup(group: scorecardGroup) {
    this.selectedGroup.next(group)
  }

  setCurrentLevel(level:LevelMode){
    this.currentLevel.next(level);
  }

  setCuurentGoalToEdit(goal: IGoalView) {
    this.currentEditedGoal.next(goal);
  }

  setNewAddedScorecard(id: string) {
    this.isNewScorecardAdded.next(id);
  }

  chnageRequest(val:boolean) {
    this.IsChnginrRequest.next(val);
  }

  setCurrentGoalsList(goals:IGoalItem[]){
    this.currentGoalsList.next(goals);
  }

  setTotalTarget(totalTarget:number){
    this.TotalTarget.next(totalTarget)
  }
}
