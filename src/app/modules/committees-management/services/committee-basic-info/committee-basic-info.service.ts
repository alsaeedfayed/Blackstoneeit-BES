import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';

@Injectable({
  providedIn: 'root'
})
export class CommitteeBasicInfoService {

  committeeMembers$: BehaviorSubject<any[]> = new BehaviorSubject([])

  committeeStrategicGoals$: BehaviorSubject<any> = new BehaviorSubject(null)
  private committeeStrategicGoals: StrategyMappingKPI[] = [];

  // to be completed
  private _committeeMemberTypes = [
    {title : {en: "User", ar: "مستخدم"}},
    { title: { en: "Chairman", ar: "الرئيس" } },
    { title: { en: "Vice Chairman", ar: "نائب الرئيس" } },
    { title: { en: "Secretory", ar: "سكراتير" } },
    { title: { en: "Member", ar: "عضو" } },
  ]
  get committeeMemberTypes() {
    return this._committeeMemberTypes;
  }
  // getCommitteeStrategicGoals() {
  //   return this.committeeStrategicGoals;
  // }
  // setCommitteeStrategicGoals(committeeStrategicGoals: StrategyMappingKPI[]) {
  //   this.committeeStrategicGoals = committeeStrategicGoals;
  // }

  constructor() { }
}
