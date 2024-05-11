import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { ProjectsMainComponent } from './components/projects-main/projects-main.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsCardComponent } from './components/projects-card/projects-card.component';
import { ProjectsCharterComponent } from './components/projects-details/components/projects-charter/projects-charter.component';
import { ProjectsPlanningComponent } from './components/projects-details/components/projects-planning/projects-planning.component';
import { ProjectsRisksComponent } from './components/projects-details/components/projects-risks/projects-risks.component';
import { ProjectsModalComponent } from './components/projects-details/components/projects-modal/projects-modal.component';
import { ProjectsAdvancedFilterComponent } from './components/projects-advanced-filter/projects-advanced-filter.component';
import { ProjectsDeliverablesComponent } from './components/projects-details/components/projects-deliverables/projects-deliverables.component';
import { ProjectsCostComponent } from './components/projects-details/components/projects-cost/projects-cost.component';
import { DeliverableStatusCardComponent } from './components/projects-details/components/projects-deliverables/components/deliverable-status-card/deliverable-status-card.component';
import { ProjectsPlanningGanttComponent } from './components/projects-details/components/projects-planning/components/projects-planning-gantt/projects-planning-gantt.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateProjectsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { ChangeRequestFormComponent } from './components/projects-details/components/projects-change-requests/change-request-form/change-request-form.component';
import { ChangeRequestStepperComponent } from './components/projects-details/components/projects-change-requests/change-request-stepper/change-request-stepper.component';
import { ProjectsClosureComponent } from './components/projects-details/components/projects-closure/projects-closure.component';
import { ProjectsChangeRequestsComponent } from './components/projects-details/components/projects-change-requests/projects-change-requests.component';
import { ProjectInitiationModule } from '../../modules/project-initiation/project-initiation.module'
import { MembersCountPipe } from './pipes/members-count/members-count.pipe';

@NgModule({
  declarations: [
    ProjectsCharterComponent,
    ProjectsDetailsComponent,
    ProjectsMainComponent,
    ProjectsCardComponent,
    ProjectsModalComponent,
    ProjectsPlanningComponent,
    ProjectsRisksComponent,
    ProjectsAdvancedFilterComponent,
    ProjectsDeliverablesComponent,
    ProjectsCostComponent,
    DeliverableStatusCardComponent,
    ProjectsPlanningGanttComponent,
    ProjectsChangeRequestsComponent,
    ChangeRequestStepperComponent,
    ProjectsClosureComponent,
    ChangeRequestFormComponent,
    MembersCountPipe,
  ],
    exports : [
      ChangeRequestFormComponent,
      ProjectsModalComponent
    ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    ProjectInitiationModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateProjectsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class ProjectsModule { }
