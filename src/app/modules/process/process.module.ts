import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessRoutingModule } from './process-routing.module';
import { ProcessMainComponent } from './components/process-main/process-main.component';
import { SharedModule } from '../../shared/shared.module';
import { ProcessDetailComponent } from './components/process-detail/process-detail.component';
import { ProcessModalComponent } from './components/process-modal/process-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessFlowchartComponent } from './components/process-flowchart/process-flowchart.component';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateProcessLoader } from 'src/app/utils/createTranslateLoader';
import { NewProcessComponent } from './components/new-process/new-process.component';
import { ProcessMainFlowComponent } from './components/process-main-flow/process-main-flow.component';
import { NewStateModelComponent } from './components/new-state-model/new-state-model.component';
import { StateTransitionsComponent } from './components/state-transitions/state-transitions.component';
import { NewTransitionModelComponent } from './components/new-transition-model/new-transition-model.component';
@NgModule({
  declarations: [
    ProcessMainComponent,
    ProcessDetailComponent,
    ProcessModalComponent,
    ProcessFlowchartComponent,
    NewProcessComponent,
    ProcessMainFlowComponent,
    NewStateModelComponent,
    StateTransitionsComponent,
    NewTransitionModelComponent
    
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DesignSystemModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateProcessLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [

  ]
})
export class ProcessModule { }
