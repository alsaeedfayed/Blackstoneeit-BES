import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { ReportsComponent } from './components/reports/reports.component';
import { ReportCardComponent } from './components/report-card/report-card.component';

@NgModule({
  declarations: [ReportsComponent, ReportCardComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    DesignSystemModule,
  ],
})
export class ReportsModule {}
