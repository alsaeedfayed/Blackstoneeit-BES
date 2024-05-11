import { PerformanceReportsHeaderComponent } from './../Components/performance-reports-header/performance-reports-header.component';
import { takeUntil, finalize } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Config } from 'src/app/core/config/api.config';
import { periodLookup } from '../Interfaces/interfaces';
import { IScorecard } from '../../Planning/Page/interfaces';

@Component({
  selector: 'app-performance-reports-page',
  templateUrl: './performance-reports-page.component.html',
  styleUrls: ['./performance-reports-page.component.scss'],
})
export class PerformanceReportsPageComponent
  extends ComponentBase
  implements OnInit, OnDestroy {
  private endSub$ = new Subject();
  // ############################
  public language = this.translate.currentLang;
  public dataLoading: boolean = false;
  public loading: boolean = false;
  public periods: periodLookup[] = [];
  public scorecards: IScorecard[] = [];
  public selectedPeriod: number;
  public selectedScorecard: number;
  public selectedGroup: number;
  public selectedGoal: number;
  public selectedGoalFiltered: number;
  public list: any[] = [];
  public isPublished:boolean;
  // ###########################3
  @ViewChild(PerformanceReportsHeaderComponent) headerComponent: PerformanceReportsHeaderComponent;
  data: any;

  constructor(
    translationService: TranslateConfigService,
    translate: TranslateService,
    private httpHandlerService: HttpHandlerService
  ) {
    super(translationService, translate);
    this.hanldeLangChange();
    this.getLookups();
  }

  ngOnInit(): void { }
  //  Handle Language Change
  private hanldeLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  private getLookups() {
    this.dataLoading = true;
    const submissionPeriodGetAll$ = this.httpHandlerService.get(
      Config.Performance.SubmissionPeriod
    );
    const scoreCards$ = this.httpHandlerService.get(
      Config.Performance.getScorecardAll
    );

    combineLatest([submissionPeriodGetAll$, scoreCards$])
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.dataLoading = false))
      )
      .subscribe(([periods, scorecards]) => {
        this.periods = periods;
        this.selectedPeriod =
          this.periods.find((period) => period.id === Number(localStorage.getItem('Submission-Period')))?.id ||
          this.periods.find((period) => period.current)?.id ||
          this.periods[0].id;
        this.scorecards = scorecards.scorecards;
        this.selectedScorecard = this.scorecards[0].id;
      });
  }

  handleScorecardChange(scorecardId: number) {
    this.selectedScorecard = scorecardId;
    this.selectedGoal = null;
    this.headerComponent.slectedScorecardId = scorecardId;
    this.headerComponent.getMyGoals()
    this.getReports();
  }

  handlePeriodChange(period: number) {
    this.selectedPeriod = period;
    localStorage.setItem('Submission-Period', JSON.stringify(period));
    this.getReports();
  }
  handleGoalChange(goal: number) {
    this.selectedGoal = goal;
    this.getReports()
  }

  public getReports() {
    this.loading = true;
    this.list = [];
    this.httpHandlerService
      .get(
        `${Config.Performance.GetPeriodGoals}/${this.selectedScorecard}/${this.selectedPeriod
        }?groupId=${this.selectedGroup ?? ''}&parentGoalId=${this.selectedGoal ?? ''}`
      )
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        if (res && res.goals) {
          this.data = res;
          this.isPublished = this.data.isPublished;
          this.list = res.goals;
        }
      });
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
