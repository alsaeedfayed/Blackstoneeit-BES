import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { IdeasMainComponent } from './components/ideas-main/ideas-main.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: IdeasMainComponent,
      data: { title: 'Ideas', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeasRoutingModule { }
