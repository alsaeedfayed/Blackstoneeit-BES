import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { EntityDesignerComponent } from './entity-designer.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: EntityDesignerComponent,
      data: { title: 'Entity designer', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityDesignerRoutingModule {}
