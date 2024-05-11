import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateCommitteesManagementLoader } from 'src/app/utils/createTranslateLoader';
import { AngularEditorModule } from '@kolkov/angular-editor';

//requests components
import { RequestsListComponent } from './requests/pages/requests-list/requests-list.component';
import { RequestsTableComponent } from './requests/components/requests-table/requests-table.component';
import { RequestsFiltersComponent } from './requests/components/requests-filters/requests-filters.component';
import { RequestDetailsComponent } from './requests/pages/request-details/request-details.component';
import { NewCommitteeComponent } from './requests/pages/new-committee/new-committee.component';

import { CommitteesManagementRoutingModule } from './committees-management-routing.module';
import { CommitteesManagementMainPageComponent } from './main-page/committees-management-main-page.component';
import { CommitteesListComponent } from './committees/pages/committees-list/committees-list.component';
import { CommitteesRowsComponent } from './committees/components/committees-rows/committees-rows.component';
import { CommitteesFiltersComponent } from './committees/components/committees-filters/committees-filters.component';
import { MembersCountPipe } from './pipes/members-count.pipe';
import { CommitteeHighlightModelComponent } from './committees/components/committee-highlight-model/committee-highlight-model.component';
import { CommitteeDetailsComponent } from './committees/pages/committee-details/committee-details.component';
import { CommitteeDashboardComponent } from './committees/dashboard/pages/committee-dashboard/committee-dashboard.component';
import { CommitteeMeetingsComponent } from './committees/meetings/pages/committee-meetings/committee-meetings.component';
import { CommitteeTasksComponent } from './committees/tasks/pages/committee-tasks/committee-tasks.component';
import { CommitteeDecisionsComponent } from './committees/decisions/pages/committee-decisions/committee-decisions.component';
import { CommitteeWorkGroupsComponent } from './committees/work-groups/pages/committee-work-groups/committee-work-groups.component';
import { CommitteeAboutComponent } from './committees/about/pages/committee-about/committee-about.component';
import { CommitteeInfoComponent } from './committees/components/committee-info/committee-info.component';
import { NewMeetingComponent } from './committees/meetings/pages/new-meeting/new-meeting.component';
import { MeetingsRowsComponent } from './committees/meetings/components/meetings-rows/meetings-rows.component';
import { MeetingsCalendarComponent } from './committees/meetings/components/meetings-calendar/meetings-calendar.component';
import { WorkGroupsCardsComponent } from './committees/work-groups/components/work-groups-cards/work-groups-cards.component';
import { DecisionsRowsComponent } from './committees/decisions/components/decisions-rows/decisions-rows.component';
import { DecisionDetailsModelComponent } from './committees/decisions/components/decision-details-model/decision-details-model.component';
import { NewGroupComponent } from './committees/work-groups/pages/new-group/new-group.component';
import { GroupDetailsComponent } from './committees/work-groups/pages/group-details/group-details.component';
import { InProgressTaskComponent } from './committees/components/in-progress-task/in-progress-task.component';
import { NewDecisionComponent } from './committees/decisions/pages/new-decision/new-decision.component';
import { AssignedToPipe } from './pipes/assignedTo/assigned-to.pipe';
import { BoardTaskCardComponent } from './committees/tasks/components/board-task-card/board-task-card.component';
import { BoardTasksColsComponent } from './committees/tasks/components/board-tasks-cols/board-tasks-cols.component';
import { WorkGroupsFiltersComponent } from './committees/work-groups/components/work-groups-filters/work-groups-filters.component';
import { StatusClassNamePipe } from './pipes/statusClassName/status-class-name.pipe';
import { MeetingHighlightModelComponent } from './committees/meetings/components/meeting-highlight-model/meeting-highlight-model.component';
import { MeetingCardComponent } from './committees/meetings/components/meeting-card/meeting-card.component';
import { MeetingDetailsComponent } from './committees/meetings/pages/meeting-details/meeting-details.component';
import { MeetingsFiltersComponent } from './committees/meetings/components/meetings-filters/meetings-filters.component';
import { DaysLeftPipe } from './pipes/days-left/days-left.pipe';
import { DaysCountPipe } from './pipes/days-count/days-count.pipe';
import { HoursLeftPipe } from './pipes/hours-left/hours-left.pipe';
import { VotingTemplatesComponent } from './settings/voting/pages/voting-templates/voting-templates.component';
import { VotingTemplatesTableComponent } from './settings/voting/components/voting-templates-table/voting-templates-table.component';
import { VotingEditModelComponent } from './settings/voting/components/voting-edit-model/voting-edit-model.component';
import { CapitalizePipe } from './pipes/capitalize/capitalize.pipe';
import { MeetingTimeLeftPipe } from './pipes/meetingTimeLeft/meeting-time-left.pipe';
import { TasksTableComponent } from './committees/tasks/components/tasks-table/tasks-table.component';
import { RequestsMainPageComponent } from './requests/requests-main-page.component';
import { CommitteesMainPageComponent } from './committees/committees-main-page.component';
import { CreateTaskModelComponent } from './committees/tasks/components/create-task-model/create-task-model.component';
import { TasksFilterComponent } from './committees/tasks/components/tasks-filter/tasks-filter.component';
import { DecisionsFiltersComponent } from './committees/decisions/components/decisions-filters/decisions-filters.component';
import { DecisionDetailsComponent } from './committees/decisions/pages/decision-details/decision-details.component';
import { TaskDetailsModelComponent } from './committees/tasks/components/task-details-model/task-details-model.component';
import { CreateDiscussedItemModelComponent } from './committees/meetings/components/create-discussed-item-model/create-discussed-item-model.component';
import { DiscussedItemsTabComponent } from './committees/meetings/components/discussed-items-tab/discussed-items-tab.component';
import { TasksTabComponent } from './committees/meetings/components/tasks-tab/tasks-tab.component';
import { DecisionsTabComponent } from './committees/meetings/components/decisions-tab/decisions-tab.component';
import { TimePassedPipe } from './pipes/time-passed/time-passed.pipe';
import { RelatedGroupsPipe } from './committees/tasks/pipes/related-groups/related-groups.pipe';
import { CreateDecisionModelComponent } from './committees/decisions/components/create-decision-model/create-decision-model.component';
import { NewAttendeeModelComponent } from './committees/meetings/components/new-attendee-model/new-attendee-model.component';
import { MeetingCommonFieldsComponent } from './committees/meetings/components/meeting-common-fields/meeting-common-fields.component';
import { EditMomMeetingComponent } from './committees/meetings/pages/edit-mom-meeting/edit-mom-meeting.component';
import { RichTextToTextPipe } from './pipes/richTextToText/rich-text-to-text.pipe';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { CapitalizeFirstLetterPipe } from './pipes/capitalizeFirstLetter/capitalize-first-letter.pipe';
import { MeetingCommentComponent } from './committees/meetings/components/meeting-comment/meeting-comment.component';
import { MeetingTimelineComponent } from './committees/meetings/components/meeting-timeline/meeting-timeline.component';
import { MeetingCountPipe } from './pipes/meetingCount/meeting-count.pipe';
import { VotersCountPipe } from './pipes/voters-count/voters-count.pipe';
import { CommitteeKpisRowsComponent } from './requests/components/committee-kpis-rows/committee-kpis-rows.component';
import { NewKPIModelComponent } from './committees/KPIs/components/new-kpi-model/new-kpi-model.component';
import { MainTasksRowsComponent } from './requests/components/main-tasks-rows/main-tasks-rows.component';
import { NewMainTaskModelComponent } from './requests/components/new-main-task-model/new-main-task-model.component';
import { CommitteeKPIsComponent } from './committees/KPIs/pages/committee-kpis/committee-kpis.component';
import { KpisRowsComponent } from './committees/KPIs/components/kpis-rows/kpis-rows.component';
import { KpisFiltersComponent } from './committees/KPIs/components/kpis-filters/kpis-filters.component';
import { KpiDetailsModelComponent } from './committees/KPIs/components/kpi-details-model/kpi-details-model.component';
import { ProgressColorPipe } from './pipes/progressColor/progress-color.pipe';
import { CommitteeMembersColumnComponent } from './committees/components/committee-members-column/committee-members-column.component';
import { MainTasksStatusComponent } from './committees/dashboard/components/main-tasks-status/main-tasks-status.component';
import { KpisPerformanceStatusComponent } from './committees/dashboard/components/kpis-performance-status/kpis-performance-status.component';
import { EvaluationMainPageComponent } from './evaluation/evaluation-main-page/evaluation-main-page.component';
import { CommitteesEvaluationsComponent } from './evaluation/pages/committees-evaluations/committees-evaluations.component';
import { EvaluationTableComponent } from './evaluation/components/evaluation-table/evaluation-table.component';
import { MeetingsAttendancePercantageComponent } from './committees/dashboard/components/meetings-attendance-percantage/meetings-attendance-percantage.component';

