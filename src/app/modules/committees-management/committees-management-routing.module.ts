import { Permissions } from './../../core/services/permissions';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from 'src/app/layout/layout-routing.service';
import { CommitteesManagementMainPageComponent } from './main-page/committees-management-main-page.component';

//requests pages
import { RequestsMainPageComponent } from './requests/requests-main-page.component';
import { RequestsListComponent } from './requests/pages/requests-list/requests-list.component';
import { RequestDetailsComponent } from './requests/pages/request-details/request-details.component';
import { NewCommitteeComponent } from './requests/pages/new-committee/new-committee.component';

//committees pages
import { CommitteesListComponent } from './committees/pages/committees-list/committees-list.component';
import { CommitteeDetailsComponent } from './committees/pages/committee-details/committee-details.component';
import { CommitteeDashboardComponent } from './committees/dashboard/pages/committee-dashboard/committee-dashboard.component';

// committee details pages
import { CommitteeMeetingsComponent } from './committees/meetings/pages/committee-meetings/committee-meetings.component';
import { CommitteeTasksComponent } from './committees/tasks/pages/committee-tasks/committee-tasks.component';
import { CommitteeDecisionsComponent } from './committees/decisions/pages/committee-decisions/committee-decisions.component';
import { CommitteeWorkGroupsComponent } from './committees/work-groups/pages/committee-work-groups/committee-work-groups.component';
import { CommitteeAboutComponent } from './committees/about/pages/committee-about/committee-about.component';
import { NewMeetingComponent } from './committees/meetings/pages/new-meeting/new-meeting.component';
import { NewGroupComponent } from './committees/work-groups/pages/new-group/new-group.component';
import { GroupDetailsComponent } from './committees/work-groups/pages/group-details/group-details.component';
import { NewDecisionComponent } from './committees/decisions/pages/new-decision/new-decision.component';
import { MeetingDetailsComponent } from './committees/meetings/pages/meeting-details/meeting-details.component';
import { RoutesVariables } from './routes';
import { VotingTemplatesComponent } from './settings/voting/pages/voting-templates/voting-templates.component';
import { DecisionDetailsComponent } from './committees/decisions/pages/decision-details/decision-details.component';
import { EditMomMeetingComponent } from './committees/meetings/pages/edit-mom-meeting/edit-mom-meeting.component';
import { CommitteeKPIsComponent } from './committees/KPIs/pages/committee-kpis/committee-kpis.component';
import { EvaluationMainPageComponent } from './evaluation/evaluation-main-page/evaluation-main-page.component';
import { CommitteesEvaluationsComponent } from './evaluation/pages/committees-evaluations/committees-evaluations.component';
import { EvaluationDetailsComponent } from './evaluation/pages/evaluation-details/evaluation-details.component';
import { CommitteesDashboardMainPageComponent } from './dashboard/committees-dashboard-main-page/committees-dashboard-main-page.component';
import { CommitteesDashboardComponent } from './dashboard/pages/committees-dashboard/committees-dashboard.component';
import { KPIDetailsComponent } from './committees/KPIs/pages/kpi-details/kpi-details.component';
import { CommitteeEvaluationComponent } from './committees/evaluations/pages/committee-evaluation/committee-evaluation.component';
import { DestroyChartGuard } from './committees/dashboard/guards/destroy-chart.guard';
import { ChangeRequestsListComponent } from './change-requests/pages/change-requests-list/change-requests-list.component';
import { NewModifyRequestsComponent } from './change-requests/pages/new-modify-requests/new-modify-requests.component';
import { CrMainPageComponent } from './change-requests/cr-main-page/cr-main-page.component';
import { ChangeRequestDetailsComponent } from './change-requests/components/change-request-details/change-request-details.component';
import { WeightSettinsComponent } from './settings/weight-settins/weight-settins.component';


