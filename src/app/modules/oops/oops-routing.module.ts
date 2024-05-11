import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BlockLicenseComponent } from './components/block-license/block-license.component';

const routes: Routes = [
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
    data: { title: 'Oops!' } // This is the page title showing in the tab (in browser)
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { title: 'Oops!' } // This is the page title showing in the tab (in browser)
  },
  {
    path: 'block-license',
    component: BlockLicenseComponent,
    data: { title: 'Oops!' } // This is the page title showing in the tab (in browser)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OopsRoutingModule { }
