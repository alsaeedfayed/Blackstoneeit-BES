import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { DashboardProjectStatusComponent } from './components/dashboard-project-status/dashboard-project-status.component';
import { DashboardFinanceSummaryComponent } from './components/dashboard-finance-summary/dashboard-finance-summary.component';
import { DashboardTasksProgressComponent } from './components/dashboard-tasks-progress/dashboard-tasks-progress.component';
import { DashboardMilestoneProgressComponent } from './components/dashboard-milestone-progress/dashboard-milestone-progress.component';
import { createTranslateDashboardLoader } from 'src/app/utils/createTranslateLoader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DashboardProjectManagersComponent } from './components/dashboard-project-managers/dashboard-project-managers.component';
import { DashboardSectorsComponent } from './components/dashboard-sectors/dashboard-sectors.component';
import { DashboardDepartmentsComponent } from './components/dashboard-departments/dashboard-departments.component';
import { PrioritiesComponent } from './components/priorities/priorities.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OriginsComponent } from './components/origins/origins.component';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters.component';
import { DashboardAdvancedFilterComponent } from './components/dashboard-advanced-filter/dashboard-advanced-filter.component';
import { DeliverablesComponent } from './components/deliverables/deliverables.component';
import { HighRisksListComponent } from './components/high-risks-list/high-risks-list.component';
import { DetailsListComponent } from './components/details-list/details-list.component';
import { DashboardMainOldComponent } from './components/dashboard-main-old/dashboard-main-old.component';
import { TotalBudgetAndSpentComponent } from './components/total-budget-and-spent/total-budget-and-spent.component';

@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardMainOldComponent,
    DashboardProjectStatusComponent,
    DashboardFinanceSummaryComponent,
    DashboardTasksProgressComponent,
    DashboardMilestoneProgressComponent,
    DashboardProjectManagersComponent,
    DashboardSectorsComponent,
    DashboardDepartmentsComponent,
    PrioritiesComponent,
    CategoriesComponent,
    OriginsComponent,
    DashboardFiltersComponent,
    DashboardAdvancedFilterComponent,
    DeliverablesComponent,
    HighRisksListComponent,
    DetailsListComponent,
    TotalBudgetAndSpentComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateDashboardLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class DashboardModule {}
