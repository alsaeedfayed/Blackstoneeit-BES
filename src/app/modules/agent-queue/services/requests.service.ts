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
    return this.http.post("/Project/Request/Search", { searchModel, filterModel })
  }

  getRequestById(projectId) {
    return this.http.get(`/Project/Request/Get/${projectId}`)
  }
  getActions(requestType, projectId) {
    return this.http.get(`/Project/Request/Task/Get/${requestType}/${projectId}`)
  }
  searchUsers(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }

    return this.http.post('/Account/Search', searchModel).pipe(
      map(response => {
        return response.data
      }),
    );
  }
  searchSectors(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }

    return this.http.post('/Organization/Sector/Search', searchModel).pipe(
      map(response => {
        return response.data
      }),
    );
  }

  getVisions(searchModel) {
    return this.http.post("/Strategy/Vision/Search", searchModel)
  }

  getInitiatives(searchModel) {
    return this.http.post("/Strategy/Initiative/Search", searchModel)
  }

  getStrategicKpis() {
    return this.http.post("/Strategy/Perspective/List")
  }

  getSectors(searchModel) {
    return this.http.post("/Organization/Sector/Search", searchModel)
  }

  getAreas(searchModel) {
    return this.http.post("/Organization/Area/Search", searchModel)
  }

  getDepartments(searchModel) {
    return this.http.post("/Organization/Department/Search", searchModel)
  }


}
