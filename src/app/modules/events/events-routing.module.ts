import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Layout } from "src/app/layout/layout-routing.service";
import { EventsMainComponent } from "./components/events-main/events-main.component";
import { EventsNewComponent } from "./components/events-new/events-new.component";
import { EventDetailsComponent } from "./components/event-details/event-details.component";

const routes: Routes = [
  Layout.childRoutes([
    {
      path: "",
      component: EventsMainComponent,
      data: { title: "Events", displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
    {
      path: "new",
      component: EventsNewComponent,
      data: { title: 'Create a new Event', displaySidebar: true } // This is the page title showing in the tab (in browser)
    },
    {
      path: "edit/:id",
      component: EventsNewComponent,
      data: { title: "Edit Event", displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
    {
      path: ":id",
      component: EventDetailsComponent,
      data: { title: "Events Details", displaySidebar: true }, // This is the page title showing in the tab (in browser)
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
