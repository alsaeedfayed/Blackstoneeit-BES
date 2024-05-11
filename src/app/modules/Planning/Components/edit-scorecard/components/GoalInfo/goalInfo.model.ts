import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { takeUntil, map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { combineLatest, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EventEmitter, Injectable } from '@angular/core';
import { IType } from './interfaces';
import { Config } from 'src/app/core/config/api.config';
import { TranslateService } from '@ngx-translate/core';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EditGoalService } from '../edit-goal.service';
import { IScorecard, IchangedGoal } from 'src/app/modules/Planning/Page/interfaces';
import { PlanningService } from 'src/app/modules/Planning/Page/planning.service';

@Injectable()
export class GoalInfoModel {

  //======================Data====================
  public lang: string = this.translateService.currentLang;
  public types: Array<IType> = new Array<IType>();
  public owners: any[] = [];
  public groups: any[] = [];
  public filteredGroups: any[] = [];
  public selectedType: IType = {} as IType;
  public internalWeightVal: number = 0;
  public contributionWeight: number = 0;
  public form: FormGroup;
  public isSubmitted: boolean = false;
  public scorecardId: string = '';
  public levels = [
    { id: 1, txt: this.translateService.instant('Planning.L0') },
    { id: 2, txt: this.translateService.instant('Planning.L1') },
    { id: 3, txt: this.translateService.instant('Planning.L2') },
    { id: 4, txt: this.translateService.instant('Planning.L3') },
  ];
  public filteredLevels = [];
  public val = 1;
  public setDataEvent = new EventEmitter();
  public endSub$ = new Subject();
  private uploadedFile: { fileName: string; extension: string }[] = [];
  public prevUploadedFiles: { fileName: string; extension: string }[] = [];
  public setGoalTypeEvent = new EventEmitter();
  public chnageModeEvent = new EventEmitter();
  public setPrevAtachmentEvent = new EventEmitter();
  public selectedTypeId: number = 1;
  public isChild: boolean = false;
  public isEditMode: boolean = false;
  public isChnageMode: boolean;
  parentItems: any[] = [];
  public loading: boolean = false;
  public isUserGroups: boolean = false;
  public groupLabel = this.translateService.instant('Planning.group');
  public sectionLabel = this.translateService.instant('Planning.section');
  public sectorsLabel = this.translateService.instant('Planning.sectors');
  public sectionsLabel = this.translateService.instant('Planning.sections');
  public departmentsLabel = this.translateService.instant('Planning.departments');
  editedGoalId: any;
  goalId: any;

