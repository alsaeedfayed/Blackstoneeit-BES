import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { TranslateModule } from '@ngx-translate/core';
import { NgxPopper } from 'angular-popper';

// workflow components
import { WorkflowStatesComponent } from './components/workflow-states/workflow-states.component';
import { HistoryTimelineComponent } from './components/history-timeline/history-timeline.component';
import { ActionModelComponent } from './components/workflow-action-model/action-model.component';
import { ActionOptionsComponent } from './components/action-options/action-options.component';
import { WorkflowPersonItemComponent } from './components/workflow-person-item/person-item.component';
import { ImageService } from './components/workflow-person-item/image.service';
import { ModelComponent } from './components/workflow-model/model.component';
import { SelectComponent } from './components/workflow-select/select.component';
import { DescriptionInputWithAttachmentsComponent } from './components/workflow-description-input-with-attachments/description-input-with-attachments.component';
import { WorkflowBadgeComponent } from './components/workflow-badge/workflow-badge.component';
import { WorkflowTeamSearchComponent } from './components/workflow-team-search/workflow-team-search.component';
import { WorkflowInitialsComponent } from './components/workflow-initials/workflow-initials.component';
import { WorkflowSkeletonLoaderComponent } from './components/workflow-skeleton-loader/workflow-skeleton-loader.component';

// workflow pipes
import { GetControlPipe } from './pipes/get-control.pipe';
import { UTCToLocalDatePipe } from './pipes/utcto-local-date.pipe';
import { SearchPipe } from './pipes/search-pipe/search.pipe';
import { InitialsPipe } from './pipes/initials-pipe/initials.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// directives pipes
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { SharedModule } from "../shared/shared.module";


const components = [
  WorkflowStatesComponent,
  HistoryTimelineComponent,
  ActionModelComponent,
  ActionOptionsComponent,
  WorkflowPersonItemComponent,
  ModelComponent,
  SelectComponent,
  DescriptionInputWithAttachmentsComponent,
  WorkflowBadgeComponent,
  WorkflowTeamSearchComponent,
  WorkflowInitialsComponent,
  WorkflowSkeletonLoaderComponent,

];

const pipes = [
  GetControlPipe,
  UTCToLocalDatePipe,
  SearchPipe,
  InitialsPipe,
];

const directives = [
  CopyToClipboardDirective,
];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgSelectModule,
  TranslateModule,
  NgxSkeletonLoaderModule,
  NgxPopper,
  SharedModule
];


@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives,
  ],
  exports: [
    ...components,
    ...pipes,
    ...directives,
    ...modules,
  ],
  providers: [
    ImageService,
  ],
  imports: [
    ...modules,

  ]
})
export class WorkflowSDkModule { }
