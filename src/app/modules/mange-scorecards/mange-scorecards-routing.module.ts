import { MangeScorecardPageComponent } from './page/mange-scorecard-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';

const routes: Routes = [
    {
      path: '',
      component: MangeScorecardPageComponent,
      data: { title: 'Manage Scorecards' }, // This is the page title showing in the tab (in browser)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MangeScorecardsRoutingModule { }
