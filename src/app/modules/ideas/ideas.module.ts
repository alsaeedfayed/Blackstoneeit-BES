import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { IdeasRoutingModule } from './ideas-routing.module';
import { IdeasMainComponent } from './components/ideas-main/ideas-main.component';
import { IdeasModalComponent } from './components/ideas-modal/ideas-modal.component';


@NgModule({
  declarations: [
    IdeasMainComponent,
    IdeasModalComponent
  ],
  imports: [
    CommonModule,
    IdeasRoutingModule,
    SharedModule,
    DesignSystemModule,
  ]
})
export class IdeasModule { }
