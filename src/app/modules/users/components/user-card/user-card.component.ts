import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { UsersService } from '../../users-service/users.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() viewGroupsAndRoles: EventEmitter<any> = new EventEmitter<any>();

  updateLabel = this.translateService.instant('shared.update');
  setRolesLabel = this.translateService.instant('users.setRoles');
  activateLabel = this.translateService.instant('users.activate');
  deactivateLabel = this.translateService.instant('users.deactivate');

  cardActions: any = [
    {
      item: this.updateLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-edit'
    },
    {
      item: this.setRolesLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-check-shield'
    },
  ]
  lang: string = this.translateService.currentLang;

  constructor(private translateService: TranslateService,
    private usersService: UsersService,
    private popupService: PopupService,
    private confirmationPopupService: ConfirmModalService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.data.active ? this.cardActions.push({
        item: this.deactivateLabel,
        disabled: false,
        textColor: '',
        icon: 'bx bx-user-x'
      }) : this.cardActions.push({
        item: this.activateLabel,
        disabled: false,
        textColor: '',
        icon: 'bx bx-user-plus'
      })
    }
  }

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.updateLabel = this.translateService.instant('shared.update');
      this.setRolesLabel = this.translateService.instant('users.setRoles');
      this.activateLabel = this.translateService.instant('users.activate');
      this.deactivateLabel = this.translateService.instant('users.deactivate');

      this.cardActions = [
        {
          item: this.updateLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-edit'
        },
        {
          item: this.setRolesLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-check-shield'
        },
      ];

      if (this.data.active) {
        this.cardActions.push({
          item: this.deactivateLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-user-x'
        });
      } else {
        this.cardActions.push({
          item: this.activateLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-user-plus'
        });
      }
    });
  }

  onOptionClick(e, user) {
    this.usersService.saveSelectedUser(user)
    if (e === this.updateLabel) {
      this.popupService.open("users")
      this.usersService.savePopupMode("create-user")
    }
    if (e === this.activateLabel) {
      this.confirmationPopupService.open()
    }
    if (e === this.deactivateLabel) {
      this.confirmationPopupService.open()
    }

    if (e === this.setRolesLabel) {
      this.popupService.open("users")
      this.usersService.savePopupMode("set-roles")
    }
  }

  onViewGroupsAndRoles(user) {
    this.viewGroupsAndRoles.emit(user);
  }
}
