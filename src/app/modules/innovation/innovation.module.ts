import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {WorkflowSDkModule} from 'src/app/workflow.sdk/workflow.sdk.module';
import {DesignSystemModule} from 'src/app/design-system/design-system.module';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {createTranslateInnovationManagementLoader} from 'src/app/utils/createTranslateLoader';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {InnovationRoutingModule} from './innovation-routing.module';
import {NgxGaugeModule} from 'ngx-gauge';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StaticsNumberComponent} from "./dashboard/components/statics-number/statics-number.component";
import {DashboardChallengesComponent} from "./dashboard/components/dashboard-challenges/dashboard-challenges.component";
import {InnovationComponent} from "./innovation.component";
import {SuccessAlertComponent} from "./shared/success-alert/success-alert.component";


@NgModule({
  declarations: [InnovationComponent, SuccessAlertComponent],
  exports: [
    SuccessAlertComponent
  ],
  imports: [
    SharedModule,
    WorkflowSDkModule,
    DesignSystemModule,
    FullCalendarModule,
    InnovationRoutingModule,
    AngularEditorModule,
    TranslateModule,
    NgxGaugeModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateInnovationManagementLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class InnovationModule {
}
