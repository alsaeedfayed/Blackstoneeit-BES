import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { ISubGroupPerformanceData } from "../level-performance/iSubGroupPerformanceData.interface";
import { ActivatedRoute } from "@angular/router";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";

@Component({
    selector: 'group-performance',
    templateUrl: './group-performance.component.html',
    styleUrls: ['./group-performance.component.scss']
})

export class GroupPerformanceComponent {

    private endSub$ = new Subject();
    public lang: string = this.translateService.currentLang;
    public subGroupPerformanceData: ISubGroupPerformanceData = {} as ISubGroupPerformanceData;
    public selectedScoreCardId = null;
    public selectedPeriod = null;
    public selectedGroupId = null;
    @Input() public perSubGoalLoading: boolean = false;
    private sessionGroupKey = "Performance-Dashboard-Group";
    private sessionScorecardKey = "Performance-Dashboard-Scorecard";
    private sessionPeriodKey = "Performance-Dashboard-Period";

    constructor(private route: ActivatedRoute, private translateService: TranslateService, private performanceDashboardService: PerformanceDashboardService) {
        this.hanldeLangChange();
        this.selectedScoreCardId = localStorage.getItem(this.sessionScorecardKey);
        this.selectedPeriod = localStorage.getItem(this.sessionPeriodKey);
        this.selectedGroupId = localStorage.getItem(this.sessionGroupKey);

        // this.route.params.subscribe(params => {
        //     this.selectedScoreCardId = params["selectedScoreCardId"];
        //     this.selectedGroupId = params["selectedGroupId"];
        //     if(this.selectedScoreCardId) {
        //         this.getSubGroupPerformance();
        //     }
        // })
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }

    // getSubGroupPerformance() {
    //     this.loading = true;
    //     this.performanceDashboardService.getSubGroupPerformance(this.selectedScoreCardId, this.selectedGroupId)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.loading = false)))
    //     .subscribe(res => {
    //         if(res) 
    //             this.subGroupPerformanceData = res;
    //     })
    // }

    // getSubGroupPerformance() {
    //     this.loading = true;
    //     const url = `${Config.PerformanceDashboard.GetSubgroupPerformance}/${this.selectedScoreCardId}?group=${this.selectedGroupId ?? ''}`;
    //     this.httpHandlerService.get(url)
    //     .pipe(takeUntil(this.endSub$), finalize(() => (this.loading = false)))
    //     .subscribe(res => {
    //         if(res) 
    //             this.subGroupPerformanceData = res;
    //     })
    // }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}