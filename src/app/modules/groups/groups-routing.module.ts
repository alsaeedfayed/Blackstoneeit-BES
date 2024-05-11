import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { GroupsMainComponent } from './components/groups-main/groups-main.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: GroupsMainComponent,
      data: { title: 'Groups', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
