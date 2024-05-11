import { GroupIdentityModule } from './../group-identity/group-identity.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { PerformanceDashboardComponent } from './pages/performance-dashboard/performance-dashboard.component';
import { PerformanceDashboardRoutingModule } from './performance-dashboard-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslatePerformanceDashboardLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { MainDashboardFilterComponent } from './components/main-dashboard-filter/main-dashboard-filter.component';
import { PerformanceToDateComponent } from './components/performance-to-date/performance-to-date.component';
import { PerformanceEvaluationComponent } from './components/performance-evaluation/performance-evaluation.component';
import { DataBreakdownComponent } from './components/data-breakdown/data-breakdown.component';
import { LevelPerformanceComponent } from './components/level-performance/level-performance.component';
import { DashboardAnalyticsComponent } from './components/dashboard-analytics/dashboard-analytics.component';
import { PerformanceDashboardDetailsComponent } from './pages/performance-dashboard-details/performance-dashboard-details.component';
import { LevelsPerformanceComponent } from './components/levels-performance/levels-performance.component';
import { PerformanceDigitalizationComponent } from './components/performance-digitalization/performance-digitalization.component';
import { TypeLevelPerformanceComponent } from './components/type-level-performance/type-level-performance.component';
import { OverallSummaryComponent } from './components/overall-summary/overall-summary.component';
import { GroupPerformanceComponent } from './components/group-performance/group-performance.component';
import { PerformanceDashboardService } from './pages/performance-dashboard/performance-dashboard.service';
import {ChartLineComponent} from "./components/chart-line/chart-line.component";

@NgModule({
  declarations: [
    PerformanceDashboardComponent,
    MainDashboardComponent,
    MainDashboardFilterComponent,
    PerformanceToDateComponent,
    PerformanceEvaluationComponent,
    LevelsPerformanceComponent,
    TypeLevelPerformanceComponent,
    DataBreakdownComponent,
    LevelPerformanceComponent,
    DashboardAnalyticsComponent,
    PerformanceDashboardDetailsComponent,
    PerformanceDigitalizationComponent,
    OverallSummaryComponent,
    GroupPerformanceComponent,
    ChartLineComponent
  ],
  imports: [
    CommonModule,
    GroupIdentityModule,
    SharedModule,
    DesignSystemModule,
    NgxChartsModule,
    PerformanceDashboardRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslatePerformanceDashboardLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [PerformanceDashboardService]
})
export class PerformanceDashboardModule {}
