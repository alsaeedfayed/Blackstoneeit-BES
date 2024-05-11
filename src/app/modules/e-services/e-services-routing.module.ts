import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Layout } from 'src/app/layout/layout-routing.service';
import { CreateEServiceComponent } from './components/create-e-service/create-e-service.component';
import { DeleteEServiceComponent } from './components/delete-e-service/delete-e-service.component';
import { EServiceDetailsComponent } from './components/e-service-details/e-service-details.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MoveEServiceComponent } from './components/move-e-service/move-e-service.component';
import { RequestsComponent } from './components/requests/requests.component';
import { EServicesComponent } from './e-services.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: EServicesComponent,
      data: { title: 'Customers Services', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      children: [
        {
          path: '',
          component: MainPageComponent,
          data: { title: 'Customers Services' },
        },
        {
          path: 'details/:id',
          component: EServiceDetailsComponent,
          data: { title: 'Customers Services Details' },
        },
      ],
    },

    {
      path: 'requests',
      component: RequestsComponent,
      data: { title: 'Create Customers Services', displaySidebar: true },
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: MainPageComponent, // Redirect to MainPageComponent
          data: { title: 'Customers Services' },
        },
        {
          path: 'create-e-service',
          component: CreateEServiceComponent,
          data: { title: 'Create Customers Services', displaySidebar: true },
        },
        {
          path: 'edit-e-service/:id',
          component: CreateEServiceComponent,
          data: { title: 'Edit Customers Services', displaySidebar: true },
        },
        {
          path: 'delete-e-service/:id',
          component: DeleteEServiceComponent,
          data: { title: 'Delete Customers Services', displaySidebar: true },
        },
        {
          path: 'move-e-service/:id',
          component: MoveEServiceComponent,
          data: { title: 'Move Customers Services', displaySidebar: true },
        },
      ],
    },
    {
      path: '**',
      redirectTo: '', // Replace 'default-route' with the path of your default route
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EServicesRoutingModule {}
