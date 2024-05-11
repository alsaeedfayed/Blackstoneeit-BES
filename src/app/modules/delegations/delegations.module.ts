import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationsRoutingModule } from './delegations-routing.module';
import { DelegationsListComponent } from './Pages/delegations-list/delegations-list.component';
import { DelegationFormComponent } from './Pages/delegation-form/delegation-form.component';
import { DelegationsMainPageComponent } from './Page/delegations-main-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateDelegationsLoader } from 'src/app/utils/createTranslateLoader';
import { NzProgressModule } from 'ng-zorro-antd/progress';


@NgModule({
  declarations: [
    DelegationsMainPageComponent,
    DelegationsListComponent,
    DelegationFormComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzProgressModule,
    DelegationsRoutingModule, SharedModule, TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateDelegationsLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  exports: [
    DelegationsMainPageComponent
  ]
})
export class DelegationsModule { }
