import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { IGoalItem } from './../../../Planning/Components/GoalItem/interfaces';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from './../../../../shared/popup/popup.service';
import { Config } from './../../../../core/config/api.config';
import { HttpHandlerService } from './../../../../core/services/http-handler.service';

import { takeUntil, switchMap, finalize } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { IScorecard } from 'src/app/modules/Planning/Page/interfaces';
import { PlanningService } from 'src/app/modules/Planning/Page/planning.service';

@Injectable()
export class changeRequestPopupModel {
  public endSub$ = new Subject();
  public selectedGroup = null;
  //======================Data====================
  public lang: string = this.translateService.currentLang;
  public form: FormGroup;
  public levels = [
    { id: 2, txt: this.translateService.instant('cr.L1') },
    { id: 3, txt: this.translateService.instant('cr.L2') },
    { id: 4, txt: this.translateService.instant('cr.L3') },
  ];
  public types = [
    {
      id: 1,
      txt: this.translateService.instant('cr.newKBI'),
      color: 'rgb(255, 26, 140)',
      isActive: false,
    },
    {
      id: 2,
      txt: this.translateService.instant('cr.editKBI'),
      color: 'rgb(255, 26, 140)',
      isActive: false,
    },
    {
      id: 3,
      txt: this.translateService.instant('cr.removeKBI'),
      color: 'rgb(255, 26, 140)',
      isActive: false,
    },
  ];
  public groups: any[] = [];
  public filteredGroups: any[] = [];
  public isBtnLoading: boolean = false;
  public isSubmitted: boolean = false;
  public selectedType: {
    id: number;
    txt: string;
    color: string;
    isActive: boolean;
  };
  public selectedScorecard: IScorecard;
  private uploadedAttachments: File[] = [];
  public goalsList: any[] = [];
  public filteredGoalsList: any[] = [];
  // inputs and outputs
  public updateList: EventEmitter<any> = new EventEmitter();

  // Static Strings For Translations
  public groupLabel = this.translateService.instant('cr.group');
  public sectionLabel = this.translateService.instant('cr.section');
  public sectorsLabel = this.translateService.instant('cr.sectors');
  public sectionsLabel = this.translateService.instant('cr.sections');
  public departmentsLabel = this.translateService.instant('cr.departments');
  filteredLevels: any[] = [];

