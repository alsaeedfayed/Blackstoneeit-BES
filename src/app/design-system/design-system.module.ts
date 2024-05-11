import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

// design-system components
import { StatsWidgetComponent } from './components/stats-widget/stats-widget.component';
import { SwitchBtnComponent } from './components/switch-btn/switch-btn.component';
import { PageFiltersComponent } from './components/page-filters/page-filters.component';
import { AvatarStackComponent } from './components/avatar-stack/avatar-stack.component';
import { TabsMenuComponent } from './components/tabs-menu/tabs-menu.component';
import { VoteProgressComponent } from './components/vote-progress/vote-progress.component';
import { VotePercentageComponent } from './components/vote-percentage/vote-percentage.component';
import { UploadedAttachmentsFilesComponent } from './components/uploaded-attachments-files/uploaded-attachments-files.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';

// design-system pipes
import { FileSizePipe } from './pipes/file-size.pipe';
import { VotesCountPipe } from './pipes/votes-count/votes-count.pipe';
import { NoSanitizePipe } from './pipes/no-sanitize/no-sanitize.pipe';
import { DescriptionWithAttachmentsComponent } from './components/description-with-attachments/description-with-attachments.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { TimePassedPipe } from './pipes/time-passed/time-passed.pipe';
import { DecisionVotingOptionsComponent } from './components/decision-voting-options/decision-voting-options.component';
import { TimeLeftPipe } from './pipes/timeLeft/time-left.pipe';
import { VotingBarComponent } from './components/voting-bar/voting-bar.component';
import { GoalsTreeComponent } from './components/goals-tree/goals-tree.component';


const components = [
  StatsWidgetComponent,
  SwitchBtnComponent,
  PageFiltersComponent,
  AvatarStackComponent,
  TabsMenuComponent,
  VoteProgressComponent,
  VotePercentageComponent,
  UploadedAttachmentsFilesComponent,
  TextEditorComponent,
  DescriptionWithAttachmentsComponent,
  CommentBoxComponent,
  DecisionVotingOptionsComponent,
  VotingBarComponent,
  GoalsTreeComponent,
];

const pipes = [
  FileSizePipe,
  VotesCountPipe,
  NoSanitizePipe,
  TimePassedPipe,
  TimeLeftPipe
];

const modules = [
  CommonModule,
  SharedModule,
  TranslateModule,
  ReactiveFormsModule,
  FormsModule,
  AngularEditorModule,
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    
  ],
  imports: [
    ...modules,
  ],
  exports: [
    ...components,
    ...pipes,
    ...modules,
  ],
})
export class DesignSystemModule { }
