import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { TableComponent } from './components/table/table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManageFormsRoutingModule } from './manage-forms-routing.module';
import { ManageFormsComponent } from './manage-forms.component';
import { CreateFormComponent } from './components/create-form/create-form.component';
import { createTranslateManageFormsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    ManageFormsComponent,
    TableComponent,
    CreateFormComponent,
  ],
  imports: [
    CommonModule,
    ManageFormsRoutingModule,
    TranslateModule,
    SharedModule,
    DesignSystemModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateManageFormsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ],
})
export class ManageFormsModule {}
