import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {WorkflowSDkModule} from 'src/app/workflow.sdk/workflow.sdk.module';
import {DesignSystemModule} from 'src/app/design-system/design-system.module';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {createTranslateInnovationManagementLoader} from 'src/app/utils/createTranslateLoader';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ChallengesRoutingModule} from './challenges-routing.module';
import {NgxGaugeModule} from 'ngx-gauge';
import {ListChallengesComponent} from "./pages/list-challenges/list-challenges.component";
import {ChallengeCardComponent} from "./components/dashboard-challenges/challenge-card.component";
import {AddChallengeComponent} from "./pages/add-challenge/add-challenge.component";
import {InnovationModule} from "../innovation.module";
import {FilterComponent} from "./components/filter/filter.component";


@NgModule({
  declarations: [ListChallengesComponent,ChallengeCardComponent , AddChallengeComponent, FilterComponent],
    imports: [
        SharedModule,
        WorkflowSDkModule,
        DesignSystemModule,
        FullCalendarModule,
        ChallengesRoutingModule,
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
        InnovationModule,
    ]
})
export class ChallengesModule {
}
