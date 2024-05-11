import { PerformanceReportsPageComponent } from './Page/performance-reports-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: PerformanceReportsPageComponent,
      data: { title: 'Performance Reports', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceReportsRoutingModule { }
