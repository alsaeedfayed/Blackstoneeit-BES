import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IPerformanceTodateData } from "./iPerformanceToDate.interface";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";

@Component({
    selector: 'performance-to-date',
    templateUrl: './performance-to-date.component.html',
    styleUrls: ['./performance-to-date.component.scss'],
})

export class PerformanceToDateComponent {

    public lang: string = this.translateService.currentLang;
    private endSub$ = new Subject();
    public _data: IPerformanceTodateData = {} as IPerformanceTodateData;
    public isNullish: boolean = false;

    // @Input() set data(data: IPerformanceTodateData) {
    //     this._data = data;
    //   //  this.loading = false;
    //     this.isNullish = Object.values(this._data).every(value => {
    //         if (value === null) {
    //             return true;
    //         }
    
    //         return false;
    //     });
    // }
    
    constructor(private performanceDashboardService: PerformanceDashboardService, private translateService: TranslateService) {
        this.performanceDashboardService.performanceToDateData$.pipe(takeUntil(this.endSub$)).subscribe((data: IPerformanceTodateData) => {
            this._data = data;
            this.isNullish = Object.values(this._data).every(value => {
                if (value === null) {
                    return true;
                }
                return false;
            });
          //  this.loading = false;
        })
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }

    ngOnInit() {
        this.hanldeLangChange();
    }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

    // get ActualTD() {
    //     if(!this._data.actualTD)
    //         return '120px';
    //     let size = this._data.actualTD * 2;
    //     if(size < 120)
    //         return '120px';
    //     if(size > 150)
    //         return '150px';
    //     return size + 'px';
    // }

    // get PerformanceTD() {
    //     if(!this._data.performanceTD)
    //         return '120px';
    //     let size = this._data.performanceTD * 2;
    //     if(size < 120)
    //         return '120px';
    //     if(size > 150)
    //         return '150px';
    //     return size + 'px';
    // }

    // get TargetTD() {
    //     if(!this._data.targetTD)
    //         return '120px';
    //     let size = this._data.targetTD * 2;
    //     if(size < 120)
    //         return '120px';
    //     if(size > 150)
    //         return '150px';
    //     return size + 'px';
    // }

}