import { EvaluationDetailsComponent } from './evaluation/pages/evaluation-details/evaluation-details.component';
import { NewObservationModelComponent } from './evaluation/components/new-observation-model/new-observation-model.component';
import { CommitteesDashboardMainPageComponent } from './dashboard/committees-dashboard-main-page/committees-dashboard-main-page.component';
import { CommitteesDashboardComponent } from './dashboard/pages/committees-dashboard/committees-dashboard.component';
import { ConfirmedDecisionComponent } from './committees/dashboard/components/confirmed-decision/confirmed-decision.component';
import { KPIDetailsComponent } from './committees/KPIs/pages/kpi-details/kpi-details.component';
import { MainTasksFiltersComponent } from './committees/dashboard/components/main-tasks-filters/main-tasks-filters.component';
import { EvaluationFilterComponent } from './evaluation/components/evaluation-filter/evaluation-filter.component';
import { CreateEvaluationModelComponent } from './evaluation/components/create-evaluation-model/create-evaluation-model.component';
import { CommentsCountPipe } from './pipes/commentsCount/comments-count.pipe';
import { ObservationCommentsModelComponent } from './evaluation/components/observation-comments-model/observation-comments-model.component';
import { ApproveAndCloseEvaluationModelComponent } from './evaluation/components/approve-and-close-evaluation-model/approve-and-close-evaluation-model.component';
import { EvaluationRowsComponent } from './committees/evaluations/components/evaluation-rows/evaluation-rows.component';
import { EvaluationCalenderComponent } from './committees/evaluations/components/evaluation-calender/evaluation-calender.component';
import { CommitteeEvaluationComponent } from './committees/evaluations/pages/committee-evaluation/committee-evaluation.component';
import { CommitteeTypesComponent } from './dashboard/components/committee-types/committee-types.component';
import { CommitteeCategoriesComponent } from './dashboard/components/committee-categories/committee-categories.component';
import { committeePerformanceDashboard } from './dashboard/components/committee-performance/committee-performance';
import { NgxGaugeModule } from 'ngx-gauge';
import { CommitteesFilterComponent } from './dashboard/components/committees-filter/committees-filter.component';
import { DashboardCommitteesRowsComponent } from './dashboard/components/dashboard-committees-rows/dashboard-committees-rows.component';
import { CommitteeDecisionInfoComponent } from './requests/components/committee-decision-info/committee-decision-info.component';
import { ChangeRequestModelComponent } from './committees/about/pages/change-request-model/change-request-model.component';
import { CrMainPageComponent } from './change-requests/cr-main-page/cr-main-page.component';
import { ChangeRequestsListComponent } from './change-requests/pages/change-requests-list/change-requests-list.component';
import { ChangeRequestsRowComponent } from './change-requests/components/change-requests-row/change-requests-row.component';
import { ChangeRequestsFilterComponent } from './change-requests/components/change-requests-filter/change-requests-filter.component';
import { NewModifyRequestsComponent } from './change-requests/pages/new-modify-requests/new-modify-requests.component';
import { ChangeRequestDetailsComponent } from './change-requests/components/change-request-details/change-request-details.component';
import { DecisionSendHistoryComponent } from './committees/decisions/components/decision-send-history/decision-send-history.component';
import { ReceiversPipe } from './pipes/receivers/receivers.pipe';
import { SendDecisionDetailsModelComponent } from './committees/decisions/components/send-decision-details-model/send-decision-details-model.component';
import { DateTransformPipe } from './committees/decisions/pipes/date-transform.pipe';
import { UpdateProgressModelComponent } from './committees/tasks/components/update-progress-model/update-progress-model.component';
import { BasicInformationRowsComponent } from './change-requests/components/basic-information-rows/basic-information-rows.component';
import { ChangedDataMembersComponent } from './change-requests/components/changed-data-members/changed-data-members.component';
import { ChangedKpisRowsComponent } from './change-requests/components/changed-kpis-rows/changed-kpis-rows.component';
import { ChangedMainTaskesComponent } from './change-requests/components/changed-main-taskes/changed-main-taskes.component';
import { ChangedKpisModalComponent } from './change-requests/components/modals/changed-kpis-modal/changed-kpis-modal.component';
import { ChangedMainTasksModalComponent } from './change-requests/components/modals/changed-main-tasks-modal/changed-main-tasks-modal.component';
import { TaskHistoryComponent } from './committees/tasks/components/task-history/task-history.component';
import { NgxCaptureModule } from "ngx-capture";
import { StrategyMappingListComponent } from './components/strategy-mapping-list/strategy-mapping-list.component';
import { KpisDetailsComponent } from './requests/modals/kpiDetails/kpis-details/kpis-details.component';
import { TasksDetailsComponent } from './requests/modals/tasks-details/tasks-details.component';
// import { ExportAsModule } from 'ngx-export-as';
import { ExportAsModule } from 'ngx-export-as';
import { CommitteeExternalMembersComponent } from './requests/components/committee-external-members/committee-external-members.component';
import { NewExternalMemberModalComponent } from './requests/components/new-external-member-modal/new-external-member-modal.component';
import { WeightSettinsComponent } from './settings/weight-settins/weight-settins.component';
import { ActiveStatusesComponent } from './dashboard/components/active-statuses/active-statuses.component';
import { FrequencyInputComponent } from './components/frequency-input/frequency-input.component';
import { CommitteeStrategicGoalsComponent } from './requests/components/committee-strategic-goals/committee-strategic-goals.component';
import { GoalsListComponent } from './components/goals-list/goals-list.component';
import { DecisionVotingHistoryComponent } from './committees/decisions/components/decision-voting-history/decision-voting-history.component';
import { VotingHistoryRowsComponent } from './committees/decisions/components/voting-history-rows/voting-history-rows.component';
import { CommitteeCreationBasicInfoComponent } from './components/committee-creation-basic-info/committee-creation-basic-info.component';
import { CommitteeInfoPanelComponent } from './change-requests/components/committee-info-panel/committee-info-panel.component';
import { CommitteeTasksKpisComponent } from './change-requests/components/committee-tasks-kpis/committee-tasks-kpis.component';
import { SendDecisionHistoryDetailsComponent } from './committees/decisions/components/send-decision-history-details/send-decision-history-details.component';


