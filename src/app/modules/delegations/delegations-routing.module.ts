import { DelegationFormComponent } from './Pages/delegation-form/delegation-form.component';
import { DelegationsListComponent } from './Pages/delegations-list/delegations-list.component';
import { DelegationsMainPageComponent } from './Page/delegations-main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: DelegationsMainPageComponent,
      data: { title: 'Delegations', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      children:[
        { path: "", component: DelegationsListComponent, data: { title: 'Delegations' }, },
        { path: "delegation-form", component: DelegationFormComponent, data: { title: 'Add Delegation' }, },
        { path: "delegation-form/:id", component: DelegationFormComponent, data: { title: 'Edit Delegation' }, },
      ]
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationsRoutingModule { }
