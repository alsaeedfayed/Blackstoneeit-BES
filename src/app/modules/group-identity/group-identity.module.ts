import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { TranslateModule } from '@ngx-translate/core';
import { SectorDepartmentFunctionComponent } from './Components/sector-department-function/sector-department-function.component';



@NgModule({
  declarations: [
    SectorDepartmentFunctionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule,
  ],
  exports: [
    SectorDepartmentFunctionComponent
  ]
})
export class GroupIdentityModule { }
