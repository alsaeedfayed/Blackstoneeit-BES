import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: DashboardMainComponent,
      data: { title: 'Dashboard', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
