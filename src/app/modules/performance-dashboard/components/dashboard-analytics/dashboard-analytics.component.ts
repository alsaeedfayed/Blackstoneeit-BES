import { Component } from "@angular/core";
import { IBorderWidget } from "src/app/shared/components/analysis-border-widget/iBorderWidget.interface";
import { IAnalysisData } from "./iAnalysis.interface";
import { TranslateService } from "@ngx-translate/core";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: 'dashboard-analytics',
    templateUrl: './dashboard-analytics.component.html',
    styleUrls: ['./dashboard-analytics.component.scss']
})

export class DashboardAnalyticsComponent {

    widgets: Array<IBorderWidget> = new Array<IBorderWidget>();
    public _data: IAnalysisData = {} as IAnalysisData;
    public lang: string = this.translate.currentLang;
    private endSub$ = new Subject();
    
    // @Input() set data(data: IAnalysisData) {
    //     this._data = data;
    //     this.widgets = [
    //         {
    //             borderColor: 'rgb(62,209,38)',
    //             title: this.translate.instant('shared.onTrack'),
    //             count: this._data.onTrack 
    //         },
    //         {
    //             borderColor: 'rgb(255,133,64)', 
    //             title: this.translate.instant('shared.offTrack'),
    //             count: this._data.offTrackGoals
    //         },
    //         {
    //             borderColor: 'rgb(82,193,255)',
    //             title: this.translate.instant('shared.overAchived'),
    //             count: this._data.overAchieved
    //         }
    //     ]
    // }

    constructor(private performanceDashboardService: PerformanceDashboardService, private translate: TranslateService) {
        this.performanceDashboardService.analysisWidgetsData$.pipe(takeUntil(this.endSub$)).subscribe((data: IAnalysisData) => {
            this._data = data;
            this.widgets = [
            {
                borderColor: 'rgb(62,209,38)',
                title: this.translate.instant('shared.onTrack'),
                count: this._data.onTrack 
            },
            {
                borderColor: 'rgb(255,133,64)', 
                title: this.translate.instant('shared.offTrack'),
                count: this._data.offTrackGoals
            },
            {
                borderColor: 'rgb(82,193,255)',
                title: this.translate.instant('shared.overAchived'),
                count: this._data.overAchieved
            },
            {
                borderColor: 'rgb(113, 121, 134)',
                title: this.translate.instant('shared.notDue'),
                count: this._data.notDue
            }
            ]
        })
    }

    ngOnInit(): void {
        this.handleLangChange()
    }

    private handleLangChange() {
        this.translate.onLangChange.subscribe((language) => {
            this.lang = language.lang;
            this.widgets = [
                {
                    borderColor: 'rgb(62,209,38)',
                    title: this.translate.instant('shared.onTrack'),
                    count: this._data.onTrack 
                },
                {
                    borderColor: 'rgb(255,133,64)', 
                    title: this.translate.instant('shared.offTrack'),
                    count: this._data.offTrackGoals
                },
                {
                    borderColor: 'rgb(82,193,255)',
                    title: this.translate.instant('shared.overAchived'),
                    count: this._data.overAchieved
                },
                {
                    borderColor: 'rgb(113, 121, 134)',
                    title: this.translate.instant('shared.notDue'),
                    count: this._data.notDue
                }
                ]
        });
    }
    
    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}