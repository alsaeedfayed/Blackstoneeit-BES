import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitteeComponent } from './committee.component';
import { CommitteeRoutingModule } from './committee-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { CommitteeTableComponent } from './components/table/table.component';
import { CommitteeModalComponent } from './components/commitee-modal/commitee-modal.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateCommitteeLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { ProjectInitiationModule } from '../project-initiation/project-initiation.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommitteeComponent,
    CommitteeTableComponent,
    CommitteeModalComponent
    // CommitteeFormComponent,
  ],
  imports: [
    CommonModule,
    CommitteeRoutingModule,
    SharedModule,
    DesignSystemModule,
    NzProgressModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateCommitteeLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    ProjectInitiationModule,
  ]
})
export class CommitteeModule { }
