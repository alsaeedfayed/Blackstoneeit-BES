import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { ManageServicesRoutingModule } from './manage-services-routing.module';
import { ManageServicesComponent } from './manage-services.component';
import { TableComponent } from './components/table/table.component';
import { FilterServicesComponent } from './components/filter-services/filter-services.component';
import { CreateServiceComponent } from './components/create-service/create-service.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { createTranslateManageServicesLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    ManageServicesComponent,
    TableComponent,
    FilterServicesComponent,
    CreateServiceComponent,
  ],
  imports: [
    CommonModule,
    ManageServicesRoutingModule,
    TranslateModule,
    SharedModule,
    DesignSystemModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateManageServicesLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ],
})
export class ManageServicesModule {}
