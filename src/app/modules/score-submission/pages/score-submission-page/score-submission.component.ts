import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize, takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-score-submission',
  templateUrl: './score-submission.component.html',
  styleUrls: ['./score-submission.component.scss'],
})

export class ScoreSubmissionComponent extends ComponentBase implements OnInit,OnDestroy {
  scorecard: any = {};
  groupId: any;
  periodId: any;
  isShowDetailsPopup: boolean = false;
  canSubmit: boolean = false;
  canClose: boolean = false;
  canExtend: boolean = false;
  periodOpened: boolean = false;
  submitted: boolean = false;
  canPublish: boolean = false;
  published: boolean = false;
  list: any[] = [];
  scorecardSubmissionId: number;
  loading: boolean = false;
  expiredAfter: any = null;
  filterList: any = null;

  actualScore: number = 0;
  targetScore: number = 0;
  notReportedCount: number = 0;
  offTrackCount: number = 0;
  onTrackCount: number = 0;
  overachievedCount: number = 0;
  totalKPIs: number = 0;
  performanceScore: number = 0;
  notDueCount: number = 0;
  currentScorecard: any;

  extendReason: string = null;
  extended: boolean = false;
  constructor(
    private translationService: TranslateConfigService,
    private instantTranslator: TranslateService,
    private http: HttpHandlerService,
    private popupService: PopupService
  ) {
    super(translationService, instantTranslator);
    this.popupService.reset$.pipe(takeUntil(this.destroy$)).subscribe(()=> this.isShowDetailsPopup = false)
    if(localStorage.getItem('currentScorecard'))
      this.currentScorecard = localStorage.getItem('currentScorecard');
  }

  ngOnInit(): void { }

  getSubmissionPeriod() {
    this.list = [];
    // if(this.groupId) {
   this.loading = true;
    let groupId = this.groupId ? `?group=${this.groupId}` : '';
    if(this.scorecard && this.scorecard?.id)
    {
      this.http.get(`${Config.ScorecardSubmission.GetScorecardSubmission}/${this.scorecard.id}/${this.periodId}${groupId}`)
       .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          if (res) {
            this.list = res.goals;
            this.scorecardSubmissionId = res.scorecardSubmissionId;
            this.canSubmit = res.canSubmit;
            this.canClose = res.canClose;
            this.canExtend = res.canExtend;
            this.expiredAfter = res.expiredAfter;
            this.periodOpened = res.periodOpened;
            this.submitted = res.submitted;
            this.actualScore = res.actualScore;
            this.targetScore = res.targetScore;
            this.onTrackCount = res.onTrackCount;
            this.offTrackCount = res.offTrackCount;
            this.overachievedCount = res.overachievedCount;
            this.notDueCount = res.notDueCount;
            this.totalKPIs = res.totalKPIs;
            this.notReportedCount = res.notReportedCount;
            this.published = res.isPublished;
            this.canPublish = res.canPublish;
            this.performanceScore = res.performance * 100;
            this.extended = res.extended;
            this.extendReason = res.extendReason;
          }
          else {
            this.list = [];
            this.periodOpened = false;
            this.scorecardSubmissionId = null;
            this.canSubmit = false;
            this.canExtend = false;
            this.canClose = false;
            this.expiredAfter = null;
            this.submitted = false;
            this.actualScore = 0;
            this.targetScore = 0;
            this.onTrackCount = 0;
            this.offTrackCount = 0;
            this.overachievedCount = 0;
            this.notDueCount = 0;
            this.totalKPIs = 0;
            this.notReportedCount = 0;
            this.canPublish = false;
            this.published = false;
          }
        });
      }
  }

  public openStatusDetailsModal(){
    this.isShowDetailsPopup = true;
    this.popupService.open("scorecardPeriodDetails", { periodId: this.periodId, scorecardId: this.scorecard.id });
  }

  public closeStatusDetailsModal(){
    this.isShowDetailsPopup = false;
    this.popupService.close();
  }

}
