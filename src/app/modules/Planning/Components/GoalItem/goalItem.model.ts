import { measurmentType } from './../TargetAndFrequency/enum';
import { listViewMode } from './../../../../shared/components/view-modes/viewMode.enum';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { EventEmitter, Injectable } from '@angular/core';
import { GoalFrequencyMode, LevelMode } from '../../enum/enums';
import { IGoalItem } from './interfaces';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GoalItemModel {
  //======================Data====================
  public lang: string = this.translateService.currentLang;
  public endSub$ = new Subject();
  public data: IGoalItem = {} as IGoalItem;
  public parentData: IGoalItem = {} as IGoalItem;
  public viewMode: listViewMode = listViewMode.treeMode;

  //=================Events=======================
  public onAddChild: EventEmitter<any> = new EventEmitter<any>();
  public onEditChild: EventEmitter<any> = new EventEmitter<any>();
  public onDeleteChild: EventEmitter<IGoalItem> = new EventEmitter<IGoalItem>();

  //=====================Logic====================

  constructor(
    private popupSer: PopupService,
    private httpSer: HttpHandlerService,
    private toastSer: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private translateService: TranslateService
  ) {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  public deleteGoal() {
    this.onDeleteChild.emit(this.data);
  }

  // Get Goal Level Text
  public get GoalLevelText() {
    return this.translateService.instant('Planning.' + LevelMode[this.data.level]);
  }

  // Get Goal Type Text
  public get GoalTypeText() {
    return this.lang === 'en' ? this.data.goalType?.name : this.data.goalType?.arabicName;
  }

  // Get Goal Type Color
  public get GoalTypeColor() {
    return this.data.goalType?.color;
  }

  public GoalfrequencyText(freq: number) {
    return this.data.measurementMethod === measurmentType.dataKBI ||
      this.data.measurementMethod === measurmentType.Subgoal
      ? this.translateService.instant('Planning.N/A')
      : this.translateService.instant('Planning.' + GoalFrequencyMode[freq]);
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
  // Get Goal Border Color
  // public get GoalBorderColor() {
  //   return this.data.isActive ? this.GoalTypeColor : "#ddd";
  // }

  // Add Child
  public addChild() {
    this.onAddChild.emit();
    this.popupSer.open('Add-Goal', this.data);
  }
  public editItem() {
    this.onEditChild.emit();
    this.popupSer.open('Add-Goal', {
      ...this.data,
      editMode: true,
      parent: this.parentData,
    });
  }

  public showDetails(){
    this.onEditChild.emit();
    this.popupSer.open('Add-Goal', {
      ...this.data,
      editMode: true,
      showOnlyDetails: true,
      parent: this.parentData,
    });
  }

  public endsubs() {
    this.endSub$.next('');
    this.endSub$.complete();
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
