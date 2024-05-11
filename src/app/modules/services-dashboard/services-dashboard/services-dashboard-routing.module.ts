import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ServiceandrequestComponent } from './pages/serviceandrequest/serviceandrequest.component'
import { ServicedashboardComponent } from './pages/servicedashboard/servicedashboard.component'
import { Layout } from 'src/app/layout/layout-routing.service'
import { ServicesDashboardFollowupComponent } from './pages/services-dashboard-followup/services-dashboard-followup.component'

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ServicedashboardComponent,
      data: { title: 'serviceboard', displaySidebar: true },
      children: [
        {
          path: '',
          redirectTo: 'serviceandrequest',
          pathMatch: 'full',
          data: { title: 'serviceboard', displaySidebar: true },
        },

        {
          path: 'serviceandrequest',
          component: ServiceandrequestComponent,
          data: { title: 'serviceboard', displaySidebar: true },
        },

        {
          path: 'services-follow-up',
          component: ServicesDashboardFollowupComponent,
          data: { title: 'serviceboard', displaySidebar: true },
        },
      ],
    },
  ]),
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesDashboardRoutingModule {}
