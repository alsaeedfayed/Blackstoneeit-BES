import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Subject } from 'rxjs';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { AllowArabicLanguageOnly } from 'src/app/core/helpers/allow-arabic-language.validator';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-lookup-set-roles',
  templateUrl: './lookup-set-roles.component.html',
  styleUrls: ['./lookup-set-roles.component.scss'],
})
export class LookupSetRolesComponent implements OnInit, OnDestroy , OnChanges {

  private endSub$ = new Subject();
  public isBtnLoading: boolean = false;
  public isEditMode: boolean = false;
  public form: FormGroup;
  public loading: boolean = false;
  public isSubmitted: boolean = false;
  public roleToDelete: number;
  public add:boolean = true;
  public confirmDelete:boolean = false;
  public users = [];
  public roles;
  pageSize = 5;
  pageIndex = 1;
  public language: string = this.translateSer.currentLang;
  public roleslookup: Array<any> = [
    {
      id: '1',
      nameEn: 'Manager',
      nameAr: 'مدير',
      value: 'Manager'
    }
  ]

  @Input() lookup: any = null;
  @Output() lookupSetHandler = new EventEmitter();
  
  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private popupSer: PopupService,
    private toastSer: ToastrService,
    private translateSer: TranslateService,
    private confirmationPopupService: ConfirmModalService
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if(this.lookup){
      this.add = true;
      this.isSubmitted = false;
      this.confirmDelete = false;
      this.roleToDelete = null;
      await this.getRoles();
    }
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.initForm();
    this.getUsers(); 
  }

  private handleLangChange() {
    this.translateSer.onLangChange.pipe().subscribe(() => {
      this.language = this.translateSer.currentLang;
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      // nameAr: this.fb.control('', [Validators.required, AllowArabicLanguageOnly()]),
      // nameEn: this.fb.control('', [Validators.required, EnglishLettersAndNumbersWithComma()]),
      name: this.fb.control(null, [Validators.required]),
      user: this.fb.control(null, [Validators.required])
    });
  }

  closePopup() {
    this.popupSer.close();
  }

  ngOnDestroy(): void {
    this.add = true;
    this.isSubmitted = false;
    this.confirmDelete = false;
    this.roleToDelete = null;
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  async getRoles() {
    this.loading = true;

    await this.httpHandlerService
      .get(Config.Lookups.getLookupRoles + "/" + this.lookup?.id,
        {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
        }
      ).subscribe(async data => {
        this.roles = data;

        for (let i = 0; i < this.roles.data.length; i++) {
          let data = await this.httpHandlerService.post(
            Config.fileService.getFilesUrls,
            [this.roles.data[i].userInfo.fileName]
          ).toPromise();

          if (data.length > 0) {
            this.roles.data[i].userInfo.url = data[0].fileUrl;
          }

          this.roles.data[i].userInfo.name = { en: this.roles.data[i].userInfo.fullName };
        }
        this.loading = false;
      });
  }

  onPageChange(e) {
    console.log("e", e);
    this.pageIndex = e;
    this.getRoles();
  }

  //search on users
  searchUsers(value: string) {
    if(value) 
      this.getUsers(value?.trim());
  }

  private getUsers(value = '') {
  // this.loading = true;
    const body = {
      pageIndex: 1,
      pageSize: 30,
      fullName: value
    };

    this.httpHandlerService
      .get(Config.UserManagement.GetAll, body)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  addRole() {
    this.add = false;
  }

  save() {
    this.isSubmitted = true;
    this.isBtnLoading = true;

    if (this.form.valid) {
      this.httpHandlerService.post(Config.Lookups.createLookupRole,
        {
          "lookupId": this.lookup?.id,
          "roleName": this.form.value.name,
          "roleNameAr": 'مدير',
          "userId": this.form.value.user
        }
      ).subscribe(data => {
        this.toastSer.success(this.translateSer.instant('lookups.roleAddedSuccessfullyMsg'));
        this.add = true;
        this.getRoles();
        this.isSubmitted = false;
        this.form.reset();
        this.isBtnLoading = false;
      });
    }
  }

  back() {
    this.add = true;
    this.form.reset();
  }

  confirmRemove(id: number) {
    this.roleToDelete = id;
    this.confirmDelete = true;
  }

  remove() {
    this.httpHandlerService.delete(Config.Lookups.removeLookupRole + "/" + this.roleToDelete)
      .subscribe(data => {
        this.toastSer.success(this.translateSer.instant('lookups.roleDeletedSuccessfullyMsg'));
        this.add = true;
        this.pageIndex = 1;
        this.getRoles();
        this.form.reset();
        this.confirmationPopupService.close('remove-role');
        this.confirmDelete = false; 
        this.roleToDelete = null;
      });
  }
}
