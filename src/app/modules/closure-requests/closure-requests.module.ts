import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClosureRequestsRoutingModule } from './closure-requests-routing.module';
import { ClosureRequestsMainComponent } from './components/closure-requests-main/closure-requests-main.component';
import { ClosureRequestsModalComponent } from './components/closure-requests-modal/closure-requests-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateClosureRequestsLoader } from 'src/app/utils/createTranslateLoader';
import { ClosureRequestsDetailsComponent } from './components/closure-requests-details/closure-requests-details.component';


@NgModule({
  declarations: [ClosureRequestsMainComponent, ClosureRequestsModalComponent, ClosureRequestsDetailsComponent],
  imports: [
    CommonModule,
    ClosureRequestsRoutingModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateClosureRequestsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class ClosureRequestsModule { }
