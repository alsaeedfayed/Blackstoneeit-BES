import  localeAr  from '@angular/common/locales/ar';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignSystemModule } from 'src/app/design-system/design-system.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditConfigureComponent } from '../configure/components/edit-configure/edit-configure.component';
import { ConfigureRoutingModule } from '../configure/configure-routing.module';
import { ConfigureComponent } from '../configure/pages/configure/configure.component';
import { ConfigTableComponent} from '../configure/components/table/config-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActiveRoute } from '../configure/is-active-route.directive';
import { FilterPipe } from '../configure/components/date-pipe.pipe';
import { createTranslateConfigurationLoader } from 'src/app/utils/createTranslateLoader';
import { TranslateLoader } from '@ngx-translate/core';
import { IfAvailableFeatureDirective } from './IfAvailableFeatureDirective';
import { FeatureFlagService } from './featureFlagService';

registerLocaleData(localeAr, 'ar')

@NgModule({
  declarations: [
    IfAvailableFeatureDirective
  ],
  imports: [
  ], 
  exports: [
    IfAvailableFeatureDirective
  ], 
  providers:[
    FeatureFlagService
  ]
})

export class FeatureFlagsModule { }
