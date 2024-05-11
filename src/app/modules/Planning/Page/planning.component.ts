import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { IGroupIdentity } from './../../group-identity/interfaces/interfaces';
import { PlanningService } from './planning.service';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import {
  IPlanning,
  IScorecard,
  scorecardStatusResult,
} from './interfaces';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { IGoalItem } from '../Components/GoalItem/interfaces';
import { PerformanceStatusMode } from '../enum/enums';

@Component({
  selector: 'planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent extends ComponentBase implements OnDestroy {
  // PROPS
  // @ViewChild(SectorDepartmentFunctionComponent) filterComponent: SectorDepartmentFunctionComponent;
  private onDestroy$: Subject<any> = new Subject();
  private status: PerformanceStatusMode;

  public lang: string = this.translate.currentLang;
  public selectedGroup: IGroupIdentity = {} as IGroupIdentity;
  selectedGroupId: number = null;
  options: any[] = [];
  public scorecardStatusResult: scorecardStatusResult = {} as scorecardStatusResult;
  public planningInstance;
  public data: IPlanning = {} as IPlanning;
  public goalsList: Array<IGoalItem> = [];
  public selectedScorecardId: number;
  public loading: boolean = true;
  public loadingStatus: boolean = false;
  public currentLevel: number;
  public selectedScorecardLevel: LevelMode;
  planning: Array<any> = [];
  selectedScorecard: IScorecard;
  closeScorecard: any;
  public instanceId: number;

  constructor(
    private httpHandlerService: HttpHandlerService,
    private modalService: ModelService,
    private planningSer: PlanningService,
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
    this.handleLangChange();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.planningInstance) {
        this.planning[0].status = {
          code: 'Pending',
          en: `( ${this.planningInstance.submitedCount} / ${this.planningInstance.totalCount
            }) ${this.translate.instant('Planning.submitted')}`,
          ar: `( ${this.planningInstance.submitedCount} / ${this.planningInstance.totalCount
            }) ${this.translate.instant('Planning.submitted')}`,
        };
      }
    });
  }

  // 1- select scorecard
  public chnageSelectedScorecard(scorecard: IScorecard) {
    if (scorecard) {
      this.selectedScorecardId = scorecard?.id;
      this.selectedScorecard = scorecard;
      // this.selectedGroupId = null;
      if (this.selectedScorecardLevel) this.loadData();
    } else {
      this.loading = false;
    }
  }

  handleGroupSelection(group: IGroupIdentity) {
    this.planningSer.setSelectedGroup(group as any);
    this.selectedGroup = group as any;
    this.selectedGroupId = group ? group.id : null;
    this.selectedScorecardLevel = group ? group.level : LevelMode.L0;
    if (this.selectedScorecardLevel && this.selectedScorecard) {
      this.loadData();
    }
  }

  // 2 load data
  public loadData() {
    this.loading = true;
    this.httpHandlerService
      .get(
        `${Config.Performance.getAll}${this.selectedScorecardId}/${this.selectedScorecardLevel
        }${this.selectedGroupId ? '?groupId=' + this.selectedGroupId : ''}`
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.data = res;
          this.goalsList = res.goals;
          this.currentLevel = res?.level;
          this.planningSer.setCurrentLevel(this.currentLevel);
          this.planningSer.setCurrentGoalsList(this.goalsList);
          this.status = res?.instanceStatus;
          // this.getCanCloseScorecard();
          this.getStatus();
          this.getMyActions(this.selectedScorecardLevel, this.selectedGroupId);
        }
      });
  }

  private getCanCloseScorecard() {
    this.httpHandlerService
      .get(`${Config.Performance.canClose}/${this.selectedScorecard.id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.closeScorecard = res;
      });
  }

  // 3 get status
  getStatus() {
    this.loadingStatus = true;

    const groupId = this.selectedGroup ? '?groupId=' + this.selectedGroup.id : '';
    this.httpHandlerService
      .get(`${Config.Performance.GetStatus}/${this.selectedScorecardId}${groupId}`)
      .pipe(finalize(() => (this.loadingStatus = false)))
      .subscribe((res: scorecardStatusResult) => {
        this.instanceId = res?.approvalInstance?.instanceId;
        this.scorecardStatusResult = res;
      });
  }

  //  4 get actions
  getMyActions(level: number, groupId: number = null) {
    const apiPath = groupId === 0 || groupId === null ? '' : `?groupId=${groupId}`;
    this.selectedGroupId;
    this.httpHandlerService
      .get(`${Config.Performance.GetMyActions}/${this.selectedScorecardId}${apiPath}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.options = res?.options;
      });
  }

  actionTakenHandler() {
    this.loading = true;

    setTimeout(() => {
      this.loadData();
    }, 3000);
  }

  deleteGoal(goalId: string) {
    this.loadData();
  }

  openActionModel(option) {
    this.modalService.open('action-model' + option.id);
  }

  public startingInstanceHandler() {
    this.loading = true;

    const params = {
      id: this.selectedScorecardId,
      groupId: this.selectedGroup?.id || '',
    };

    this.httpHandlerService
      .post(Config.MangeScorecards.startScorecard, params)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.loadData();
        },
      });
  }

  // Getters & Setters
  public get Status() {
    return this.translate.instant(
      'Planning.' + PerformanceStatusMode[this.status]
    );
  }

  public get StatusValue() {
    return this.data.status;
  }
}
