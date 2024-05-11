import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  merge,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
} from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { RolesService } from '../../roles-service/roles.service';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss'],
})
export class RolesModalComponent implements OnInit, OnDestroy {
  permissions;
  @Input() title;
  @Input() set Permissions(permissions) {
    this.permissions = permissions;
    this.subscriptions.add(
      this.rolesService.popupMode.subscribe((mode) => {
        this.mode = mode;

        if (mode === 'set-permissions') {
          this.title = this.translate.instant('roles.setPermissions');
          this.selectedPermissions = [];
          // this.selectedPermissions = [...this.selectedRole.permissions];

          this.selectedRole?.structuredPermissions?.forEach((group) => {
            this.selectedPermissions.push(...group.children);
          });

          if (this.permissions?.structure?.length > 0) {
            this.permissions?.structure.forEach((group) => {
              group.children.forEach((permission) => {
                permission.isSelected = this.selectedPermissions.find(
                  (p) => p.id == permission.id
                )
                  ? true
                  : false;
              });
            });
          }

          if (this.permissions?.structureAr?.length > 0) {
            this.permissions.structureAr.forEach((group) => {
              group.children.forEach((permission) => {
                permission.isSelected = this.selectedPermissions.find(
                  (p) => p.id == permission.id
                )
                  ? true
                  : false;
              });
            });
          }
        }
      })
    );
  }
  @Output() refreshRolesList: EventEmitter<any> = new EventEmitter();
  claimsList = [];
  dropdownSettings = {};
  checkValidation: boolean;
  isFormSubmitted;
  isLoading;
  form: FormGroup;
  lang: string;
  mode: string;
  private subscriptions = new Subscription();
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  selectedPermissions: any = [];
  selectedRole: any;

  // selectForm: FormGroup;
  @ViewChild('permissionsForm') permissionsForm: NgForm;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private rolesService: RolesService,
    private toastr: ToastrService,
    private popupService: PopupService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    // this.initSelectForm();
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.subscriptions.add(
      this.rolesService.selectedRole.subscribe((role) => {
        if (role) {
          this.title = this.translate.instant('roles.updateRole');
          this.initForm(role);
          this.selectedRole = role;
        } else {
          this.title = this.translate.instant('roles.addNewRole');
          this.initForm();
          this.form.reset();
        }
      })
    );
    // this.subscriptions.add(
    //   this.rolesService.popupMode.subscribe((mode) => {
    //     this.mode = mode;

    //     if (mode === 'set-permissions') {
    //       this.title = this.translate.instant('roles.setPermissions');
    //       this.selectedPermissions = [];
    //       // this.selectedPermissions = [...this.selectedRole.permissions];

    //       this.selectedRole.structuredPermissions.forEach((group) => {
    //         this.selectedPermissions.push(...group.children);
    //       });

    //       if (this.permissions?.structure?.length > 0) {
    //         this.permissions.structure.forEach((group) => {
    //           group.children.forEach((permission) => {
    //             permission.isSelected = this.selectedPermissions.find(
    //               (p) => p.id == permission.id
    //             )
    //               ? true
    //               : false;
    //           });
    //         });
    //       }

    //       if (this.permissions?.structureAr?.length > 0) {
    //         this.permissions.structureAr.forEach((group) => {
    //           group.children.forEach((permission) => {
    //             permission.isSelected = this.selectedPermissions.find(
    //               (p) => p.id == permission.id
    //             )
    //               ? true
    //               : false;
    //           });
    //         });
    //       }
    //     }
    //   })
    // );
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  // initSelectForm() {
  //   this.selectForm = this.fb.group({
  //     permissionsIds: new FormControl(),
  //   });
  // }

  // init form
  initForm(role?) {
    this.form = this.fb.group({
      name: [
        role ? role.name : null,
        [Validators.required, EnglishLettersAndNumbersOnly()],
      ],
      nameAr: [
        role ? role.nameAr : null,
        [Validators.required, ArabicLettersAndNumbersOnly()],
      ],
      id: [role ? role.id : null],
    });
  }
  get getRoleForm() {
    return this.form.controls;
  }

  addRole() {
    if (this.form.valid) {
      this.isLoading = true;
      delete this.form.value.id;
      this.rolesService.createRole(this.form.value).subscribe(
        (res) => {
          this.onResetState(
            this.translate.instant('roles.roleWasSuccessfullyCreated')
          );
          this.isFormSubmitted = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }
  }

  updateRole() {
    if (this.form.valid) {
      this.isLoading = true;
      this.rolesService.updateRole(this.form.value).subscribe(
        (res) => {
          this.onResetState(
            this.translate.instant('roles.roleWasSuccessfullyUpdated')
          );
          this.isFormSubmitted = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }
  }

  onSubmit() {
    if (this.mode === 'create-role') {
      this.isFormSubmitted = true;
      if (this.form.value?.id) {
        this.updateRole();
      } else {
        this.addRole();
      }
    } else {
      this.onSetPermissions();
    }
  }

  onResetState(message) {
    this.toastr.success(message);
    this.form.reset();
    this.refreshRolesList.emit();
    this.isLoading = false;
    this.popupService.close();
    this.rolesService.saveSelectedRole(null);
    this.selectedRole = null;
  }

  onPopupClose() {
    this.popupService.close();
    this.isFormSubmitted = false;
    this.isLoading = false;
    this.form.reset();
    this.rolesService.saveSelectedRole(null);
    this.selectedRole = null;
  }

  formatter = (result: any) => result.name;
  searchPermissions: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance?.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term: string) =>
        (term === ''
          ? this.permissions
          : this.permissions.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  onSelectPermissions(e) {
    e.preventDefault();
    if (this.selectedPermissions.find((item) => item.id === e.item.id)) {
      return;
    } else {
      this.selectedPermissions.push(e.item);
    }
  }

  onDeleteRole(i) {
    this.selectedPermissions.splice(i, 1);
  }

  onSetPermissions() {
    // console.log(this.selectForm.value.permissionsIds);
    // const ids= [];
    // this.selectForm.value.permissionsIds.map(id=>{
    //   this.permissions.map(permission=>{
    //     if(permission.name === id) {

    //     } else {
    //       ids.push(id);
    //     }
    //   })
    // })

    const keys = Object.keys(this.permissionsForm.value);
    const selected = keys.filter((key: any) => {
      return this.permissionsForm.value[key];
    });

    this.isLoading = true;
    this.rolesService
      .setRolePermissions({
        roleId: this.selectedRole.id,
        // permissionsNamesList: this.selectedPermissions.map((item) => item.name),
        permissionsIdsList: selected,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        this.selectedPermissions = [];
        this.selectedRole = null;
        this.toastr.success(
          this.translate.instant('roles.permissionsWereSuccessfullySet')
        );
        this.refreshRolesList.emit();
        this.popupService.close();
      });
  }
}