@NgModule({
  declarations: [
    CommitteesManagementMainPageComponent,
    RequestsListComponent,
    RequestsTableComponent,
    RequestsFiltersComponent,
    RequestDetailsComponent,
    NewCommitteeComponent,
    CommitteesListComponent,
    CommitteesRowsComponent,
    CommitteesFiltersComponent,
    MembersCountPipe,
    CommitteeHighlightModelComponent,
    CommitteeDetailsComponent,
    CommitteeDashboardComponent,
    CommitteeMeetingsComponent,
    CommitteeTasksComponent,
    CommitteeDecisionsComponent,
    CommitteeWorkGroupsComponent,
    CommitteeAboutComponent,
    NewMeetingComponent,
    CommitteeInfoComponent,
    MeetingsRowsComponent,
    MeetingsCalendarComponent,
    WorkGroupsCardsComponent,
    DecisionsRowsComponent,
    DecisionDetailsModelComponent,
    DecisionsFiltersComponent,
    NewGroupComponent,
    GroupDetailsComponent,
    InProgressTaskComponent,
    NewDecisionComponent,
    AssignedToPipe,
    BoardTaskCardComponent,
    BoardTasksColsComponent,
    WorkGroupsFiltersComponent,
    StatusClassNamePipe,
    MeetingHighlightModelComponent,
    MeetingCardComponent,
    MeetingDetailsComponent,
    MeetingsFiltersComponent,
    DaysLeftPipe,
    DaysCountPipe,
    HoursLeftPipe,
    VotingTemplatesComponent,
    VotingTemplatesTableComponent,
    VotingEditModelComponent,
    CapitalizePipe,
    MeetingTimeLeftPipe,
    TasksTableComponent,
    RequestsMainPageComponent,
    CommitteesMainPageComponent,
    CreateTaskModelComponent,
    TasksFilterComponent,
    DecisionDetailsComponent,
    TaskDetailsModelComponent,
    CreateDiscussedItemModelComponent,
    DiscussedItemsTabComponent,
    TasksTabComponent,
    DecisionsTabComponent,
    TimePassedPipe,
    RelatedGroupsPipe,
    CreateDecisionModelComponent,
    NewAttendeeModelComponent,
    MeetingCommonFieldsComponent,
    EditMomMeetingComponent,
    RichTextToTextPipe,
    TruncatePipe,
    CapitalizeFirstLetterPipe,
    MeetingCommentComponent,
    MeetingTimelineComponent,
    MeetingCountPipe,
    VotersCountPipe,
    CommitteeKpisRowsComponent,
    NewKPIModelComponent,
    MainTasksRowsComponent,
    NewMainTaskModelComponent,
    CommitteeKPIsComponent,
    KpisRowsComponent,
    KpisFiltersComponent,
    KpiDetailsModelComponent,
    ProgressColorPipe,
    CommitteeMembersColumnComponent,
    MainTasksStatusComponent,
    KpisPerformanceStatusComponent,
    EvaluationMainPageComponent,
    CommitteeEvaluationComponent,
    CommitteesEvaluationsComponent,
    EvaluationTableComponent,
    MeetingsAttendancePercantageComponent,
    EvaluationDetailsComponent,
    NewObservationModelComponent,
    CommitteesDashboardMainPageComponent,
    CommitteesDashboardComponent,
    ConfirmedDecisionComponent,
    KPIDetailsComponent,
    MainTasksFiltersComponent,
    EvaluationFilterComponent,
    CreateEvaluationModelComponent,
    CommentsCountPipe,
    ObservationCommentsModelComponent,
    ApproveAndCloseEvaluationModelComponent,
    EvaluationRowsComponent,
    EvaluationCalenderComponent,
    CommitteeTypesComponent,
    CommitteeCategoriesComponent,
    committeePerformanceDashboard,
    CommitteesFilterComponent,
    DashboardCommitteesRowsComponent,
    CommitteeDecisionInfoComponent,
    ChangeRequestModelComponent,
    CrMainPageComponent,
    ChangeRequestsListComponent,
    ChangeRequestsRowComponent,
    ChangeRequestsFilterComponent,
    NewModifyRequestsComponent,
    ChangeRequestDetailsComponent,
    DecisionSendHistoryComponent,
    ReceiversPipe,
    SendDecisionDetailsModelComponent,
    DateTransformPipe,
    UpdateProgressModelComponent,
    BasicInformationRowsComponent,
    ChangedDataMembersComponent,
    ChangedKpisRowsComponent,
    ChangedMainTaskesComponent,
    ChangedKpisModalComponent,
    ChangedMainTasksModalComponent,
    TaskHistoryComponent,
    StrategyMappingListComponent,
    KpisDetailsComponent,
    TasksDetailsComponent,
    CommitteeExternalMembersComponent,
    NewExternalMemberModalComponent,
    WeightSettinsComponent,
    ActiveStatusesComponent,
    FrequencyInputComponent,
    CommitteeStrategicGoalsComponent,
    GoalsListComponent,
    DecisionVotingHistoryComponent,
    VotingHistoryRowsComponent,
    CommitteeCreationBasicInfoComponent,
    CommitteeInfoPanelComponent,
    CommitteeTasksKpisComponent,
    SendDecisionHistoryDetailsComponent
  ],
  imports: [
    SharedModule,
    WorkflowSDkModule,
    DesignSystemModule,
    FullCalendarModule,
    CommitteesManagementRoutingModule,
    AngularEditorModule,
    TranslateModule,
    NgxGaugeModule,
    NgxCaptureModule,
    ExportAsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateCommitteesManagementLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class CommitteesManagementModule { }
