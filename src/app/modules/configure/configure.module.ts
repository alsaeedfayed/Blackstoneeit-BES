import  localeAr  from '@angular/common/locales/ar';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditConfigureComponent } from './components/edit-configure/edit-configure.component';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureComponent } from './pages/configure/configure.component';
import { ConfigTableComponent} from './components/table/config-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActiveRoute } from './is-active-route.directive';
import { FilterPipe } from './components/date-pipe.pipe';
import { createTranslateConfigurationLoader } from 'src/app/utils/createTranslateLoader';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

registerLocaleData(localeAr, 'ar')

@NgModule({
  declarations: [
    ConfigureComponent,
    EditConfigureComponent,
    ConfigTableComponent,
    IsActiveRoute,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    CommonModule,
    SharedModule,
    DesignSystemModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateConfigurationLoader,
        deps: [HttpClient],
      },
      isolate: true,
    })
  ]
})

export class ConfigureModule { }
