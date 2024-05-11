import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { AgentQueuePageComponent } from './pages/agent-queue-page/agent-queue-page.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: AgentQueuePageComponent,
      data: { title: 'Agent Queue', displaySidebar: true } // This is the page title showing in the tab (in browser)
    }
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AgentQueueRoutingModule { }
