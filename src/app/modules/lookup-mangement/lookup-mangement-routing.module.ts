import { LookupPageComponent } from './page/lookup-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: LookupPageComponent,
      data: { title: 'Lookups', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookupMangementRoutingModule { }