import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  sortState = new Subject<string>();

  private selectedRoleSource = new BehaviorSubject<any>('');
  selectedRole = this.selectedRoleSource.asObservable();

  private popupModeSource = new BehaviorSubject<any>('');
  popupMode = this.popupModeSource.asObservable();

  constructor(private http: HttpHandlerService) { }

  getRoles(model) {
    return this.http.get('/UserManagement/api/Role/GetAll', model)
  }

  createRole(role) {
    return this.http.post('/UserManagement/api/Role/Create', role);
  }

  updateRole(role) {
    return this.http.post('/UserManagement/api/Role/Update', role);
  }

  getPermissionsList() {
    return this.http.get('/UserManagement/api/Permissions/GetAll')
  }

  setRolePermissions(permissions) {
    return this.http.post('/UserManagement/api/Role/SetRolePermissions', permissions);

  }

  saveSelectedRole(role) {
    this.selectedRoleSource.next(role)
  }

  savePopupMode(mode) {
    this.popupModeSource.next(mode)
  }

  deleteRole(id) {
    return this.http.post('/UserManagement/api/Role/Delete/', {}, { roleId: id });
  }

  getClaimsList() {
    return this.http.get('/Claim/List');
  }

  validateName(name) {
    return this.http.post('/Role/Validate/Name', { name });
  }

  getRoleMembers(id) {
    return this.http.get(`/User/GetUsersInRole/${id}`);
  }

}