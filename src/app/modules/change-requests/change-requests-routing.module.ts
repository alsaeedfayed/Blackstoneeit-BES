import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ChangeRequestsDetailsComponent } from './components/change-requests-details/change-requests-details.component';
import { ChangeRequestsMainComponent } from './components/change-requests-main/change-requests-main.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ChangeRequestsMainComponent,
      data: { title: 'Change Requests', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: 'details/:id',
      component: ChangeRequestsDetailsComponent,
      data: { title: 'Change Request Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeRequestsRoutingModule { }
