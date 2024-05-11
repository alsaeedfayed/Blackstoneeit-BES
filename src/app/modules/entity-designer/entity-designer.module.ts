import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityDesignerRoutingModule } from './entity-designer-routing.module';
import { EntityDesignerComponent } from './entity-designer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { EntityBoxComponent } from './components/entity-box/entity-box.component';
import { DndModule } from 'ngx-drag-drop';
import { EntityBuilderModule } from 'src/app/shared/entity-builder/entity-builder.module';
import { EntityBuilderMode } from 'src/app/core/enums/entity-builder-config';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateEntityDesignerLoader } from 'src/app/utils/createTranslateLoader';

@NgModule({
  declarations: [EntityDesignerComponent, EntityBoxComponent],
  imports: [
    CommonModule,
    EntityDesignerRoutingModule,
    SharedModule,
    DesignSystemModule,
    DndModule,
    EntityBuilderModule.forFeature({
      mode: EntityBuilderMode.View,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateEntityDesignerLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class EntityDesignerModule {}
