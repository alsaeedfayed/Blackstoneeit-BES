import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalTypeComponent } from './page/goal-type.component';

const routes: Routes = [
  { path: "", component: GoalTypeComponent, data: { title: 'Configuration Goal Type' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalTypesSettingsRoutingModule { }
