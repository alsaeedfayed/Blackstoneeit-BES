import { NgxPermissionsService } from 'src/app/core/modules/permissions';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.api';
import { UserService } from 'src/app/core/services/user.service';
import { SidebarService } from 'src/app/layout/sidebar/sidebar-service/sidebar.service';
import { environment } from 'src/environments/environment';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from 'src/app/core/config/constant';
import { BrowserDbService } from 'src/app/core/services/browser-db.service';

const modes = {
  username: 'username_mode',
  password: 'password_mode',
  setPassword: 'setPassword_mode',
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ComponentBase implements OnInit {
  loader: boolean = false;
  loginForm: FormGroup;
  setPasswordForm: FormGroup;
  mode = modes.username;
  token: any;
  isBtnLoading: boolean;
  isPasswordDisplayed: boolean = false;
  isConfirmationPasswordDisplayed: any;
  lang: string;
  version = environment.version;
  appName = environment.appName;
  isFormSubmitted: boolean = false;
  isAzureAuthLoading: boolean;
  formatedAuthResponse: any;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private permissionsService: NgxPermissionsService,
    private toastr: ToastrService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private db: BrowserDbService
  ) {
    super(translateService, translate);

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['code']) {
        this.authenticateWithAzure(params['code']);
      }
    });
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.initLoginForm();
    this.initSetPasswordForm();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: [null, [Validators.required]],
      // rememberMe: [null],
    });
  }

  get getLoginForm() {
    return this.loginForm.controls;
  }

  initSetPasswordForm() {
    this.setPasswordForm = this.fb.group({
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[#$^+=!*()@%&]).{6,}$'
          ),
        ],
      ],
      otp: [null, [Validators.required]],
      passwordConfirmation: [
        null,
        [
          Validators.required,
          this.matchValues('password'),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[#$^+=!*()@%&]).{6,}$'
          ),
        ],
      ],
    });
  }

  get getSetPasswordForm() {
    return this.setPasswordForm.controls;
  }

  matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value !== control.parent.controls[matchTo].value
        ? { isMatching: true }
        : null;
    };
  }

  revalidatePasswordMatch() {
    this.setPasswordForm.controls.password.valueChanges.subscribe(() => {
      this.setPasswordForm.controls.passwordConfirmation.updateValueAndValidity();
    });
  }

  login() {
    if (
      this.loginForm.valid &&
      this.loginForm.value.email != '' &&
      this.loginForm.value.password != ''
    ) {
      this.loader = true;
      // this.isBtnLoading = true
      this.authService
        .login({
          userName: this.loginForm.value.email,
          password: this.loginForm.value.password,
        })
        .subscribe(
          (res) => {
            if (res) {
              // this.isBtnLoading = false;
              this.loader = false;
              //format auth response to comply with user service model
              const formatedAuthResponse = {
                token: res.accessToken,
                userId: res.userId,
                expires: res.expiresOn,
                claims: res.permissions,
                user: {
                  email: res.email,
                  userName: res.firstName + ' ' + res.lastName,
                  phoneNumber: res.phoneNumber,
                },
                roles: res.roles,
                position: res.position,
                refreshToken: res.refreshToken
              };
              //debugger
              this.userService.setToken(formatedAuthResponse);
              this.permissionsService.loadPermissions(
                formatedAuthResponse.claims
              );
              this.formatedAuthResponse = formatedAuthResponse;
              // const claims = localStorage.getItem(`$EPPM$claims`);
              if (formatedAuthResponse.token) {
                //console.log("claims ", claims)
                // console.log('login done')
                this.navigateToLandingPage();
              }
            }
          },
          (err) => {
            // this.isBtnLoading = false;
            this.loader = false;
          }
        );
    } else {
      this.toastr.error(this.translate.instant('auth.pleaseEnterValidEmailAndPassword'));
    }
  }

  loginWithAzure() {
    //  this.isAzureBtnLoading = true;
    this.loader = true;
    this.authService.loginWithAzure().subscribe(
      (res) => {
        window.location.href = res.uri;
      },
      (err) => {
        // this.isAzureBtnLoading = false;
        this.loader = false;
      }
    );
  }

  authenticateWithAzure(code) {
    this.isAzureAuthLoading = true;
    this.authService.authenticateWithAzure(code).subscribe(
      (res) => {
        const formatedAuthResponse = {
          token: res.accessToken,
          userId: res.userId,
          expires: res.expiresOn,
          claims: res.permissions,
          user: {
            email: res.email,
            userName: res.firstName + ' ' + res.lastName,
            phoneNumber: res.phoneNumber,
          },
          roles: res.roles,
          position: res.position,
          refreshToken: res.refreshToken
        };
        this.userService.setToken(formatedAuthResponse);
        this.permissionsService.loadPermissions(
          formatedAuthResponse.claims
        );
        this.formatedAuthResponse = formatedAuthResponse;
        // const claims = localStorage.getItem(`$EPPM$claims`);
        if (formatedAuthResponse.token) {
          this.navigateToLandingPage();
        }
      },
      (err) => {
        this.isAzureAuthLoading = false;
      }
    );
  }

  navigateToLandingPage(){
    let latestRoute = localStorage.getItem('latestLocation') || '/service-catalog';
    if(latestRoute == '/')
    latestRoute = '/service-catalog';
    //console.log('Routing to last used page:', latestRoute)
    this.router.navigateByUrl(latestRoute);
  }

  // authenticate() {
  //   if (this.loginForm.controls['password'].valid) {
  //     this.isBtnLoading = true
  //     this.authService.authenticate(this.token, this.loginForm.value.password).subscribe(res => {
  //       this.isBtnLoading = false
  //       this.userService.setToken(res)
  //       this.router.navigateByUrl('/dashboard')
  //       // this.sidebarService.navigateToFirstMenu()
  //       this.userService.saveUserData(res.user)
  //     }, err => {
  //       this.isBtnLoading = false
  //       this.toastr.error(err.message[this.lang])
  //     })
  //   }
  // }

  switchLanguage() {
    const lang = this.db.getItem(Constant.locale);
    this.translateService.setLanguage(lang == 'ar' ? 'en' : 'ar');
    // setTimeout(() => {
    //   location.reload();
    // }, 500);
  }

  togglePasswordVisibility() {
    this.isPasswordDisplayed = !this.isPasswordDisplayed;
  }
}
