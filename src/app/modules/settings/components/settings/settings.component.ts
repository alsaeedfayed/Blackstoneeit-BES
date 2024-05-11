import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, switchMap, tap, map, filter } from 'rxjs/operators';
import { TranslationService } from 'src/app/core/services/translate.service';
import { UserService } from 'src/app/core/services/user.service';
import { SettingsService } from '../../settings-service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;
  settings;
  searchQuery: string = '';
  totalSettings: number;
  loading;
  isFormSubmitted;
  isLoading;
  editSwitch;
  userFullName;
  lang: string;

  searchFailed: boolean;
  financialInput;
  searchFinancialLoading
  constructor(private settingsService: SettingsService,
    private toastr: ToastrService,
    private translationService: TranslationService,
    private userService: UserService,) { }


  ngOnInit() {
    this.getSettings();
    this.userFullName = this.userService.getCurrentUserData().fullName;
    this.lang = this.translationService.language
  }
  getFinancialAccounts() {

  }
  titleResultFormatter = (item: any) => item?.name[this.lang];
  titleFormatter = (item: any) => item?.name[this.lang];
  searchFinancial: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchFinancialLoading = true)),
      switchMap((term) =>
        this.settingsService.searchFinancial({ keyword: term, sortBy: '', page: 1, pageSize: 10 }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searchFinancialLoading = false))
    );
  selectedFinancial
  onFinancialSelect(e) {
    this.selectedFinancial = e?.item
  }
  getSettings() {
    this.loading = true;
    this.settingsService.getSettings(0, 0, this.searchQuery.trim(), '').pipe(finalize(() => {
      this.loading = false;
    })).subscribe(res => {
      this.settings = res.data.map(item => ({ ...item, editMode: false }));
      //     this.getFinancialAccountForFinancialType()
      this.totalSettings = res.total;
    }, err => {
      this.toastr.error(err.message[this.lang]);
    })
  }
  getFinancialAccountForFinancialType() {
    this.settings.forEach(setting => {
      if (setting.dataType === 'FinancialAccount') {
        this.settingsService.getFinancialAccountById(setting.value).subscribe(res => {
          setting.financialType = {
            name: res.name,
            id: res.id
          }
        })
      }
    });
  }


  // on edit
  onEdit(setting, index) {
    this.selectedFinancial = setting.financialAccount
    this.settings = this.settings.map((item, i) => ({ ...item, editMode: i === index ? true : false }))
  }

  // edit setting
  editSetting(setting) {
    const newSetting = {
      key: setting.key,
      title: setting.title,
      value: setting.dataType === 'FinancialAccount' ? this.selectedFinancial?.id : this.form?.value?.value,
      description: setting.description,
      dataType: setting.dataType,
      updatedBy: this.userFullName ? this.userFullName : 'Unknown user'
    }
    this.settingsService.editSetting(newSetting).subscribe(res => {
      setting.editMode = false;
      this.isLoading = false;
      this.isFormSubmitted = false;
      this.form.reset();
      this.toastr.success('Setting was successfully updated');
      this.getSettings();
    }, err => {
      this.isLoading = false;
      this.toastr.error(err.message[this.lang]);
    });
  }

  // edit boolean setting (switch button)
  editBooleanSetting(setting) {
    this.editSwitch = true;
    const newSetting = {
      key: setting.key,
      title: setting.title,
      value: setting.value == "true" ? "false" : "true",
      description: setting.description,
      dataType: setting.dataType,
      updatedBy: this.userFullName ? this.userFullName : 'Unknown user'
    }
    this.settingsService.editSetting(newSetting).subscribe(res => {
      this.editSwitch = false;
      this.toastr.success('Setting was successfully updated');
      this.getSettings();
    }, err => {
      this.editSwitch = false;
      this.toastr.error(err.message[this.lang]);
    });
  }

  // on submit
  onSubmit(setting) {
    this.isFormSubmitted = true;
    this.isLoading = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }
    this.editSetting(setting);
  }

}
