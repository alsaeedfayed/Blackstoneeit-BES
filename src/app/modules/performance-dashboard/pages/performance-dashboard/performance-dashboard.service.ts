import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { IPerformanceTodateData } from '../../components/performance-to-date/iPerformanceToDate.interface';
import { IBreakdown, IGoalTypePerformance } from '../../components/overall-summary/iGoalTypePerformanceData.interface';
import { IAnalysisData } from '../../components/dashboard-analytics/iAnalysis.interface';
import { ISubGroupPerformanceData } from '../../components/level-performance/iSubGroupPerformanceData.interface';

@Injectable()
export class PerformanceDashboardService {

    private performanceToDateData: BehaviorSubject<IPerformanceTodateData> = new BehaviorSubject<IPerformanceTodateData>({} as IPerformanceTodateData);
    public performanceToDateData$ = this.performanceToDateData.asObservable();
    
    private performanceEvaluationData: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    public performanceEvaluationData$ = this.performanceEvaluationData.asObservable();
    
    private goalTypesData: BehaviorSubject<Array<IGoalTypePerformance>> = new BehaviorSubject<Array<IGoalTypePerformance>>([]);
    public goalTypesData$ = this.goalTypesData.asObservable();

    private analysisWidgetsData: BehaviorSubject<IAnalysisData> = new BehaviorSubject<IAnalysisData>({} as IAnalysisData);
    public analysisWidgetsData$ = this.analysisWidgetsData.asObservable();

    private performanceBreakdownData: BehaviorSubject<Array<IBreakdown>> = new BehaviorSubject<Array<IBreakdown>>([]);
    public performanceBreakdownData$ = this.performanceBreakdownData.asObservable();

    // private expnadedArraySub = new BehaviorSubject([]);
    // public expnadedArraySub$ = this.expnadedArraySub.asObservable()

    private subGroupPerformanceData: BehaviorSubject<Array<ISubGroupPerformanceData>> = new BehaviorSubject<Array<ISubGroupPerformanceData>>([]);
    public subGroupPerformanceData$ = this.subGroupPerformanceData.asObservable();


    constructor(private httpHandlerService: HttpHandlerService) {}

    // ===================PerformanceToDate===================
    getPerformanceToDate(selectedScoreCardId: any, selectedPeriod: any, selectedGroupId: any) {
        const url = `${Config.PerformanceDashboard.GetPerformanceTodate}/${selectedScoreCardId}/${selectedPeriod}?group=${selectedGroupId ?? ''}`;
        return this.httpHandlerService.get(url);
    }
    setPerformanceTodateData(data: IPerformanceTodateData) {
        this.performanceToDateData.next(data);
    }


    // ===================PerformanceEvaluation===================
    getPerformanceEvaluation(selectedScoreCardId: any, selectedGroupId: any) {
        const url = `${Config.PerformanceDashboard.GetYearPerformance}/${selectedScoreCardId}?group=${selectedGroupId ?? ''}`;
        return this.httpHandlerService.get(url);
    }
    setPerformanceEvaluation(data: Array<any>) {
        this.performanceEvaluationData.next(data);
    }


    // ===================GoalTypePerformance===================
    getGoalTypePerformance(selectedScoreCardId: any, selectedPeriod: any, selectedGroupId: any) {
        const url = `${Config.PerformanceDashboard.GetGoalTypePerformance}/${selectedScoreCardId}/${selectedPeriod}?group=${selectedGroupId ?? ''}`;
        return this.httpHandlerService.get(url);
    }
    setGoalTypePerformance(data: Array<IGoalTypePerformance>) {
        this.goalTypesData.next(data);
    }
    setAnalysisWidgetsData(data: IAnalysisData) {
        this.analysisWidgetsData.next(data);
    }
    setBreakdownData(data: Array<IBreakdown>) {
        this.performanceBreakdownData.next(data);
    }
    // setExpandedArray(data) {
    //     this.expnadedArraySub.next(data);
    // }


    // ===================SubGroupPerformance===================
    getSubGroupPerformance(selectedScoreCardId: any, selectedPeriod: any, selectedGroupId: any) {
        const url = `${Config.PerformanceDashboard.GetSubgroupPerformance}/${selectedScoreCardId}/${selectedPeriod}?group=${selectedGroupId ?? ''}`;
        return this.httpHandlerService.get(url);
    }
    setSubGroupPerformance(data: Array<ISubGroupPerformanceData>) {
        this.subGroupPerformanceData.next(data);
    }

}