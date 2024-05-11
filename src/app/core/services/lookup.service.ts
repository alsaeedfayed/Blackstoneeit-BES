import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from './http-handler.service';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  constructor(private http: HttpHandlerService) { }



  getCriterias() {
    return this.http.get('/Eppm/api/Project/Priority/Criterias');
  }

  getSetting(settingKey) {
    return this.http.get(`/WorkflowEngine/api/Settings/GetValue/${settingKey}`);
  }

  getSectors() {
    return this.http.get('/Eppm/api/Organization/Sector/GetAll');
  }
  getRequestsStates() {
    return this.http.get('/Eppm/api/Lookup/Project/Request/States');
  }
  getRequestChangeTypes() {
    return this.http.get('/Eppm/api/Lookup/Project/ChangeRequest/Type');
  }
  getLikelihoods() {
    return this.http.get('/Eppm/api/Lookup/Risk/Likelihoods');
  }

  getImpacts() {
    return this.http.get('/Eppm/api/Lookup/Risk/Impacts');
  }

  getProjectsStatus() {
    return this.http.get('/Eppm/api/Lookup/Project/Status');
  }

  getProjectsTypes() {
    return this.http.get('/Eppm/api/Lookup/Project/Types');
  }

}
