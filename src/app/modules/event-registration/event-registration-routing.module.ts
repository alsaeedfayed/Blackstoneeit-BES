import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventRegistrationMainComponent } from './components/event-registration-main/event-registration-main.component';
import { EventRateComponent } from '../events/components/event-rate/event-rate.component';

const routes: Routes = [
  {
    path: ':id',
    component: EventRegistrationMainComponent,
    data: { title: 'Event registration' }, // This is the page title showing in the tab (in browser)
  },
  {
    path: 'rate/:eventId/:AttendeeCode',
    component: EventRateComponent,
    data: { title: 'Event Rate' }, // This is the page title showing in the tab (in browser)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRegistrationRoutingModule { }
