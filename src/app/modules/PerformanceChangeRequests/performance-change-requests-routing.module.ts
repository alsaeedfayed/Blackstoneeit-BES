import { ChangeRequestPageComponent } from './Page/change-request-page.component';
import { ChnageRequestDetilasPageComponent } from './components/chnage-request-detilas-page/chnage-request-detilas-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { PerformanceChangeRequestsPageComponent } from './components/performance-change-requests-page/performance-change-requests-page.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ChangeRequestPageComponent,
      data: { title: 'performance-change-Requests', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      children: [
        {
          path:'',
          component: PerformanceChangeRequestsPageComponent,
        },
        {
          path: 'details/:id',
          component: ChnageRequestDetilasPageComponent,
          data: { title: 'change-Requests Details', displaySidebar: true }, // This is the page title showing in the tab (in browser)
        }
      ],
    },

  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceChangeRequestsRoutingModule {}
