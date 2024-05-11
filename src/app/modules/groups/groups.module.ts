import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsRoutingModule } from './groups-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateGroupsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { GroupsMainComponent } from './components/groups-main/groups-main.component';
import { GroupsModalComponent } from './components/groups-modal/groups-modal.component';
import { ChartDesignerComponent } from './components/chart/chart-designer/chart-designer.component';
import { ChartNodeComponent } from './components/chart/chart-node/chart-node.component';
import { OrgChartComponent } from './components/chart/org-chart/org-chart.component';

@NgModule({
  declarations: [
    GroupsMainComponent,
    GroupsModalComponent,
    ChartDesignerComponent,
    ChartNodeComponent,
    OrgChartComponent,
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateGroupsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class GroupsModule {}
