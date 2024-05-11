import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { GoalTypesSettingsRoutingModule } from './goal-types-settings-routing.module';
import { GoalTypeComponent } from './page/goal-type.component';
import { GoalTypesTableComponent } from './components/goal-types-table/goal-types-table.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';


@NgModule({
  declarations: [GoalTypeComponent, GoalTypesTableComponent, GoalFormComponent],
  imports: [
    CommonModule,
    GoalTypesSettingsRoutingModule,
    SharedModule,
    DesignSystemModule,
  ]
})
export class GoalTypesSettingsModule { }
