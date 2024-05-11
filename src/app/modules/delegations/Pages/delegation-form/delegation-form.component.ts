import { Component, OnInit, OnDestroy, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { componentModes } from './../../Enums/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styleUrls: ['./delegation-form.component.scss'],
})
export class DelegationFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() createdDelegationId: string;
  @Input() ComonentsMode: componentModes;

  @Output() refreshData : EventEmitter<any> = new EventEmitter();

  private endSub$ = new Subject();
  public lang:string = this.translateService.currentLang;

  public isBtnLoadingSave: boolean = false;
  public isBtnLoadingSubmit: boolean = false;
  public isLoading: boolean = false;

  public delegation : any;
  public calculdatedDays:number = 0;

  attendeesPoitions: any[] = [];
  taskTypes: any[]=[];
  users:[] = [];
  form : FormGroup;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private toaster: ToastrService,
    private httpService: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    private fb : FormBuilder,
    private popupService: PopupService
  ) {
    this.form = this.fb.group({
      delegator: [null, [Validators.required]],
      delegatedTo: [null, [Validators.required]],
      dates: [null, [Validators.required]],
    });

    this.form.get('dates').valueChanges.subscribe(val => {
      if (val) {
        this.calculdatedDays = this.calculateDifference(val[0], val[1]);
      }
    });
  }

  ngOnInit(): void {
    this.handleLanguageChange();
    this.getUsers();
    if(this.createdDelegationId){
      this.getDelegation();
    }
  }

  ngOnChanges() {
    if (this.createdDelegationId) {
      this.getDelegation();
    } else {
      this.form.reset();
      this.calculdatedDays = 0;
    }
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  calculateDifference(date1 , date2){
    return Math.abs(((new Date(date1)).getTime() - (new Date(date2)).getTime()) / (1000 * 3600 * 24));
  }

  onPopupClose() {
    this.popupService.close()
  }

  getUsers() {
    const body = {
      pageIndex: 1,
      pageSize: 10000,
    };

    this.httpService
      .get(Config.UserManagement.GetAll, body)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.users = res.data;
      });
  }

  getDelegation() {
    this.httpService
      .get(Config.delegations.get + '/' + this.createdDelegationId)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.delegation = res;
        this.form.get('delegator').setValue(this.delegation.delegator.userId);
        this.form.get('delegatedTo').setValue(this.delegation.delegatedTo.userId);
        this.form.get('dates').setValue([this.delegation.startDate , this.delegation.endDate]);
        this.calculdatedDays = Math.abs(((new Date(this.delegation.startDate)).getTime() - (new Date(this.delegation.endDate)).getTime()) / (1000 * 3600 * 24));
      });
  }

  private handleLanguageChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.lang = this.translateService.currentLang;
    });
  }

  public cancelForm() {
    this.router.navigate(['/delegations']);
  }

  // Main Logic
  public delegationCreatedHandler(createdDelegationId: string) {
    if (createdDelegationId) {
      this.createdDelegationId = createdDelegationId;
      this.isBtnLoadingSave = false;
      this.router.navigate([`/delegations/delegation-form/${this.createdDelegationId}`], { replaceUrl: true })
    }
  }

  public delegationUpdatedHandler() {
    this.isBtnLoadingSave = false;
    // this.checkEditMode();
  }

  public submit() {
    this.isBtnLoadingSubmit = true;

    if (this.form.valid) {
      if (this.isEditMode) {
        this.httpService
          .put(Config.delegations.update, {
            "id": this.createdDelegationId,
            "delegatorUserId": this.form.value.delegator,
            "delegatedToUserId": this.form.value.delegatedTo,
            "startDate": this.form.value?.dates?.[0]?.toLocaleString(),
            "endDate": this.form.value?.dates?.[1]?.toLocaleString()
          })
          .pipe(
            takeUntil(this.endSub$),
            finalize(() => (this.isBtnLoadingSubmit = false))
          )
          .subscribe((res) => {
            if (res) {
              this.toaster.success(
                this.translateService.instant('delegations.editSuccessMsg')
              );
              this.refreshData.emit();
              this.onPopupClose();
            }
          });
      } else {
        this.httpService
          .post(Config.delegations.create, {
            "delegatorUserId": this.form.value.delegator,
            "delegatedToUserId": this.form.value.delegatedTo,
            "startDate": this.form.value?.dates?.[0]?.toLocaleString(),
            "endDate": this.form.value?.dates?.[1]?.toLocaleString()
          })
          .pipe(
            takeUntil(this.endSub$),
            finalize(() => (this.isBtnLoadingSubmit = false))
          )
          .subscribe((res) => {
            if (res) {
              this.toaster.success(
                this.translateService.instant('delegations.addSuccessMsg')
              );
              this.refreshData.emit();
              this.onPopupClose();
            }
          });
      }
    } else {
      this.toaster.error(this.translateService.instant('delegations.pleaseEnterData'));
      this.isBtnLoadingSubmit = false;
    }
  }

  public get isEditMode(): boolean {
    return this.ComonentsMode === componentModes.editMode
  }
}
