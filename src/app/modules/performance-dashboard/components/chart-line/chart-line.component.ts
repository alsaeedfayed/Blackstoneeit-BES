import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IGoalTypePerformance } from "../overall-summary/iGoalTypePerformanceData.interface";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";

@Component({
    selector: 'chart-line',
    templateUrl: './chart-line.component.html',
    styleUrls: ['./chart-line.component.scss']
})

export class ChartLineComponent {

    private endSub$ = new Subject();
    public lang: string = this.translateService.currentLang;
    public _data: Array<IGoalTypePerformance> = new Array<IGoalTypePerformance>();

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

    }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}
