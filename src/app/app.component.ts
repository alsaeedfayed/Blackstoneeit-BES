import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './core/services/authentication.api';
import { UserService } from './core/services/user.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart} from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from './core/services/logging.service';
import { NgxPermissionsService } from './core/modules/permissions';
import { TranslateConfigService } from './core/services/translate-config.service';
declare var $: any;
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { enUS } from 'date-fns/locale';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ConfirmModalService } from './shared/confirm-modal/confirm-modal.service';
import { ComponentBase } from './core/helpers/component-base.directive';
import { ApplicationLiscenceService } from './core/services/application-license.service';

declare var $: any;
registerLocaleData(en);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends ComponentBase implements OnInit {
  title = 'EppmPortal';
  sidebarCounter = {
    citizens: 0,
    applications: 0,
    suppliers: 0,
  };
  confirmMsg: string = null; 
  remainingDays: number = 0;
  lang: string = this.translate.currentLang;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateModule: TranslateService,
    private userService: UserService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private loggingSrvc: LoggingService,
    private translateConfigService: TranslateConfigService,
    private confirmationPopupService: ConfirmModalService,
    private applicationLiscenceService: ApplicationLiscenceService,
    private i18n: NzI18nService
  ) {
    super(translateConfigService, translateModule);
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (!event.url?.includes('login')) {
          // console.log('saving to', event.url)
          localStorage.setItem('latestLocation', event.url);
        }
        $('.modal-backdrop').remove();
      }
    });
  }

  ngOnInit(): void {
    this.translateConfigService.getSystemLang();

    this.i18n.setDateLocale(enUS);
    let formattedTokenExpiryDate = this.userService
      .getToken()
      ?.expires?.replace(/\\/g, '');
    if (formattedTokenExpiryDate) {
      const tokenExpiryDate = new Date(formattedTokenExpiryDate);
      if (moment(tokenExpiryDate).isBefore()) {
       // this.userService.clear();
       // this.userService.getRefreshToken()
      }
    }

    // this.translationService.init(environment.defaultLang);
    const onNavigationEnd = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
    // Change page title on navigation or language change, based on route data
    onNavigationEnd
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route: any) => route.outlet === 'primary'),
        switchMap((route: any) => route.data)
      )
      .subscribe((event: any) => {
        // this.translateModule.onLangChange.subscribe(lang => {
        //   this.titleService.setTitle(
        //     this.translateModule.instant(event.title || environment.appName)
        //   );
        // })
      });
    const claims = localStorage.getItem(`$EPPM$claims`);
    if (!!claims) {
      this.permissionsService.loadPermissions(JSON.parse(claims));
    }
    this.handleLanguage();
    this.applicationLiscenceService.checkLicenseStatus().subscribe(res => {
      // check if warning text
      if(res) {
        if(res.status.toLocaleLowerCase() == 'warning'.toLocaleLowerCase()) {
          this.remainingDays = res.remainingDays;
          this.confirmMsg = this.lang == 'en' ? 
                `Dear, <br/> Kindly be aware that your application license is set to expire in ${this.remainingDays} days. We encourage you to reach out to our support team to ensure a seamless license renewal process and prevent any interruptions.` : 
                `عزيزي/عزيزتى <br/>
                نود أن نلفت انتباهك إلى أن ترخيص التطبيق الخاص بك سينتهي خلال ${this.remainingDays} يومًا
                نشجعك على التواصل مع فريق الدعم لضمان عملية تجديد الترخيص بسلاسة وتجنب أي انقطاعات 
                مع خالص التحية،`;
  
          this.openWarningConfirmationPopup();
        }
      }
    })
  }

  handleLanguage() {
    this.translateModule.onLangChange.subscribe(result => {
      this.lang = result.lang;
      this.confirmMsg = this.lang == 'en' ? 
        `Dear, <br/> Kindly be aware that your application license is set to expire in ${this.remainingDays} days. We encourage you to reach out to our support team to ensure a seamless license renewal process and prevent any interruptions.` : 
        `عزيزي/عزيزتى <br/>
        نود أن نلفت انتباهك إلى أن ترخيص التطبيق الخاص بك سينتهي خلال ${this.remainingDays} يومًا
        نشجعك على التواصل مع فريق الدعم لضمان عملية تجديد الترخيص بسلاسة وتجنب أي انقطاعات 
        مع خالص التحية،`;
      })
  }

  openWarningConfirmationPopup() {
    this.confirmationPopupService.open('warning-license');
  }
  
  public onConfirmed() {
    this.confirmationPopupService.close('warning-license');
  }
  
}
