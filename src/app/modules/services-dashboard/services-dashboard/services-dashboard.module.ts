import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ServicesDashboardRoutingModule } from './services-dashboard-routing.module'
import { ServiceandrequestComponent } from './pages/serviceandrequest/serviceandrequest.component'
import { ServicedashboardComponent } from './pages/servicedashboard/servicedashboard.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { createTranslateServicesDashboardLoader } from 'src/app/utils/createTranslateLoader'
import { HttpClient } from '@angular/common/http'
import { ServicesDashboardFollowupComponent } from './pages/services-dashboard-followup/services-dashboard-followup.component'
import { SharedModule } from 'src/app/shared/shared.module'
import { ServicesDashboardFiltersComponent } from './components/services-dashboard-filters/services-dashboard-filters.component';
import { ServicesDashboardRequestsComponent } from './components/services-dashboard-requests/services-dashboard-requests.component';
import { ServicesDashboardClosureRateComponent } from './components/services-dashboard-closure-rate/services-dashboard-closure-rate.component';
import { ServicesDashboardDistributionsComponent } from './components/services-dashboard-distributions/services-dashboard-distributions.component';
import { ServicesDashboardSlaComponent } from './components/services-dashboard-sla/services-dashboard-sla.component';
import { ServicesDashboardReqUpTrackChartComponent } from './components/services-dashboard-req-up-track-chart/services-dashboard-req-up-track-chart.component';
import { FollowUpPerQuarterComponent } from './components/follow-up-per-quarter/follow-up-per-quarter.component';
import { MeetingsPerQuaraterComponent } from './components/meetings-per-quarater/meetings-per-quarater.component';
import { FollowUpTrackkingComponent } from './components/follow-up-trackking/follow-up-trackking.component';
import { FollowUpItemssComponent } from './components/follow-up-itemss/follow-up-itemss.component';
import { FollowUpClosureRatteComponent } from './components/follow-up-closure-ratte/follow-up-closure-ratte.component';
import { FollowUpTopEmpsComponent } from './components/follow-up-top-emps/follow-up-top-emps.component';
import { FollowUpMeetingsStatusComponent } from './components/follow-up-meetings-status/follow-up-meetings-status.component';
import { ReqUpTrackPieChartComponent } from './components/services-dashboard-req-up-track-chart/req-up-track-pie-chart/req-up-track-pie-chart.component';
import { RequestsFiltersComponent } from './components/requests-filters/requests-filters.component';
import { TrackingPieChartComponent } from './components/follow-up-trackking/tracking-pie-chart/tracking-pie-chart.component';
import { FollowUpFiltersComponent } from './components/follow-up-filters/follow-up-filters.component'
import {DesignSystemModule} from "../../../design-system/design-system.module";

@NgModule({
  declarations: [
    ServiceandrequestComponent,
    ServicedashboardComponent,
    ServicesDashboardFollowupComponent,
    ServicesDashboardFiltersComponent,
    ServicesDashboardRequestsComponent,
    ServicesDashboardClosureRateComponent,
    ServicesDashboardDistributionsComponent,
    ServicesDashboardSlaComponent,
    ServicesDashboardReqUpTrackChartComponent,
    FollowUpPerQuarterComponent,
    MeetingsPerQuaraterComponent,
    FollowUpTrackkingComponent,
    FollowUpItemssComponent,
    FollowUpClosureRatteComponent,
    FollowUpTopEmpsComponent,
    FollowUpMeetingsStatusComponent,
    ReqUpTrackPieChartComponent,
    RequestsFiltersComponent,
    TrackingPieChartComponent,
    FollowUpFiltersComponent,
  ],
    imports: [
        CommonModule,
        ServicesDashboardRoutingModule,
        SharedModule,
        TranslateModule.forRoot({
            defaultLanguage: 'ar',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateServicesDashboardLoader,
                deps: [HttpClient],
            },
            isolate: true,
        }),
        DesignSystemModule,
    ],
})
export class ServicesDashboardModule {}
