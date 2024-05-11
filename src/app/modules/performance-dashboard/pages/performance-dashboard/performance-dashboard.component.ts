import { Component, HostListener, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PerformanceDashboardService } from './performance-dashboard.service';
import { IPerformanceTodateData } from '../../components/performance-to-date/iPerformanceToDate.interface';
import { IBreakdown, IGoalTypePerformance } from '../../components/overall-summary/iGoalTypePerformanceData.interface';
import { IAnalysisData } from '../../components/dashboard-analytics/iAnalysis.interface';
import { ISubGroupPerformanceData } from '../../components/level-performance/iSubGroupPerformanceData.interface';
import { CollapseService } from 'src/app/layout/sidebar/sidebar-service/collapse.service';

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss'],
})

export class PerformanceDashboardComponent extends ComponentBase implements OnDestroy {
  //  DATA & Props
  private endSub$ = new Subject();
  public language = this.translate.currentLang;
  tabs = [
    {
      icon: 'bx bx-notepad',
      label: 'Main Dashboard',
      labelAr: 'لوحة الاداء الرئيسية',
      route: 'main-dashboard',
      id: 'tab1'
    },
    {
      icon: 'bx bx-line-chart',
      label: 'Overall Summary',
      labelAr: 'إدارة نوافذ ادخال النتائج',
      route: 'overall-summary',
      id: 'tab2'
    },
    {
      icon: 'bx bx-group',
      label: 'Group Performance',
      labelAr: 'إدارة أنواع الهدف',
      route: 'group-performance',
      id: 'tab3'
    },
  ];

  public selectedScoreCardId = null;
  public selectedPeriod = null;
  public selectedGroupId = null;
  public filterData: any;
  private sessionGroupKey = "Performance-Dashboard-Group";
  private sessionScorecardKey = "Performance-Dashboard-Scorecard";

  public selectedTabId: string ;
  public isFixed: boolean = false;
  public perTodateLoading: boolean = false;
  public perEvaluationLoading: boolean = false;
  public perTypesLoading: boolean = false;
  public perSubGoalLoading: boolean = false;
  public performanceToDateData: IPerformanceTodateData = {} as IPerformanceTodateData;
  public performanceEvaluationData = [];
  public goalTypesData: Array<IGoalTypePerformance> = new Array<IGoalTypePerformance>();
  public analysisWidgetsData: IAnalysisData = {} as IAnalysisData;
  public performanceBreakdownData: Array<IBreakdown> = new Array<IBreakdown>();
  public subGroupPerformanceData: Array<ISubGroupPerformanceData> = new Array<ISubGroupPerformanceData>();

  public isSidebarCollapsed: boolean = false;

  private goalTypePerformanceApiSubscription: Subscription;
  private subGroupPerformanceApiSubscription: Subscription;
  private performanceEvaluationApiSubscription: Subscription;
  private performanceToDateApiSubscription: Subscription;

