import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: UsersComponent,
      data: { title: 'Users', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
