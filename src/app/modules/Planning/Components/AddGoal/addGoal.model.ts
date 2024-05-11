import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { IType } from './../GoalInfo/interfaces';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TargetAndFrequencyComponent } from './../TargetAndFrequency/targetAndFrequency.component';
import { GoalInfoComponent } from './../GoalInfo/goalInfo.component';
import { Injectable, EventEmitter } from '@angular/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Istep } from 'src/app/shared/components/stepper/iStepper.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Config } from 'src/app/core/config/api.config';
import { ToastrService } from 'ngx-toastr';
import { frquencyType } from '../TargetAndFrequency/enum';
import { TranslateService } from '@ngx-translate/core';
import { IScorecard, scorecardGroup } from '../../Page/interfaces';
import { PlanningService } from '../../Page/planning.service';
import { EditGoalService } from '../edit-scorecard/components/edit-goal.service';
import { licenceKey } from 'src/license/license';

@Injectable()
export class AddGoalModel {
  //DATA
  public showParents: boolean = false;
  public parents: [] = []
  public addGoalMode = 1;
  public activeStep = 1;
  public steps: Istep[] = [
    {
      stepIndex: 1,
      stepTitle: this.translateService.instant('Planning.goalInfo'),
    },
    {
      stepIndex: 2,
      stepTitle: this.translateService.instant('Planning.targetFrequency'),
    },
  ];
  public editedGoalId: string = '';
  private goalInfoData: any;
  public endSub$ = new Subject();
  public scoreCardId: string;
  public isBtnLoading = false;
  public update = new EventEmitter();
  selectedType: IType;
  setAddedGoal = new EventEmitter()
  freqInfoData: any = {};
  public isEditMode: boolean = false;
  isChangeModeInfo: boolean;
  scorecardGroupId: number;
  scorecardLevel: number;
  //view children
  public goalInfoComp: GoalInfoComponent;
  public measurableGoalInfo: GoalInfoComponent;
  public freqComp: TargetAndFrequencyComponent;
  level$;
  groupId$
  prevAttachment: any[] = [];
  groupId: unknown;
  isEditScoreCard: boolean = false;
  isShowOnlyDetails: boolean = false;

  //constructor
  constructor(
    private modalSer: PopupService,
    private _httpSer: HttpHandlerService,
    private _http: HttpClient,
    private userService: UserService,
    private toastSer: ToastrService,
    private popupSer:PopupService,
    private translateService: TranslateService,
    private planningSer:PlanningService,
    private editScorecardSer: EditGoalService
  ) {
    this.getData();
    this.checkeditMode();
    this.checkReset();
  }


  checkEditScoreacrdMode() {
    if(this.isEditScoreCard){
      this.editScorecardSer.selecetedGroup$.pipe((takeUntil(this.endSub$))).subscribe((group:any)=>{
       // debugger
        if(group && group.level !== LevelMode.L0){
          this.measurableGoalInfo?.model.makeParentRequired();
        }
        this.measurableGoalInfo?.model.form.controls['groupId'].setValue(group? group.id : null);
        this.measurableGoalInfo?.model.getUserGroup();
      })
    }
  }


  //methods

