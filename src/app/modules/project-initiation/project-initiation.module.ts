import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { ProjectInitiationRoutingModule } from './project-initiation-routing.module';
import { RequestsMilestoneCardComponent } from './components/requests-create/components/requests-planning-form/components/requests-milestone-card/requests-milestone-card.component';
import { RequestsModalComponent } from './components/requests-create/components/requests-modal/requests-modal.component';
import { RequestsCreateComponent } from './components/requests-create/requests-create.component';
import { RequestsPlanningFormComponent } from './components/requests-create/components/requests-planning-form/requests-planning-form.component';
import { RequestsOrganizationFormComponent } from './components/requests-create/components/requests-organization-form/requests-organization-form.component';
import { RequestsOverviewFormComponent } from './components/requests-create/components/requests-overview-form/requests-overview-form.component';
import { RequestsStrategicImpactComponent } from './components/requests-create/components/requests-strategic-impact/requests-strategic-impact.component';
import { PrioritySettingComponent } from './components/requests-create/components/requests-modal/components/priority-setting/priority-setting.component';
import { WorkflowActionsConfirmationComponent } from './components/requests-create/components/requests-modal/components/workflow-actions-confirmation/workflow-actions-confirmation.component';
import { RequestsTranslationsComponent } from './components/requests-create/components/requests-translations/requests-translations.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateEppmInitiationFormLoader, } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import {BauModule} from "../bau/bau.module";


@NgModule({
  declarations: [
    RequestsMilestoneCardComponent,
    RequestsModalComponent,
    RequestsCreateComponent,
    RequestsPlanningFormComponent,
    RequestsOrganizationFormComponent,
    RequestsOverviewFormComponent,
    RequestsStrategicImpactComponent,
    PrioritySettingComponent,
    WorkflowActionsConfirmationComponent,
    RequestsTranslationsComponent,
  ],
    imports: [
        CommonModule,
        ProjectInitiationRoutingModule,
        SharedModule,
        DesignSystemModule,
        WorkflowSDkModule,
        TranslateModule.forRoot({
            defaultLanguage: 'ar',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateEppmInitiationFormLoader,
                deps: [HttpClient],
            },
            isolate: true,
        }),
        BauModule,
    ],
  exports : []
})
export class ProjectInitiationModule { }
