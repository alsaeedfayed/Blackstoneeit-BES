import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { EServicesRoutingModule } from './e-services-routing.module';
import { EServicesComponent } from './e-services.component';
import { createTranslateEServicesLoader } from 'src/app/utils/createTranslateLoader';
import { TableComponent } from './components/table/table.component';
import { CreateEServiceComponent } from './components/create-e-service/create-e-service.component';
import { MoveEServiceComponent } from './components/move-e-service/move-e-service.component';
import { DeleteEServiceComponent } from './components/delete-e-service/delete-e-service.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RequestHeaderComponent } from './components/request-header/request-header.component';
import { RequestsComponent } from './components/requests/requests.component';
import { EServiceDetailsComponent } from './components/e-service-details/e-service-details.component';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    EServicesComponent,
    TableComponent,
    CreateEServiceComponent,
    MoveEServiceComponent,
    DeleteEServiceComponent,
    MainPageComponent,
    RequestHeaderComponent,
    RequestsComponent,
    EServiceDetailsComponent,
  ],
  imports: [
    CommonModule,
    EServicesRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateEServicesLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  exports: [
    AngularEditorModule
  ]
})
export class EServicesModule { }
