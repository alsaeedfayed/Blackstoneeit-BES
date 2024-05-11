import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { EntityBuilderComponent } from './entity-builder.component';
import { BuilderEntityComponent } from './components/control-builder/control-builder.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { EntityBuilderConfig, EntityBuilderMode, ENTITY_BUILDER_CONFIG } from 'src/app/core/enums/entity-builder-config';
import { OnlyNumberDirective } from './directives/number-only.directive';
import { FormValidatorsService } from './services/handle-form-validators.service';
import { LocalPipe } from './pipes/local.pipe';
import { GetMassagePipe } from './pipes/get-massage.pipe';
import { OtherControlComponent } from './components/control-builder/other-control/other-control.component';
import { IsSupportItemsPipe } from './pipes/is-support-items.pipe';
import { EntityModalComponent } from './components/entity-modal/entity-modal.component';
import { DndModule } from 'ngx-drag-drop';

const components = [
  BuilderEntityComponent,
  EntityBuilderComponent,
  FormContainerComponent,
  OnlyNumberDirective,
  OtherControlComponent,
  EntityModalComponent
];

const pipes = [LocalPipe, GetMassagePipe, IsSupportItemsPipe]

const _defaultConfig: EntityBuilderConfig = {
  mode: EntityBuilderMode.View,
};

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DesignSystemModule,
    FormsModule,
    DndModule
  ],
  exports: [...components],
  providers: [
    FormValidatorsService,
    {
      provide: ENTITY_BUILDER_CONFIG,
      useValue: _defaultConfig,
    },
  ],
})


export class EntityBuilderModule {
  static forFeature(
    config: EntityBuilderConfig
  ): ModuleWithProviders<EntityBuilderModule> {
    return {
      ngModule: EntityBuilderModule,
      providers: [
        {
          provide: ENTITY_BUILDER_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
