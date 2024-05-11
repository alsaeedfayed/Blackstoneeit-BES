import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { OopsRoutingModule } from './oops-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { createTranslateOopsLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { BlockLicenseComponent } from './components/block-license/block-license.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    NotAuthorizedComponent,
    BlockLicenseComponent
  ],
  imports: [
    CommonModule,
    OopsRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateOopsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ]
})
export class OopsModule { }
