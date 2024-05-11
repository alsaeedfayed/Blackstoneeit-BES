import {unAuthenticationGuard} from "./core/services/unAuthorized.guard";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthenticationGuard} from "./core/services/authentication.guard";
import {Permissions} from "./core/services/permissions";

const routes: Routes = [
  // Pages without Layout

  {
    path: "login",
    canActivate: [unAuthenticationGuard],
    loadChildren: () =>
      import("./modules/authentication/authentication.module").then(
        a => a.AuthenticationModule
      ),
  },
  {
    path: "oops",
    loadChildren: () =>
      import("./modules/oops/oops.module").then(a => a.OopsModule),
  },
  {
    path: "users",
    loadChildren: () =>
      import("./modules/users/users.module").then(a => a.UsersModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.UserManagement.Users.view],
    },
  },
  {
    path: "delegations",
    loadChildren: () =>
      import("./modules/delegations/delegations.module").then(
        a => a.DelegationsModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.WorkFlow.ManageDelegations],
    },
  },
  {
    path: "process",
    loadChildren: () =>
      import("./modules/process/process.module").then(a => a.ProcessModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.WorkFlow.ManageProcess],
    },
  },
  {
    path: "manage-services",
    loadChildren: () =>
      import("./modules/manage-services/manage-services.module").then(
        a => a.ManageServicesModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.manageService.view],
    },
  },
  {
    path: 'e-services',
    loadChildren: () =>
      import('./modules/e-services/e-services.module').then(
        (a) => a.EServicesModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.EService.view],
    },
  },
  {
    path: 'lookups',
    loadChildren: () =>
      import('./modules/lookup-mangement/lookup-mangement.module').then(
        (a) => a.LookupMangementModule)
  },
  {
    path: "entity-designer",
    loadChildren: () =>
      import("./modules/entity-designer/entity-designer.module").then(
        m => m.EntityDesignerModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.manageForms.create],
    },
  },
  {
    path: "lookups",
    loadChildren: () =>
      import("./modules/lookup-mangement/lookup-mangement.module").then(
        a => a.LookupMangementModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.UserManagement.Groups.view],
    },
  },
  {
    path: "form-builder",
    loadChildren: () =>
      import("./modules/FormBuilder/formBuilder.module").then(
        a => a.FormBuilderModule
      ),
    canActivate: [AuthenticationGuard],
  },
  {
    path: "manage-forms",
    loadChildren: () =>
      import("./modules/manage-forms/manage-forms.module").then(
        a => a.ManageFormsModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.manageForms.view],
    },
  },
  {
    path: "agent-queue",
    loadChildren: () =>
      import("./modules/agent-queue/agent-queue.module").then(
        a => a.AgentQueueModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: [Permissions.ServiceDesk.agentQueue.view],
    // },
  },
  {
    path: "follow-up",
    loadChildren: () =>
      import("./modules/follow-up/follow-up.module").then(
        a => a.FollowUpModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.serviceCatalog.view],
    },
  },
  {
    path: "roles",
    loadChildren: () =>
      import("./modules/roles/roles.module").then(a => a.RolesModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.UserManagement.Roles.view],
    },
  },

  {
    path: "settings",
    loadChildren: () =>
      import("./modules/settings/settings.module").then(a => a.SettingsModule),
    canActivate: [AuthenticationGuard],
    // // data: {
    // //   allowedClaims: ['ManageSettings'],
    // // },
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        a => a.DashboardModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageSettings'],
    // },
  },
  {
    path: "score-submission",
    loadChildren: () =>
      import("./modules/score-submission/score-submission.module").then(
        a => a.ScoreSubmissionModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.Performance.Scorecard_Submission.View],
    },
  },
  {
    path: "service-catalog",
    loadChildren: () =>
      import("./modules/service-catalog/service-catalog.module").then(
        a => a.ServiceCatalogModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.serviceCatalog.view],
    },
  },
  {
    path: "performance-change-requests",
    loadChildren: () =>
      import(
        "./modules/PerformanceChangeRequests/performance-change-requests.module"
        ).then(a => a.PerformanceChangeRequestsModule),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: [Permissions.ServiceDesk.serviceCatalog.view],
    // },
  },
  // {
  //   path: 'myKPIs',
  //   loadChildren: () =>
  //     import('./modules/my-kpis/my-kpis.module').then((a) => a.MyKPIsModule),
  //   canActivate: [AuthenticationGuard],
  //   data: {
  //     allowedClaims: ['ManageSettings'],
  //   },
  // },

  {
    path: "requests",
    loadChildren: () =>
      import("./modules/requests/requests.module").then(a => a.RequestsModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.myRequests.view],
    },
  },
  {
    path: "eppm-requests",
    loadChildren: () =>
      import("./modules/eppm-requests/requests.module").then(
        a => a.EppmRequestsModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests', 'CreateProject'],
    // },
  },
  {
    path: "create-project",
    loadChildren: () =>
      import("./modules/project-initiation/project-initiation.module").then(
        a => a.ProjectInitiationModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests', 'CreateProject'],
    // },
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./modules/projects/projects.module").then(a => a.ProjectsModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: "change-requests",
    loadChildren: () =>
      import("./modules/change-requests/change-requests.module").then(
        a => a.ChangeRequestsModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests'],
    // },
  },
  {
    path: "closure-requests",
    loadChildren: () =>
      import("./modules/closure-requests/closure-requests.module").then(
        a => a.ClosureRequestsModule
      ),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests'],
    // },
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./modules/reports/reports.module").then(a => a.ReportsModule),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageSettings'],
    // },
  },
  {
    path: "ideas",
    loadChildren: () =>
      import("./modules/ideas/ideas.module").then(a => a.IdeasModule),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests'],
    // },
  },
  {
    path: "meetings",
    loadChildren: () =>
      import("./modules/meetings/meetings.module").then(a => a.MeetingsModule),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: ['ManageRequests'],
    // },
  },
  {
    path: "planning",
    loadChildren: () =>
      import("./modules/Planning/planning.module").then(m => m.PlanningModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [
        Permissions.Performance.Scorecard.Create,
        Permissions.Performance.Scorecard.GetById,
        Permissions.Performance.Scorecard.MyActions,
        Permissions.Performance.Scorecard.Status,
        Permissions.Performance.Scorecard.Submit,
        Permissions.Performance.Scorecard.Update,
        Permissions.Performance.Goal.Add,
        Permissions.Performance.Goal.Edit,
        Permissions.Performance.Goal.Delete,
      ],
    },
  },
  {
    path: "mange-scorecards",
    loadChildren: () =>
      import("./modules/mange-scorecards/mange-scorecards.module").then(
        m => m.MangeScorecardsModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [
        Permissions.Performance.Scorecard.Create,
        Permissions.Performance.Scorecard.GetById,
        Permissions.Performance.Scorecard.MyActions,
        Permissions.Performance.Scorecard.Status,
        Permissions.Performance.Scorecard.Submit,
        Permissions.Performance.Scorecard.Update,
        Permissions.Performance.Goal.Add,
        Permissions.Performance.Goal.Edit,
        Permissions.Performance.Goal.Delete,
      ],
    },
  },
  // {
  //   path: 'performance-reports',
  //   loadChildren: () =>
  //     import('./modules/performance-reports/performance-reports.module').then(
  //       (m) => m.PerformanceReportsModule,
  //     ),
  //   canActivate: [AuthenticationGuard],
  //   data: {
  //     allowedClaims: [Permissions.Performance.Scorecard_Reports.View],
  //   },
  // },
  {
    path: "configuration",
    loadChildren: () =>
      import("./modules/configure/configure.module").then(
        m => m.ConfigureModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.Performance.Scorecard_Settings.View],
    },
  },
  {
    path: "servicesdashboard",
    loadChildren: () =>
      import(
        "./modules/services-dashboard/services-dashboard/services-dashboard.module"
        ).then(a => a.ServicesDashboardModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.ServiceDesk.serviceDashboard.view],
    },
  },

  {
    path: "bau",
    loadChildren: () => import("./modules/bau/bau.module").then(a => a.BauModule),
    canActivate: [AuthenticationGuard],
    /* data: {
      allowedClaims: [Permissions.BAU.OperationPlan.view],
    }, */
  },

  {
    path: "committees",
    loadChildren: () =>
      import("./modules/committee/committee.module").then(
        a => a.CommitteeModule
      ),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.UserManagement.Committees.view],
    },
  },
  {
    path: "groups",
    loadChildren: () =>
      import("./modules/groups/groups.module").then(a => a.GroupsModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.UserManagement.Groups.view],
    },
  },
  {
    path: "performance-dashboard",
    loadChildren: () =>
      import(
        "./modules/performance-dashboard/performance-dashboard.module"
        ).then(a => a.PerformanceDashboardModule),
    canActivate: [AuthenticationGuard],
    data: {
      allowedClaims: [Permissions.Performance.Dashboard.View],
    },
  },
  {
    path: "committees-management",
    loadChildren: () =>
      import(
        "./modules/committees-management/committees-management.module"
        ).then(a => a.CommitteesManagementModule),
    canActivate: [AuthenticationGuard],
    // data: {
    //   allowedClaims: [Permissions.Performance.Dashboard.View],
    // },
  },
  {
    path: 'innovation',
    loadChildren: () =>
      import('./modules/innovation/innovation.module').then((a) => a.InnovationModule),
    canActivate: [AuthenticationGuard],
  },
  // {
  //   path: 'events',

  //   loadChildren: () =>
  //     import("./modules/events/events.module").then(a => a.EventsModule),
  //   canActivate: [AuthenticationGuard],
  //   // data: {
  //   //   allowedClaims: [Permissions.Performance.Dashboard.View],
  //   // },
  // },
  // {
  //   path: "event",
  //   loadChildren: () =>
  //     import("./modules/event-registration/event-registration.module").then(
  //       a => a.EventRegistrationModule
  //     ),
  //   canActivate: [AuthenticationGuard],
  //   // data: {
  //   //   allowedClaims: [Permissions.Performance.Dashboard.View],
  //   // },
  // },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "oops/not-found",
    pathMatch: "full",
  },
];

@NgModule({

  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "top"})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
