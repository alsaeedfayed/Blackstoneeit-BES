import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ManageFormsComponent } from './manage-forms.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ManageFormsComponent,
      data: { title: 'Manage Forms', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFormsRoutingModule {}
