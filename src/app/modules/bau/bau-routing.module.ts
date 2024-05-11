import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {Layout} from "src/app/layout/layout-routing.service";

import { BauComponent } from "./bau.component";
import { MainTasksComponent } from "./taskboard/pages/main-tasks/main-tasks.component";
import { CreateMainTaskComponent } from "./taskboard/pages/main-tasks/create-main-task/create-main-task.component";
import { CreateSubTaskComponent } from "./taskboard/pages/main-tasks/create-sub-task/create-sub-task.component";
import { MainTasksTableComponent } from "./taskboard/pages/main-tasks/main-tasks-table/main-tasks-table.component";
import { BauRolesMainPageComponent } from "./roles/bau-roles-main-page/bau-roles-main-page.component";
import { RoutesVariables } from "./routes";
import { BauRolesComponent } from "./roles/pages/bau-roles/bau-roles.component";
import { BauMainTaskMainPageComponent } from "./taskboard/main-tasks/bau-main-task-main-page/bau-main-task-main-page.component";
import { MainTaskDetailsComponent } from "./taskboard/main-tasks/pages/main-task-details/main-task-details.component";
import { BauTasksMainPageComponent } from "./taskboard/tasks/bau-tasks-main-page/bau-tasks-main-page.component";
import { BauDashboardComponent } from "./dashboard/pages/bau-dashboard/bau-dashboard.component";

const routes: Routes = [
  Layout.childRoutes([
    {
      path: 'dashboard',
      component: BauDashboardComponent,
      data: {title: "Bau-Dashboard", displaySidebar: true}
    },
    {
      path: "taskboard",
      component: BauComponent,
      data: {title: "BAU", displaySidebar: true},
      children: [
        {
          path: "",
          component: MainTasksComponent,
          data: {title: "serviceboard", displaySidebar: true},
        },
        {
          path: ":year",
          component: MainTasksComponent,
          data: {title: "serviceboard", displaySidebar: true},
          children: [
            {
              path: "tasks-table",
              component: MainTasksTableComponent,
              data: {title: "serviceboard", displaySidebar: true},
            },
            {
              path: "main-task/management/edit/:mainTaskId",
              component: CreateMainTaskComponent,
              data: {title: "serviceboard", displaySidebar: true},
            }, {
              path: "main-task/management/copy/:mainTaskId",
              component: CreateMainTaskComponent,
              data: {title: "serviceboard", displaySidebar: true},
            }, {
              path: "main-task/management/create",
              component: CreateMainTaskComponent,
              data: {title: "serviceboard", displaySidebar: true},
            },
            {
              path: "create-sub-task/:TaskId",
              component: CreateSubTaskComponent,
              data: {title: "serviceboard", displaySidebar: true},
            },
            {
              path: "edit-sub-task/:TaskId",
              component: CreateSubTaskComponent,
              data: {title: "serviceboard", displaySidebar: true},
            },
            {
              path: "",
              redirectTo: "tasks-table",
              pathMatch: "full",
              data: {title: "BAU", displaySidebar: true},
            },
          ]
        },
        {
          path: 'mainTasks/details/:id',
          // path: 'mainTasks',
          component: BauMainTaskMainPageComponent,
          data: {title: "tasks", displaySidebar: true},
          children: [
            {
              path: "",
              component: MainTaskDetailsComponent,
              data: {title: "Details", displaySidebar: true},
            },
          ]
        },
        // {
        //   path: 'tasks/details/:id',
        //   // path: 'tasks',
        //   component: BauTasksMainPageComponent,
        //   data: { title: "tasks", displaySidebar: true },
        //   children: [
        //     {
        //       path: "",
        //       component: TasksDetailsComponent,
        //       data: { title: "Details", displaySidebar: true },
        //     }
        //   ]
        // },
      ],

    },
    {
      path: RoutesVariables.Roles.Root,
      component: BauRolesMainPageComponent,
      data: {title: "Roles", displaySidebar: true},
      children: [
        {
          path: "",
          component: BauRolesComponent,
          data: {title: "Roles & Responsibilities", displaySidebar: true},
        }
      ]
    },
    {
      path: "",
      redirectTo: "taskboard",
      pathMatch: "full",
      data: {title: "BAU", displaySidebar: true},
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BauRoutingModule {
}
