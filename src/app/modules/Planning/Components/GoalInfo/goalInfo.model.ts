import { LevelMode } from './../../enum/enums';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { takeUntil, finalize, map, take } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { combineLatest, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EventEmitter, Injectable } from '@angular/core';
import { IType } from './interfaces';
import { Config } from 'src/app/core/config/api.config';
import { IGoalView } from '../GoalItem/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { PlanningService } from '../../Page/planning.service';

@Injectable()
export class GoalInfoModel {

  //======================Data====================
  public lang: string = this.translateService.currentLang;
  public types: Array<IType> = new Array<IType>();
  public owners: any[] = [];
  public groups: any[] = [];
  public filteredGroups: any[] = [];
  public selectedType: IType = {} as IType;
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
  public selectedGroupId = null;
  public isUserGroups: boolean = false;
  public groupLabel = this.translateService.instant('Planning.group');
  public sectionLabel = this.translateService.instant('Planning.section');
  public sectorsLabel = this.translateService.instant('Planning.sectors');
  public sectionsLabel = this.translateService.instant('Planning.sections');
  public departmentsLabel = this.translateService.instant('Planning.departments');

  public showParents: boolean = false;
  public parents: [] = [];
  showOnlyDetails: boolean;
  //=====================Logic====================
  constructor(
    private fb: FormBuilder,
    private _httpSer: HttpHandlerService,
    private popupSer: PopupService,
    private toastSer: ToastrService,
    private translateService: TranslateService,
    private planningSer: PlanningService
  ) {
    this.handleLangChange();
    this.initForm();
    // this.getLookups()
    this.checkReset();
    this.setLevel()
  }
  private setLevel() {
    const level$ = this.planningSer.currentLevel$;
    const selectedGroup$ = this.planningSer.selectedGroup$;
    combineLatest([level$, selectedGroup$]).subscribe(([level, selectedGroup]) => {
      if (level) {
        this.f['level'].setValue(level);
        this.f['level'].updateValueAndValidity();
        this.val = level;
        this.selectedGroupId = (selectedGroup as any)?.id || null;
      }
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
      level: [null],
      ownerId: [null],
      groupId: [null],
      parentId: [null],
    });
  }

