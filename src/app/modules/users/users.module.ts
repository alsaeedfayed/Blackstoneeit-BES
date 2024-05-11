import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'src/app/shared/shared.module';
import {DesignSystemModule} from 'src/app/design-system/design-system.module';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './components/users/users.component';
import {UsersModalComponent} from './components/users-modal/users-modal.component';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UsersTableComponent} from './components/users-table/users-table.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateUsersLoader} from 'src/app/utils/createTranslateLoader';
import {HttpClient} from '@angular/common/http';
import {
  ViewGroupsAndRolesModalComponent
} from './components/view-groups-and-roles-modal/view-groups-and-roles-modal.component';
import {AgUserWidgetComponent} from './components/ag-components/ag-user-widget.component'
import {AgGroupLinkComponent} from "./components/ag-group-link/ag-group-link.component";
import {AgRolesLinkComponent} from "./components/ag-roles-link/ag-roles-link.component";
import {AgStatusComponent} from "./components/ag-status/ag-status.component";
import {AgActionsComponent} from "./components/ag-actions/ag-actions.component";

@NgModule({
  declarations: [
    UsersComponent,
    UsersModalComponent,
    UserCardComponent,
    UsersTableComponent,
    ViewGroupsAndRolesModalComponent,
    AgUserWidgetComponent,
    AgGroupLinkComponent,
    AgRolesLinkComponent,
    AgStatusComponent,
    AgActionsComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    DesignSystemModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateUsersLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),

  ]
})
export class UsersModule {
}
