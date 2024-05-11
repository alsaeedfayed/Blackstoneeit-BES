import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { ProjectsMainComponent } from './components/projects-main/projects-main.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ProjectsMainComponent,
      data: { title: 'Projects', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: ':id',
      component: ProjectsDetailsComponent,
      data: { title: 'Project Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