  // This method will be called whenever the user scrolls the page
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Call your method or perform any actions you need here
    this.handleScroll();
  }

  constructor(translateService: TranslateConfigService, translate: TranslateService, private performanceDashboardService: PerformanceDashboardService, private collapseService: CollapseService) {
    super(translateService, translate);
    this.hanldeLangChange();
    this.filterData = {
      selectedScoreCardId: this.selectedScoreCardId,
      selectedGroupId: this.selectedGroupId
    }
    this.selectedTabId = this.tabs[0].id;
   // this.changeFilter()
  }

  private hanldeLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  changeFilter(data) {
    setTimeout(() => {
      this.selectedScoreCardId = data?.scorecardId;
      this.selectedGroupId = (data?.groupId && data?.groupId !='null') ? data?.groupId :
                            localStorage.getItem(this.sessionGroupKey) && localStorage.getItem(this.sessionGroupKey) != 'null' ? localStorage.getItem(this.sessionGroupKey)  : '';
      this.selectedPeriod = data?.period
      this.filterData = {
        selectedScoreCardId: this.selectedScoreCardId,
        selectedPeriod: this.selectedPeriod,
        selectedGroupId: this.selectedGroupId
      }
      // debugger
      this.getPerformanceToDate();
      this.getPerformanceEvaluation();
      this.getGoalTypePerformance();
      this.getSubGroupPerformance();
    }, 600);
   // let routeIds = (this.filterData?.selectedGroupId || localStorage.getItem(this.sessionGroupKey) != null) ? (this.filterData?.selectedScoreCardId +"/"+ this.filterData?.selectedGroupId) : this.filterData?.selectedScoreCardId;


    // if (window.location.href.includes('main-dashboard') && this.filterData?.selectedScoreCardId)
    //   this.router.navigateByUrl('/performance-dashboard/main-dashboard/'+ routeIds)
    // else if (window.location.href.includes('overall-summary') && this.filterData?.selectedScoreCardId)
    //   this.router.navigateByUrl('/performance-dashboard/overall-summary/'+ routeIds)
    // else if (window.location.href.includes('group-performance') && this.filterData?.selectedScoreCardId)
    //   this.router.navigateByUrl('/performance-dashboard/group-performance/'+ routeIds)
  }

  // onOutletLoaded(component: MainDashboardComponent | OverallSummaryComponent | GroupPerformanceComponent) {
  //   setTimeout(() => {
  //     // debugger
  //     let routeIds = (this.filterData?.selectedGroupId || localStorage.getItem(this.sessionGroupKey) != null) ? (this.filterData?.selectedScoreCardId +"/"+ this.filterData?.selectedGroupId) : this.filterData?.selectedScoreCardId;
  //     if (component instanceof MainDashboardComponent && this.filterData?.selectedScoreCardId)
  //       this.router.navigateByUrl('/performance-dashboard/main-dashboard/'+ routeIds)
  //     else if (component instanceof OverallSummaryComponent && this.filterData?.selectedScoreCardId)
  //       this.router.navigateByUrl('/performance-dashboard/overall-summary/'+ routeIds)
  //     else if (component instanceof GroupPerformanceComponent && this.filterData?.selectedScoreCardId)
  //       this.router.navigateByUrl('/performance-dashboard/group-performance/'+ routeIds)
  //     //   component.FilterData = this.filterData;
  //   }, 500);
  // }

  handleScroll() {
    // Check the current scroll position
    var scrollPosition = window.scrollY || window.pageYOffset;

    // Check if the scroll position is greater than or equal to 100 pixels
    if (scrollPosition >= 100) {
        // Your code to be executed when scrolling down 100 pixels
        this.isFixed = true;
    }
    if(scrollPosition == 0) {
      this.isFixed = false;
    }
    this.collapseService.isCollapse$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
    })
  }

  getPerformanceToDate() {
    this.perTodateLoading = true;
    this.performanceToDateApiSubscription = this.performanceDashboardService.getPerformanceToDate(this.selectedScoreCardId, this.selectedPeriod, this.selectedGroupId)
    .pipe(takeUntil(this.endSub$), finalize(() => (this.perTodateLoading = false)))
    .subscribe(res => {
        if(res) {
            this.performanceToDateData = {
                actualTD: (res.actualTD).replace('٫','.'),
                performanceTD: (res.performanceTD).replace('٫','.'),
                targetTD: (res.targetTD).replace('٫','.')
            };
          this.performanceDashboardService.setPerformanceTodateData(this.performanceToDateData);
        }
    })
  }

  getPerformanceEvaluation() {
    this.perEvaluationLoading = true;
    this.performanceEvaluationApiSubscription = this.performanceDashboardService.getPerformanceEvaluation(this.selectedScoreCardId, this.selectedGroupId)
    .pipe(takeUntil(this.endSub$), finalize(() => (this.perEvaluationLoading = false)))
    .subscribe(res => {
        if(res) {
          this.performanceEvaluationData = res;
          this.performanceDashboardService.setPerformanceEvaluation(this.performanceEvaluationData);
        }
    })
  }

  getGoalTypePerformance() {
    this.perTypesLoading = true;
    this.goalTypePerformanceApiSubscription = this.performanceDashboardService.getGoalTypePerformance(this.selectedScoreCardId, this.selectedPeriod, this.selectedGroupId)
    .pipe(takeUntil(this.endSub$), finalize(() => ( this.perTypesLoading = false)))
    .subscribe(res => {
        if(res) {
            this.goalTypesData = res.types;
            this.performanceDashboardService.setGoalTypePerformance(this.goalTypesData);

            this.analysisWidgetsData = {
                offTrackGoals: res.offTrackGoals,
                onTrack: res.onTrack,
                overAchieved: res.overAchieved,
                notDue: res.notDue
            };
            this.performanceDashboardService.setAnalysisWidgetsData(this.analysisWidgetsData);

            this.performanceBreakdownData = res.breakdown;
            this.performanceDashboardService.setBreakdownData(this.performanceBreakdownData);
        }
    })
  }

  getSubGroupPerformance() {
    this.perSubGoalLoading = true;
    this.subGroupPerformanceApiSubscription = this.performanceDashboardService.getSubGroupPerformance(this.selectedScoreCardId, this.selectedPeriod, this.selectedGroupId)
    .pipe(takeUntil(this.endSub$), finalize(() => (this.perSubGoalLoading = false)))
    .subscribe(res => {
        if(res) {
          this.subGroupPerformanceData = res;
          this.performanceDashboardService.setSubGroupPerformance(this.subGroupPerformanceData);
        }
    })
  }

  ngOnDestroy() {
    if (this.goalTypePerformanceApiSubscription) 
      this.goalTypePerformanceApiSubscription.unsubscribe();
    if(this.subGroupPerformanceApiSubscription)
      this.subGroupPerformanceApiSubscription.unsubscribe();
    if(this.performanceEvaluationApiSubscription)
      this.performanceEvaluationApiSubscription.unsubscribe();
    if(this.performanceToDateApiSubscription)
      this.performanceToDateApiSubscription.unsubscribe();
  }

}
