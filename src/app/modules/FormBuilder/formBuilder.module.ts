import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EntityBuilderMode } from 'src/app/core/enums/entity-builder-config';
import { EntityBuilderModule } from 'src/app/shared/entity-builder/entity-builder.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { FormBuilderRoutingModule } from './formBuilder-routing.module';
import { FormBuilderComponent } from './Pages/FormBuilder/formBuilder.component';

@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    TranslateModule,
    SharedModule,
    DesignSystemModule,
    ReactiveFormsModule,
    EntityBuilderModule.forFeature({
      mode: EntityBuilderMode.Editable,
    }),
  ],
})
export class FormBuilderModule {}
