import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  sortState = new Subject<string>();

  private selectedUserSource = new BehaviorSubject<any>(null);
  selectedUser = this.selectedUserSource.asObservable();

  private popupModeSource = new BehaviorSubject<any>(null);
  popupMode = this.popupModeSource.asObservable();

  constructor(private http: HttpHandlerService) {}

  getRoles(pageIndex, pageSize) {
    return this.http.get('/UserManagement/api/Role/GetAll', {
      pageIndex,
      pageSize,
    });
  }

  getGroups() {
    return this.http.get(Config.Groups.GetGroups)
  }

  // getGroups(userId) {
  //   return this.http.get(Config.Groups.Get + '?userId=' + userId);
  // }

  getUsers(model) {
    return this.http.get(Config.UserManagement.GetAll, model);
  }

  onActivateUser(id) {
    return this.http.post(`/UserManagement/api/User/Activate/${id}`);
  }
  onDeactivateUser(id) {
    return this.http.post(`/UserManagement/api/User/Deactivate/${id}`);
  }
  onSetUserRole(roles) {
    return this.http.post(`/UserManagement/api/User/SetUserRoles`, roles);
  }

  saveSelectedUser(user) {
    this.selectedUserSource.next(user);
  }

  createUser(User) {
    return this.http.post('/UserManagement/api/User/Create', User);
  }

  updateUser(User) {
    return this.http.put('/UserManagement/api/User/Update', User);
  }

  savePopupMode(mode) {
    this.popupModeSource.next(mode);
  }

  //activate user
  Activate(id) {
    return this.http.put(`/Account/Activate/${id}`);
  }

  //deActivate user
  Deactivate(id) {
    return this.http.delete(`/Account/Deactivate/${id}`);
  }

  getRolesList(
    page: number,
    pageSize: number,
    keyword: string,
    sortBy: string
  ) {
    return this.http.post('/Role/Search', { page, pageSize, keyword, sortBy });
  }

  validateEmail(userName) {
    return this.http.post('/User/Validate/Email', { userName });
  }

  sendOTP(email) {
    return this.http.post(`/User/ForgotPassword`, email);
  }

  resetPassword(data) {
    return this.http.post(`/Account/ResetPassword`, data);
  }
}
