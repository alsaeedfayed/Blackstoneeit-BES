import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/shared/', '.json');
};

export const createTranslateSharedLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
  ]);
};

export const createTranslateAuthLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/authentication/', suffix: '.json' },
  ]);
};

export const createTranslateDashboardLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/dashboard/', suffix: '.json' },
  ]);
};

export const createTranslatePlanningLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/Planning/', suffix: '.json' },
  ]);
};

export const createTranslatePerformaneReportsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/performanceReports/', suffix: '.json' },
  ]);
};

export const createTranslateChangeRequestsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/change-requests/', suffix: '.json' },
  ]);
};

export const createTranslateClosureRequestsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/closure-requests/', suffix: '.json' },
  ]);
};

export const createTranslateEppmRequestsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/eppm-requests/', suffix: '.json' },
  ]);
};
export const createTranslateEppmInitiationFormLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/initiation-form/', suffix: '.json' },
  ]);
};

export const createTranslateCommitteeLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/Committee/', suffix: '.json' },
  ]);
};

export const createTranslateBauLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/bau/', suffix: '.json' },
  ]);
};

export const createTranslateGroupsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/groups/', suffix: '.json' },
  ]);
};

export const createTranslateAgentQueueLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/agent-queue/', suffix: '.json' },
  ]);
};

export const createTranslateManageServicesLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/manage-services/', suffix: '.json' },
  ]);
};

export const createTranslateManageScorecardsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/mangeScorecards/', suffix: '.json' },
  ]);
};
export const createTranslatePerformanceSharedLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/PerformanceShared/', suffix: '.json' },
  ]);
};

export const createTranslateManageFormsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/manage-forms/', suffix: '.json' },
  ]);
};

export const createTranslateMeetingsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/Meetings/', suffix: '.json' },
    { prefix: './assets/i18n/FollowUp/', suffix: '.json' },
  ]);
};

export const createTranslateFollowupLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/FollowUp/', suffix: '.json' },
  ]);
};

export const createTranslateRequestsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/requests/', suffix: '.json' },
  ]);
};

export const createTranslateUsersLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/users/', suffix: '.json' },
  ]);
};

export const createTranslateServiceCatalogLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/service-catalog/', suffix: '.json' },
  ]);
};

export const createTranslateRolesLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/roles/', suffix: '.json' },
  ]);
};

export const createTranslatePerfChngeRequestLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/performnaceChangeRequest/', suffix: '.json' },
    { prefix: './assets/i18n/Planning/', suffix: '.json' },
  ]);
};
export const createTranslateProjectsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/projects/', suffix: '.json' },
  ]);
};

export const createTranslateEntityDesignerLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/entity-designer/', suffix: '.json' },
  ]);
};

export const createTranslateOopsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/oops/', suffix: '.json' },
  ]);
};

export const createScoreSubmissionLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/score-submission/', suffix: '.json' },
  ]);
};

export const createTranslateConfigurationLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/configuration/', suffix: '.json' },
  ]);
};

export const createTranslateLookupLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/lookups/', suffix: '.json' },
  ]);
};

export const createTranslatePerformanceDashboardLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/performance-dashboard/', suffix: '.json' },
  ]);
};

export const createTranslateCommitteesManagementLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/committees-management/', suffix: '.json' }
  ]);
};
export const createTranslateInnovationManagementLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/innovation/', suffix: '.json' }
  ]);
};
export const createTranslateEventsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/events/', suffix: '.json' }
  ]);
};

export const createTranslateEventRegistrationLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/event-registration/', suffix: '.json' }
  ]);
};

export const createTranslateDelegationsLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/delegations/', suffix: '.json' },
  ]);
};

export const createTranslateServicesDashboardLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/services-dashboard/', suffix: '.json' },
  ])
}

export const createTranslateProcessLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/design-system/', suffix: '.json' },
    { prefix: './assets/i18n/workflow.sdk/', suffix: '.json' },
    { prefix: './assets/i18n/process/', suffix: '.json' },
  ]);
};

export const createTranslateEServicesLoader = (http: HttpClient) => {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/e-services/', suffix: '.json' },
  ]);
};