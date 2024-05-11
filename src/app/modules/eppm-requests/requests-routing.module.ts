import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { RequestsMainComponent } from './components/requests-main/requests-main.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: RequestsMainComponent,
      data: { title: 'Requests', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EppmRequestsRoutingModule { }
