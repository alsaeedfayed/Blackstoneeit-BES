import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ManageServicesComponent } from './manage-services.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ManageServicesComponent,
      data: { title: 'Manage Services', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageServicesRoutingModule {}
