import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';
import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsPageComponent } from './components/requests-page/requests-page.component';
import { RequestsStatsComponent } from './components/requests-stats/requests-stats.component';
import { RequestsFiltersComponent } from './components/requests-filters/requests-filters.component';
import { RequestsTableComponent } from './components/requests-table/requests-table.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { RequestDetailsDataComponent } from './components/request-details-data/request-details-data.component';
import { RequestHistoryComponent } from './components/request-history/request-history.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryListItemComponent } from './components/history-list-item/history-list-item.component';
import { RequestStatusTimelineComponent } from './components/request-status-timeline/request-status-timeline.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateRequestsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { RequestActionModelComponent } from './components/req-action-model/req-action-model.component';
import { RequestsAdvancedFilterComponent } from './components/requests-advanced-filter/requests-advanced-filter.component';
import { RequestCommentsComponent } from './components/request-comments/request-comments.component';
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  declarations: [
    RequestsPageComponent,
    RequestsStatsComponent,
    RequestsFiltersComponent,
    RequestsTableComponent,
    RequestDetailsComponent,
    RequestDetailsDataComponent,
    RequestHistoryComponent,
    HistoryListComponent,
    HistoryListItemComponent,
    RequestStatusTimelineComponent,
    RequestActionModelComponent,
    RequestsAdvancedFilterComponent,
    RequestCommentsComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
    DesignSystemModule,
		WorkflowSDkModule,
		ExportAsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateRequestsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RequestsModule {}
