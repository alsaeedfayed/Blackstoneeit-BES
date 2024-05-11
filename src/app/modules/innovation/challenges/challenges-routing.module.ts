import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Layout} from 'src/app/layout/layout-routing.service';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {ListChallengesComponent} from "./pages/list-challenges/list-challenges.component";
import {AddChallengeComponent} from "./pages/add-challenge/add-challenge.component";


const routes: Routes = [
  Layout.childRoutes([
    {
      path: 'list',
      component: ListChallengesComponent,
      data: {title: 'ALl CHALLENGES', displaySidebar: true}, // This is the page title showing in the tab (in browser)
    },
    {
      path: 'add',
      component: AddChallengeComponent,
      data: {title: 'Add CHALLENGE', displaySidebar: true}, // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengesRoutingModule {
}
