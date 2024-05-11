import { Component, EventEmitter, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { IScorecard } from "src/app/modules/Planning/Page/interfaces";
import { IGroupIdentity } from "src/app/modules/group-identity/interfaces/interfaces";

@Component({
    selector: 'main-dashboard-filter',
    templateUrl: './main-dashboard-filter.component.html',
    styleUrls: ['./main-dashboard-filter.component.scss'],
})

export class MainDashboardFilterComponent {

    private endSub$ = new Subject()
    public lang: string = this.translateService.currentLang;
    public scorecards: IScorecard[] = [];
    public selectedScorecard: number;
    public selectedPeriod: number;
    public selectedGroup = null;
    public isDownloading: boolean = false;
    private sessionGroupKey = "Performance-Dashboard-Group";
    private sessionScorecardKey = "Performance-Dashboard-Scorecard";
    private sessionPeriodKey = "Performance-Dashboard-Period";
    period: any[] = [];

    @Output() onFilter: EventEmitter<any> = new EventEmitter();

    constructor(private translateService: TranslateService, private httpHandlerService: HttpHandlerService) {
        this.hanldeLangChange();
        // this.getAllScorcards();
        // this.getSubmissionPeriod();
        this.loadSelectsData();
    }

    loadSelectsData() {
        const getAllScorecards = this.httpHandlerService.get(Config.Performance.getScorecardAll);
        const getAllSubmissionPeriod = this.httpHandlerService.get(Config.Performance.SubmissionPeriod);
        forkJoin({ getAllScorecards, getAllSubmissionPeriod })
        .subscribe((res) => {

            this.scorecards = res.getAllScorecards.scorecards;
            if(!localStorage.getItem(this.sessionScorecardKey)) {
                this.selectedScorecard = this.scorecards[0].id;
                localStorage.setItem(this.sessionScorecardKey, this.selectedScorecard ? this.selectedScorecard.toString() : null);
            }
            else 
                this.selectedScorecard = +(localStorage.getItem(this.sessionScorecardKey))
        
            this.period = res.getAllSubmissionPeriod;
            if(!localStorage.getItem(this.sessionPeriodKey)) {
                this.selectedPeriod = this.period[0].index;
                localStorage.setItem(this.sessionPeriodKey, this.selectedPeriod ? this.selectedPeriod.toString() : null);
            }
            else 
                this.selectedPeriod = +(localStorage.getItem(this.sessionPeriodKey))
            
            this.search();
        
        })
    }

    private hanldeLangChange() {
        this.translateService.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
            this.lang = this.translateService.currentLang;
        });
    }
    
    public getAllScorcards() {
        this.httpHandlerService.get(Config.Performance.getScorecardAll).subscribe(res=> {
            this.scorecards = res.scorecards;
            if(!localStorage.getItem(this.sessionScorecardKey)) {
                this.selectedScorecard = this.scorecards[0].id;
                localStorage.setItem(this.sessionScorecardKey, this.selectedScorecard ? this.selectedScorecard.toString() : null);
            }
            else {
                this.selectedScorecard = +(localStorage.getItem(this.sessionScorecardKey))
            }
        })
    }
    
    public getSubmissionPeriod() {
        this.httpHandlerService.get(Config.Performance.SubmissionPeriod).subscribe(res=> {
            this.period = res;
            if(!localStorage.getItem(this.sessionPeriodKey)) {
                this.selectedPeriod = this.period[0].index;
                localStorage.setItem(this.sessionPeriodKey, this.selectedPeriod ? this.selectedPeriod.toString() : null);
            }
            else {
                this.selectedPeriod = +(localStorage.getItem(this.sessionPeriodKey))
            }
        })
    }
    
    public handleScorecardChange(scorecardId: number) {
        this.selectedScorecard = scorecardId;
        localStorage.setItem(this.sessionScorecardKey, this.selectedScorecard ? this.selectedScorecard.toString() : null);
        //debugger
        // this.selectedGoal = null;
        // this.headerComponent.slectedScorecardId = scorecardId;
        // this.headerComponent.getMyGoals()
        // this.getReports();
    }

    public handelChangePeriod(selectedPeriod: number) {
        this.selectedPeriod = selectedPeriod;
        localStorage.setItem(this.sessionPeriodKey, this.selectedPeriod ? this.selectedPeriod.toString() : null);
    }
    
    public onSelectedGroupChange(group:IGroupIdentity) {
        this.selectedGroup = group ? group.id : null;
    //     this.changeGroup.emit(selectedGroup);
    //     this.doneData.emit();
        localStorage.setItem(this.sessionGroupKey, this.selectedGroup ? this.selectedGroup.toString() : null);
    }

    search() {
        this.onFilter.emit({
            groupId: this.selectedGroup ? this.selectedGroup :
                    localStorage.getItem(this.sessionGroupKey) ? localStorage.getItem(this.sessionGroupKey) : 
                    null,
            scorecardId: this.selectedScorecard,
            period: this.selectedPeriod
        })
        // console.log('from filter ', {
        //     groupId: this.selectedGroup,
        //     scorecardId: this.selectedScorecard
        // })
    }

    get isShowExport(): boolean {
        return true;
        //(
            // (this.selectLevel && this.selectLevel == LevelMode.L0) || (this.selectLevel && !!this.selectedGroup)
        //);
    }

    public exportDataHandler() {
        this.isDownloading = true;
        // fetch(`${environment.serverUrl}${Config.Performance.Export}?ScorecardId=${this.selectedScorecard}
        //     // &Level=${this.selectLevel ?? ''}&GroupId=${
        //     //   this.selectedGroup ? this.selectedGroup: ''
        //     // }&ParentGroupId=${this.selectedGoal ?? ''}&PeriodId=${
        //     //   this.selectedPeriodId ?? ''
        //     // }`
        //     , {
        //   headers: { Authorization: 'Bearer ' + this.userSer.getAccessTokenId(), 'License-Key': licenceKey.valid },
        // })
        //   .then((resp) => resp.blob())
        //   .then((blob) => {
        //     const url = window.URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.style.display = 'none';
        //     a.href = url;
        //     // the filename you want
        //     a.download = `Goals.xlsx`;
        //     document.body.appendChild(a);
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        //     this.isDownloading = false;
        //   });
    }

    ngOnDestroy(): void {
        this.endSub$.next(null);
        this.endSub$.complete();
    }

}