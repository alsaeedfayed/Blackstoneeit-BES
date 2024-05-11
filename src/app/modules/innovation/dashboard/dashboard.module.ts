import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {WorkflowSDkModule} from 'src/app/workflow.sdk/workflow.sdk.module';
import {DesignSystemModule} from 'src/app/design-system/design-system.module';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {createTranslateInnovationManagementLoader} from 'src/app/utils/createTranslateLoader';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {NgxGaugeModule} from 'ngx-gauge';
import {DashboardComponent} from "./dashboard.component";
import {Layout} from "../../../layout/layout-routing.service";
import {RouterModule, Routes} from "@angular/router";
import {StaticsNumberComponent} from "./components/statics-number/statics-number.component";
import {DashboardChallengesComponent} from "./components/dashboard-challenges/dashboard-challenges.component";

const routes: Routes = [
  Layout.childRoutes([{
    path: '',
    component: DashboardComponent,
    data: {title: 'Innovation', displaySidebar: true}, // This is the page title showing in the tab (in browser)

  }])
]


@NgModule({
  declarations: [DashboardComponent,StaticsNumberComponent , DashboardChallengesComponent],
  imports: [
    SharedModule,
    WorkflowSDkModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    FullCalendarModule,
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
export class DashboardModule {
}
