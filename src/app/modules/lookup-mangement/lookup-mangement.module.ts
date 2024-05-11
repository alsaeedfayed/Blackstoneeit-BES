import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { LookupMangementRoutingModule } from './lookup-mangement-routing.module';
import { LookupPageComponent } from './page/lookup-page.component';
import { LookupTypeFormComponent } from './components/lookup-type-form/lookup-type-form.component';
import { LookupFormComponent } from './components/lookup-form/lookup-form.component';
import { LookupSetRolesComponent } from './components/lookup-set-roles/lookup-set-roles.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {  createTranslateLookupLoader } from 'src/app/utils/createTranslateLoader';


@NgModule({
  declarations: [
    LookupPageComponent,
    LookupTypeFormComponent,
    LookupFormComponent,
    LookupSetRolesComponent
  ],
  imports: [
    CommonModule,
    LookupMangementRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLookupLoader,
        deps: [HttpClient],
      },
      isolate: true,
    })
  ]
})
export class LookupMangementModule { }
