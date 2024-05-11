import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../users-service/users.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
// import * as AOS from 'aos';
import { Subscription } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends ComponentBase implements OnInit, OnDestroy {
  searchQuery: string;
  lang: string;
  loadingModalFlag: boolean;
  loading: boolean;
  
  isListView: boolean = true;

  modalTitle: any;
  users: any;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  totalUsers: any;
  private subscriptions = new Subscription();
  roles: any;
  groups: any;
  user;
  keyword: any = '';
  selectedUser;

  isGroupsAndRolesModelOpened: boolean = false;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private popupService: PopupService
  ) {
    super(translateService, translate);
   // AOS.init();
  }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.getUsers();
    this.getRoles();
    this.getGroups();
    this.usersService.selectedUser.subscribe((user) => {
      this.selectedUser = user;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeViewMode(mode){
    this.isListView = mode === 'list' ? true : false;
  }

  getGroups() {
    // const userId = this.userService.getCurrentUserId();
    this.subscriptions.add(
      this.usersService.getGroups().subscribe((res) => {
        this.groups = res;
      })
    );
  }

  getRoles() {
    this.subscriptions.add(
      this.usersService.getRoles(1, 1000).subscribe((res) => {
        this.roles = res.data;
      })
    );
  }

  getUsers() {
    this.loading = true;
    this.users = [];
    this.totalUsers = 0;

    const query = {
      ...this.paginationModel,
      fullName: this.keyword,
    };

    this.subscriptions.add(
      this.usersService
        .getUsers(query)
        .subscribe((res) => {
          this.totalUsers = res.count;
          this.users = res.data;

          this.loading = false;
        })
    );
  }

  refreshList() {
    this.paginationModel = {
      pageIndex: 1,
      pageSize: 30,
    };
    this.getUsers();
  }

  onPaginate(e) {
    this.paginationModel.pageIndex = e;
    this.getUsers();
  }

  onSearch(keyword: string) {
    this.keyword = keyword.toLowerCase();
    this.paginationModel.pageIndex = 1;

    this.getUsers();
  }

  getMatch(user, key: string) {
    return user[key].toLowerCase();
  }

  onAddUser() {
    this.modalTitle = this.translate.instant('users.addNewUser');
    this.popupService.open('users');
    this.usersService.savePopupMode('create-user');
  }

  onConfirmationModalConfirm($event) {
    if (this.selectedUser.active) {
      this.onDeactivateUser(this.selectedUser?.id);
    } else {
      this.onActivateUser(this.selectedUser?.id);
    }
  }

  onActivateUser(id) {
    this.usersService.onActivateUser(id).subscribe((res) => {
      this.toastr.success(
        this.translate.instant('users.userWasSuccessfullyActivated')
      );
      this.paginationModel.pageIndex = 1;
      this.getUsers();
    });
  }

  onDeactivateUser(id) {
    this.usersService.onDeactivateUser(id).subscribe((res) => {
      this.toastr.success(
        this.translate.instant('users.userWasSuccessfullyDeactivated')
      );
      this.paginationModel.pageIndex = 1;
      this.getUsers();
    });
  }

  viewGroupsAndRoles(user) {
    this.isGroupsAndRolesModelOpened = true;
    this.popupService.open('view-groups-roles');
    this.user = user;
  }

  // close groups/roles model
  closeGroupsAndRolesModel() {
    this.isGroupsAndRolesModelOpened = false;
    this.popupService.close();
  }
}
