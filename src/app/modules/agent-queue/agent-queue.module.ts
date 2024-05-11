import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { AgentQueueFiltersComponent } from './components/agent-queue-filters/agent-queue-filters.component';
import { AgentQueueTableComponent } from './components/agent-queue-table/agent-queue-table.component';
import { AgentQueueRoutingModule } from './agent-queue-routing.module';
import { AgentQueueAnalyticsComponent } from './components/agent-queue-analytics/agent-queue-analytics.component';
import { AgentQueuePageComponent } from './pages/agent-queue-page/agent-queue-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateAgentQueueLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { AgentAdvancedFilterComponent } from './components/agent-advanced-filter/agent-advanced-filter.component';

@NgModule({
  declarations: [
    AgentQueuePageComponent,
    AgentQueueAnalyticsComponent,
    AgentQueueFiltersComponent,
    AgentQueueTableComponent,
    AgentAdvancedFilterComponent,
  ],
  imports: [
    CommonModule,
    AgentQueueRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateAgentQueueLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class AgentQueueModule {}
