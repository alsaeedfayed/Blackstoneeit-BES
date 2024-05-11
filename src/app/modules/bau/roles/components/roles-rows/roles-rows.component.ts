import { Subject } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { sortDirections } from 'src/app/modules/bau/enums/enums';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, finalize } from 'rxjs/operators';
import { Role } from '../../models/Role';
import { RoleSortBy } from '../../../enums/enums';
import { Permissions } from 'src/app/core/services/permissions';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-roles-rows',
  templateUrl: './roles-rows.component.html',
  styleUrls: ['./roles-rows.component.scss']
})
export class RolesRowsComponent implements OnInit {


  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  // action permissions
  editRolePermission = Permissions.BAU.Roles.edit;
  deleteRolePermission = Permissions.BAU.Roles.delete;

  sortKey = RoleSortBy;
  public sortedCol: RoleSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  @Input() public set SortedCol(val: RoleSortBy | null) {
    this.sortedCol = val;
  }
  @Input() public set SortDirection(val: sortDirections | null) {
    this.sortDirection = val;
  }
  @Input() list: Role[] = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() sortFilter = new EventEmitter();
  @Output() onPaginateEvent = new EventEmitter();

  @Output() onChange = new EventEmitter();



  deletedRoleId: number = null;
  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,
    private modelService: ModelService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // add an action flag 
    this.list = this.list.map((role) => ({ ...role, isTackingAction: false }));
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // sort requests items by column
  sort(col: RoleSortBy) {

    if (this.sortedCol === col) {
      if (this.sortDirection === sortDirections.Asc) {
        this.sortDirection = sortDirections.Desc;
      } else {
        this.sortDirection = sortDirections.Asc;
      }
    } else {
      this.sortDirection = sortDirections.Asc
    }

    this.sortedCol = col;
    this.sortFilter.emit({
      orderType: this.sortDirection,
      orderBy: this.sortedCol,
    });
  }

  public get ascMode(): boolean {
    return this.sortDirection === sortDirections.Asc;
  }

  public get descMode(): boolean {
    return this.sortDirection === sortDirections.Desc;
  }

  // confirm the deletion of the role
  deleteRoleConfirmation(id: number) {
    this.confirmationPopupService.open('delete-role');
    this.deletedRoleId = id;
  }

  // delete role confirmed
  deleteRole() {
    this.confirmationPopupService.close('delete-role');

    // start loader icon
    this.list.find(role => role.id === this.deletedRoleId).isTackingAction = true;

    this.httpSer
      .delete(`${Config.BAU.Roles.delete}/${this.deletedRoleId}`)
      .pipe(finalize(() => { this.list.find(role => role.id === this.deletedRoleId).isTackingAction = false; }))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('bau.roles.deleteSuccessMsg'));

          this.onChange.emit();
        }
      });
  }
  isUpdateModalOpen: boolean = false;
  roleOpened: Role = null;
  // open update role model
  openUpdateRoleModel(role: Role) {
    this.modelService.open('update-role');
    this.isUpdateModalOpen = true;
    this.roleOpened = role;
  }

  closeModal() {
    this.modelService.close();
    this.isUpdateModalOpen = false;
    this.roleOpened = null;
    this.onChange.emit();
  }
}
