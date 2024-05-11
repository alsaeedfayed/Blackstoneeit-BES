import { GroupIdentityModule } from './../group-identity/group-identity.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { WorkflowSDkModule } from 'src/app/workflow.sdk/workflow.sdk.module';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningStepComponent } from './Components/PlanningStep/planningStep.component';
import { PlanningHeaderComponent } from './Components/PlanningHeader/planningHeader.component';
import { GoalItemComponent } from './Components/GoalItem/goalItem.component';
import { ScoreCardTreeComponent } from './Components/ScoreCardTree/scoreCardTree.component';
import { GoalItemsComponent } from './Components/GoalItems/goalItems.component';
import { AddGoalComponent } from './Components/AddGoal/addGoal.component';
import { GoalInfoComponent } from './Components/GoalInfo/goalInfo.component';
import { TargetAndFrequencyComponent } from './Components/TargetAndFrequency/targetAndFrequency.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FrequencyComponent } from './Components/TargetAndFrequency/components/frequency/frequency.component';
import { FrequencyInputComponent } from './Components/TargetAndFrequency/components/frequency-input/frequency-input.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ActionModelComponent } from './Components/action-model/action-model.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslatePlanningLoader } from 'src/app/utils/createTranslateLoader';
import { AddScorecardComponent } from './Components/add-scorecard/add-scorecard.component';
import { EditScorecardComponent } from './Components/edit-scorecard/edit-scorecard.component';
import { CrTargetAndFrequencyComponent } from './Components/edit-scorecard/components/TargetAndFrequency/targetAndFrequency.component';
import { CrFrequencyComponent } from './Components/edit-scorecard/components/TargetAndFrequency/components/frequency/frequency.component';
import { CRGoalInfoComponent } from './Components/edit-scorecard/components/GoalInfo/goalInfo.component';
import { ChangeRequestAddGoalComponent } from './Components/edit-scorecard/components/AddGoal/addGoal.component';
import { PlanningComponent } from './Page/planning.component';
import { PlanningStatusComponent } from './Components/planning-status/planning-status.component';
import { PerformanceSharedModuleModule } from '../performance-shared-module/performance-shared-module.module';

@NgModule({
  declarations: [
    PlanningComponent,
    PlanningStepComponent,
    ScoreCardTreeComponent,
    AddGoalComponent,
    GoalInfoComponent,
    TargetAndFrequencyComponent,
    FrequencyComponent,
    FrequencyInputComponent,
    ActionModelComponent,
    AddScorecardComponent,
    EditScorecardComponent,
    CrTargetAndFrequencyComponent,
    CrFrequencyComponent,
    CRGoalInfoComponent,
    ChangeRequestAddGoalComponent,
    PlanningHeaderComponent,
    GoalItemComponent,
    GoalItemsComponent,
    PlanningStatusComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DesignSystemModule,
    WorkflowSDkModule,
    PlanningRoutingModule,
    NgSelectModule,
    PerformanceSharedModuleModule,
    GroupIdentityModule,
    NzStepsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslatePlanningLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})

export class PlanningModule {}
