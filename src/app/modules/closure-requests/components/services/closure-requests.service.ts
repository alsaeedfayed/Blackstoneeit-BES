import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment'
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class ClosureRequestsService {
  private closureRequestSource = new BehaviorSubject<any>(null)
  closureRequest = this.closureRequestSource.asObservable()

  private popupConfigSource = new BehaviorSubject<any>(null)
  popupConfig = this.popupConfigSource.asObservable()

  private displayLoadingModalSource = new BehaviorSubject<any>(false)
  displayLoadingModal = this.displayLoadingModalSource.asObservable();
  constructor(private http: HttpHandlerService, private httpClient: HttpClient, private userService: UserService) { }



  getClosureRequests(searchModel, filterModel) {
    return this.http.post("/Eppm/api/Project/Closure/Search", { searchModel, filterModel })
  }
  getClosureRequest(requestId) {
    return this.http.get(`/Eppm/api/Project/Closure/Get/${requestId}`)
  }
  getActions(requestType, projectId) {
    return this.http.get(`/Eppm/api/Project/Request/Task/Get/${requestType}/${projectId}`)
  }
  uploadActionAttachment(requestId, actionId, file) {
    return this.http.post("/Eppm/api/Project/Request/Action/Attachment/Add", { requestId, actionId, attachmentModel: file })
  }
  actionPerform(actionConfig) {
    return this.http.post("/Eppm/api/Workflow/Action/Perform", actionConfig)
  }
  forceAction(actionConfig) {
    return this.http.post("/Eppm/api/Workflow/Action/Force/Perform", actionConfig)
  }
  reassignAction(actionConfig) {
    return this.http.post("/Eppm/api/Workflow/Task/Reassign", actionConfig)
  }
  cancelReassign(actionConfig) {
    return this.http.post("/Eppm/api/Workflow/Task/Reassign/Cancel", actionConfig)
  }

  saveChangeRequest(request) {
    this.closureRequestSource.next(request)
  }

  saveLoadingModalState(state) {
    this.displayLoadingModalSource.next(state)
  }

  savePopupConfig(config) {
    this.popupConfigSource.next(config)
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

  onUploadAttachment(file) {
    const headerDict = {
      "Authorization": 'Bearer ' + this.userService.getToken().token,
      'License-Key' :licenceKey.valid
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const formData = new FormData();
    formData.append("file", file, file.name);

    return this.httpClient.post(environment.serverUrl + "/FileService/api/Attachment/Upload", formData, requestOptions)
  }

  getInstanceStates(instanceId) {
    return this.http.get(`/Eppm/api/Workflow/Instance/States/${instanceId}`)
  }

  getUserById(userId) {
    return this.http.get("/UserManagement/api/User/GetById", { userId })
  }

  getProjectById(projectId) {
    return this.http.get(`/Eppm/api/Project/Get/${projectId}`)
  }

  searchProjects(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }

    return this.http.post('/Eppm/api/Project/Search', { searchModel, filterModel: {} }).pipe(
      map(response => {
        return response.data
      }),
    );
  }

  getRequestStates() {
    return this.http.get('/Eppm/api/Lookup/Project/Request/States')

  }

}
