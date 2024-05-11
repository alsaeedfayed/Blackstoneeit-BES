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
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  takeUntil,
} from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { UsersService } from '../../users-service/users.service';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { AllowEnglishLanguageOnly } from 'src/app/core/helpers/allow-english-language.validator';
import { RegexConfig } from 'src/app/core/config/regex.configs';
import { ArabicLettersAndSpecialChars } from "src/app/core/helpers/arabic-letters-and-special-chars";

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() roles;
  @Input() groups;
  @Output() refreshUsersList: EventEmitter<any> = new EventEmitter();

  width = 800;
  height = 800;

  currentUserId;
  rolesList;
  checkValidation: boolean;
  isValidEmail: boolean = true;
  isValidMobile: boolean = true;
  isLoading;
  form: FormGroup;
  lang: string;
  personItem: IPerson = {} as IPerson;

  //reset password form
  isBtnLoading: boolean = false;
  isSubmitted: boolean = false;
  displayPasswords: boolean = true;
  private endSub$ = new Subject();
  mode: string;
  mode$: Observable<any>;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  selectedRoles = [];
  selectedUser: any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private userService: UserService
  ) {
    this.mode$ = this.usersService.popupMode;
  }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.currentUserId = this.userService.getCurrentUserId();
    this.usersService.selectedUser
      .pipe(takeUntil(this.endSub$))
      .subscribe((selectedUser) => {
        if (selectedUser) {
          this.title = this.translate.instant('users.updateUser');
          this.initForm(selectedUser);
          this.displayPasswords = false;
          this.selectedUser = selectedUser;
        } else {
          this.title = this.translate.instant('users.addNewUser');
          this.initForm();
          this.form.reset();
          this.displayPasswords = true;
        }
      });

    this.usersService.popupMode
      .pipe(takeUntil(this.endSub$))
      .subscribe((mode) => {
        this.mode = mode;
        if (mode === 'set-roles') {
          if (this.selectedUser)
            this.selectedRoles = [
              ...this.selectedUser.usersRoles.map((role) => role.name),
            ];
          this.title = this.translate.instant('users.setRoles');
          this.height = 450;
        } else {
          this.height = 800;
        }
      });
  }

  ngOnDestroy(): void {
    this.endSub$.next('');
    this.endSub$.complete();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.groups?.length) {
        this.groups = [...this.groups];
      }
    });
  }

  // Initialize user form
  initForm(user?) {
    this.form = this.fb.group({
      id: [user ? user?.id : null],
      position: [
        user ? user?.position : null,
        [Validators.required],
      ],
      firstName: [
        user ? user?.firstName : null,
        [Validators.required, AllowEnglishLanguageOnly()],
      ],
      lastName: [
        user ? user?.lastName : null,
        [Validators.required, AllowEnglishLanguageOnly()],
      ],
      fullArabicName: [
        user ? user?.fullArabicName : null,
        [Validators.required, ArabicLettersAndSpecialChars()],
      ],
      email: [
        user ? user?.email : null,
        [Validators.required, Validators.pattern(RegexConfig.emailRegExp)],
      ],
      phoneNumber: [user ? user?.phoneNumber : null],
      groupsIds: this.fb.control([]),
      ...(!user && {
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$'
            ),
          ],
        ],
        passwordConfirmation: [
          null,
          [
            Validators.required,
            this.matchValues('password'),
            Validators.pattern(
              '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$'
            ),
          ],
        ],
      }),
      profilePicture: [null],
    });

    if (user) {
      if (user.usersGroups.length !== 0) {
        const groupsIds = user.usersGroups.map((group) => group?.id);
        this.form.controls['groupsIds'].setValue(groupsIds);
      }
    }
  }

  // User form getter
  get getUserForm() {
    return this.form.controls;
  }

  matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value !== control.parent.controls[matchTo].value
        ? { passwordNotMatching: true }
        : null;
    };
  }

  // Mobile validation
  mobileValidation(e) {
    // in case of there is no phone number (optional)
    if ((<string>e.target.value).indexOf('_') === 5) {
      this.isValidMobile = true;
      return;
    }
    if (
      (<string>e.target.value).indexOf('_') > 5 ||
      (<string>e.target.value).indexOf('5') !== 5
    ) {
      this.isValidMobile = false;
    } else {
      this.isValidMobile = true;
    }
  }

  // Form submission
  onSubmit() {
    if (this.mode === 'create-user') {
      if (this.form.valid && this.isValidMobile) {
        delete this.form.value.passwordConfirmation;
        this.isBtnLoading = true;
        if (this.form.value?.id) {
          delete this.form.value.password;
          this.usersService
            .updateUser({
              ...this.form.value,
              groupsIds: this.form.value.groupsIds,
            })
            .subscribe(
              (res) => {
                this.onResetState(
                  this.translate.instant('users.userWasSuccessfullyUpdated')
                );
                this.refreshUsersList.emit();
              },
              (err) => {
                this.isBtnLoading = false;
              }
            );
        } else {
          this.form.removeControl('id');
          this.form.updateValueAndValidity();
          this.usersService
            .createUser({
              ...this.form.value,
              groupsIds: this.form.value.groupsIds,
            })
            .subscribe(
              (res) => {
                this.onResetState(
                  this.translate.instant('users.userWasSuccessfullyCreated')
                );
                this.refreshUsersList.emit();
              },
              (err) => {
                this.isBtnLoading = false;
              }
            );
        }
      }
    } else {
      this.onSetUserRole();
    }
  }

  onSetUserRole() {
    this.isBtnLoading = true;
    this.usersService
      .onSetUserRole({
        userId: this.selectedUser?.id,
        rolesNamesList: this.selectedRoles,
      })
      .pipe(
        finalize(() => {
          this.isBtnLoading = false;
        })
      )
      .subscribe(
        (res) => {
          this.selectedRoles = [];
          this.refreshUsersList.emit();
          this.popupService.close();
          this.selectedUser = null;
          this.toastr.success(
            this.translate.instant('users.rolesWereSuccessfullySet')
          );
          this.isBtnLoading = false;
        },
        (err) => {
          this.toastr.error(err.message);
        }
      );
  }

  // Popup cancel
  onCancel() {
    this.popupService.close();
    this.form.reset();
    this.usersService.saveSelectedUser(null);
    this.selectedUser = null;
  }

  onResetState(successMessage) {
    this.form.reset();
    this.isBtnLoading = false;
    this.toastr.success(successMessage);
    this.popupService.close();
    this.refreshUsersList.emit();
    this.selectedUser = null;
  }

  formatter = (result: any) => result.name;
  searchRoles: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ): any => {
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
          ? this.roles
          : this.roles.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 100)
      )
    );
  };

  onSelectRole(e) {
    e.preventDefault();
    if (this.selectedRoles.find((item) => item?.id === e.item?.id)) {
      return;
    } else {
      this.selectedRoles.push(e.item);
    }
  }

  onDeleteRole(i) {
    this.selectedRoles.splice(i, 1);
  }

  groupsFormatter = (result: any) => result.name;

  searchGroups: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ): any => {
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
          ? this.groups
          : this.groups.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  onSelectGroup(e) {
    e.preventDefault();
    const formArr: FormArray = this.form.controls.groupsIds as FormArray;
    if (this.form.value.groupsIds.find((item) => item?.id == e.item?.id)) {
      return;
    }
    formArr.push(new FormControl(e.item));
  }

  onDeleteGroup(i) {
    const formArr: FormArray = this.form.controls.groupsIds as FormArray;
    formArr.removeAt(i);
  }
}

