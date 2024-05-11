import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IGoalTypePerformance } from "../overall-summary/iGoalTypePerformanceData.interface";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";

@Component({
    selector: 'levels-performance',
    templateUrl: './levels-performance.component.html',
    styleUrls: ['./levels-performance.component.scss']
})

export class LevelsPerformanceComponent {

    private endSub$ = new Subject();
    public lang: string = this.translateService.currentLang;
    public _data: Array<IGoalTypePerformance> = new Array<IGoalTypePerformance>();
    public selectedTabId: number = 1;

    @Input() set data(_data: Array<IGoalTypePerformance>) {
        this._data = _data;
        // this.selectedTabId = this._data[0]?.type?.id;
    }

    constructor(private performanceDashboardService: PerformanceDashboardService, private translateService: TranslateService) {
        this.hanldeLangChange();
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }

    ngOnInit() {
        this.performanceDashboardService.goalTypesData$.pipe(takeUntil(this.endSub$)).subscribe((data: Array<IGoalTypePerformance>) => {
            this._data = data;
        })
    }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}
