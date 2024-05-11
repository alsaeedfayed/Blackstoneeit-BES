import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { FollowUpRoutingModule } from './follow-up-routing.module';
import { FollowUpComponent } from './follow-up.component';
import { UpdateItemProgressComponent } from './components/update-item-progress/update-item-progress.component';
import { AdvancedFilterComponent } from './components/advanced-filter/advanced-filter.component';
import { FollowUpFiltersComponent } from './components/follow-up-filters/follow-up-filters.component';
import { FollowUpTableComponent } from './components/table/table.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FollowAddItemComponent } from './components/follow-add-item/follow-add-item.component';
import { FollowTransferItemComponent } from './components/follow-transfer-item/follow-transfer-item.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateFollowupLoader } from 'src/app/utils/createTranslateLoader';
import { GetTypePipe } from './pipes/get-type.pipe';
import { FollowActionsItemComponent } from './components/follow-actions-item/follow-actions-item.component';

@NgModule({
  declarations: [
    FollowUpComponent,
    UpdateItemProgressComponent,
    AdvancedFilterComponent,
    FollowUpFiltersComponent,
    FollowUpTableComponent,
    FollowAddItemComponent,
    FollowTransferItemComponent,
    FollowActionsItemComponent,
    GetTypePipe
  ],
  imports: [
    CommonModule,
    FollowUpRoutingModule,
    SharedModule,
    DesignSystemModule,
    NzProgressModule,
   // TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateFollowupLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class FollowUpModule { }
