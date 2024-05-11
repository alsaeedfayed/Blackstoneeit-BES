import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { listViewMode } from './../../../../shared/components/view-modes/viewMode.enum';
import { EventEmitter, Injectable } from "@angular/core";
import { IGoalItem } from "../GoalItem/interfaces";
import { GoalFrequencyMode, LevelMode } from '../../enum/enums';
import { Config } from 'src/app/core/config/api.config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { measurmentType } from '../TargetAndFrequency/enum';
import { scorecardGroup } from '../../Page/interfaces';
import { PlanningService } from '../../Page/planning.service';

@Injectable()
export class GoalItemsModel {
  private idToBeDeleted: number;
  //======================Data====================
  public lang: string = this.translateService.currentLang;
  public viewMode = listViewMode.treeMode;
  public endSub$ = new Subject()
  public goalItems: Array<IGoalItem> = new Array<IGoalItem>();
  public goalListItems: Array<IGoalItem> = new Array<IGoalItem>();
  public paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  public deleteChildEvent: EventEmitter<number> = new EventEmitter<number>();
  public totalItems: number = 0;
  public confirmMsg: string;
  public confirmModalText: string;
  flatenedGoalItems: IGoalItem[] = [];

  //=================Constructor==================
  constructor(private httpSer: HttpHandlerService, private toastSer: ToastrService, private confirmationPopupService: ConfirmModalService, private planningSer: PlanningService, private translateService: TranslateService) {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.confirmModalText = this.translateService.instant('shared.confirmModalText');
    });
  }

  public setGoalListItems(list: IGoalItem[]) {
    list.forEach((goal) => {
      if (goal.goalType && goal.goalType.category == 2) {
        this.goalListItems.push(goal)
      }
      if (goal.children && goal.children.length > 0) {
        this.setGoalListItems(goal.children)
      }
    });
    this.filterListByGroups()
  }

  private filterListByGroups() {
    this.planningSer.selectedGroup$.pipe().subscribe((group: scorecardGroup) => {
      //debugger
      let groupId = null;
      if (group)
        groupId = (group as any).id;

      this.goalListItems = this.goalListItems.filter(goal => goal.groupId == groupId);
    })
  }

  public GoalLevelText(level: number) {
    return this.translateService.instant('Planning.' + LevelMode[level]);
  }

  public GoalfrequencyText(freq: number) {
    return this.translateService.instant('Planning.' + GoalFrequencyMode[freq]);
  }

  public getMeasurmentMethodText(val: number) {
    switch (val) {
      case 1:
        return this.translateService.instant('Planning.%Percentage');
      case 2:
        return this.translateService.instant('Planning.#Number');
      case 4:
        return this.translateService.instant('Planning.$Currency');
      case 5:
        return this.translateService.instant('Planning.date');
      case 6:
        return this.translateService.instant('Planning.subGoal');
      default:
        return this.translateService.instant('Planning.N/A');
    }
  }

  deleteGoal(goal: IGoalItem) {
    this.confirmMsg = `${this.translateService.instant('Planning.deleteGoalConfirmationMsg')} (${goal.title}) ${this.lang === 'en' ? '?' : '؟'}`;
    this.idToBeDeleted = goal.id;
    this.confirmationPopupService.open();
  }

  onDeleteGoalConfirmed() {
    const apiPath = `${Config.Performance.deleteGoal}/${this.idToBeDeleted}`;
    //debugger
    this.httpSer.delete(apiPath).pipe(takeUntil(this.endSub$)).subscribe({
      next: (res) => {
        if (res) {
          this.deleteChildEvent.emit(this.idToBeDeleted);
          this.toastSer.success(this.translateService.instant('Planning.goalIsDeletedSuccessfully'));
        }
      },
      error: (err) => {
        return;
      }
    })
  }

  onPaginate(pageNumber: number) {
    this.paginationModle.pageIndex = pageNumber;
  }

  public endsubs() {
    this.endSub$.next("")
    this.endSub$.complete()
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date)
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  addittion(measurementMethod) {
    if (measurementMethod == measurmentType.currency)
      return this.translateService.instant('Planning.AED');
    else if (measurementMethod == measurmentType.percent)
      return '%';
    else
      return ""
  }

}
