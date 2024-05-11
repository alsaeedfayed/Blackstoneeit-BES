import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { MeetingsRoutingModule } from './meetings-routing.module';
import { MeetingsListComponent } from './Pages/meetings-list/meetings-list.component';
import { UpdateItemProgressComponent2 } from './Components/update-item-progress/update-item-progress.component';
import { MeetingDetailsComponent } from './Pages/meeting-details/meeting-details.component';
import { MeetingFormComponent } from './Pages/meeting-form/meeting-form.component';
import { MettingsMainPageComponent } from './Page/mettings-main-page.component';
import { MinsOfMettingComponent } from './Components/mins-of-metting/mins-of-metting.component';
import { AttendeesListComponent } from './Components/attendees-list/attendees-list.component';
import { ActionItemListComponent } from './Components/action-item-list/action-item-list.component';
import { DiscussionItemListComponent } from './Components/discussion-item-list/discussion-item-list.component';
import { DiscussionItemsModalComponent } from './Components/discussion-item-list/discussion-items-modal/discussion-items-modal.component';
import { AttendeesModalComponent } from './Components/attendees-list/attendees-modal/attendees-modal.component';
import { ActionItemModalComponent } from './Components/action-item-list/action-item-modal/action-item-modal.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateMeetingsLoader } from 'src/app/utils/createTranslateLoader';
import { MeetingsActionModelComponent } from './Pages/meeting-details/components/meetings-action-model/meetings-action-model.component';
import { MeetingDetailsDataComponent } from './Pages/meeting-details/components/meetings-details-data/meetings-details-data.component';
import { AttendeeSearchComponent } from './Components/attendee-search/attendee-search.component';
import { AdvancedFilterComponent } from './Components/advanced-filter/advanced-filter.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { MeetingsAnalyticsComponent } from './Components/meetings-analytics/meetings-analytics.component';


@NgModule({
  declarations: [
    MettingsMainPageComponent,
    MeetingsListComponent,
    MeetingDetailsComponent,
    MeetingFormComponent,
    MinsOfMettingComponent,
    AttendeesListComponent,
    ActionItemListComponent,
    DiscussionItemListComponent,
    DiscussionItemsModalComponent,
    AttendeesModalComponent,
    ActionItemModalComponent,
    MeetingsActionModelComponent,
    MeetingDetailsDataComponent,
    UpdateItemProgressComponent2,
    AttendeeSearchComponent,
    AdvancedFilterComponent,
    MeetingsAnalyticsComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzProgressModule,
    MeetingsRoutingModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateMeetingsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  exports: [
    MettingsMainPageComponent
  ]
})
export class MeetingsModule { }
