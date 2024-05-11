import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateBauLoader } from "src/app/utils/createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DesignSystemModule } from "src/app/design-system/design-system.module";

import { InsightsComponent } from "./taskboard/components/insights/insights.component";
import { MainTasksComponent } from "./taskboard/pages/main-tasks/main-tasks.component";
import { CreateMainTaskComponent } from "./taskboard/pages/main-tasks/create-main-task/create-main-task.component";
import { FiltersComponent } from "./taskboard/components/filters/filters.component";
import { MainTasksTableComponent } from "./taskboard/pages/main-tasks/main-tasks-table/main-tasks-table.component";
import { ProgressBarZonesComponent } from "./taskboard/components/progress-bar-zones/progress-bar-zones.component";
import { FormatMoneyPipe } from "./taskboard/pipe/format-money.pipe";
import { CreateSubTaskComponent } from "./taskboard/pages/main-tasks/create-sub-task/create-sub-task.component";
import { TasksFilterComponent } from './taskboard/components/tasks-filter/tasks-filter.component';
import { BauRoutingModule } from "./bau-routing.module";

import { BauComponent } from "./bau.component";
import { BauRolesMainPageComponent } from './roles/bau-roles-main-page/bau-roles-main-page.component';
import { BauRolesComponent } from './roles/pages/bau-roles/bau-roles.component';
import { BauMainTaskMainPageComponent } from './taskboard/main-tasks/bau-main-task-main-page/bau-main-task-main-page.component';
import { MainTaskDetailsComponent } from './taskboard/main-tasks/pages/main-task-details/main-task-details.component';
import { BauTasksMainPageComponent } from './taskboard/tasks/bau-tasks-main-page/bau-tasks-main-page.component';
import { PorgressColorPipe } from './taskboard/tasks/pipes/porgress-color.pipe';
import { RolesRowsComponent } from './roles/components/roles-rows/roles-rows.component';
import { RolesFilterComponent } from './roles/components/roles-filter/roles-filter.component';
import { NewRoleModalComponent } from './roles/components/new-role-modal/new-role-modal.component';
import { BauDashboardComponent } from './dashboard/pages/bau-dashboard/bau-dashboard.component';
import { BauDashboardFiltersComponent } from './dashboard/components/bau-dashboard-filters/bau-dashboard-filters.component';
import { BauDashboardStatisticsComponent } from './dashboard/components/bau-dashboard-statistics/bau-dashboard-statistics.component';
import { StatisticCardComponent } from './bau-shared-components/statistic-card/statistic-card.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { BauDashboardSectorPerformanceComponent } from './dashboard/components/bau-dashboard-sector-performance/bau-dashboard-sector-performance.component';
import { TaskImplementationsComponent } from './dashboard/components/task-implementations/task-implementations.component';
import { ImplementationStatusComponent } from './dashboard/components/implementation-status/implementation-status.component';
import { SpentTotalTasksComponent } from './dashboard/components/spent-total-tasks/spent-total-tasks.component';
import { TasksStatusComponent } from './dashboard/components/tasks-status/tasks-status.component';
import { RolesCoveragesComponent } from './dashboard/components/roles-coverages/roles-coverages.component';
import { TasksRowsComponent } from './dashboard/components/tasks-rows/tasks-rows.component';
import { BoardTaskCardComponent } from './taskboard/tasks/components/board-task-card/board-task-card.component';
import { BoardTasksColsComponent } from './taskboard/tasks/components/board-tasks-cols/board-tasks-cols.component';
import { TaskDetailsModalComponent } from './taskboard/tasks/components/task-details-modal/task-details-modal.component';
import { TasksFiltersComponent } from './taskboard/tasks/components/tasks-filters/tasks-filters.component';
import { TasksHistoryComponent } from './taskboard/tasks/components/tasks-history/tasks-history.component';
import { UpdateTaskProgressModalComponent } from './taskboard/tasks/components/update-task-progress-modal/update-task-progress-modal.component';
import { ImportanceLevelComponent } from './taskboard/importance-level/importance-level.component';
import { ExportAsModule } from 'ngx-export-as';
import { ProgressColorBauPipe } from './pipes/taskProgressColor/progress-color-bau.pipe';
import { TaskTableComponent } from './taskboard/tasks/components/task-table/task-table.component';
import { StrategyMappingListComponent } from './taskboard/components/strategy-mapping-list/strategy-mapping-list.component';
import { TasksBoardComponent } from './taskboard/tasks/components/tasks-board/tasks-board.component';
import { MainTaskMainInfoComponent } from './taskboard/main-tasks/components/main-task-main-info/main-task-main-info.component';
import {DateFormatPipe} from "./taskboard/pipe/date-format.pipe";
import { TaskboardFormModalComponent } from './taskboard/components/taskboard-form-modal/taskboard-form-modal.component';

@NgModule({
  declarations: [
    InsightsComponent,
    MainTasksComponent,
    CreateMainTaskComponent,
    FiltersComponent,
    MainTasksTableComponent,
    ProgressBarZonesComponent,
    BauComponent,
    FormatMoneyPipe,
    DateFormatPipe,
    CreateSubTaskComponent,
    TasksFilterComponent,
    BauRolesMainPageComponent,
    BauRolesComponent,
    BauMainTaskMainPageComponent,
    MainTaskDetailsComponent,
    BauTasksMainPageComponent,
    PorgressColorPipe,
    RolesRowsComponent,
    RolesFilterComponent,
    NewRoleModalComponent,
    BauDashboardComponent,
    BauDashboardFiltersComponent,
    BauDashboardStatisticsComponent,
    StatisticCardComponent,
    BauDashboardSectorPerformanceComponent,
    TaskImplementationsComponent,
    ImplementationStatusComponent,
    SpentTotalTasksComponent,
    TasksStatusComponent,
    RolesCoveragesComponent,
    TasksRowsComponent,
    BoardTaskCardComponent,
    BoardTasksColsComponent,
    TaskDetailsModalComponent,
    TasksFiltersComponent,
    TasksHistoryComponent,
    UpdateTaskProgressModalComponent,
    ImportanceLevelComponent,
    ProgressColorBauPipe,
    TaskTableComponent,
    StrategyMappingListComponent,
    TasksBoardComponent,
    MainTaskMainInfoComponent,
    TaskboardFormModalComponent,
  ],
  imports: [
    CommonModule,
    BauRoutingModule,
    DesignSystemModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGaugeModule,
    ExportAsModule,
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateBauLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  exports: [
    FormatMoneyPipe
  ]
})
export class BauModule {}
