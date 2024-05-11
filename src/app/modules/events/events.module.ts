import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { createTranslateEventsLoader } from "src/app/utils/createTranslateLoader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "src/app/shared/shared.module";
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { EventsRoutingModule } from "./events-routing.module";
import { EventsMainComponent } from "./components/events-main/events-main.component";
import { EventCardComponent } from "./components/event-card/event-card.component";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { EventsQRcodeConfirmModalComponent } from "./components/events-qrcode-confirm-modal/events-qrcode-confirm-modal.component";
import { NgChartsModule } from "ng2-charts";
import { EventsNewComponent } from "./components/events-new/events-new.component";


@NgModule({
  declarations: [
    EventsMainComponent,
    EventCardComponent,
    EventsNewComponent,
    EventDetailsComponent,
    EventsQRcodeConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    DesignSystemModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateEventsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class EventsModule {}
