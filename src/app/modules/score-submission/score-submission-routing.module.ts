import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ScoreSubmissionComponent } from './pages/score-submission-page/score-submission.component';
import { UpdateKpiProgressComponent } from './pages/update-kpi-progress/update-kpi-progress.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ScoreSubmissionComponent,
      data: { title: 'Score Submission', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
    {
      path: ':scorecardSubmissionId/:goalId',
      component: UpdateKpiProgressComponent,
      data: { title: 'Update KPI Progress', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreSubmissionRoutingModule {}
