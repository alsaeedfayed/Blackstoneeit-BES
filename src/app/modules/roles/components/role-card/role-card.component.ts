import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { RolesService } from '../../roles-service/roles.service';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
})
export class RoleCardComponent implements OnInit, OnChanges {
  @Input() role;
  @Output() viewPermissions: EventEmitter<any> = new EventEmitter<any>();

  updateLabel = this.translate.instant('shared.update');
  setPermissionsLabel = this.translate.instant('roles.setPermissions');
  deleteLabel = this.translate.instant('shared.delete');

  cardActions: any = [
    {
      item: this.updateLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-edit',
    },
    {
      item: this.setPermissionsLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-check-shield',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];
  lang: string = this.translate.currentLang;
  numberOfPermissions: number = 0;

  constructor(
    private rolesService: RolesService,
    private popupService: PopupService,
    private confirmationPopupService: ConfirmModalService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.updateLabel = this.translate.instant('shared.update');
      this.setPermissionsLabel = this.translate.instant('roles.setPermissions');
      this.deleteLabel = this.translate.instant('shared.delete');
      this.cardActions = [
        {
          item: this.updateLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-edit',
        },
        {
          item: this.setPermissionsLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-check-shield',
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash',
        },
      ];
    });
  }

  ngOnChanges(): void {
    if (this.role?.id) {
      this.role.structuredPermissions.forEach((group) => {
        this.numberOfPermissions += group.children?.length;
      });
    }
  }

  onOptionClick(e, role) {
    this.rolesService.saveSelectedRole(role);

    if (e === this.updateLabel) {
      this.popupService.open('role');
      this.rolesService.savePopupMode('create-role');
    }

    if (e === this.deleteLabel) {
      this.confirmationPopupService.open();
    }

    if (e === this.setPermissionsLabel) {
      this.popupService.open('role');
      this.rolesService.savePopupMode('set-permissions');
    }
  }

  onViewPermissions(role) {
    this.viewPermissions.emit(role);
  }
}
