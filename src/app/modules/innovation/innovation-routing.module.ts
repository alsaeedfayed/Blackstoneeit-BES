import {Permissions} from '../../core/services/permissions';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Layout} from 'src/app/layout/layout-routing.service';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {InnovationComponent} from "./innovation.component";


const routes: Routes = [
  {
    path: '',
    component: InnovationComponent,
    children: [{
      path: "dashboard",
      loadChildren: () =>
        import("./dashboard/dashboard.module").then(
          a => a.DashboardModule
        ),
      // data: {
      //   allowedClaims: ['ManageSettings'],
      // },
    },
      {
        path: "challenges",
        loadChildren: () =>
          import("./challenges/challenges.module").then(
            a => a.ChallengesModule
          ),
        // data: {
        //   allowedClaims: ['ManageSettings'],
        // },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovationRoutingModule {
}
