import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpHandlerService,) { }

  getRequests(searchModel, filterModel) {
    return this.http.post("/Eppm/api/Project/Request/Search", { searchModel, filterModel })
  }

  getRequestById(projectId) {
    return this.http.get(`/Eppm/api/Project/Request/Get/${projectId}`)
  }
  getActions(requestType, projectId) {
    return this.http.get(`/Eppm/api/Workflow/Task/Get/${projectId}`)
  }
  searchUsers(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }

    return this.http.get('/UserManagement/api/User/GetAll', searchModel).pipe(
      map(response => {
        return response.data
      }),
    );
  }
  searchSectors(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }

    return this.http.post('/Eppm/api/Organization/Sector/Search', searchModel).pipe(
      map(response => {
        return response.data
      }),
    );
  }

  getVisions(searchModel) {
    return this.http.post("/Eppm/api/Strategy/Vision/Search", searchModel)
  }

  getInitiatives(searchModel) {
    return this.http.post("/Eppm/api/Strategy/Initiative/Search", searchModel)
  }

  getLookups() {
    return this.http.get('/Eppm/api/Lookup/Project/ExternalLookups')
  }



  getSectors() {
    return this.http.get("/Eppm/api/Lookup/Project/GetSectors")
  }
  getDepartments() {
    return this.http.get("/Eppm/api/Lookup/Project/GetDepartments")
  }
  getPriorities() {
    return this.http.get("/Eppm/api/Lookup/Project/PriorityLevels")
  }

  getAreas(searchModel) {
    return this.http.post("/Eppm/api/Organization/Area/Search", searchModel)
  }


  getInstanceStates(instanceId) {
    return this.http.get(`/Eppm/api/Workflow/Instance/States/${instanceId}`)
  }






}
