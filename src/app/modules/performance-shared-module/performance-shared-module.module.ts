import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorecardDetailsModalComponent } from './Components/scorecard-details-modal/scorecard-details-modal.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateManageScorecardsLoader, createTranslatePerformanceSharedLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ScorecardDetailsModalComponent],
  imports: [
    CommonModule,SharedModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslatePerformanceSharedLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [ScorecardDetailsModalComponent],
})
export class PerformanceSharedModuleModule {}
