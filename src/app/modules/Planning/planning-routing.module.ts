import { EditScorecardComponent } from './Components/edit-scorecard/edit-scorecard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { PlanningComponent } from './Page/planning.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: PlanningComponent,
      data: { title: 'planning', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: 'edit/:id',
      component: EditScorecardComponent,
      data: { title: 'Edit Scorecard', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },

  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PlanningRoutingModule { }
