import { UserService } from './../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from './../../../../shared/popup/popup.service';
import { LevelMode } from './../../../Planning/enum/enums';
import { TranslateService } from '@ngx-translate/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { IGoalItem } from './../../../Planning/Components/GoalItem/interfaces';
import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { takeUntil, pluck, map, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { chnageStatus } from './chnageStatus.enum';
import { EditGoalService } from './components/edit-goal.service';
import { PlanningService } from '../../Page/planning.service';

@Injectable()
export class editScorecardModel {
  public lang: string = '';
  //======================Data====================
  public chnageContext = 1;
  public scoreCardId;
  public loading: boolean = false;
  public btnloading: boolean = false;
  public goalsList: IGoalItem[] = [];
  public endSub$ = new Subject();
  public editScorecardForm: FormGroup;
  public groupName$: Observable<string>;
  public showAddModel: boolean = false;
  public showEditModel: boolean = false;

  public groups: any[] = [];
  public filteredGroups: any[] = [];

  // Tranlsations Label
  public sectionLabel = this.translateSer.instant('Planning.section');
  public sectorsLabel = this.translateSer.instant('Planning.sectors');
  public sectionsLabel = this.translateSer.instant('Planning.sections');
  public departmentsLabel = this.translateSer.instant('Planning.departments');
  relatedChangeRequests: any[] = [];
  viewedGoalsList: IGoalItem[] = [];
  public loadingGoals: boolean = false;
  personItem: {
    id: any;
    name: any;
    image: any;
    backgroundColor: string;
    isActive: any;
    position: any;
  };
  parents: any[] = [];
  selectedGroup: any;
  //=====================Logic====================
  constructor(
    private active: ActivatedRoute,
    private httpHandlerService: HttpHandlerService,
    private fb: FormBuilder,
    private translateSer: TranslateService,
    private popupSer: PopupService,
    private planningSer: PlanningService,
    private editGoalSer: EditGoalService,
    private toastSer: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.getScorecardId();
    this.initForm();
    this.getProfile();
    this.getLookups();
    this.checkReset();
  }

  private getScorecardId() {
    this.active.params
      .pipe(takeUntil(this.endSub$), pluck('id'))
      .subscribe((id: string) => {
        this.scoreCardId = id;
        if (this.scoreCardId) this.getscoreCardData();
      });
  }

  private checkReset() {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.showAddModel = false;
      this.showEditModel = false;
    });
  }

  private initForm() {
    this.editScorecardForm = this.fb.group({
      level: [null, Validators.required],
      groupId: [null, Validators.required],
      changeContext: [1, Validators.required],
      changeContent: [''],
      changeRequestIds: [null, Validators.required],
    });
  }

  private getLookups() {
    const groups$ = this.httpHandlerService.get(
      Config.Lookups.lookupPerformanceGroups
    );
    combineLatest(groups$)
      .pipe(takeUntil(this.endSub$))
      .subscribe(([groups]) => {
        this.groups = groups;
        this.flateningGroups(this.groups);
      });
  }

  private flateningGroups(groups) {
    groups.forEach((group) => {
      this.groups.push(group);
      if (group.children && group.children.length > 0) {
        this.flateningGroups(group.children);
      }
    });
    this.groups = [...new Set(this.groups)];
  }

  public filterGroups() {
    this.f['groupId'].reset();
    this.f['groupId'].updateValueAndValidity();
    this.filteredGroups = this.groups.filter(
      (group) => group.level == this.f['level'].value
    );
  }

  private loadParents() {
    this.loading = true;
    const selectedLevel = this.f['level'].value;
    let selectedGroup = this.f['groupId'].value;
    this.httpHandlerService
      .get(
        `${Config.scorecard.GetGoalsToLevel}/${
          this.scoreCardId
        }/${selectedLevel}${
          selectedGroup === 0 || selectedGroup === null
            ? ''
            : `?groupId=${selectedGroup}`
        }`
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) this.parents = res;
      });
  }


  private getscoreCardData() {
    this.loading = true;
    this.httpHandlerService
      .get(`${Config.Performance.getAll}${this.scoreCardId}/1`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.planningSer.selectScoreCard(res);
        }
      });
  }
  // Adjusting Validators
  public typeChangedHandler(type: number) {
    this.f['changeContent'].reset();
    this.f['changeRequestIds'].reset();
    if (type == 1) {
      this.f['changeRequestIds'].addValidators(Validators.required);
    } else {
      this.f['changeRequestIds'].removeValidators(Validators.required);
    }
    this.f['changeContent'].updateValueAndValidity();
    this.f['changeRequestIds'].updateValueAndValidity();
  }

  getProfile() {
    const userId = this.userService.getCurrentUserId();
    this.httpHandlerService
      .get(Config.Profile.getProfile + '?userId=' + userId)
      .subscribe((res) => {
        this.personItem = {
          id: res.id,
          name: res.fullName,
          image: res.profilePicture,
          backgroundColor: '#0075ff',
          isActive: res.active,
          position: res.position,
        };
      });
  }

  chaneLevelHandler(level: { id: LevelMode; label: string; labelAr: string }) {
    this.viewedGoalsList = [];
    this.goalsList = [];
    this.relatedChangeRequests = [];
    this.f['changeRequestIds'].reset();
    this.f['changeRequestIds'].updateValueAndValidity();
    this.filterGroups();
    if (level.id == LevelMode.L0) {
      this.f['groupId'].removeValidators(Validators.required);
      this.groupSelectedHandler();
      this.loadParents();
    } else {
      this.f['groupId'].addValidators(Validators.required);
    }
    this.f['groupId'].updateValueAndValidity();

  }

  public addGoalHandler(goal: any) {
    const goalItem = {
      ...goal,
      goalType: {
        name: 'KPI',
        arabicName: 'KPI',
        description: 'KPI',
        color: '#ff1a8c',
        category: 2,
        isEnabled: false,
      },
      level: this.f['level'].value,
      group: this.filteredGroups.find(
        (group) => group.id == this.f['groupId'].value
      ),
      groupId: this.f['groupId'].value,
      owner: this.personItem
        ? {
            email: '',
            userName: this.personItem.name,
            roles: [],
            fileName: this.personItem.image,
            id: this.personItem.id,
            fullName: this.personItem.name,
            position: this.personItem.position,
          }
        : {},
    };
    this.viewedGoalsList.push({
      ...goalItem,
      goalStatus: chnageStatus.addedGoal,
    });
    this.goalsList.push({ ...goalItem, goalStatus: chnageStatus.addedGoal });
  }

  public editGoalHandler(goal: any) {
    const selectedGoalIndex = this.goalsList.findIndex(
      (goalItem) => goalItem.id == goal.id
    );
    const newGoal = {
      ...this.goalsList[selectedGoalIndex],
      ...goal,
      goalStatus:
        this.goalsList[selectedGoalIndex].goalStatus == 4
          ? chnageStatus.editedGoal
          : this.goalsList[selectedGoalIndex].goalStatus,
      groupId: this.f['groupId'].value,
      level: this.f['level'].value,
    };
    if (selectedGoalIndex > -1) {
      this.goalsList.push(newGoal);
      this.goalsList.splice(selectedGoalIndex, 1);
    }
    const selectedViewedGoalIndex = this.viewedGoalsList.findIndex(
      (goalItem) => goalItem.id == goal.id
    );
    if (selectedViewedGoalIndex > -1) {
      this.viewedGoalsList.push(newGoal);
      this.viewedGoalsList.splice(selectedViewedGoalIndex, 1);
    }
  }

  public groupSelectedHandler() {
    const selectedLevel = this.f['level'].value;
    const selectedGroup = this.f['groupId'].value;
    this.viewedGoalsList = [];
    this.goalsList = [];
    const selectedGroupItem = this.filteredGroups.find(
      (group) => group.id == selectedGroup
    );
    this.editGoalSer.setGroup(selectedGroupItem);
    this.loadParents();
    const chnageRequests$ = this.httpHandlerService.get(
      `${Config.chnageRequest.getRelatedChangeRequests}/${
        this.scoreCardId
      }/${selectedLevel}?GroupId=${selectedGroup ?? ''}`
    );
    const goalsList$ = this.httpHandlerService.get(
      `${Config.chnageRequest.getChangerequestGoals}?ScorecardId=${
        this.scoreCardId
      }&Level=${selectedLevel}&GroupId=${selectedGroup ?? ''}`
    );
    this.loadingGoals = true;

    combineLatest(chnageRequests$, goalsList$)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => {
          this.loading = false;
          this.loadingGoals = false;
        })
      )
      .subscribe(([changeRequests, Goals]) => {
        this.relatedChangeRequests = changeRequests;
        this.goalsList = (Goals as IGoalItem[]).map((goal: IGoalItem) => {
          return {
            ...goal,
            goalStatus: chnageStatus.notChanged,
          };
        });
        this.viewedGoalsList = [...this.goalsList];
      });
  }

  public undoDeletedGoal(goalToUndo: IGoalItem) {
    const goalViewdIndex = this.viewedGoalsList.findIndex(
      (goal) => goal.id == goalToUndo.id
    );
    if (goalViewdIndex > -1)
      this.goalsList[goalViewdIndex].goalStatus = chnageStatus.notChanged;

    const goalIndex = this.goalsList.findIndex(
      (goal) => goal.id == goalToUndo.id
    );
    if (goalIndex > -1)
      this.goalsList[goalIndex].goalStatus = chnageStatus.notChanged;
  }

  public deleteGoal(goalToDelete: IGoalItem) {
    if (goalToDelete.children && goalToDelete.children.length > 0) {
      this.toastSer.error(
        this.translateSer.instant('Planning.deleteGoalErrMsg')
      );
      return;
    }
    // this.viewedGoalsList = this.viewedGoalsList.filter(
    //   (goal) => goal.id !== goalToDelete.id
    // );
    const goalViewdIndex = this.viewedGoalsList.findIndex(
      (goal) => goal.id == goalToDelete.id
    );

    if (goalViewdIndex > -1) {
      if (this.goalsList[goalViewdIndex].goalStatus == 4) {
        this.goalsList[goalViewdIndex].goalStatus = chnageStatus.removedGoal;
      } else {
        this.viewedGoalsList = this.viewedGoalsList.filter(
          (goal) => goal.id !== goalToDelete.id
        );
      }
    }

    const goalIndex = this.goalsList.findIndex(
      (goal) => goal.id == goalToDelete.id
    );
    if (goalIndex > -1)
      this.goalsList[goalIndex].goalStatus = chnageStatus.removedGoal;
  }

  public openAddGoalPopup() {
    // this.parents = this.parents.map((parent:any)=>{
    //   if (parent.goalType.category == 2) {
    //     let matchedElement = this.viewedGoalsList.find((goal)=> goal.id == parent.id)
    //     return {...parent,...matchedElement}
    //   } else {
    //     return parent;
    //   }
    // })
    this.showAddModel = true;
    this.popupSer.open('Goal-action-add');
  }

  public openEditGoalPopup(goal: IGoalItem) {
    const selectedGoalToBeEdited = this.goalsList.find(
      (goaIteml) => goaIteml.id == goal.id
    );
    if (selectedGoalToBeEdited) {
      this.editGoalSer.setGoalToBeEdited(selectedGoalToBeEdited);
    }
    this.showEditModel = true;
    this.popupSer.open('Goal-action-edit');
  }

  public updateGoals() {
    this.getscoreCardData();
  }

  public getGoalLevelText(level: LevelMode) {
    return this.translateSer.instant('Planning.' + LevelMode[level]);
  }

  public saveChnages() {
    if (this.editScorecardForm.invalid) return;
    if (
      this.goalsList.every((goal) => goal.goalStatus == chnageStatus.notChanged)
    ) {
      this.toastSer.error(
        this.lang == 'en'
          ? 'You have not made any changes to submit'
          : 'لم تقم بأي تغييرات لحفظها'
      );
      return;
    }
    this.btnloading = true;
    const res = {
      scorecardId: +this.scoreCardId,
      ...this.editScorecardForm.value,
      changeRequestIds: this.f['changeRequestIds'].value
        ? [this.f['changeRequestIds'].value]
        : null,
      changedGoals: this.goalsList,
    };
    this.httpHandlerService
      .put(Config.chnageRequest.updateScorecard, res)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.btnloading = false))
      )
      .subscribe((res) => {
        this.toastSer.success(
          this.lang == 'en' ? 'Submitted Successfully' : 'تم الحفظ بنجاح'
        );
        this.router.navigate(['/planning']);
      });
  }
  //getters and setters
  get f(): { [key: string]: AbstractControl } {
    return this.editScorecardForm.controls;
  }

  get isShowAddGoal(): boolean {
    return (
      !!this.f['level'].value &&
      (this.f['level'].value == LevelMode.L0 || !!this.f['groupId'].value)
    );
  }

  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
