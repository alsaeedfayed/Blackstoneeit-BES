import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BAUStateService {
  constructor() {
    // const savedState = localStorage.getItem("BAUState");
    // if (savedState) {
    //   this.BAUState = JSON.parse(savedState);
    // }
  }

  private BAUState = {
    canChangeBudget: false,
    canCreateTaskBoard: false,
    hasBoard: false,
    year: null,
  };

  private canChangeBudgetSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.BAUState.canChangeBudget);


  setBAUState(state: any): void {
    this.BAUState.canChangeBudget = state.canChangeBudget;
    this.BAUState.canCreateTaskBoard = state.canCreateTaskBoard;
    this.BAUState.hasBoard = state.hasBoard;
    this.BAUState.year = state.year;

    this.canChangeBudgetSubject.next(state.canChangeBudget);

    // localStorage.setItem("BAUState", JSON.stringify(state));
  }

  getBAUState() {
    return this.BAUState;
  }

  getCanChangeBudget(): Observable<boolean> {
    return this.canChangeBudgetSubject.asObservable();
  }

  getCanCreateTaskBoard(): boolean {
    return this.BAUState.canCreateTaskBoard;
  }

  getHasBoard(): boolean {
    return this.BAUState.hasBoard;
  }

  getYear(): any {
    return this.BAUState.year;
  }


  private reloadInsightsSubject = new Subject<void>();

  reload$ = this.reloadInsightsSubject.asObservable();

  triggerInsightsReload() {
    this.reloadInsightsSubject.next();
  }
}
