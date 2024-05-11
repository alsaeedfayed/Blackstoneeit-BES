import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IPerformanceTodateData } from "../performance-to-date/iPerformanceToDate.interface";
import { IAnalysisData } from "../dashboard-analytics/iAnalysis.interface";
import { IGoalTypePerformance } from "../overall-summary/iGoalTypePerformanceData.interface";

@Component({
    selector: 'main-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.scss']
})

export class MainDashboardComponent {

    private endSub$ = new Subject();
    public lang: string = this.translateService.currentLang;
    public performanceToDateData: IPerformanceTodateData = {} as IPerformanceTodateData;
    public performanceEvaluationData = [];
    public goalTypesData: Array<IGoalTypePerformance> = new Array<IGoalTypePerformance>();
    public analysisWidgetsData: IAnalysisData = {} as IAnalysisData;
    public selectedScoreCardId = null;
    public selectedPeriod = null;
    public selectedGroupId = null;
    @Input() public perTodateLoading: boolean;
    @Input() public perEvaluationLoading: boolean;
    @Input() public perTypesLoading: boolean;
    private sessionGroupKey = "Performance-Dashboard-Group";
    private sessionScorecardKey = "Performance-Dashboard-Scorecard";
    private sessionPeriodKey = "Performance-Dashboard-Period";
    // @Input() set FilterData(filterData: any) {
    //     this.filterData = filterData;
    //     if(this.filterData?.selectedScoreCardId) {
    //         this.getPerformanceToDate();
    //         this.getPerformanceEvaluation();
    //     }
    // }

   // public _selectedTabId: string;

    // @Input() set selectedTabId(_selectedTabId: string) {
    //     this._selectedTabId = _selectedTabId;
    //     this.scrollToDiv(this._selectedTabId)
    // }

    // scrollToDiv(divId) {
    //     var element = document.getElementById(divId);
    //     element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
    // }

    constructor(private translateService: TranslateService) {
        this.hanldeLangChange();
        setTimeout(() => {
            // debugger
            this.selectedScoreCardId = localStorage.getItem(this.sessionScorecardKey);
            this.selectedPeriod = localStorage.getItem(this.sessionPeriodKey);
            this.selectedGroupId = localStorage.getItem(this.sessionGroupKey);
        }, 800)

        // this.route.params.subscribe(params => {
        //     this.selectedScoreCardId = params["selectedScoreCardId"];
        //     this.selectedGroupId = params["selectedGroupId"];
        //     if(this.selectedScoreCardId) {
        //         //this.getPerformanceToDate();
        //         this.getPerformanceEvaluation();
        //         this.getGoalTypePerformance();
        //     }
        // })
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }

    // getPerformanceToDate() {
    //     this.perTodateLoading = true;
    //     this.performanceDashboardService.getPerformanceToDate(this.selectedScoreCardId, this.selectedGroupId)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.perTodateLoading = false)))
    //     .subscribe(res => {
    //         if(res)
    //             this.performanceToDateData = {
    //                 actualTD: res.actualTD,
    //                 performanceTD: res.performanceTD,
    //                 targetTD: res.targetTD
    //             };
    //     })
    // }

    // getPerformanceEvaluation() {
    //     this.perEvaluationLoading = true;
    //     this.performanceDashboardService.getPerformanceEvaluation(this.selectedScoreCardId, this.selectedGroupId)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.perEvaluationLoading = false)))
    //     .subscribe(res => {
    //         if(res)
    //             this.performanceEvaluationData = res;
    //     })
    // }

    // getGoalTypePerformance() {
    //     this.perTypesLoading = true;
    //     this.performanceDashboardService.getGoalTypePerformance(this.selectedScoreCardId, this.selectedGroupId)
    //     .pipe(takeUntil(this.endSub$), finalize(() => ( this.perTypesLoading = false)))
    //     .subscribe(res => {
    //         if(res) {
    //             this.goalTypesData = res.types;
    //             this.analysisWidgetsData = {
    //                 offTrackGoals: res.offTrackGoals,
    //                 onTrack: res.onTrack,
    //                 overAchieved: res.overAchieved
    //             };
    //         }
    //     })
    // }

    // getPerformanceToDate() {
    //     this.perTodateLoading = true;
    //     const url = `${Config.PerformanceDashboard.GetPerformanceTodate}/${this.selectedScoreCardId}?group=${this.selectedGroupId ?? ''}`;
    //     this.httpHandlerService.get(url)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.perTodateLoading = false)))
    //     .subscribe(res => {
    //         if(res)
    //             this.performanceToDateData = {
    //                 actualTD: res.actualTD,
    //                 performanceTD: res.performanceTD,
    //                 targetTD: res.targetTD
    //             };
    //     })
    // }

    // getPerformanceEvaluation() {
    //     this.perEvaluationLoading = true;
    //     const url = `${Config.PerformanceDashboard.GetYearPerformance}/${this.selectedScoreCardId}?group=${this.selectedGroupId ?? ''}`;
    //     this.httpHandlerService.get(url)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.perEvaluationLoading = false)))
    //     .subscribe(res => {
    //         if(res)
    //             this.performanceEvaluationData = res;
    //     })
    // }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}
