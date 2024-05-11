import { IType } from './../GoalInfo/interfaces';
import { switchMap, takeUntil, finalize, map } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Injectable, EventEmitter } from '@angular/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Istep } from 'src/app/shared/components/stepper/iStepper.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Config } from 'src/app/core/config/api.config';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CRGoalInfoComponent } from '../GoalInfo/goalInfo.component';
import { CrTargetAndFrequencyComponent } from '../TargetAndFrequency/targetAndFrequency.component';
import { frquencyType, measurmentType } from '../TargetAndFrequency/enum';
import { PlanningService } from 'src/app/modules/Planning/Page/planning.service';
import { IScorecard, scorecardGroup } from 'src/app/modules/Planning/Page/interfaces';
import { licenceKey } from 'src/license/license';

@Injectable()
export class AddGoalModel {
  //DATA
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
  freqInfoData: any = {};
  public isEditMode: boolean = false;
  isChangeModeInfo: boolean;
  scorecardGroupId: number;
  scorecardLevel: number;
  //view children
  public goalInfoComp: CRGoalInfoComponent;
  level$;
  groupId$
  prevAttachment: any[] = [];
  currentLevel: unknown;
  groupId: unknown;
  FrequencyComp: CrTargetAndFrequencyComponent;
  setEditedGoal = new EventEmitter()

  //constructor
  constructor(
    private modalSer: PopupService,
    private _httpSer: HttpHandlerService,
    private _http: HttpClient,
    private userService: UserService,
    private toastSer: ToastrService,
    private popupSer: PopupService,
    private translateService: TranslateService,
    private planningSer: PlanningService
  ) {
    this.getData();
    this.checkeditMode();
    this.checkReset();
    this.getCurrentLevelAndGroup()
  }
  getCurrentLevelAndGroup() {
    this.level$ = this.planningSer.SelectedScorecard$.pipe(map((scorecard: IScorecard) => scorecard?.currentLevel));
    this.groupId$ = this.planningSer.selectedGroup$.pipe(map((group: scorecardGroup) => group ? group.groupId ?? null : null));
    combineLatest(this.level$, this.groupId$).subscribe(([level, group]) => {
      this.currentLevel = level;
      this.groupId = group
    })
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

  public setFreqData(data: any) {
    if (data) {
      this.freqInfoData = data;
      this.saveGoal()
    }
  }

  public onNextStep() {
    this.goalInfoComp.model.saveChanges();
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
      if (res && res.editMode) {
        this.editedGoalId = res.id;
        this.isEditMode = true;
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
      this.goalInfoData = data;
      this.activeStep = 2;
      // this.saveGoal();
    }
  }

  public onPopupSave() {
    this.FrequencyComp.model.saveChanges();
  }
  private saveGoal() {
    // if (
    //   !this.freqInfoData.isParentLinkedToChildren &&
    //   this.freqInfoData.measurementMethod !== measurmentType.dataKBI &&
    //   !this.checkMeasurmentValidation()
    // ) {
    //   this.toastSer.error(this.translateService.instant('Planning.summationErrorMsg'));
    //   return;
    // }
    this.isBtnLoading = true;
    combineLatest(this.UploadAllFilesToCloud(this.goalInfoData.attachments))
      .pipe(
        switchMap((res) => {
          const finalData = {
            ...this.goalInfoData,
            ...this.freqInfoData,
            attachments: this.goalInfoData.attachments.length > 0 ? res : null,
            scorecardId: this.scoreCardId,
            level: this.currentLevel,
            groupId: this.scorecardLevel == 1 ? null : this.groupId,
            scorecardGroupId:
              this.scorecardLevel == 1 ? null : this.goalInfoData.groupId,

          };
          return of(finalData);
        }),
        takeUntil(this.endSub$),
        finalize(() => (this.isBtnLoading = false))
      )
      .subscribe({
        next: (res) => {
          this.toastSer.success(this.translateService.instant('Planning.goalUpdatedSuccessfully'));
          this.onPopupCancel();
          this.setEditedGoal.emit(res);
          this.modalSer.resetPopup();
        }
      });
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
    //  const uploadedFiles = attachment.map((attachment) => attachment?.file);
    //const obs$ = uploadedFiles.map((file) => {
    const obs$ = attachment.map((file) => {
      if (file?.file && file.file instanceof File) {
        const formData = new FormData();
        formData.append('File', file.file);
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
      }
      return of(file);
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

  public set goalMode(val: number) {
    this.addGoalMode = val;
  }
  // end subscribtions
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
