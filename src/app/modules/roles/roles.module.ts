import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { RolesModalComponent } from './components/roles-modal/roles-modal.component';
import { RoleCardComponent } from './components/role-card/role-card.component';
import { RolesTableComponent } from './components/roles-table/roles-table.component';
import { MemberComponent } from './components/member/member.component';
import { ViewPermissionsModalComponent } from './components/view-permissions-modal/view-permissions-modal.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateRolesLoader } from 'src/app/utils/createTranslateLoader';
import { HttpClient } from '@angular/common/http';
import { PermissionsCountPipe } from './pips/permissions-count.pipe';

@NgModule({
  declarations: [
    RolesComponent,
    RolesModalComponent,
    RoleCardComponent,
    RolesTableComponent,
    MemberComponent,
    ViewPermissionsModalComponent,
    PermissionsCountPipe,
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateRolesLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ]
})
export class RolesModule { }
