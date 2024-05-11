import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IAnalysisData } from "../dashboard-analytics/iAnalysis.interface";
import { IBreakdown } from "./iGoalTypePerformanceData.interface";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";

@Component({
    selector: 'overall-summary',
    templateUrl: './overall-summary.component.html',
    styleUrls: ['./overall-summary.component.scss']
})

export class OverallSummaryComponent {

    private endSub$ = new Subject();
    public lang: string = this.translateService.currentLang;
    public analysisWidgetsData: IAnalysisData = {} as IAnalysisData;
    public performanceBreakdownData: Array<IBreakdown> = new Array<IBreakdown>();
    //public goalTypesData: Array<IGoalTypePerformance> = new Array<IGoalTypePerformance>();
    public selectedScoreCardId = null;
    public selectedPeriod = null;
    public selectedGroupId = null;
    // public filterData: any;
    // public _selectedTabId: string;
    @Input() perTypesLoading: boolean;
    private sessionGroupKey = "Performance-Dashboard-Group";
    private sessionScorecardKey = "Performance-Dashboard-Scorecard";
    private sessionPeriodKey = "Performance-Dashboard-Period";

    // @Input() set selectedTabId(_selectedTabId: string) {
    //     this._selectedTabId = _selectedTabId;
    //     this.scrollToDiv(this._selectedTabId)
    // }

    // scrollToDiv(divId) {
    //     var element = document.getElementById(divId);
    //     element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
    // }

    constructor(private translateService: TranslateService, private performanceDashboardService: PerformanceDashboardService) {
        this.hanldeLangChange();
        this.selectedScoreCardId = localStorage.getItem(this.sessionScorecardKey);
        this.selectedPeriod = localStorage.getItem(this.sessionPeriodKey);
        this.selectedGroupId = localStorage.getItem(this.sessionGroupKey);
        
        // this.route.params.subscribe(params => {
        //     this.selectedScoreCardId = params["selectedScoreCardId"];
        //     this.selectedGroupId = params["selectedGroupId"];
        //     if(this.selectedScoreCardId) 
        //         this.getGoalTypePerformance();
        // })
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }

    // getGoalTypePerformance() {
    //     this.loading = true;
    //     this.performanceDashboardService.getGoalTypePerformance(this.selectedScoreCardId, this.selectedGroupId)
    //     .pipe(takeUntil(this.endSub$), finalize(() => ( this.loading = false)))
    //     .subscribe(res => {
    //         if(res) {
    //            // this.goalTypesData = res.types;
    //             this.analysisWidgetsData = {
    //                 offTrackGoals: res.offTrackGoals,
    //                 onTrack: res.onTrack,
    //                 overAchieved: res.overAchieved
    //             };
    //             this.performanceBreakdownData = res.breakdown;
    //         }
    //     })
    // }
    
    // getGoalTypePerformance() {
    //     this.loading = true;
    //     const url = `${Config.PerformanceDashboard.GetGoalTypePerformance}/${this.selectedScoreCardId}?group=${this.selectedGroupId ?? ''}`;
    //     this.httpHandlerService.get(url)
    //     .pipe(takeUntil(this.endSub$), finalize(() => ( this.loading = false)))
    //     .subscribe(res => {
    //         if(res) {
    //             this.goalTypesData = res.types;
    //             this.analysisWidgetsData = {
    //                 offTrackGoals: res.offTrackGoals,
    //                 onTrack: res.onTrack,
    //                 overAchieved: res.overAchieved
    //             };
    //             this.performanceBreakdownData = res.breakdown;
    //         }
    //     })
    // }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}