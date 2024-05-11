import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { PopupService } from './../../../../../../shared/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { Input } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { goalTypesCategory } from '../../Enums/enums';
import { Subject } from 'rxjs';
import { IGoalTypeSettings } from '../../Interfaces/interfaces';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
@Component({
  selector: 'app-goal-types-table',
  templateUrl: './goal-types-table.component.html',
  styleUrls: ['./goal-types-table.component.scss'],
})
export class GoalTypesTableComponent implements OnInit, OnDestroy {
  // PROPS
  private endSub$ = new Subject();
  public language = this.translateSer.currentLang;
  public isShowEditTypePopup: boolean = false;
  private goalIdToBeDeleted: number;
  public confirmMsg: string = this.translateSer.instant(
    'configuration.goalTypesObj.deleteConfirmMsg'
  );
  // INPUTS & OUTPUTS
  @Input() goalTypes: IGoalTypeSettings[] = [];
  @Output() typeDeleteEvent: EventEmitter<number> = new EventEmitter();
  @Output() typeEditedEvent: EventEmitter<IGoalTypeSettings> =
    new EventEmitter();

  editLabel = this.translateSer.instant('shared.edit');
  deleteLabel = this.translateSer.instant('shared.delete');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];

  // CONSTRUCTOR
  constructor(
    private translateSer: TranslateService,
    private confirmationPopupService: ConfirmModalService,
    private popupSer: PopupService,
    private httpSer:HttpHandlerService,
    private toastSer:ToastrService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateSer.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translateSer.currentLang;
        this.editLabel = this.translateSer.instant('shared.edit');
        this.deleteLabel = this.translateSer.instant('shared.delete');
        this.options = [
          {
            item: this.editLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bxs-edit',
          },
          {
            item: this.deleteLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bx-trash',
          },
        ];
      });
  }

  public msgText(goalType:IGoalTypeSettings):string{
    if(goalType.isEnabled) {
      return `${this.translateSer.instant("configuration.goalTypesObj.disenableMsg")} "${this.translateSer.currentLang == "en" ? goalType.name : goalType.arabicName}"?`
    } else {
      return `${this.translateSer.instant("configuration.goalTypesObj.enableMsg")} "${this.translateSer.currentLang == "en" ? goalType.name : goalType.arabicName}"?`
    }
  }

  public openModel(golaType: IGoalTypeSettings) {
    this.confirmationPopupService.open('confrontation-msg' + golaType.id);
  }

  public toggleActive(goalType:IGoalTypeSettings){
    this.confirmationPopupService.close('confrontation-msg' + goalType.id);
    this.httpSer.put(`${Config.GoalTypes.updateEnable}/${goalType.id}/${!goalType.isEnabled}`).pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.toastSer.success(this.translateSer.instant("configuration.goalTypesObj.successEdited"));
      this.typeEditedEvent.emit({...goalType,isEnabled: !goalType.isEnabled})
    })
  }

  public openEditPopup(goalType: IGoalTypeSettings) {
    this.isShowEditTypePopup = true;
    this.popupSer.open('edit-goalType', goalType);
  }

  public closeEditPopup() {
    this.isShowEditTypePopup = false;
    this.popupSer.close();
  }

  public deleteGoalType(goalType: IGoalTypeSettings) {
    this.goalIdToBeDeleted = goalType.id;
    this.confirmMsg =
      this.translateSer.instant('configuration.goalTypesObj.deleteConfirmMsg') +
      ` "${this.language == 'en' ? goalType.name : goalType.arabicName}"?`;
    this.confirmationPopupService.open();
  }

  public onDeleteGoalConfirmed() {
    this.typeDeleteEvent.emit(this.goalIdToBeDeleted);
  }

  public typeEditedHandler(editedType: IGoalTypeSettings) {
    this.isShowEditTypePopup = false;
    this.typeEditedEvent.emit(editedType);
  }

  // Getters & Setters
  public getCategoryName(category: goalTypesCategory): string {
    return this.translateSer.instant(
      'configuration.goalTypesObj.' + goalTypesCategory[category]
    );
  }

  // ON DESTROY

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  onOptionSelect(e, goal) {
    if (e === this.editLabel) {
      this.openEditPopup(goal);
    } else if (e === this.deleteLabel) {
      this.deleteGoalType(goal);
    }
  }
}
