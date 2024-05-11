import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { ServiceCatalogRoutingModule } from './service-catalog-routing.module';
import { ServiceCatalogComponent } from './service-catalog.component';
import { HeaderPageComponent } from './components/header-page/header-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BoxServicesComponent } from './components/box-services/box-services.component';
import { SegmentModule } from 'src/app/shared/components/segment/segment.module';
import { StartServiceComponent } from './components/start-service/start-service.component';
import { EntityBuilderModule } from 'src/app/shared/entity-builder/entity-builder.module';
import { EntityBuilderMode } from 'src/app/core/enums/entity-builder-config';
import { createTranslateServiceCatalogLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    ServiceCatalogComponent,
    HeaderPageComponent,
    BoxServicesComponent,
    StartServiceComponent,
  ],
  imports: [
    CommonModule,
    ServiceCatalogRoutingModule,
    SharedModule,
    DesignSystemModule,
    SegmentModule,
    EntityBuilderModule.forFeature({
      mode: EntityBuilderMode.Editable,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateServiceCatalogLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class ServiceCatalogModule {}
