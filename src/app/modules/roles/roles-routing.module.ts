import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { RolesComponent } from './components/roles/roles.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: RolesComponent,
      data: { title: 'Roles', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
