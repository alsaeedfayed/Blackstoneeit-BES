import { GroupIdentityModule } from './../group-identity/group-identity.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { ScoreSubmissionComponent } from './pages/score-submission-page/score-submission.component';
import { ScoreSubmissionRoutingModule } from './score-submission-routing.module';
import { TabelScoreSubmissionComponent } from './components/tabel-score-submission/tabel-score-submission.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createScoreSubmissionLoader } from 'src/app/utils/createTranslateLoader';
import { HeaderScoreSubmissionComponent } from './components/header-score-submission/header-score-submission.component';
import { UpdateKpiProgressComponent } from './pages/update-kpi-progress/update-kpi-progress.component';
import { UpdateProgressModalComponent } from './components/update-progress-modal/update-progress-modal.component';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';
import { ActualTargetStatisticsSubmissionComponent } from './components/actual-target-statistics-submission/actual-target-statistics-submission.component';
import { ScorecardSubmittionAnalysisComponent } from './components/scorecard-submittion-analysis/scorecard-submittion-analysis.component';
import { SubmitScoreSubmittionStatusComponent } from './components/submit-score-submittion-status/submit-score-submittion-status.component';
import { ReopenScorecardSubmissionComponent } from './components/reopen-submittion-scorecard/reopen-submittion-scorecard.component';

@NgModule({
  declarations: [
    ScoreSubmissionComponent,
    TabelScoreSubmissionComponent,
    UpdateKpiProgressComponent,
    HeaderScoreSubmissionComponent,
    UpdateProgressModalComponent,
    HistoryModalComponent,
    ActualTargetStatisticsSubmissionComponent,
    ScorecardSubmittionAnalysisComponent,
    SubmitScoreSubmittionStatusComponent,
    ReopenScorecardSubmissionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DesignSystemModule,
    GroupIdentityModule,
    ScoreSubmissionRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createScoreSubmissionLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class ScoreSubmissionModule {}
