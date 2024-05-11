import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ClosureRequestsDetailsComponent } from './components/closure-requests-details/closure-requests-details.component';
import { ClosureRequestsMainComponent } from './components/closure-requests-main/closure-requests-main.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ClosureRequestsMainComponent,
      data: { title: 'Closure Requests', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: 'details/:id',
      component: ClosureRequestsDetailsComponent,
      data: { title: 'Closure Requests Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClosureRequestsRoutingModule { }
