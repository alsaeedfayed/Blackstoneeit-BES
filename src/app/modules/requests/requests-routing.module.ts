import { RequestsPageComponent } from './components/requests-page/requests-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { RequestDetailsComponent } from './components/request-details/request-details.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: RequestsPageComponent,
      data: { title: 'Requests', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
    {
      path:'request-details/:id',
      component:RequestDetailsComponent,
      data: { title: 'Request Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
    }
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule {}
