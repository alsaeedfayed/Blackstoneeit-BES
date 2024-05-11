import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { DesignSystemModule } from './design-system/design-system.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import { NgxPermissionsModule } from './core/modules/permissions';
import { CommonModule } from '@angular/common';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import localeAR from '@angular/common/locales/ar';
import { createTranslateSharedLoader } from './utils/createTranslateLoader';
import { LanguageInterceptor } from './core/services/language.interceptor';
import { NgxGaugeModule } from 'ngx-gauge';

export let AppInjector: Injector;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    DesignSystemModule,
    RouterModule,
    LayoutModule,
    HttpClientModule,
    // NgxCaptureModule,
    // ColorPickerModule,
    BrowserAnimationsModule,
    NgxGaugeModule,
    NgxPermissionsModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateSharedLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    CommonModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    // { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        return en_US;
      },
      deps: [LOCALE_ID],
    },
    { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
  ],
})
export class AppModule {
  constructor(private injector: Injector) {
    registerLocaleData(localeAR, 'ar-EG-u-nu-latn');
    AppInjector = this.injector;
  }
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