const routes: Routes = [
  Layout.childRoutes([
    {
      path: '',
      component: CommitteesManagementMainPageComponent,
      data: { title: 'Committees', displaySidebar: true }, // This is the page title showing in the tab (in browser)
      children: [

        {
          path: RoutesVariables.Requests.Root,
          component: RequestsMainPageComponent,
          data: { title: 'Committees Requests', displaySidebar: true }, // This is the page title showing in the tab (in browser)
          //requests model routes
          children: [
            {
              path: '',
              component: RequestsListComponent,
              data: { title: 'Committees Requests', displaySidebar: true }, // This is the page title showing in the tab (in browser)
            },
            {
              path: RoutesVariables.Requests.Create,
              component: NewCommitteeComponent,
              data: { title: 'Create a new Committee', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: RoutesVariables.Requests.Details,
              component: RequestDetailsComponent,
              data: { title: 'Request Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
            }
          ]
        },

        {
          path: 'edit/:id',
          component: NewCommitteeComponent,
          data: { title: 'Edit Committee', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path : RoutesVariables.ModifyRequests.Root,
          component: CrMainPageComponent,
          data: { title: 'modify requests', displaySidebar: true },
          children : [

              {
                path: '',
                component: ChangeRequestsListComponent,
                data: { title: 'modify requests', displaySidebar: true }, // This is the page title showing in the tab (in browser)
              },

              {
                path: RoutesVariables.ModifyRequests.Details,
                component: ChangeRequestDetailsComponent,
                data: { title: 'Modify Requests Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
              },

              {
                path: 'modify-request/:id',
                component: NewModifyRequestsComponent,
                data: { title: 'modify Request Edit Committee', displaySidebar: true } // This is the page title showing in the tab (in browser)
              },



          ]
        },

        {
          path: 'edit-change-request/:id',
          component: NewModifyRequestsComponent,
          data: { title: 'Change Request Edit Committee', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },

        {
          path: 'modify-request/:id',
          component: NewModifyRequestsComponent,
          data: { title: 'Change Request Edit Committee', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },



        {
          path: 'list',
          component: CommitteesListComponent,
          data: { title: 'Committees List', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        // {
        //   path: 'change-requests',
        //   component: ChangeRequestsListComponent,
        //   data: { title: 'change requests', displaySidebar: true } // This is the page title showing in the tab (in browser)
        // },

        {
          path: RoutesVariables.Dashboard.Root,
          component: CommitteesDashboardMainPageComponent,
          data: { title: 'Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
          children: [
            {
              path: '',
              component: CommitteesDashboardComponent,
              data: { title: 'Committees Dashboard', displaySidebar: true }, // This is the page title showing in the tab (in browser)
            },
          ]
        },
        {
          path: RoutesVariables.Evaluation.Root,
          component: EvaluationMainPageComponent,
          data: { title: 'Evaluation', displaySidebar: true, allowedClaims: [Permissions.Committees.Evaluations] }, // This is the page title showing in the tab (in browser)
          children: [
            {
              path: '',
              component: CommitteesEvaluationsComponent,
              data: { title: 'Committees Evaluation', displaySidebar: true }, // This is the page title showing in the tab (in browser)
            },
            {
              path: RoutesVariables.Evaluation.Details,
              component: EvaluationDetailsComponent,
              data: { title: 'Audit Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            // {
            //   path: RoutesVariables.Requests.Details,
            //   component: RequestDetailsComponent,
            //   data: { title: 'Request Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
            // }
          ]
        },
        {
          path: 'committee-details/:id',
          component: CommitteeDetailsComponent,
          data: { title: 'Committee Details', displaySidebar: true }, // This is the page title showing in the tab (in browser)
          children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
              path: 'dashboard',
              component: CommitteeDashboardComponent,
              // canDeactivate: [DestroyChartGuard],
              data: { title: 'Dashboard', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'meetings',
              component: CommitteeMeetingsComponent,
              data: { title: 'Meetings', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'tasks',
              component: CommitteeTasksComponent,
              data: { title: 'Tasks', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'decisions',
              component: CommitteeDecisionsComponent,
              data: { title: 'Decisions', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'work-groups',
              component: CommitteeWorkGroupsComponent,
              data: { title: 'Work Groups', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'KPIs',
              component: CommitteeKPIsComponent,
              data: { title: 'KPIs', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'evaluations',
              component: CommitteeEvaluationComponent,
              data: { title: 'Evaluations', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
            {
              path: 'about',
              component: CommitteeAboutComponent,
              data: { title: 'About', displaySidebar: true } // This is the page title showing in the tab (in browser)
            },
          ]
        },
        {
          path: `${RoutesVariables.Meeting.Create}`,
          component: NewMeetingComponent,
          data: { title: 'Create a new Meeting', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.Meeting.Update}`,
          component: NewMeetingComponent,
          data: { title: 'Edit Meeting', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.Meeting.MomUpdate}`,
          component: EditMomMeetingComponent,
          data: { title: 'Edit Meeting', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.Meeting.Details}`,
          component: MeetingDetailsComponent,
          data: { title: 'Meeting Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.KPI.Details}`,
          component: KPIDetailsComponent,
          data: { title: 'KPI Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.Decision.Create}`,
          component: NewDecisionComponent,
          data: { title: 'Create a new Decision', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: `${RoutesVariables.Decision.Update}`,
          component: NewDecisionComponent,
          data: { title: 'Edit Decision', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: 'committee/:committeeId/groups/new',
          component: NewGroupComponent,
          data: { title: 'Create a new Group', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: 'committee/:committeeId/groups/:groupId',
          component: GroupDetailsComponent,
          data: { title: 'Group Details', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: 'committee/:committeeId/groups/update/:groupId',
          component: NewGroupComponent,
          data: { title: 'Edit work group', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: 'settings/voting-templates',
          component: VotingTemplatesComponent,
          data: { title: 'Voting Templates', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },
        {
          path: 'settings/weight-settings',
          component: WeightSettinsComponent,
          data: { title: 'Weight Settings', displaySidebar: true } // This is the page title showing in the tab (in browser)
        },



        {
          path: `${RoutesVariables.Decision.Details}`,
          component: DecisionDetailsComponent,
          data: { title: 'Decisions', displaySidebar: true } // This is the page title showing in the tab (in browser)
        }
      ]
    },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteesManagementRoutingModule { }
