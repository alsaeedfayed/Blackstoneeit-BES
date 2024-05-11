import { createTranslatePerfChngeRequestLoader } from './../../utils/createTranslateLoader';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { PerformanceChangeRequestsRoutingModule } from './performance-change-requests-routing.module';
import { PerformanceChangeRequestsPageComponent } from './components/performance-change-requests-page/performance-change-requests-page.component';
import { PerformanceChangeRequestsFiltersComponent } from './components/performance-change-requests-filters/performance-change-requests-filters.component';
import { PerformanceChangeRequestsTableComponent } from './components/performance-change-requests-table/performance-change-requests-table.component';
import { PerformanceChangeRequestModalComponent } from './components/performance-change-request-modal/performance-change-request-modal.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ChnageRequestDetilasPageComponent } from './components/chnage-request-detilas-page/chnage-request-detilas-page.component';
import { CrDetailsDataComponent } from './components/chnage-request-detilas-page/components/cr-details-data/cr-details-data.component';
import { CrActionModelComponent } from './components/chnage-request-detilas-page/components/cr-action-model/cr-action-model.component';
import { ChangeRequestPageComponent } from './Page/change-request-page.component';

@NgModule({
  declarations: [
    PerformanceChangeRequestsPageComponent,
    PerformanceChangeRequestsFiltersComponent,
    PerformanceChangeRequestsTableComponent,
    PerformanceChangeRequestModalComponent,
    ChnageRequestDetilasPageComponent,
    CrDetailsDataComponent,
    CrActionModelComponent,
    ChangeRequestPageComponent
  ],
  imports: [
    CommonModule,
    PerformanceChangeRequestsRoutingModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslatePerfChngeRequestLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class PerformanceChangeRequestsModule {}
