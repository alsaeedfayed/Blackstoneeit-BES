import { IConsumer } from '../../models/IConsumer';
import { takeUntil, finalize, debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Subject } from 'rxjs';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { Config } from 'src/app/core/config/api.config';
import { IRole } from '../../models/IRole';
import { IButtonSelect } from 'src/app/shared/components/button-select/iBtnSelect.interface';
import { NumbersOnly } from 'src/app/core/helpers/Numbers-Only.validator';
import { IProcess } from '../../models/IProcess';
import { ProcessService } from '../../processes-service/process.service';
import { IForceActionRoles } from '../../models/IForceActionRoles';

@Component({
  selector: 'app-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss']
})
export class NewProcessComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();
  searchSubject = new Subject<string>();

  language: string = this.translate.currentLang;

  //button loading icon
  saveBtnLoading: boolean = false;

  //loading data vars
  loadingConsumers: boolean = true;
  loadingAuthTypes: boolean = true;
  loadingUsers: boolean = true;
  loadingRoles: boolean = true;
  loadingProcessData: boolean = true;

  //loading users list vars
  usersLoadCount: number = 1;
  gettingUsers = false;
  userSearchValue: string = '';
  users: any[] = [];

  //loading roles list vars
  rolesLoadCount: number = 1;
  gettingRoles = false;
  roleSearchValue: string = '';
  roles: IRole[] = [];

  isUpdating: boolean = false;
  processId: number = 0;
  processData: IProcess = {} as IProcess;

  form: FormGroup;
  consumers: IConsumer[] = [];

  overrideTagList: IButtonSelect[] = [
    { text: { en: "Primary", ar: "اساسي" }, className: "primary" },
    { text: { en: "Danger", ar: "رفض" }, className: "danger" },
    { text: { en: "Success", ar: "موافقة" }, className: "success" },
    { text: { en: "Secondary", ar: "ثانوي" }, className: "secondary" },
    { text: { en: "Warning", ar: "تحذير" }, className: "warning" },
  ];

  reviewTagList: IButtonSelect[] = [
    { text: { en: "Primary", ar: "اساسي" }, className: "primary" },
    { text: { en: "Danger", ar: "رفض" }, className: "danger" },
    { text: { en: "Success", ar: "موافقة" }, className: "success" },
    { text: { en: "Secondary", ar: "ثانوي" }, className: "secondary" },
    { text: { en: "Warning", ar: "تحذير" }, className: "warning" },
  ];
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private processService: ProcessService,

  ) {
    super(translateService, translate);
    //search for users

    // this.searchSubject.pipe(debounceTime(250)).subscribe((type) => {
    //   if (type === 'users') {
    //     this.usersLoadCount = 1;
    //     this.users = [];
    //     this.getUsers();
    //   } else if (type === "roles") {
    //     this.rolesLoadCount = 1;
    //     this.roles = [];
    //     this.getRoles();
    //   }
    // });
  }

  fetchRolesAndUsers(): void {
    this.httpSer.get('/UserManagement/api/Role/GetAll?pageSize=30').subscribe(
      (roleData) => {
        this.roles = roleData?.data; 
      },
      (error) => {
      }
    );

    this.httpSer.get('/UserManagement/api/User/GetAll?pageSize=30').subscribe(
      (userData) => {
        this.users = userData?.data; 
      },
      (error) => {
      }
    );
  }

  onRoleInputChange(e){
    this.httpSer.get(`/UserManagement/api/Role/GetAll?roleName=${e.target.value}`).subscribe(
      (roleData) => {
        this.roles = roleData?.data; 
      },
      (error) => {
      }
    );
  }
  onUserInputChange(e){
    this.httpSer.get(`/UserManagement/api/User/GetAll?FullName=${e.target.value}`).subscribe(
      (userData) => {
        this.users = userData?.data; 
      },
      (error) => {
      }
    );
  }

  clickOverrideButton() {

  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();
    this.checkIds();
    this.fetchRolesAndUsers();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  checkIds() {

    // handles language change event
    this.handleLangChange();

    // initialize new meeting form controls
    this.initNewProcessFormControls();

    //load consumers
    this.getConsumers();

    if (this.router.url.includes('/edit/')) {
      //get id 
      this.isUpdating = true;
      this.processId = +this.route.snapshot.params['id'];
      //check if fake id
      if (isNaN(this.processId)) {
        this.goToNotFound();
        this.processId = null;
      }
      else {
        //get process details
        this.getProcessById();
      }
    }
  }

  // initialize new process form controls
  initNewProcessFormControls() {
    this.form = this.fb.group({
      title: [null, [Validators.required, EnglishLettersAndNumbersWithComma()]],
      arabicTitle: [null, [Validators.required, ArabicLettersAndNumbersOnly()]],
      description: [null, Validators.required],
      arabicDescription: [null, Validators.required],
      sla: [null, [ Validators.pattern(/^\d+$/)]],
      consumerId: [null, Validators.required],
      isEnabled: [true],
      isForceActionUsed: [false],
      forceActionType: [1],
      forceActionRoles: [null],
      forceActionUsers: [null],
      isReassignOptionUsed: [false],
      forceActionOptionTag: [null],
      reassignOptionTag: [null],
      externalStates: [null, Validators.required],
    });
    // {


    // }
  }

  get isForceActionUsed() { return this.form.get('isForceActionUsed') as FormControl; }

  get forceActionType() { return this.form.get('forceActionType') as FormControl; }
  get forceActionRoles() { return this.form.get('forceActionRoles') as FormControl; }
  get forceActionUsers() { return this.form.get('forceActionUsers') as FormControl; }
  get forceActionOptionTag() { return this.form.get('forceActionOptionTag') as FormControl; }

  get isReassignOptionUsed() { return this.form.get('isReassignOptionUsed') as FormControl; }
  get reassignOptionTag() { return this.form.get('reassignOptionTag') as FormControl; }

  get isEnabled() { return this.form.get('isEnabled') as FormControl; }
  get externalStates() { return this.form.get('externalStates') as FormControl; }

  //load consumers 
  getConsumers() {
    this.httpSer
      .get(Config.Lookups.getConsumers)
      .pipe(finalize(() => (this.loadingConsumers = false)))
      .subscribe((res: IConsumer[]) => {
        if (res) {
          this.consumers = res;
        }
      });
  }

  // fetch all users
  // getUsers() {
  //   this.gettingUsers = true;
  //   this.httpSer
  //     .get(Config.UserManagement.GetAll, { pageIndex: this.usersLoadCount, pageSize: 10, fullName: this.userSearchValue })
  //     .pipe(finalize(() => { this.gettingUsers = false }))
  //     .subscribe((res) => {
  //       if (res) {
  //         res.data.forEach((emp) => {
  //           let duplicated = false;
  //           //check if duplicated user exists
  //           for (const e of this.users) {
  //             if (e.id == emp.id) {
  //               duplicated = true;
  //               break;
  //             }
  //           }

  //           if (!duplicated) this.users.push(emp);
  //         });
  //       }
  //     });
  // }

  //focus on search bar if members selection
  onUserSelectFocus(inputType: string) {    
    this.userSearchValue = '';
    // this.getUsers();
  }
  //search on users selection
  searchUsers(value: any) {
    if (value.term.trim()) {
      this.userSearchValue = value.term.trim();
      this.searchSubject.next("users");
    }
  }
  //load more employees
  loadMoreUsers() {
    this.usersLoadCount++;
    // this.getUsers();
  }

  //fetch a slice of  users 
  getUsersSlice() {
    let users = [
      ...this.processData?.forceActionUsers?.map(user => user.userId),
    ]
    this.httpSer
      .post(Config.UserManagement.GetUsersByIds, { usersIds: [...new Set(users)] })
      .pipe(finalize(() => { this.loadingUsers = false; }))
      .subscribe((res) => {
        if (res) {

          res.activeUsers.forEach((user) => {
            this.users.push(user);
          });
        }
      });
  }
  // fetch all roles
  getRoles() {
    this.gettingRoles = true;
    this.httpSer
      .get(Config.Lookups.lookupRoles, { pageIndex: this.rolesLoadCount, pageSize: 10, fullName: this.roleSearchValue })
      .pipe(finalize(() => { this.gettingRoles = false }))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((role) => {
            let duplicated = false;
            //check if duplicated user exists
            for (const r of this.roles) {
              if (r.id == role.id) {
                duplicated = true;
                break;
              }
            }

            if (!duplicated) this.roles.push(role);
          });
        }
      });
  }
  // //focus on roles selection
  onRolesSelectFocus() {
    this.roleSearchValue = '';
    this.getRoles();
  }
  // //search on users selection
  searchRoles(value: any) {
    if (value.term.trim()) {
      this.roleSearchValue = value.term.trim();
      this.searchSubject.next("roles");
    }
  }
  // //load more employees
  loadMoreRoles() {
    this.rolesLoadCount++;
    this.getRoles();
  }
  //fetch a slice of  users 
  getRolesSlice() {
    let roles = [
      ...this.processData?.forceActionRoles?.map(role => role.id),
    ]
    this.httpSer
      .post(Config.Lookups.GetRolesByIds, { rolesIds: [...new Set(roles)] })
      .pipe(finalize(() => { this.loadingRoles = false; }))
      .subscribe((res) => {
        if (res) {
          console.log(res);
          res.activeRoles.forEach((role) => {
            this.roles.push(role);
          });
        }
      });
  }
  onAllowForceActionChange(e) {
    this.isForceActionUsed.setValue(e);
    this.onChangeValidation('forceActionOptionTag', e)
    if (e) {
      this.onSelectAuthType();
    } else {
      this.onChangeValidation('forceActionUsers', false)
      this.onChangeValidation('forceActionRoles', false)
    }

  }
  onSelectAuthType() {
    this.onChangeValidation('forceActionUsers', this.forceActionType.value == 1)
    this.onChangeValidation('forceActionRoles', this.forceActionType.value == 2)
  }
  onAllowReviewAction(e) {
    this.isReassignOptionUsed.setValue(e);
    this.onChangeValidation('reassignOptionTag', e)
  }

  getOverrideButtonStyle(e) {
    this.forceActionOptionTag.setValue(e);
  }

  getReviewButtonStyle(e) {
    this.reassignOptionTag.setValue(e);
  }

  enabledChange(e) {
    this.isEnabled.setValue(e);
  }

  getExternalStates(states) {
    this.externalStates.setValue(states);
  }

  onChangeValidation(FormControlName: string, enabled: boolean) {

    if (enabled) {
      this.form.controls[FormControlName].addValidators(Validators.required);
    }
    else {
      this.form.controls[FormControlName].removeValidators(Validators.required);
    }
    this.form.controls[FormControlName].updateValueAndValidity();
  }
  // back to last page
  backToLastPage() {
    this.router.navigateByUrl(`/process${this.isUpdating ? '/' + this.processId : ''}`);
  }

  //save
  save() {
    this.saveBtnLoading = true;

    if (!this.isForceActionUsed.value) {
      this.forceActionType.setValue(null)
      this.forceActionRoles.setValue(null)
      this.forceActionUsers.setValue(null)
      this.forceActionOptionTag.setValue(null)
    } else {
      this.forceActionType.value == 1 ? this.forceActionRoles.setValue(null) : this.forceActionUsers.setValue(null);
    }
    if (!this.isReassignOptionUsed.value) {
      this.reassignOptionTag.setValue(null)
    }

    this.isUpdating ? this.updateProcess() : this.addNewProcess();
  }

  addNewProcess() {
    let body = {
      ...this.form.value,
    }
    this.processService.addProcess(body)
      .pipe(finalize(() => { this.saveBtnLoading = false; }))
      .subscribe(data => {
        if (data) {
          this.processId = data.id;
          this.toastr.success(this.translate.instant('newProcess.createSuccessMsg'));
          this.router.navigateByUrl(`/process/${this.processId}`);
        }
      })
  }
  updateProcess() {

    let body = {
      ...this.form.value,
      id: this.processId,
    }
    this.processService.editProcess(body)
      .pipe(finalize(() => { this.saveBtnLoading = false; }))
      .subscribe(data => {
        if (data) {
          this.toastr.success(this.translate.instant('newProcess.updateSuccessMsg'));
          this.router.navigateByUrl(`/process/${this.processId}`);
        }
      })
  }

  getProcessById() {
    this.processService.getProcessById(this.processId)
      .pipe(finalize(() => { this.loadingProcessData = false; }))
      .subscribe((res: IProcess) => {
        this.processData = res
        this.processData?.forceActionUsers ? this.getUsersSlice() : this.loadingUsers = false;
        this.processData?.forceActionRoles?.length > 0 ? (this.roles = this.processData?.forceActionRoles) : '';
        this.patchForm();
        this.onSelectAuthType();
      })
  }
  patchForm() {
    let formValues = {
      title: this.processData?.title?.en,
      arabicTitle: this.processData?.title?.ar,
      description: this.processData?.description?.en,
      arabicDescription: this.processData?.description?.ar,
      sla: this.processData?.sla?.toString(),
      consumerId: this.processData?.consumer?.id,
      isEnabled: this.processData?.isEnabled,
      isForceActionUsed: this.processData?.isForceActionUsed,
      forceActionType: this.processData?.forceActionType?.id ?? 1,
      forceActionRoles: this.processData?.forceActionRoles?.map(role => role.id),
      forceActionUsers: this.processData?.forceActionUsers?.map(user => user.userId),
      isReassignOptionUsed: this.processData?.isReassignOptionUsed,
      forceActionOptionTag: this.processData?.forceActionOptionTag,
      reassignOptionTag: this.processData?.reassignOptionTag,
      externalStates: this.processData?.externalStates,
    }
    this.form.patchValue(formValues);
  }
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
}

