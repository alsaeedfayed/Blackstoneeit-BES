import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ServicesStatus } from 'src/app/core/models/services-status';
import { Permissions } from 'src/app/core/services/permissions';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'src/app/core/modules/permissions/service/permissions.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() services: any = [];
  sortedServices: any = [];
  @Input() paginationModle: any = {
    pageIndex: 1,
    pageSize: 10,
  };
  // Variable to track the current sorting state: 'normal', 'sorted', 'reversed'
  @Input() searchQuery;
  currentSortOrder: string = 'normal';
  creationDateSortOrder: string = 'normal';

  @Output() pagination: EventEmitter<any> = new EventEmitter();
  @Output() sortFilter = new EventEmitter();

  language: string = this.translate.currentLang;
  servicesStatusEnum = ServicesStatus;
  loading: boolean = false;
  editLabel = this.translate.instant('shared.edit');
  moveLabel = this.translate.instant('shared.move');
  deleteLabel = this.translate.instant('shared.remove');

  allowToEdit: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.edit
  );
  allowToMove: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.move
  );
  allowToDelete: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.delete
  );

  actions = [
    {
      item: this.editLabel,
      disabled: !this.allowToEdit,
      textColor: '',
      icon: 'bx bx-edit',
    },
    {
      item: this.moveLabel,
      disabled: !this.allowToMove,
      textColor: '',
      icon: 'bx bx-move',
    },
    {
      item: this.deleteLabel,
      disabled: !this.allowToDelete,
      textColor: '',
      icon: 'bx bx-trash',
    },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.restFilters();
    this.sortedServices = this.services;
  }



  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.editLabel = this.translate.instant('shared.edit');
      this.moveLabel = this.translate.instant('shared.move');
      this.deleteLabel = this.translate.instant('shared.remove');
      this.actions = [
        {
          item: this.editLabel,
          disabled: !this.allowToEdit,
          textColor: '',
          icon: 'bx bx-edit',
        },
        {
          item: this.moveLabel,
          disabled: !this.allowToMove,
          textColor: '',
          icon: 'bx bx-move',
        },
        {
          item: this.deleteLabel,
          disabled: !this.allowToDelete,
          textColor: '',
          icon: 'bx bx-trash',
        },
      ];
    });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;
  }

  onClickDetails(id: string) {
    this.router.navigate([`e-services/details/${id}`]);
  }


  // rest sort direction to curent sort direction
  restFilters() {
    if (
      this.searchQuery.sortKey == 'Name' ||
      this.searchQuery.sortKey == 'ArabicName' ||
      this.searchQuery.sortKey == null
    )
      this.currentSortOrder =
        this.searchQuery.sortDirection == null
          ? 'normal'
          : this.searchQuery.sortDirection == 1
          ? 'sorted'
          : 'reversed';
    if (
      this.searchQuery.sortKey == 'CreationDate' ||
      this.searchQuery.sortKey == null
    )
      this.creationDateSortOrder =
        this.searchQuery.sortDirection == null
          ? 'normal'
          : this.searchQuery.sortDirection == 1
          ? 'sorted'
          : 'reversed';
  }

  // handle  emiting values to parent to call new data
  onSort() {
    switch (this.currentSortOrder) {
      case 'normal':
        // Sort in ascending order by default
        // this.currentSortOrder = 'sorted';
        this.sortFilter.emit({
          sortKey: this.language == 'en' ? 'Name' : 'ArabicName',
          sortDirection: 1,
        });
        break;
      case 'sorted':
        // Sort in descending order
        // this.currentSortOrder = 'reversed';
        this.sortFilter.emit({
          sortKey: this.language == 'en' ? 'Name' : 'ArabicName',
          sortDirection: 2,
        });
        break;
      case 'reversed':
        // Revert to the original order (normal)
        // this.currentSortOrder = 'normal';
        this.sortFilter.emit({ sortKey: null, sortDirection: null });
        break;
      default:
        break;
    }
  }

    // handle  emiting values to parent to call new data

  onCreationDateSort() {
    switch (this.creationDateSortOrder) {
      case 'normal':
        // Sort in ascending order by default
        // this.creationDateSortOrder = 'sorted';
        this.sortFilter.emit({ sortKey: 'CreationDate', sortDirection: 1 });
        break;
      case 'sorted':
        // Sort in descending order
        // this.creationDateSortOrder = 'reversed';
        this.sortFilter.emit({ sortKey: 'CreationDate', sortDirection: 2 });
        break;
      case 'reversed':
        // Revert to the original order (normal)
        // this.creationDateSortOrder = 'normal';
        this.sortFilter.emit({ sortKey: null, sortDirection: null });
        break;
      default:
        break;
    }
  }

  onActionSelect(e, service) {
    if (service.canSubmit) {
      if (e === this.editLabel) {
        this.router.navigate([
          `e-services/requests/edit-e-service/${service.id}`,
        ]);
      } else if (e === this.moveLabel) {
        this.router.navigate([
          `e-services/requests/move-e-service/${service.id}`,
        ]);
      } else if (e === this.deleteLabel) {
        this.router.navigate([
          `e-services/requests/delete-e-service/${service.id}`,
        ]);
      } else {
        return;
      }
    } else {
      this.toastr.error(this.translate.instant('EServices.errorPending'));
    }
  }
}