  private getData() {
    this.planningSer.selectedGroup$
      .pipe(takeUntil(this.endSub$))
      .subscribe((group: scorecardGroup) => {
        if (group) {
          this.scorecardGroupId = group?.groupId;
        }
      });
    this.planningSer.SelectedScorecard$.pipe(takeUntil(this.endSub$)).subscribe(
      (scorecard: IScorecard) => {
        if (scorecard) {
          this.scorecardLevel = scorecard?.currentLevel;
        }
      }
    );
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      if (res) {
        this.activeStep = 1;
      }
    });
  }

  private checkeditMode() {
    this.popupSer.data.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      if (res && res.editMode && !res.showOnlyDetails) {
        this.editedGoalId = res.id;
        this.isEditMode = true;
      } else if (res && res.showOnlyDetails) {
        this.isShowOnlyDetails = true;
      }
    });
  }

  public onPopupCancel() {
    this.modalSer.close();
    this.modalSer.resetPopup();
  }

  public setPrevAtachment(event: any[]) {
    this.prevAttachment = event;
  }

  public setInfoData(data: any) {
    if (data) {
     // debugger
      this.goalInfoData = data;
      if (this.getMeasurableMode){
       // this.freqComp.model.checkSubGoaLChildMode(this.goalInfoData)
       if (!this.isEditMode && !this.isShowOnlyDetails){
          this.freqComp.model.checkSubGoaLChildMode(this.goalInfoData)
        }
        this.activeStep++;
      }
      else {
        if (this.getEditMode) this.updateGoal();
        else this.saveInformativeGoal();
      }
    }
  }

  private updateGoal() {
    this.isBtnLoading = true;
    combineLatest(this.UploadAllFilesToCloud(this.goalInfoData.attachments))
      .pipe(
        switchMap((res) => {
          // debugger
          const finalData = {
            ...this.goalInfoData,
            ...this.freqInfoData,
            attachments:
              this.goalInfoData.attachments.length > 0 && res[0]
                ? [...res, ...this.prevAttachment]
                : this.prevAttachment.length > 0
                ? [...this.prevAttachment]
                : null,
            scorecardId: this.scoreCardId,
            id: this.editedGoalId,
          };
          return this._httpSer.put(Config.Performance.updateGoal, finalData);
        }),
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe({
        next: () => {
          this.toastSer.success(this.translateService.instant('Planning.goalUpdatedSuccessfully'));
          this.onPopupCancel();
          this.update.emit();
        },
      });
  }

  public setFreqData(data: any) {
    if (data) {
      this.freqInfoData = data;
      if (this.getEditMode) this.updateGoal();
      else this.saveMeasurableGoal();
    }
  }
  public onNextStep() {
    this.measurableGoalInfo.model.saveChanges();
  }

  public onPopupSave() {
    if (this.getInformativeMode) {
      this.goalInfoComp.model.saveChanges();
    }
    if (this.getMeasurableMode) {
      this.freqComp.model.saveChanges();
    }
  }
  private saveInformativeGoal() {
    // debugger;
    this.isBtnLoading = true;
    combineLatest(this.UploadAllFilesToCloud(this.goalInfoData.attachments))
      .pipe(
        switchMap((res) => {
          const finalData = {
            ...this.goalInfoData,
            attachments: this.goalInfoData.attachments.length > 0 ? res : null,
            scorecardId: this.scoreCardId,
            scorecardGroupId:
              this.scorecardLevel == 1 ? null : this.goalInfoData.groupId,
          };
          return this._httpSer.post(Config.Performance.createGoal, finalData);
        }),
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe({
        next: (res) => {
          this.toastSer.success(this.translateService.instant('Planning.goalAddedSuccessfully'));
          this.onPopupCancel();
          this.update.emit();
          this.modalSer.resetPopup();
        }
      });
  }

  private saveMeasurableGoal() {
  // debugger;
    // if (

    //   !this.freqInfoData.isParentLinkedToChildren &&
    //   this.freqInfoData.measurementMethod !== measurmentType.dataKBI &&
    //   !this.checkMeasurmentValidation()
    // ) {
    //   this.toastSer.error(this.translateService.instant('Planning.summationErrorMsg'));
    //   return;
    // }
    this.isBtnLoading = true;
    if( !this.isEditScoreCard){
      combineLatest(this.UploadAllFilesToCloud(this.goalInfoData.attachments))
        .pipe(
          switchMap((res) => {
            const finalData = {
              ...this.goalInfoData,
              attachments: this.goalInfoData.attachments.length > 0 ? res : null,
              scorecardId: this.scoreCardId,
              scorecardGroupId:
                this.scorecardLevel == 1 ? null : this.goalInfoData.groupId,
              ...this.freqInfoData,
            };
            return this._httpSer.post(Config.Performance.createGoal, finalData);
          }),
          takeUntil(this.endSub$),
          finalize(() => (this.isBtnLoading = false))
        )
        .subscribe({
          next: (res) => {
            this.toastSer.success(this.translateService.instant('Planning.goalAddedSuccessfully'));
            this.onPopupCancel();
            this.update.emit();
            this.modalSer.resetPopup();
            this.activeStep = 1;
          }
        });
    } else {
      combineLatest(this.UploadAllFilesToCloud(this.goalInfoData.attachments))
        .pipe(
          switchMap((res) => {
            const finalData = {
              ...this.goalInfoData,
              attachments: this.goalInfoData.attachments.length > 0 ? res : null,
              scorecardId: this.scoreCardId,
              groupId: this.scorecardLevel == 1 ? null : this.groupId,
              scorecardGroupId:
                this.scorecardLevel == 1 ? null : this.goalInfoData.groupId,
              ...this.freqInfoData,
            };
            return of(finalData);
          }),
          takeUntil(this.endSub$),
          finalize(() => (this.isBtnLoading = false))
        )
        .subscribe({
          next: (res) => {
            this.setAddedGoal.emit({ ...res, isMaintainTargetForFrequency: res.IsMaintainTargetForFrequency });
            this.toastSer.success(this.translateService.instant("Planning.goalAddedSuccessfully"))
            this.onPopupCancel();
            this.modalSer.resetPopup();
          }
        });
    }

  }

  private checkMeasurmentValidation(): boolean {
    if (this.freqInfoData.isBaseline || this.freqInfoData.IsMaintainTargetForFrequency) return true
    let freqData: any;
    let freqVal: any[] = [];
    switch (this.freqInfoData.frequency) {
      case frquencyType.monthly:
        freqData = this.freqInfoData.monthlyTarget;
        break;
      case frquencyType.quarterly:
        freqData = this.freqInfoData.quarterTarget;
        break;
      case frquencyType.biYearly:
        freqData = this.freqInfoData.biYearlyTarget;
        break;
      case frquencyType.yearly:
        freqData = this.freqInfoData.yearlyTarget;
        break;
      default:
        freqData = this.freqInfoData.monthlyTarget;
        break;
    }
    Object.keys(freqData).forEach((key) => {
      freqVal.push(freqData[key]);
    });
    const total = freqVal.reduce((prev, currnet) => +prev + +currnet, 0);
    if (total == this.freqInfoData.totalTarget) {
      return true;
    } else {
      return false;
    }
  }

  public setMode(event: IType) {
    this.selectedType = event;
    this.goalMode = event.category;
  }

  public setChnageMode(evt: boolean) {
    this.isChangeModeInfo = evt;
  }

  private UploadAllFilesToCloud(attachment: any[]) {
    const uploadedFiles = attachment.map((attachment) => attachment.file);
    const obs$ = uploadedFiles.map((file) => {
      const formData = new FormData();
      formData.append('File', file);
      return this._http.post(
        Config.apiUrl + Config.fileService.upload,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
            'License-Key': licenceKey.valid
          }),
        }
      );
    });
    return attachment && attachment.length > 0 ? obs$ : of(null);
  }

  //Getters and Setters
  public get getInformativeMode(): boolean {
    return this.addGoalMode === 1;
  }

  public get getMeasurableMode(): boolean {
    return this.addGoalMode === 2;
  }

  public get getEditMode(): boolean {
    return this.isEditMode;
  }

  public get getEditScoreCardMode():boolean {
    return this.isEditScoreCard;
  }

  public set goalMode(val: number) {
    this.addGoalMode = val;
  }
  // end subscribtions
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
