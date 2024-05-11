import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventRegistrationRoutingModule } from "./event-registration-routing.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { createTranslateEventRegistrationLoader } from "src/app/utils/createTranslateLoader";

import { EventRegistrationMainComponent } from "./components/event-registration-main/event-registration-main.component";
import { EventRateComponent } from "../events/components/event-rate/event-rate.component";

@NgModule({
  declarations: [EventRegistrationMainComponent, EventRateComponent],
  imports: [
    CommonModule,
    EventRegistrationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateEventRegistrationLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class EventRegistrationModule {}
