import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BreakdownStatus } from "./enums";
import { MeasurementMethodStatus } from "src/app/modules/score-submission/pages/update-kpi-progress/enums";
import { IBreakdown } from "../overall-summary/iGoalTypePerformanceData.interface";
import { PerformanceDashboardService } from "../../pages/performance-dashboard/performance-dashboard.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { LevelMode } from "src/app/modules/Planning/enum/enums";

@Component({
    selector: 'data-breakdown',
    templateUrl: './data-breakdown.component.html',
    styleUrls: ['./data-breakdown.component.scss']
})

export class DataBreakdownComponent {

    public lang: string = this.translate.currentLang;
    public _data: Array<IBreakdown> = new Array<IBreakdown>();
    public childrenGoals: Array<IBreakdown> = new Array<IBreakdown>();
    public status = BreakdownStatus;
    private endSub$ = new Subject();
    public allowExpandAll: boolean = true;
    //public expandedChildren = [];

    // @Input() set data(_data: Array<IBreakdown>) {
    //     this._data = _data;
    //     this.childrenGoals = this._data?.filter(goal => goal?.childrenGoals);
    // }
    
    constructor(private performanceDashboardService: PerformanceDashboardService, private translate: TranslateService) {
        this.performanceDashboardService.performanceBreakdownData$.pipe(takeUntil(this.endSub$)).subscribe((data: Array<IBreakdown>) => {
            this._data = data;
            this.childrenGoals = this._data?.filter(goal => goal?.childrenGoals);
        })
        // this.performanceDashboardService.expnadedArraySub$.pipe(takeUntil(this.endSub$)).subscribe(()=>{
        //     this.expandedChildren = [];
        //     this.performanceDashboardService.setExpandedArray(this.expandedChildren)
        // })
    }
    
    ngOnInit(): void {
        console.log("ngOnInit");
        this.handleLangChange()
    }

    private handleLangChange() {
        this.translate.onLangChange.subscribe((language) => {
            this.lang = language.lang;
        });
    }

    public GoalLevelText(level: number) {
        return this.translate.instant('shared.' + LevelMode[level]);
    }

    toggleNestedList(goal) {
        goal.open = !goal.open;
    }
    
    getLabel(label) {
        return this.translate.instant('shared.' + label)
    }
    
    addittion(measurementMethod) {
        if(measurementMethod == MeasurementMethodStatus.Currency)
            return " " + this.translate.instant('performanceDashboard.AED');
        else if(measurementMethod == MeasurementMethodStatus.Percentage)
            return '%';
        else 
            return ""
    }

    toggleViewGoals(flag: boolean){
        this._data?.forEach(goal => {
            goal.open = flag;
            this.checkChildren(goal, flag);
        })
        this.allowExpandAll = !this.allowExpandAll;
    }

    checkChildren(goal:any, flag: boolean){
        for(let index=0; index < goal?.childrenGoals?.length; index++){
            goal.childrenGoals[index].open = flag;
            this.checkChildren(goal.childrenGoals[index], flag);
        }
        //return;
    }

}