  //=====================Logic====================
  constructor(
    private fb: FormBuilder,
    private _httpSer: HttpHandlerService,
    private popupSer: PopupService,
    private toastSer: ToastrService,
    private translateService: TranslateService,
    private planningSer: PlanningService,
    private editGoalSer: EditGoalService
  ) {
    this.handleLangChange();
    this.initForm();
    // this.getLookups()
    this.checkReset();
    this.setLevelAndGroup()
  }
  private setLevelAndGroup() {
    const level$ = this.planningSer.SelectedScorecard$.pipe(map((scorecard: IScorecard) => scorecard?.currentLevel));
    const groupId$ = this.editGoalSer.selecetedGroup$.pipe(map((group: any) => group ? group.id ?? null : null));

    combineLatest(level$, groupId$).subscribe(([level, groupId]) => {
      this.f['level'].setValue(level)
      this.f['groupId'].setValue(groupId)
      this.f['level'].updateValueAndValidity()
      this.f['groupId'].updateValueAndValidity()
      this.isUserGroups = true;
      this.getUserGroup()
    })
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.filteredGroups = [...this.filteredGroups];
      this.parentItems = [...this.parentItems];
      this.groupLabel = this.translateService.instant('Planning.group');
      this.sectionLabel = this.translateService.instant('Planning.section');
      this.sectorsLabel = this.translateService.instant('Planning.sectors');
      this.sectionsLabel = this.translateService.instant('Planning.sections');
      this.departmentsLabel = this.translateService.instant('Planning.departments');
      this.levels = [
        { id: 1, txt: this.translateService.instant('Planning.L0') },
        { id: 2, txt: this.translateService.instant('Planning.L1') },
        { id: 3, txt: this.translateService.instant('Planning.L2') },
        { id: 4, txt: this.translateService.instant('Planning.L3') },
      ];
    });
  }

  private initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, EnglishLettersAndNumbersWithComma(), Validators.maxLength(300)]],
      titleAr: ['', [Validators.required, ArabicLettersAndNumbersOnly(), Validators.maxLength(300)]],
      formula: [''],
      risk: [''],
      achievementRequirements: [''],
      level: [1],
      ownerId: [null],
      groupId: [null],
      parentId: [null],
    });
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.form.reset();
      this.form.controls['level'].setValue(1);
      this.prevUploadedFiles = [];
      this.uploadedFile = [];
      this.isSubmitted = false;
      this.isEditMode = false;
      this.groups = [];
    });
  }

  public filterGroups() {
    this.form.controls['groupId'].reset();
    this.form.controls['ownerId'].reset();
    this.isUserGroups = false;
    if (this.val == 1) {
      this.form.controls['groupId'].removeValidators(Validators.required);

    } else {
      this.filteredGroups = this.groups.filter((group) => group.level == this.val)
      // this.form.controls['groupId'].addValidators(Validators.required);
    }
    this.form.controls['groupId'].updateValueAndValidity();
  }

  public getLookups() {
    this.loading = true;
    const goalTypes$ = this._httpSer.get(Config.Lookups.lookupEnabledGoalTypes);
    // debugger
    const groups$ = this._httpSer.get(
      `${Config.Lookups.lookupPerformanceGroups}`
    );
    const data$ = this.editGoalSer.goalTobeEdited$;
    const currentScorecard$ = this.planningSer.SelectedScorecard$;

    // const parentItems$ = this._httpSer.get(Config.Performance.getAll + this.scorecardId);
    combineLatest(goalTypes$, groups$, data$)
      .pipe(takeUntil(this.endSub$))
      .subscribe(([types, groups, data]) => {
        this.flateningGroups(groups);
        this.filteredGroups = this.groups;
        this.types = types;
        this.filteredLevels = this.levels;
        if (data) {
          // edit Case
          this.setEditModeValues(data);
          return;
        }

      });
  }

  private setEditModeValues(data: IchangedGoal) {
    this.isEditMode = true;
    this.editedGoalId = data.id;
    this.f['title'].setValue(data.title);
    this.f['titleAr'].setValue(data.titleAr)
    this.f['formula'].setValue(data.formula);
    this.f['risk'].setValue(data.risk);
    this.f['achievementRequirements'].setValue(data.achievementRequirements);
    this.f['level'].setValue(data.level);
    this.f['ownerId'].setValue(data.ownerId);
    this.f['groupId'].setValue(data.groupId);
    this.f['parentId'].setValue(data.parentId);
    this.internalWeightVal = data.internalWeight;
    this.contributionWeight = data.contributionWeight;
    this.prevUploadedFiles = data.attachments;

    if (!(this.selectedType && +this.selectedType.id !== data.goalTypeId)) {
      let selectedTypeItem = this.types.find(type => +type.id == data.goalTypeId);
      if (selectedTypeItem) {
        this.selectedType = selectedTypeItem;
        this.setGoalTypeEvent.emit(this.selectedType);
      }
      this.loading = false;
    }
  }

  public saveChanges() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    let formVal = {
      ...this.form.value,
      goalTypeId: this.selectedType.id,
      attachments: this.prevUploadedFiles?.length > 0 ? [...this.uploadedFile, ...this.prevUploadedFiles] : [...this.uploadedFile],
      //attachments: this.uploadedFile,
      internalWeight: this.internalWeightVal,
      contributionWeight: this.contributionWeight,
      id: this.editedGoalId
    };
    this.setDataEvent.emit(formVal);
  }

  public uploadFile(evt: any) {
    this.uploadedFile = evt;
  }

  public getUserGroup(goalOwnerId: string = "") {
    this.form.controls['ownerId'].reset()
    const groupId = this.f['groupId'].value;
    if (groupId) {
      this._httpSer
        .get(`${Config.Groups.GetUserGroup}?groupId=${groupId}`)
        .pipe(
          takeUntil(this.endSub$)

        )
        .subscribe((res) => {
          this.owners = [...res];
          if (this.isEditMode && goalOwnerId)
            this.f['ownerId'].setValue(goalOwnerId)
        });
    }
  }

  // Toggle Activation
  public toggleActivation(type: IType) {
    if (this.selectedType.category != type.category) {
      this.isChnageMode = true;
    } else {
      this.isChnageMode = false;
    }
    this.selectedType = type;
    this.setGoalTypeEvent.emit(type);
    this.chnageModeEvent.emit(this.isChnageMode);
  }


  // utilities
  private flateningGroups(groups) {
    groups.forEach((group) => {
      this.groups.push(group)
      if (group.children && group.children.length > 0) {
        this.flateningGroups(group.children)
      }
    })
  }
  // getters and setters
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
