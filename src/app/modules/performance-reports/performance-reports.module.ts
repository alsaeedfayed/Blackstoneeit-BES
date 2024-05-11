import { GroupIdentityModule } from './../group-identity/group-identity.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { PerformanceReportsRoutingModule } from './performance-reports-routing.module';
import { PerformanceReportsPageComponent } from './Page/performance-reports-page.component';
import { PerformanceReportsHeaderComponent } from './Components/performance-reports-header/performance-reports-header.component';
import { PerformanceReportsTableComponent } from './Components/performance-reports-table/performance-reports-table.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslatePerformaneReportsLoader } from 'src/app/utils/createTranslateLoader';


@NgModule({
  declarations: [
    PerformanceReportsPageComponent,
    PerformanceReportsHeaderComponent,
    PerformanceReportsTableComponent
  ],
  imports: [
    CommonModule,GroupIdentityModule,
    PerformanceReportsRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslatePerformaneReportsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class PerformanceReportsModule { }
