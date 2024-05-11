import { MeetingFormComponent } from './Pages/meeting-form/meeting-form.component';
import { MeetingsListComponent } from './Pages/meetings-list/meetings-list.component';
import { MettingsMainPageComponent } from './Page/mettings-main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { MeetingDetailsComponent } from './Pages/meeting-details/meeting-details.component';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: MettingsMainPageComponent,
      data: { title: 'Maeetings', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      children:[
        { path: "", component: MeetingsListComponent, data: { title: 'Maeetings' }, },
        { path: "meeting-form", component: MeetingFormComponent, data: { title: 'Add Maeeting' }, },
        { path: "meeting-form/:id", component: MeetingFormComponent, data: { title: 'Edit Maeeting' }, },
        { path: "details/:id", component: MeetingDetailsComponent, data: { title: 'Maeetings'}, },
      ]
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
