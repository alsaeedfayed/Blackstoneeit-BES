import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';
import { ChangeRequestsRoutingModule } from './change-requests-routing.module';
import { ChangeRequestsMainComponent } from './components/change-requests-main/change-requests-main.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateChangeRequestsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { ChangeRequestsDetailsComponent } from './components/change-requests-details/change-requests-details.component';
import { ChangeRequestsModalComponent } from './components/change-requests-modal/change-requests-modal.component';
import { ProjectsModule } from '../projects/projects.module';
@NgModule({
  declarations: [ChangeRequestsMainComponent, ChangeRequestsDetailsComponent, ChangeRequestsModalComponent],
  imports: [
    CommonModule,
    ChangeRequestsRoutingModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    ProjectsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateChangeRequestsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class ChangeRequestsModule { }
