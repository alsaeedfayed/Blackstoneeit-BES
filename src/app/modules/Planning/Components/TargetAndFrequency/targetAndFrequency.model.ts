import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IGoalView } from './../GoalItem/interfaces';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { FrequencyComponent } from './components/frequency/frequency.component';
import { Subject } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EventEmitter, Injectable } from '@angular/core';
import { frquencyType, measurmentType } from './enum';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PlanningService } from '../../Page/planning.service';
import { LevelMode } from '../../enum/enums';

@Injectable()
export class TargetAndFrequencyModel {
  public lang: string;
  public currentLevel: LevelMode = null;
  public SetDataEvt = new EventEmitter();
  public freqComp: FrequencyComponent;
  public internalWeightVal: number = 0;
  public types = [
    {
      txt: this.translateService.instant('Planning.%Percentage'),
      isActive: true,
      id: measurmentType.percent,
    },
    {
      txt: this.translateService.instant('Planning.#Number'),
      isActive: false,
      id: measurmentType.number,
    },
    {
      txt: this.translateService.instant('Planning.AEDCurrency'),
      isActive: false,
      id: measurmentType.currency,
    },
    {
      txt: this.translateService.instant('Planning.dateKBI'),
      isActive: false,
      id: measurmentType.dataKBI,
    },
    // { txt: this.translateService.instant('Planning.subGoal'), isActive: false, id: measurmentType.Subgoal },
  ];
  public freq = [
    {
      id: frquencyType.yearly,
      txt: this.translateService.instant('Planning.Yearly'),
      isActive: true,
    },
    {
      id: frquencyType.biYearly,
      txt: this.translateService.instant('Planning.Biyearly'),
      isActive: false,
    },
    {
      id: frquencyType.quarterly,
      txt: this.translateService.instant('Planning.Quarterly'),
      isActive: false,
    },
    {
      id: frquencyType.monthly,
      txt: this.translateService.instant('Planning.Monthly'),
      isActive: false,
    },
  ];
  selectedType: measurmentType = measurmentType.percent;
  selectedFreq = 4;
  public targetForm: FormGroup;
  public weightForm: FormGroup;
  public isParentLinkedToChildren: boolean = false;
  public endSub$ = new Subject();
  isSubmitted: boolean = false;
  isEditMode: boolean;
  isNotAllowedToBeSubGoal: boolean = false;
  public editedGoal: IGoalView;
  showOnlyDetails: boolean;
  filteredFreq: { id: frquencyType; txt: any; isActive: boolean; }[];
  filteredTypes: { txt: any; isActive: boolean; id: measurmentType; }[];

