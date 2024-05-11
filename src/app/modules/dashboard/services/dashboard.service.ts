import { Injectable } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  advancedFilterData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sectorId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  departmentId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  year: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private http: HttpHandlerService) {}

  getManagers() {
    return this.http.get(Config.UserManagement.GetAll);
  }

  getExternalLookups() {
    return this.http.get(Config.Lookups.getExternalLookups);
  }

  getDepartmentsBySectorId(sectorId) {
    return this.http.get(
      Config.Lookups.getDepartments + '?sectorId=' + sectorId
    );
  }

  getPriorityLevels() {
    return this.http.get(Config.Lookups.getPriorityLevels);
  }

  getProjectsStatistics(data) {
    return this.http.post(Config.Dashboard.GetProjectsStatistics, data);
  }

  getBudgetStatistics(data) {
    return this.http.post(Config.Dashboard.GetBudgetStatistics, data);
  }

  getProjectManagers(data) {
    return this.http.post(Config.Dashboard.GetProjectManagers, data);
  }

  getSectorsData(data) {
    return this.http.post(Config.Dashboard.GetSectorsData, data);
  }

  getDepartments(data) {
    return this.http.post(Config.Dashboard.GetDepartments, data);
  }

  getSectors() {
    return this.http.get(Config.Dashboard.GetSectors);
  }

  getPriorities(data) {
    return this.http.post(Config.Dashboard.GetPriorities, data);
  }

  getCategories(data) {
    return this.http.post(Config.Dashboard.GetCategories, data);
  }

  getOrigins(data) {
    return this.http.post(Config.Dashboard.GetOrigins, data);
  }

  getDeliverables(data) {
    return this.http.post(Config.Dashboard.GetDeliverables, data);
  }

  getHighRisks(searchModel, filterModel) {
    return this.http.post(Config.Dashboard.GetHighRisks, {
      filter: filterModel,
      searchModel: searchModel,
    });
  }

  getDetails(searchModel, filterModel, status) {
    return this.http.post(Config.Dashboard.GetDetails, {
      filter: filterModel,
      searchModel: searchModel,
      status: status,
    });
  }

  getTotalBudgetAndSpent(data) {
    return this.http.post(Config.Dashboard.GetTotalBudgetAndSpent, data);
  }

  getProjectStatus() {
    return this.http.get(Config.Lookups.getProjectStatus);
  }
}
