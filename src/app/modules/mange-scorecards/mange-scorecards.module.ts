import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { MangeScorecardsRoutingModule } from './mange-scorecards-routing.module';
import { MangeScorecardPageComponent } from './page/mange-scorecard-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateManageScorecardsLoader, createTranslateManageServicesLoader } from 'src/app/utils/createTranslateLoader';
import { ScorecardsTableComponent } from './components/scorecards-table/scorecards-table.component';
import { scorecardModalComponent } from './components/scorecard-modal/scorecard-modal.component';
import { PerformanceSharedModuleModule } from '../performance-shared-module/performance-shared-module.module';


@NgModule({
  declarations: [
    MangeScorecardPageComponent,
    ScorecardsTableComponent, scorecardModalComponent
  ],
  imports: [
    CommonModule,
    MangeScorecardsRoutingModule, SharedModule, PerformanceSharedModuleModule, TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateManageScorecardsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class MangeScorecardsModule { }
