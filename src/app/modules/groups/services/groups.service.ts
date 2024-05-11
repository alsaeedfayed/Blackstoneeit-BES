import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private popupConfigSource = new BehaviorSubject<any>('');
  popupConfig = this.popupConfigSource.asObservable();
  private selectedGroupSource = new BehaviorSubject<any>('');
  selectedGroup = this.selectedGroupSource.asObservable();

  onSelectOption: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpHandlerService) { }

  savePopupConfig(config) {
    this.popupConfigSource.next(config)
  }
  
  saveSelectedGroup(group) {
    this.selectedGroupSource.next(group)
  }

  createGroup(group) {
    return this.http.post("/UserManagement/api/Groups/Create", group)
  }

  updateGroup(group) {
    return this.http.put("/UserManagement/api/Groups/Update", group)
  }

  getAllGroups(query) {
    return this.http.get(Config.Groups.GetPagedGroups, query)
  }

  onDeleteGroup(groupId) {
    return this.http.post("/UserManagement/api/Groups/Delete", {}, { groupId })
  }

  getGroups() {
    return this.http.get(Config.Groups.GetGroups)
  }
}
