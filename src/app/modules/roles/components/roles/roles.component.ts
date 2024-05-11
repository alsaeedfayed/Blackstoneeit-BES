import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/core/services/translate.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { RolesService } from '../../roles-service/roles.service';
// import * as AOS from 'aos';
import { Subscription } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent extends ComponentBase implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 6;
  searchQuery: any = '';
  sortBy: string;
  loading: boolean;
  isPaginationLoading: boolean;
  roles;
  title;
  language;
  isListView: boolean = true;

  keyword: any = '';
  totalRoles: any;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  private subscriptions = new Subscription();
  permissions: any;
  role;
  
  constructor(
    private rolesService: RolesService,
    private translationService: TranslationService,
    private popupService: PopupService,
    private toastr: ToastrService,
    translateService: TranslateConfigService,
    translate: TranslateService
  ) {
    super(translateService, translate);
    // AOS.init();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.getRoles();
    this.getPermission();
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
    })
  }

  changeViewMode(mode){
    this.isListView = mode === 'list' ? true : false;
  }

  getPermission() {
    this.subscriptions.add(
      this.rolesService.getPermissionsList().subscribe((res) => {
        this.permissions = res;
      })
    );
  }

  // get roles
  getRoles() {
    this.loading = true;
    this.roles = [];
    this.totalRoles = 0;

    const query = {
      ...this.paginationModel,
      roleName: this.keyword,
    };

    this.subscriptions.add(
      this.rolesService
        .getRoles(query)
        .subscribe((res) => {
          this.loading = false;
          this.totalRoles = res.count;
          this.roles = res.data;
        })
    );
  }

  // get selected role
  getSelectedRole(role) {
    this.role = role;
  }

  // see more
  onPaginate(e) {
    this.paginationModel.pageIndex = e;
    this.getRoles();
  }

  onSearch(keyword: string) {
    this.keyword = keyword.toLowerCase();
    this.paginationModel.pageIndex = 1;

    this.getRoles();
  }

  // refresh list
  refreshList() {
    this.paginationModel = {
      pageIndex: 1,
      pageSize: 30,
    };

    this.getRoles();
  }

  // on add
  onAddRole() {
    this.title = this.translate.instant('roles.addNewRole');
    this.popupService.open('role');
    this.rolesService.savePopupMode('create-role');
  }

  onConfirmationModalConfirm(e) {
    this.subscriptions.add(
      this.rolesService.selectedRole.subscribe((role) => {
        this.deleteRole(role.id);
      })
    );
  }

  // delete role
  deleteRole(id) {
    this.rolesService.deleteRole(id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('roles.roleWasSuccessfullyDeleted'));
        this.refreshList();
      },
      (err) => {
        if (err.message.startsWith('{"message":')) {
          const json = err.message.replace(/(\w+):(\w+)/g, `"$1":"$2"`);
          this.toastr.error(JSON.parse(json).message);
        } else {
          this.toastr.error(err.message);
        }
      }
    );
  }

  viewPermissions(role) {
    this.popupService.open('view-permissions');
    this.role = role;
  }
}