  public makeParentRequired() {
    this.f['parentId'].addValidators(Validators.required);
    this.f['parentId'].updateValueAndValidity();
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe((res) => {
      this.form.reset();
      this.form.controls['level'].setValue(LevelMode.L0);
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
      this.filteredGroups = this.groups.filter((group) => group.level === this.val)
      this.form.controls['groupId'].addValidators(Validators.required);
    }
    this.form.controls['groupId'].updateValueAndValidity();
  }

  public getLookups() {
    this.loading = true;
    const goalTypes$ = this._httpSer.get(Config.Lookups.lookupEnabledGoalTypes);
    const groups$ = this._httpSer.get(
      `${Config.Lookups.lookupPerformanceGroups}`
    );
    const data$ = this.popupSer.data$;
    const currentScorecard$ = this.planningSer.SelectedScorecard$;
    combineLatest([goalTypes$, groups$, data$, currentScorecard$])
      .pipe(takeUntil(this.endSub$))
      .subscribe(([types, groups, data, currentScorecard]) => {
        // this.owners = owners;
        this.flateningGroups(groups);
        this.filteredGroups = this.groups;
        this.types = types;
        this.filteredLevels = this.levels.filter((level) => level.id >= currentScorecard?.currentLevel);
        if (data && data.goalType && data.goalType.category) {
          if (data.editMode) {
            // edit Case
            this.setEditModeValues(data);
            return;
          } else {
            this.isEditMode = false;
            // add child case
            this.parentItems = [
              ...this.parentItems,
              { title: data.title, titleAr: data.titleAr, id: data.id },
            ];
            this.filteredLevels = this.filteredLevels.filter(
              (level) =>
                level.id >= data.level
            );
            // this.val = this.filteredLevels[0].id;
            this.filterGroups()
            this.isChild = true;
            this.form.controls['parentId'].setValue(data.id);
            if (data.goalType.category == 2) {
              this.types = (types as any[]).filter(
                (type) => type.category == data.goalType.category
              );
              this.setGoalTypeEvent.emit(this.types[0])
            }
          }
        } else {
          //general add case
          // this.val = this.filteredLevels[0].id;
          // Edit scorecard case show only measurable types
          if (this.showParents) {
            this.types = (types as any[]).filter(
              (type) => type.category == 2
            );
            this.setGoalTypeEvent.emit(this.types[0])
          }
          this.isChild = false;
          this.isEditMode = false;
        }


        // Deafult selected Type
        if (!this.isChnageMode) {
          if (
            !this.selectedType ||
            !this.selectedType.id ||
            (this.selectedType &&
              this.selectedType.id &&
              this.selectedType.id != this.types[0].id)
          ) {
            this.selectedType = this.types[0];
          }
        }
        this.loading = false;
      });
  }


  private flateningGroups(groups) {
    groups.forEach((group) => {
      this.groups.push(group)
      if (group.children && group.children.length > 0) {
        this.flateningGroups(group.children)
      }
    })
  }

  private setEditModeValues(data: any) {
    this.isEditMode = true;
    if (!(this.selectedType && this.selectedType.id !== data.goalTypeId)) {
      this.selectedType = { ...data.goalType, id: data.goalTypeId };
      this.setGoalTypeEvent.emit(this.selectedType);
    }
    if (data.parent) {
      this.isChild = true;
      const parentItem = data.parent;
      if (parentItem.goalType.category == 2) {
        this.types = (this.types as any[]).filter(
          (type) => type.category == parentItem.goalType.category
        );
        this.setGoalTypeEvent.emit(this.types[0])
      }
      if (
        this.parentItems.findIndex((item) => item.id == parentItem.id) === -1
      ) {
        this.parentItems.push({ id: parentItem.id, title: parentItem.title, titleAr: parentItem.titleAr });
        this.parentItems = [...this.parentItems];
      }
      this.f['parentId'].setValue(parentItem.id);
      this.filteredLevels = this.filteredLevels.filter(
        (level) =>
          level.id >= parentItem.level
      );
    }
    if (data.showOnlyDetails){
      this.showOnlyDetails = true;
      this.types = this.types.filter((type) => type.id === data.goalType.id)
    }
    this._httpSer
      .get(`${Config.Performance.getGoalView}/${data.id}`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (goal: IGoalView) => {
          this.planningSer.setCuurentGoalToEdit(goal);
          this.f['title'].setValue(goal.title);
          this.f['titleAr'].setValue(goal.titleAr);
          this.val = +goal.level;
          this.filterGroups()
          this.f['formula'].setValue(goal.formula);
          this.f['risk'].setValue(goal.risk);
          this.f['achievementRequirements'].setValue(goal.achievementRequirements);
          this.f['level'].setValue(goal.level);
          if (goal?.groupId) {
            this.f['groupId'].setValue(goal.groupId);
            this.getUserGroup(goal.ownerId)
          }
          this.prevUploadedFiles = goal.goalAttachments;
          this.setPrevAtachmentEvent.emit(this.prevUploadedFiles)
        },
        error: () => {
          this.toastSer.error(this.translateService.instant('Planning.fetchingGoalDataErrorMsg'));
        },
      });
  }

  public saveChanges() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    let formVal = {
      ...this.form.value,
      goalTypeId: this.selectedType.id,
      attachments: this.uploadedFile,
    };
    this.setDataEvent.emit(formVal);
  }

  public uploadFile(evt: any) {
    this.uploadedFile = evt;
  }

  public getUserGroup(goalOwnerId: string = "") {
    this.form.controls['ownerId'].reset()
    const groupId = this.f['groupId'].value;
    if (!groupId) return;
    this._httpSer
      .get(`${Config.Groups.GetUserGroup}?groupId=${groupId ?? ''}`)
      .pipe(
        takeUntil(this.endSub$)
      )
      .subscribe((res) => {
        this.owners = [...res];
        if (this.isEditMode && goalOwnerId)
          this.f['ownerId'].setValue(goalOwnerId)
      });
  }

  public parentSelectedHandler(parent:any){
    if(this.showParents) {
      this.popupSer.data$.pipe(take(1)).subscribe((data)=>{
        this.popupSer.data.next({ ...data, parent: parent })
      })
    }
  }

  // Toggle Activation
  public toggleActivation(type: IType) {
    // Make all btns not active
    // this.types.forEach((type) => type.isActive = false);
    // type.isActive = true;

    if (this.selectedType.category != type.category) {
      this.isChnageMode = true;
    } else {
      this.isChnageMode = false;
    }
    this.selectedType = type;
    this.setGoalTypeEvent.emit(type);
    this.chnageModeEvent.emit(this.isChnageMode);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get isParentRequired(): boolean {
    return this.f['parentId'].hasValidator(Validators.required);
  }

  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
