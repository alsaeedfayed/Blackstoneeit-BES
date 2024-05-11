import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RolesService } from '../../roles-service/roles.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss']
})
export class RolesTableComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  List = [];

  @Input() set list (list) {
    this.List = list;
    this.addActionOptions(this.List);
  };
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() viewPermissions: EventEmitter<any> = new EventEmitter<any>();
  @Output() onConfirmation: EventEmitter<any> = new EventEmitter<any>();

  updateLabel = this.translate.instant('shared.update');
  setPermissionsLabel = this.translate.instant('roles.setPermissions');
  deleteLabel = this.translate.instant('shared.delete');

  // cardActions: any = [];

  constructor(
    private translate: TranslateService,
    private rolesService: RolesService,
    private popupService: PopupService,
    private confirmationPopupService: ConfirmModalService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;

        this.updateLabel = this.translate.instant('shared.update');
        this.setPermissionsLabel = this.translate.instant('roles.setPermissions');
        this.deleteLabel = this.translate.instant('shared.delete');
        this.addActionOptions(this.List);

        // this.cardActions = [
        //   {
        //     item: this.updateLabel,
        //     disabled: false,
        //     textColor: '',
        //     icon: 'bx bx-edit',
        //   },
        //   {
        //     item: this.setPermissionsLabel,
        //     disabled: false,
        //     textColor: '',
        //     icon: 'bx bx-check-shield',
        //   },
        //   {
        //     item: this.deleteLabel,
        //     disabled: false,
        //     textColor: '',
        //     icon: 'bx bx-trash',
        //   },
        // ];
      });
  }

  addActionOptions(items) {
    items.forEach(item => {
      if(item && item.fixed) {
        item.cardActions = [
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
        ];
      }
      else {
        item.cardActions = [
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
      }
    });
  }

  onOptionClick(e, role) {
    this.rolesService.saveSelectedRole(role);

    if (e === this.updateLabel) {
      this.popupService.open('role');
      this.rolesService.savePopupMode('create-role');
    }

    if (e === this.deleteLabel) {
      this.onConfirmation.emit(role);
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