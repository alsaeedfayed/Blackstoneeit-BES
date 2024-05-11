import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UsersService} from '../../users-service/users.service';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';
import {TableData} from "../../../../shared/ag-grid-table/ag-table.component";
import {AgUserWidgetComponent} from "../ag-components/ag-user-widget.component";
import {AgGroupLinkComponent} from "../ag-group-link/ag-group-link.component";
import {AgRolesLinkComponent} from "../ag-roles-link/ag-roles-link.component";
import {AgStatusComponent} from "../ag-status/ag-status.component";
import {AgActionsComponent} from "../ag-actions/ag-actions.component";
import {ITextFilterParams} from "ag-grid-community";

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  public data: TableData;
  @Output() viewGroupsAndRoles: EventEmitter<any> = new EventEmitter<any>();

  updateLabel = this.translate.instant('shared.update');
  setRolesLabel = this.translate.instant('users.setRoles');

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
  ];
  public context: any;

  constructor(
    private translate: TranslateService,
    private usersService: UsersService,
    private popupService: PopupService,
    private confirmationPopupService: ConfirmModalService,
  ) {
    this.context = {componentParent: this};
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
    });
  }

  setTableData() {
    var agGroup: ITextFilterParams = {
      filterOptions: ['contains', 'notContains'],
      textFormatter: (r) => {
        if (r == null) return null;
        return r
          .toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/æ/g, 'ae')
          .replace(/ç/g, 'c')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/ñ/g, 'n')
          .replace(/[òóôõö]/g, 'o')
          .replace(/œ/g, 'oe')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ýÿ]/g, 'y');
      },
      debounceMs: 200,
      maxNumConditions: 1,
    };
    this.data = {
      columns: [
        {
          field: "fullName",
          headerName: this.translate.instant('users.name'),
          cellRenderer: AgUserWidgetComponent,
          width: 350,
          filter: 'agTextColumnFilter',
          floatingFilter: true
        },
        {
          field: "email", headerName: this.translate.instant('users.email'), width: 300, filter: 'agTextColumnFilter',
          floatingFilter: true
        },
        {
          field: "phoneNumber",
          headerName: this.translate.instant('users.mobile'),
          filter: 'agTextColumnFilter',
          floatingFilter: true
        },
        {
          field: "usersGroups.name",
          headerName: this.translate.instant('users.groups'),
          cellRenderer: AgGroupLinkComponent,
        },
        {
          field: "Roles",
          headerName: this.translate.instant('users.roles'),
          cellRenderer: AgRolesLinkComponent,
        },
        {field: "Active", headerName: this.translate.instant('users.active'), cellRenderer: AgStatusComponent},
        {field: "Actions", headerName: this.translate.instant('shared.actions'), cellRenderer: AgActionsComponent}
      ],
      rows: this.list,
      options: {
        rowCount: 50,
        alwaysMultiSort: true,
        pagination: true,
        paginationPageSize: 50,
        embedFullWidthRows: true,
        paginationAutoPageSize: true,
        rowSelection: 'multiple',
        rowDeselection: true,
        suppressRowClickSelection: true,
        checkboxSelection: true,
        rowMultiSelectWithClick: true
      },
    };
    this.data.rows = this.list
  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.setTableData()
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;

        this.updateLabel = this.translate.instant('shared.update');
        this.setRolesLabel = this.translate.instant('users.setRoles');

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
      });
  }

  onOptionClick(e, user) {
    this.usersService.saveSelectedUser(user);

    if (e === this.updateLabel) {
      this.popupService.open("users");
      this.usersService.savePopupMode("create-user");
    }

    if (e === this.setRolesLabel) {
      this.popupService.open("users");
      this.usersService.savePopupMode("set-roles");
    }
  }

  onViewGroupsAndRoles(user) {
    this.viewGroupsAndRoles.emit(user);
  }

  confirmToggleActiveState(user) {
    this.usersService.saveSelectedUser(user);
    this.confirmationPopupService.open();
  }

}