  //=====================Logic====================
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private planningSer: PlanningService,
    private httpSer: HttpHandlerService,
    private attachmentSer: AtachmentService,
    private popupSer: PopupService,
    private toastSer: ToastrService
  ) {
    this.selectedType = this.types[0];
    this.initForm();
    this.getSelectedScorecard();
    this.getSelectedData();
    this.getCurrentGoals();
    this.handleLanguageChange();
  }
  private getCurrentGoals() {
    this.planningSer.currentGoalsList$
      .pipe(takeUntil(this.endSub$))
      .subscribe((goals: IGoalItem[]) => {
        this.flateningGoals(goals);
      });
  }

  private flateningGoals(goals: IGoalItem[]) {
    goals.forEach((goal) => {
      this.goalsList.push(goal);
      if (goal.children && goal.children.length > 0) {
        this.flateningGoals(goal.children);
      }
    });
  }

  private getSelectedData() {
    this.planningSer.selectedGroup$
      .pipe(takeUntil(this.endSub$))
      .subscribe((group) => {
        if(group){
          console.log(group);
          this.f['level'].setValue((group as any).level);
          this.selectedGroup = group;
          this.filteredGroups.push(group);
          this.f['groupId'].setValue((group as any).id);
          this.filterGoals();
        }
      });
  }

  handleLanguageChange() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.groupLabel = this.translateService.instant('cr.group');
        this.sectionLabel = this.translateService.instant('cr.section');
        this.sectorsLabel = this.translateService.instant('cr.sectors');
        this.sectionsLabel = this.translateService.instant('cr.sections');
        this.departmentsLabel = this.translateService.instant('cr.departments');
        this.levels = [
          { id: 2, txt: this.translateService.instant('cr.L1') },
          { id: 3, txt: this.translateService.instant('cr.L2') },
          { id: 4, txt: this.translateService.instant('cr.L3') },
        ];
        this.types = [
          {
            id: 1,
            txt: this.translateService.instant('cr.newKBI'),
            color: 'rgb(255, 26, 140)',
            isActive: false,
          },
          {
            id: 2,
            txt: this.translateService.instant('cr.editKBI'),
            color: 'rgb(255, 26, 140)',
            isActive: false,
          },
          {
            id: 3,
            txt: this.translateService.instant('cr.removeKBI'),
            color: 'rgb(255, 26, 140)',
            isActive: false,
          },
        ];
        this.filteredGroups = [...this.filteredGroups];
      });
  }

  private initForm() {
    this.form = this.fb.group({
      level: [null, Validators.required],
      groupId: [null, Validators.required],
      title: ['', [Validators.required, EnglishLettersAndNumbersOnly()]],
      goalTitle: [null, [Validators.required, EnglishLettersAndNumbersOnly()]],
      titleAr: ['', [Validators.required, ArabicLettersAndNumbersOnly()]],
      goalTitleAr: [null, [Validators.required, ArabicLettersAndNumbersOnly()]],
      reason: [''],
      changeRequestGoalIds: [null],
    });
  }

  public getSelectedScorecard() {
    this.planningSer.SelectedScorecard$.pipe(takeUntil(this.endSub$)).subscribe(
      (scorecard: IScorecard) => {
        this.selectedScorecard = scorecard;
      }
    );
  }

  // public levelChangedHandler() {
  //   this.filterGroups();
  //   this.filteredGoalsList = [];
  //   this.f['groupId'].reset()
  //   this.f['changeRequestGoalIds'].reset()
  //   this.f['groupId'].updateValueAndValidity()
  //   this.f['changeRequestGoalIds'].updateValueAndValidity()
  // }

  // public filterGroups() {
  //   this.filteredGroups = this.groups.filter(
  //     (group) => group.level == this.f['level'].value
  //   );
  // }

  public filterGoals() {
    const levelValue = this.f['level'].value;
    const groupValue = this.f['groupId'].value;
    this.httpSer
      .get(
        `${Config.chnageRequest.getGoalsByLevelAndGroup}/${this.selectedScorecard.id}/${levelValue}/${groupValue}`
      )
      .pipe(takeUntil(this.endSub$))
      .subscribe((goals) => {
        this.filteredGoalsList = goals;
      });
  }

  public toggleTypeActivation(type: any) {
    // Make all btns not active
    this.types.forEach((type) => (type.isActive = false));
    type.isActive = true;
    this.selectedType = type;
    if (this.isaddGoal) {
      this.f['goalTitle'].addValidators(Validators.required);
      this.f['goalTitleAr'].addValidators(Validators.required);
      this.f['changeRequestGoalIds'].removeValidators(Validators.required);
    } else {
      this.f['goalTitle'].removeValidators(Validators.required);
      this.f['goalTitleAr'].removeValidators(Validators.required);
      this.f['changeRequestGoalIds'].addValidators(Validators.required);
    }
    this.f['goalTitle'].updateValueAndValidity();
    this.f['goalTitleAr'].updateValueAndValidity();
    this.f['changeRequestGoalIds'].updateValueAndValidity();
  }

  public uploadFile(event: File[]) {
    this.uploadedAttachments = event;
  }

  public submit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isBtnLoading = true;
    combineLatest(
      this.attachmentSer.UploadAllFilesToCloud(this.uploadedAttachments)
    )
      .pipe(
        takeUntil(this.endSub$),
        switchMap((res) => {
          const resVal = {
            ...this.form.value,
            scorecardId: this.selectedScorecard.id,
            type: this.selectedType.id,
            attachments: this.uploadedAttachments.length > 0 ? res : null,
          };
          return this.httpSer
            .post(Config.chnageRequest.submit, resVal)
            .pipe(finalize(() => (this.isBtnLoading = false)));
        })
      )
      .subscribe({
        next: (res) => {
          this.popupSer.close();
          this.toastSer.success(
            this.lang == 'en'
              ? `Request '${res.title ?? ''}' Added successfully`
              : `تمت إضافة الطلب '${res.title ?? ''}' بنجاح`
          );
          this.updateList.emit();
        },
      });
  }

  // getters and setters

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public get isaddGoal(): boolean {
    return this.selectedType.id === 1;
  }

  public get isEditGoal(): boolean {
    return this.selectedType.id === 2;
  }

  public get IsRemoveGoal() {
    return this.selectedType.id === 3;
  }

  public get LevelText(): string {
    return this.translateService.instant(
      'cr.' + LevelMode[this.selectedGroup.level]
    );
  }

  public get selectedGroupName() {
    if (this.selectedGroup) {
      return this.lang === 'en'
        ? this.selectedGroup.name
        : this.selectedGroup.arabicName;
    }
    return null;
  }

  //  end subscribtions
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}