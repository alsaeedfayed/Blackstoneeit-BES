import { PopupService } from 'src/app/shared/popup/popup.service';
import { Subject } from 'rxjs';
import { measurmentType } from './../../enum';
import { EventEmitter, Injectable } from '@angular/core';
import { frquencyType } from '../../enum';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IGoalView } from '../../../GoalItem/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { PlanningService } from 'src/app/modules/Planning/Page/planning.service';

@Injectable()
export class FrequencyModel {
  public endSub$ = new Subject();
  selectedFreq: frquencyType = frquencyType.monthly;
  selectedType: measurmentType = measurmentType.percent;
  public form: FormGroup;
  monthes = [
    { label: this.translate.instant('Planning.Jan'), formControlName: 'janValue' },
    { label: this.translate.instant('Planning.Feb'), formControlName: 'febValue' },
    { label: this.translate.instant('Planning.Mar'), formControlName: 'marValue' },
    { label: this.translate.instant('Planning.Apr'), formControlName: 'aprValue' },
    { label: this.translate.instant('Planning.May'), formControlName: 'mayValue' },
    { label: this.translate.instant('Planning.Jun'), formControlName: 'junValue' },
    { label: this.translate.instant('Planning.Jul'), formControlName: 'julValue' },
    { label: this.translate.instant('Planning.Aug'), formControlName: 'augValue' },
    { label: this.translate.instant('Planning.Sep'), formControlName: 'sepValue' },
    { label: this.translate.instant('Planning.Oct'), formControlName: 'octValue' },
    { label: this.translate.instant('Planning.Nov'), formControlName: 'novValue' },
    { label: this.translate.instant('Planning.Dec'), formControlName: 'decValue' },
  ];
  quarts = [
    { label: this.translate.instant('Planning.Q1'), formControlName: 'firstQuarterValue' },
    { label: this.translate.instant('Planning.Q2'), formControlName: 'secondQuarterValue' },
    { label: this.translate.instant('Planning.Q3'), formControlName: 'thirdQuarterValue' },
    { label: this.translate.instant('Planning.Q4'), formControlName: 'fourthQuarterValue' },
  ];
  biYear = [
    { label: this.translate.instant('Planning.H1'), formControlName: 'fisrtHalf' },
    { label: this.translate.instant('Planning.H2'), formControlName: 'secondHalf' },
  ];
  public setFreqMeasurementEvt = new EventEmitter();
  isSubmitted: boolean = false;
  isEditMode: boolean;
  goalToBeEdited: IGoalView;
  isDisableAllInputs: boolean = false;
  constructor(
    private fb: FormBuilder,
    private popupSer: PopupService,
    private planningSer: PlanningService,
    private translate: TranslateService
  ) {
    this.initForm();
    this.checkeditMode();
    this.checkFreqEqualTargetCase()
    this.checkReset();
  }


  initForm() {
    let formGroup = this.getCurrentFormGroup();
    this.form = this.fb.group({
      ...formGroup,
    });

  }
  private checkeditMode() {
    this.popupSer.data.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      if (res && res.editMode) {
        this.isEditMode = true;
        this.getGoalData();
      }
    });
  }
  private getGoalData() {
    this.planningSer.currentEditedGoal$
      .pipe(takeUntil(this.endSub$))
      .subscribe((goal: IGoalView) => {
        if (goal) {
          this.goalToBeEdited = goal;
          setTimeout(() => {
            if (this.isEditMode) this.setGoalFrequencyData();
          }, 1000);
        }
      });
  }

  checkFreqEqualTargetCase() {
    this.planningSer.TotalTarget$.pipe(takeUntil(this.endSub$)).subscribe((target:number)=>{
      if (target && this.isDisableAllInputs) {
        setTimeout(() => {
          Object.keys(this.getCurrentFormGroup()).forEach((control) => {
            this.f[control].setValue(target)
          });
        }, 100);

      }
    })
  }

  public setGoalFrequencyData() {

    if(this.goalToBeEdited){
      let freqData: any = {};
      if (this.MonthlyFreq) {
        freqData = this.goalToBeEdited.monthlyTarget;
      } else if (this.QuarterlyFreq) {
        freqData = this.goalToBeEdited.quarterTarget;
      } else if (this.BiYearlyFreq) {
        freqData = this.goalToBeEdited.biYearlyTarget;
      } else {
        freqData = this.goalToBeEdited.yearlyTarget;
      }
      Object.keys(this.getCurrentFormGroup()).forEach((control) => {
        if(freqData){
          this.f[control].setValue(freqData[control])
        }
      });
    }
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.form.reset();
      this.isSubmitted = false;
    });
  }

  private getCurrentFormGroup() {
    if (this.MonthlyFreq) {
      return {
        janValue: ['', Validators.required],
        febValue: ['', Validators.required],
        marValue: ['', Validators.required],
        aprValue: ['', Validators.required],
        mayValue: ['', Validators.required],
        junValue: ['', Validators.required],
        julValue: ['', Validators.required],
        augValue: ['', Validators.required],
        sepValue: ['', Validators.required],
        octValue: ['', Validators.required],
        novValue: ['', Validators.required],
        decValue: ['', Validators.required],
      };
    } else if (this.QuarterlyFreq) {
      return {
        firstQuarterValue: ['', Validators.required],
        secondQuarterValue: ['', Validators.required],
        thirdQuarterValue: ['', Validators.required],
        fourthQuarterValue: ['', Validators.required],
      };
    } else if (this.BiYearlyFreq) {
      return {
        fisrtHalf: ['', Validators.required],
        secondHalf: ['', Validators.required],
      };
    } else {
      return {};
    }
  }

  saveChanges() {
   // console.log(this.selectedFreq)
    this.isSubmitted = true;
    if (this.form.invalid) return;
    let finalVal: any = { };
    let val: any = {};
    if (this.MonthlyFreq) {
      val.monthlyTarget = this.form.value;
    } else if (this.QuarterlyFreq) {
      val.quarterTarget = this.form.value;
    } else if (this.BiYearlyFreq) {
      val.biYearlyTarget = this.form.value;
    } else {
      val.yearlyTarget = {};
    }
    finalVal = { ...finalVal, ...val };
    this.setFreqMeasurementEvt.emit(finalVal);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public get MonthlyFreq() {
    return this.selectedFreq === frquencyType.monthly;
  }
  public get QuarterlyFreq() {
    return this.selectedFreq === frquencyType.quarterly;
  }
  public get BiYearlyFreq() {
    return this.selectedFreq === frquencyType.biYearly;
  }
  public get YearlyFreq() {
    return this.selectedFreq === frquencyType.yearly;
  }

  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
