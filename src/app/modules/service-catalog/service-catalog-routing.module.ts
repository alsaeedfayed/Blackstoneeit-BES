import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { StartServiceComponent } from './components/start-service/start-service.component';
import { ServiceCatalogComponent } from './service-catalog.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: ServiceCatalogComponent,
      data: { title: 'Service Catalog', displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
    {
      path: 'start-service',
      component: StartServiceComponent,
      data: { title: 'start service', displaySidebar: true },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceCatalogRoutingModule {}