  constructor(
    private fb: FormBuilder,
    private popupSer: PopupService,
    private planningSer: PlanningService,
    private translateService: TranslateService,
    private toastser: ToastrService
  ) {
    this.handleLangChange();
    this.initForm();
    this.getCurrentLevel();
    this.checkeditMode();
    this.checkSubGoaLChildMode();
    this.checkReset();
    this.filteredFreq = this.freq;
    this.filteredTypes = this.types;
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.types = [
        {
          txt: this.translateService.instant('Planning.%Percentage'),
          isActive: true,
          id: measurmentType.percent,
        },
        {
          txt: this.translateService.instant('Planning.#Number'),
          isActive: false,
          id: measurmentType.number,
        },
        {
          txt: this.translateService.instant('Planning.AEDCurrency'),
          isActive: false,
          id: measurmentType.currency,
        },
        {
          txt: this.translateService.instant('Planning.dateKBI'),
          isActive: false,
          id: measurmentType.dataKBI,
        },
        {
          txt: this.translateService.instant('Planning.subGoal'),
          isActive: false,
          id: measurmentType.Subgoal,
        },
      ];
      this.freq = [
        {
          id: frquencyType.yearly,
          txt: this.translateService.instant('Planning.Yearly'),
          isActive: true,
        },
        {
          id: frquencyType.biYearly,
          txt: this.translateService.instant('Planning.Biyearly'),
          isActive: false,
        },
        {
          id: frquencyType.quarterly,
          txt: this.translateService.instant('Planning.Quarterly'),
          isActive: false,
        },
        {
          id: frquencyType.monthly,
          txt: this.translateService.instant('Planning.Monthly'),
          isActive: false,
        },
      ];
    });
  }

  private getCurrentLevel() {
    this.planningSer.currentLevel$.pipe(takeUntil(this.endSub$)).subscribe((level: LevelMode) => {
      this.currentLevel = level;
    })
  }

  initForm() {
    this.targetForm = this.fb.group({
      IsMaintainTargetForFrequency: [false, Validators.required],
      isBaseline: [false, Validators.required],
      isCentralizedKPI: [false],
      initial: ['', Validators.required],
      totalTarget: ['', Validators.required],
      isParentLinkedToChildren: [false, Validators.required],
    });
    this.weightForm = this.fb.group({
      internalWeight: [0, Validators.required],
      contributionWeight: [0, Validators.required],
    });
  }

  private checkeditMode() {
    this.popupSer.data.pipe(takeUntil(this.endSub$)).subscribe((res) => {
     // debugger
      if (res && res.editMode) {
        this.isEditMode = true;
        if (res.showOnlyDetails) this.showOnlyDetails = true;
        this.getGoalData();
      }
    });
  }

  private getGoalData() {
    this.planningSer.currentEditedGoal$
      .pipe(takeUntil(this.endSub$))
      .subscribe((goal: IGoalView) => {
        if (goal) {
          this.editedGoal = goal;
          const selectedMeasurmentMethod = this.types.find(
            (type) => type.id === +goal.measurementMethod
          );
          const selectedFrequency = this.freq.find(
            (freq) => freq.id === +goal.frequency
          );
          if (selectedMeasurmentMethod)
            this.toogleTypeActivations(selectedMeasurmentMethod);
          if (selectedFrequency) this.toogleFreqActivations(selectedFrequency);
          if (+goal.measurementMethod === measurmentType.dataKBI) {
            this.targetForm.controls['initial'].setValue(
              this.fromData(goal.dateGoalTarget.kpiDate1)
            );
            this.targetForm.controls['totalTarget'].setValue(
              this.fromData(goal.dateGoalTarget.kpiDate2)
            );
          } else {
            this.targetForm.controls['initial'].setValue(goal.initial);
            this.targetForm.controls['totalTarget'].setValue(goal.totalTarget);
          }

          this.f['isBaseline'].setValue(goal.isBaseline);
          this.f['isCentralizedKPI'].setValue(goal.isCentralizedKPI);
          this.f['IsMaintainTargetForFrequency'].setValue(goal.isMaintainTargetForFrequency)
          this.f['isParentLinkedToChildren'].setValue(
            goal.isParentLinkedToChildren
          );
          this.isParentLinkedToChildren = goal.isParentLinkedToChildren;
          this.weightForm.controls['internalWeight'].setValue(
            goal.internalWeight
          );
          this.weightForm.controls['contributionWeight'].setValue(
            goal.contributionWeight
          );

        }
      });
  }

  public checkSubGoaLChildMode(infoData = null) {
    this.popupSer.data$.pipe(takeUntil(this.endSub$)).subscribe((data) => {
      // debugger
      if (data) {
        if (!data.editMode && data.isParentLinkedToChildren) {
          this.isNotAllowedToBeSubGoal = true;
          // TODO if goal group is mot same as parent
          if (infoData && data.groupId !== infoData.groupId) {
            this.filteredFreq = this.freq.filter((freq) => {
              return freq.id == data.frequency;
            });
            this.filteredTypes = this.types.filter((type) => {
              return type.id == data.measurementMethod
            })

          }
        }
        // If The parent is automatically
        if (data && data.parent && data.parent.isParentLinkedToChildren) {
          // debugger
          this.isNotAllowedToBeSubGoal = true;
          if (infoData && data.parent.groupId !== infoData.groupId) {
            this.filteredFreq = this.freq.filter((freq) => {
              return freq.id == data.parent.frequency;
            });
            this.filteredTypes = this.types.filter((type) => {
              return type.id == data.parent.measurementMethod
            })
          }

        }

        if(this.filteredFreq?.length > 0)
          this.toogleFreqActivations(this.filteredFreq[0]);
        if(this.filteredTypes?.length > 0)
          this.toogleTypeActivations(this.filteredTypes[0])
        // this.selectedType = this.types[0].id;
        // this.types[0].isActive = true;
        // this.freq[0].isActive = true;
        // this.selectedFreq = this.freq[0].id;


      }
    });
  }

  private fromData(date: string) {
    if (date) {
      let data = new DatePipe('en').transform(date, 'M/d/y').split('/');
      return {
        day: +data[1],
        month: +data[0],
        year: +data[2],
      };
    }
    return null;
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.targetForm.reset();
      this.isSubmitted = false;
      this.selectedType = measurmentType.percent;
      this.selectedFreq = frquencyType.monthly;
    });
  }

  toogleTypeActivations(type) {
    // debugger
    if (this.selectedType == measurmentType.dataKBI) {
      this.targetForm.controls['initial'].reset()
      this.targetForm.controls['totalTarget'].reset()
    }
    this.types.forEach((type) => (type.isActive = false));
    type.isActive = true;
    if (type.id == measurmentType.dataKBI) {
      this.selectedFreq = 0;
      if (this.isEditMode && this.editedGoal.dateGoalTarget && this.editedGoal.dateGoalTarget.kpiDate1) {
        this.targetForm.controls['initial'].setValue(
          this.fromData(this.editedGoal.dateGoalTarget.kpiDate1)
        );
        this.targetForm.controls['totalTarget'].setValue(
          this.fromData(this.editedGoal.dateGoalTarget.kpiDate2)
        );
      }
    } else {
      this.selectedFreq = this.freq.find((freq) => freq.isActive).id || 0;
    }
    this.selectedType = type.id;
  }

  setFrequencies(totalTargetValue: number) {
    if (this.isFreqEqulTarget) {
      this.planningSer.setTotalTarget(totalTargetValue)
    }
  }

  setEqulFreqsCase(isEqual: boolean) {
    if (isEqual) {
      setTimeout(() => {
        this.planningSer.setTotalTarget(this.targetForm.controls['totalTarget'].value)
      }, 200);
    }
  }

  chnageTargetValidators(evt) {
    if (evt) {
      this.f['isCentralizedKPI'].setValue(false)
      this.f['initial'].removeValidators(Validators.required);
      this.f['totalTarget'].removeValidators(Validators.required);
      this.isParentLinkedToChildren = false;
    } else {
      this.f['initial'].addValidators(Validators.required);
      this.f['totalTarget'].addValidators(Validators.required);
    }
    this.f['initial'].updateValueAndValidity();
    this.f['totalTarget'].updateValueAndValidity();
  }
  toogleFreqActivations(freq) {
    this.freq.forEach((type) => (type.isActive = false));
    freq.isActive = true;
    this.selectedFreq = freq.id;
    this.setFrequencies(this.targetForm.controls['totalTarget'].value)
  }

  public setAllData(evt: any) {
    // evt.target = this.targetForm.controls['total'].value;
    let formVal = {
      ...this.targetForm.value,
      ...this.weightForm.value,
      isParentLinkedToChildren: this.isParentLinkedToChildren,
      frequency: this.selectedFreq,
      measurementMethod: this.selectedType,
      ...evt,
    };
    if (this.selectedFreq === frquencyType.yearly) {
      formVal = {
        ...formVal,
        IsMaintainTargetForFrequency: false,
        yearlyTarget: {
          value: this.targetForm.controls['totalTarget'].value,
        },
      };
    }
    this.SetDataEvt.emit(formVal);
  }

  saveChanges() {
    this.isSubmitted = true;
    if (
      !this.getSubGoalMode() &&
      (this.targetForm.controls['initial'].value >
        this.targetForm.controls['totalTarget'].value)
    ) {
      this.toastser.error(
        this.translateService.instant('Planning.targetErrorMsg')
      );
      return;
    }
    if (this.targetForm.invalid || this.weightForm.invalid) return;
    if (this.isParentLinkedToChildren && !this.getDateMode) {
      const formVal = {
        ...this.targetForm.value,
        ...this.weightForm.value,
        IsMaintainTargetForFrequency: false,
        initial: 0,
        totalTarget: 0,
        measurementMethod: this.selectedType,
        frequency: this.selectedFreq,
      };
      this.SetDataEvt.emit(formVal);
      return;
    }
    if (this.getDateMode) {
      let intial = this.targetForm.controls['initial'].value;
      let target = this.targetForm.controls['totalTarget'].value;
      if (intial && target) {
        intial = new Date(
          this.targetForm.controls['initial'].value.year,
          this.targetForm.controls['initial'].value.month - 1,
          this.targetForm.controls['initial'].value.day
        ).toISOString();
        target = new Date(
          this.targetForm.controls['totalTarget'].value.year,
          this.targetForm.controls['totalTarget'].value.month - 1,
          this.targetForm.controls['totalTarget'].value.day
        ).toISOString();
      }
      if (intial > target) {
        this.toastser.error(
          this.translateService.instant('Planning.targetErrorMsg')
        );
        return;
      }
      let formVal = {
        ...this.weightForm.value,
        isBaseline: this.f['isBaseline'].value,
        dateGoalTarget: {
          kpiDate1: intial ?? this.targetForm.controls['initial'].value,
          kpiDate2: target ?? this.targetForm.controls['totalTarget'].value,
        },
        isParentLinkedToChildren: false,
        IsMaintainTargetForFrequency: false,
        frequency: 0,
        measurementMethod: this.selectedType,
      };
      if (this.f['isBaseline'].value) {
        formVal = {
          ...formVal,
          IsMaintainTargetForFrequency: false,
          dateGoalTarget: {
            kpiDate1: new Date(Date.now()).toISOString(),
            kpiDate2: new Date(Date.now() + 1000).toISOString()
          }
        }
      }
      this.SetDataEvt.emit(formVal);
      return;
    }
    if (this.IsBaselineKBI) {
      const formVal = {
        ...this.targetForm.value,
        ...this.weightForm.value,
        IsMaintainTargetForFrequency: false,
        initial: 0,
        totalTarget: 100,
        measurementMethod: this.selectedType,
        frequency: frquencyType.yearly,
      };
      this.SetDataEvt.emit(formVal);
      return;
    }
    this.freqComp.model.saveChanges();
  }

  //getters and setters
  get f(): { [key: string]: AbstractControl } {
    return this.targetForm.controls;
  }
  public get getDateMode(): boolean {
    return this.selectedType === measurmentType.dataKBI;
  }

  public get IsBaselineKBI(): boolean {
    return this.f['isBaseline'].value;
  }

  public get isParentSubGoal(): boolean {
    return this.isNotAllowedToBeSubGoal;
  }
  public get isFreqEqulTarget(): boolean {
    return this.f['IsMaintainTargetForFrequency'].value
  }

  public get isYearlyFreq(): boolean {
    return this.selectedFreq === frquencyType.yearly
  }

  public getSubGoalMode(): boolean {
    return this.isParentLinkedToChildren;
  }

  public get isL0Goal(): boolean {
    return !!this.currentLevel && this.currentLevel === LevelMode.L0;
  }

  // End subscribtion
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
