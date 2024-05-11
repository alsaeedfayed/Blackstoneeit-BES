import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { EppmRequestsRoutingModule } from './requests-routing.module';

import { RequestsMainComponent } from './components/requests-main/requests-main.component';
import { RequestsCardComponent } from './components/requests-card/requests-card.component';
import { RequestsAdvancedFilterComponent } from './components/requests-advanced-filter/requests-advanced-filter.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateEppmRequestsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { RequestsTableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    RequestsMainComponent,
    RequestsCardComponent,
    RequestsAdvancedFilterComponent,
    RequestsTableComponent,
  ],
  imports: [
    CommonModule,
    EppmRequestsRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateEppmRequestsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class EppmRequestsModule { }
