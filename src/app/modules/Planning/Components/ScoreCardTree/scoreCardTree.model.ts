import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { listViewMode } from './../../../../shared/components/view-modes/viewMode.enum';
import { PopupService } from './../../../../shared/popup/popup.service';
import { Injectable } from "@angular/core";
import { IGoalItem } from "../GoalItem/interfaces";
import { Subject } from 'rxjs';
import { PlanningService } from '../../Page/planning.service';
import { Constant } from 'src/app/core/config/constant';

@Injectable()
export class ScoreCardTreeModel {

  private endSub$ = new Subject()
  //========================Data======================
  public goalItems: Array<IGoalItem> = new Array<IGoalItem>();
  public loading: boolean = true;
  public showNoDataModel: boolean = false;
  public showModel: boolean = false;
  public isEditChild: boolean = false;
  public viewMode: listViewMode = listViewMode.treeMode;
  public isShowHeader = false;
  public expandedChildren:string[] = [];
  public addGoalTitle = this.translateService.instant('Planning.addGoal');
  public editGoalTitle = this.translateService.instant('Planning.editGoal');

  constructor(private popupSer: PopupService, private planningSer: PlanningService, private translateService:TranslateService) {
    this.checkReset();
    this.handleLangChange();
    this.planningSer.selectedGroup$.pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.expandedChildren = [];
      this.planningSer.expnadedArraySub.next(this.expandedChildren)
    })

  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      if (res) {
        this.showModel = false;
        this.showNoDataModel = false;
      }
    })
  }

  private handleLangChange(){
    this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.addGoalTitle = this.translateService.instant('Planning.addGoal');
      this.editGoalTitle = this.translateService.instant('Planning.editGoal');
    })
  }

  public setExpanded(evt:string[]){
    this.expandedChildren = [...evt];
    this.planningSer.expnadedArraySub.next(this.expandedChildren)
  }
  // Getters & Setters
  public get HasItems() {
    return this.goalItems != null && this.goalItems && this.goalItems.length > 0;
  }

  public get getTreeView() {
    return this.viewMode === listViewMode.treeMode
  }
  
  public setViewMode(viewMode: listViewMode) {
    this.viewMode = viewMode;
  }

  public get getListView() {
    return this.viewMode === listViewMode.listMode
  }



  public openAddNewGoal() {
    this.showNoDataModel = true;
    this.isEditChild = false;
    this.popupSer.open("Add-Goal-no")
  }

  public openEditChild() {
    this.showModel = true;
    this.isEditChild = true
  }

  public endSubs() {
    this.endSub$.next("")
    this.endSub$.complete()
  }

  public openPopup(){
    this.showModel = true;
    this.isEditChild = false;
    this.popupSer.open('Add-Goal', {});
  }

  chnageViewMode(viewMode: listViewMode) {
    this.viewMode = viewMode;
    localStorage.setItem(Constant.scorecardIdViewMode, this.viewMode.toString());
  }

  public setExpand(isExpandAll: boolean) {
    this.planningSer.expandSub.next(isExpandAll);
  }


}
