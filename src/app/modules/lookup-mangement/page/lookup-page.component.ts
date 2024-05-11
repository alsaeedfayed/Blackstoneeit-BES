import {ToastrService} from 'ngx-toastr';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {Config} from 'src/app/core/config/api.config';
import {HttpHandlerService} from 'src/app/core/services/http-handler.service';
import {takeUntil, finalize} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {ILookup, ILookupItem, ILookupService} from '../interfaces/interfaces';
import {LookupServices} from '../enums/enums';
import {StructureLookups} from 'src/app/utils/loockups.utils';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-lookup-page',
  templateUrl: './lookup-page.component.html',
  styleUrls: ['./lookup-page.component.scss'],
})
export class LookupPageComponent
  extends ComponentBase
  implements OnInit, OnDestroy {
  // PROPs
  public lookupService: ILookupService[] = [
    {
      label: this.translate.instant('lookups.ServiceDesk'),
      code: 'ServiceDesk',
      id: LookupServices.ServiceDesk,
    },
    {
      label: this.translate.instant('lookups.UserManagement'),
      code: 'UserManagement',
      id: LookupServices.UserManagement,
    },
    {
      label: this.translate.instant('lookups.Performance'),
      code: 'Performance',
      id: LookupServices.Performance,
    },
    {
      label: this.translate.instant('lookups.EPPM'),
      code: 'EPPM',
      id: LookupServices.EPPM,
    },
    {
      label: this.translate.instant('lookups.committee'),
      code: 'Committee',
      id: LookupServices.Committee,
    }, {
      label: this.translate.instant('lookups.Innovation'),
      code: 'Innovation',
      id: LookupServices.Innovation,
    },
  ];
  public confirmMsg: string = null;
  public delteConfirmMsg: string = null;
  public language: string = this.translate.currentLang;
  public isShowlookup: boolean = false;
  public isShowLookupRoles: boolean = false;
  public isShowlookupType: boolean = false;
  public isGettingLookupTypes: boolean = false;
  public lookupTypes: { code: string; id: number, nameEn: string, nameAr: string }[] = [];
  public allServiceLookups: ILookup[] = [];
  public typeLookupValues: ILookupItem[] = [];
  public selectedService: ILookupService | null = null;
  public selectedLookuptype: string | null = null;
  public selectedLookuptypeId: any;
  public lookupToToggleStatus: ILookupItem = null;
  public lookupToDelete: ILookupItem = null;
  public isEditMode: boolean = false;
  public selectedLookup: any;
  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');
  setRolesLabel = this.translate.instant('lookups.setRoles');

  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
    {
      item: this.setRolesLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-briefcase',
    },
  ];
  totalItems: number = 0;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private popupser: PopupService,
    private confirmationPopupService: ConfirmModalService,
    private toastSer: ToastrService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.checkForPopupReset();
  }

  private handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.language = this.translate.currentLang;
      this.lookupService = [
        {
          label: this.translate.instant('lookups.ServiceDesk'),
          code: 'ServiceDesk',
          id: LookupServices.ServiceDesk,
        },
        {
          label: this.translate.instant('lookups.UserManagement'),
          code: 'UserManagement',
          id: LookupServices.UserManagement,
        },
        {
          label: this.translate.instant('lookups.Performance'),
          code: 'Performance',
          id: LookupServices.Performance,
        },
        {
          label: this.translate.instant('lookups.EPPM'),
          code: 'EPPM',
          id: LookupServices.EPPM,
        },
        {
          label: this.translate.instant('lookups.committee'),
          code: 'Committee',
          id: LookupServices.Committee,
        },
        {
          label: this.translate.instant('lookups.Innovation'),
          code: 'Innovation',
          id: LookupServices.Innovation,
        }
      ];
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash',
        },
        {
          item: this.setRolesLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-briefcase',
        }
      ];
    });
  }

  private checkForPopupReset() {
    this.popupser.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isShowlookup = false;
      this.isShowlookupType = false;
      this.isEditMode = false;
    })
  }

  private getAllLookups(lookupServiceCode: string) {
    this.isGettingLookupTypes = true;
    this.httpSer
      .get(`${Config.Lookups.lookupService}?ServiceName=${lookupServiceCode}`)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isGettingLookupTypes = false))
      )
      .subscribe((lookups: ILookup[]) => {
        this.allServiceLookups = lookups;
        this.lookupTypes = lookups.map((lookup) => {
          return {
            code: lookup.lookupType,
            id: lookup.lookupResult[0]?.lookupTypeId,
            nameEn: lookup.lookupTypeNameEn,
            nameAr: lookup.lookupTypeNameAr
          };
        });
        this.selectedLookuptype = this.lookupTypes[0]?.code;
        this.selectedLookuptypeId = this.lookupTypes[0]?.id;
        this.changeLookupTypeHandler(this.lookupTypes[0])
      });
  }

  public changeLookupServiceHandler(lookupService: ILookupService) {
    this.selectedLookuptype = null;
    this.typeLookupValues = [];
    if (lookupService) {
      this.getAllLookups(lookupService.code);
    }

    !lookupService && (this.totalItems = 0);
  }

  public changeLookupTypeHandler(lookupType: { code: string; id: number }) {
    const lookup = this.allServiceLookups.find(item => item?.lookupType === lookupType?.code);
    this.selectedLookuptypeId = lookupType?.id;
    this.totalItems = lookup?.lookupResult?.length;

    this.typeLookupValues = StructureLookups(this.allServiceLookups, false)[lookupType?.code];

    if (!lookupType) {
      this.typeLookupValues = [];
      this.totalItems = 0;
    }
  }

  public openConfirmationModel(lookup: ILookupItem) {
    this.lookupToToggleStatus = lookup;
    let statusMsg = lookup.status
      ? this.translate.instant('lookups.deactivateMsg')
      : this.translate.instant('lookups.activateMsg');
    this.confirmMsg = `${statusMsg} "${
      this.language === 'en' ? lookup.nameEn : lookup.nameAr
    }" ${this.language === "en" ? "?" : "؟"}`;
    this.confirmationPopupService.open();
  }

  public onToggleStatusConfirmed() {
    const body = {
      lookupId: this.lookupToToggleStatus?.id,
      status: !this.lookupToToggleStatus.status
    }
    this.httpSer
      .put(
        `${Config.Lookups.changeLookupStatus}`, body
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastSer.success(
            this.translate.instant('lookups.statusChangedSuccess')
          );
          this.lookupToToggleStatus.status = !this.lookupToToggleStatus.status;
        }
      });
  }

  public openDeleteConfirmationPopup(lookup: ILookupItem) {
    this.lookupToDelete = lookup;
    this.delteConfirmMsg = `${this.translate.instant(
      'lookups.deleteConfirmMsg'
    )} "${this.language === 'en' ? lookup.nameEn : lookup.nameAr}" ${this.language === "en" ? "?" : "؟"}`;
    this.confirmationPopupService.open('delete-lookup');
  }

  public onDeleteLookupConfirmed() {
    this.confirmationPopupService.close('delete-lookup');

    this.httpSer
      .post(`${Config.Lookups.deleteLookup}`, {id: this.lookupToDelete?.id})
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastSer.success(this.translate.instant('lookups.deletedSuccessfullyMsg'));
          this.typeLookupValues = this.typeLookupValues.filter(
            (lookup) => lookup?.id !== this.lookupToDelete?.id
          );
          this.allServiceLookups.forEach((lookupType) => {
            lookupType.lookupResult = lookupType.lookupResult.filter((lookup) => lookup?.id !== this.lookupToDelete?.id)
          });
          this.totalItems = this.typeLookupValues?.length;
        }
      });
  }

  public openEditLookupPopup(lookup: ILookupItem) {
    this.isEditMode = true;
    this.isShowlookup = true;
    this.popupser.open("lookup-form", lookup);
  }

  public lookupAddedHandler(lookup: ILookupItem) {
    this.typeLookupValues.push(lookup);
  }

  public lookupEditedHandler(lookup: ILookupItem) {
    let index = this.typeLookupValues.findIndex((lokkupItem) => lokkupItem?.id === lookup?.id);
    if (index > -1) {
      this.typeLookupValues[index] = {
        ...this.typeLookupValues[index],
        ...lookup
      }
    }
  }

  public openLookupPopup() {
    this.isShowlookup = true;
    this.popupser.open('lookup-form');
  }

  onOptionSelect(e, lookup) {
    if (e === this.editLabel) {
      this.openEditLookupPopup(lookup);
    } else if (e === this.deleteLabel) {
      this.openDeleteConfirmationPopup(lookup);
    } else if (e === this.setRolesLabel) {
      this.openSetRolesPopup(lookup);
    }
  }

  openSetRolesPopup(lookup) {
    this.selectedLookup = lookup;
    this.isShowLookupRoles = true;
    this.popupser.open("set-role-lookup-form", lookup);
  }

  lookupSetHandler(data: any) {
    // this.getAllLookups();
  }

  // close create/edit lookup model
  closeLookupFormModel() {
    this.isShowlookup = false;
    this.popupser.close();
  }

  // close lookup roles model
  closeLookupRolesModel() {
    this.isShowLookupRoles = false;
    this.popupser.close();
  }
}
