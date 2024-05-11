import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ProcessDetailComponent } from './components/process-detail/process-detail.component';
import { ProcessMainComponent } from './components/process-main/process-main.component';
import { NewProcessComponent } from './components/new-process/new-process.component';
import { RoutesVariables } from './routes';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ProcessMainComponent,
      data: { title: 'Process', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: RoutesVariables.Process.Create,
      component: NewProcessComponent,
      data: { title: 'New Process', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: RoutesVariables.Process.Edit,
      component: NewProcessComponent,
      data: { title: 'Edit Process', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: ':id',
      component: ProcessDetailComponent,
      data: { title: 'Process Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ])

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
