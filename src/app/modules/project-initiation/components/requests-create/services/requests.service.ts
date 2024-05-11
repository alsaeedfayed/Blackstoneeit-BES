import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class RequestsCreateService {

  private requestLookupsSource = new BehaviorSubject<any>(null)
  requestLookups = this.requestLookupsSource.asObservable();

  private stepperStateSource = new BehaviorSubject<any>(null)
  stepperState = this.stepperStateSource.asObservable();


  private forceActionStepsSource = new BehaviorSubject<any>(null)
  forceActionSteps = this.forceActionStepsSource.asObservable();

  private loadingModalStateSource = new BehaviorSubject<any>(null)
  loadingModalState = this.loadingModalStateSource.asObservable();

  constructor(private http: HttpHandlerService, private httpClient: HttpClient, private userService: UserService) { }

  getRequestById(projectId) {
    return this.http.get(`/Eppm/api/Project/Request/Get/${projectId}`)
  }


  getInstanceStates(instanceId) {
    return this.http.get(`/Eppm/api/Workflow/Instance/States/${instanceId}`)
  }

  searchApprovedIdeas(searchModel) {
    if (searchModel.term === '') {
      return of([]);
    }
    return this.http.post('/Eppm/api/Project/Idea/Approved/Search', searchModel).pipe(
      map(response => {
        return response.data
      }),
    );
  }

  submitPriority(data) {
    return this.http.post("/Eppm/api/Project/Priority/Submit", data)
  }

  getProjectComments(projectId) {
    return this.http.get(`/Eppm/api/Comment/${projectId}`)
  }

  toogleCommentLike(commentId) {
    return this.http.post(`/Eppm/api/Comment/Like/${commentId}`)
  }

  createComment(config) {
    return this.http.post("/Eppm/api/Comment/Add", config)
  }

  createRequest(request) {
    return this.http.post("/Eppm/api/Project/Register", request)
  }

  createMilestone(milestone) {
    return this.http.post("/Eppm/api/Milestone/Add", milestone)
  }

  deleteMilestone(id) {
    return this.http.delete(`/Eppm/api/Milestone/Delete/${id}`)
  }

  getUsers(searchModel) {
    return this.http.get("/UserManagement/api/User/GetAll", searchModel)
  }

  saveRequestLookups(lookups) {
    this.requestLookupsSource.next(lookups)
  }

  saveForceActionSteps(steps) {
    this.forceActionStepsSource.next(steps)
  }

  saveLoadingModalState(state) {
    this.loadingModalStateSource.next(state)
  }

  saveStepperState(formKey, state) {
    const formsStates = {
      overviewForm: this.stepperStateSource.getValue()?.overviewForm ? this.stepperStateSource.getValue().overviewForm : false,
      strategicImpactForm: this.stepperStateSource.getValue()?.strategicImpactForm ? this.stepperStateSource.getValue().strategicImpactForm : false,
      organizationForm: this.stepperStateSource.getValue()?.organizationForm ? this.stepperStateSource.getValue().organizationForm : false,
      planningForm: this.stepperStateSource.getValue()?.planningForm ? this.stepperStateSource.getValue().planningForm : false,
    }
    formsStates[formKey] = state
    this.stepperStateSource.next(formsStates)
  }

  resetStepperState() {
    this.stepperStateSource.next(null)
  }
  resetLoadingModalState() {
    this.loadingModalStateSource.next(null)
  }

  actionPerform(actionConfig) {
    return this.http.post("/Eppm/api/Workflow/Action/Perform", actionConfig)
  }

  uploadActionAttachment(requestId, actionId, file) {
    return this.http.post("/Eppm/api/Project/Request/Action/Attachment/Add", { requestId, actionId, attachmentModel: file })
  }

  getMilestonesTemplates(searchModel, filterModel) {
    return this.http.post("/Eppm/api/Project/Templates/Search", { searchModel, projectDateCost: filterModel })
  }

  onUploadAttachment(file) {
    const headerDict = {
      "Authorization": 'Bearer ' + this.userService.getToken().token,
      'License-Key': licenceKey.valid
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const formData = new FormData();
    formData.append("file", file, file.name);

    return this.httpClient.post(environment.serverUrl + "/FileService/api/Attachment/Upload", formData, requestOptions)
  }

  addAttachment(body) {
    return this.http.post("/Eppm/api/Project/Attachment/Add", body)
  }

  forceAction(body) {
    return this.http.post("/Eppm/api/Workflow/Action/Force/Perform", body)
  }
  reassignAction(body) {
    return this.http.post("/Eppm/api/Workflow/Task/Reassign", body)
  }
  cancelReassign(body) {
    return this.http.post("/Eppm/api/Workflow/Task/Reassign/Cancel", body)
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

  cloneRequest(requestId) {
    return this.http.post(`/Eppm/api/Project/Request/Clone/${requestId}`)
  }
  //Task: edit hardcoded groupId
  getStrategicKpis(goalIds) {
    return this.http.post(`/Performance/api/Goal/CurrentYearGoals`, { goalIds })
  }
  getStrategicKpisList(goalIds) {
    return this.http.post(`/Performance/api/Goal/CurrentYearGoals/List`, { goalIds })
  }

  getSectors() {
    return this.http.get('/Eppm/api/Lookup/Project/GetSectors')
  }
  getDepartments(sectorId) {
    return this.http.get(`/Eppm/api/Lookup/Project/GetDepartments`, { sectorId })
  }
  getAreas(departmentId) {
    return this.http.get('/Eppm/api/Lookup/Project/GetAreas', { departmentId })
  }

  getOverviewLookups() {
    return this.http.get('/Eppm/api/Lookup/Project/ExternalLookups')
  }

  getDeliveryTypes() {
    return this.http.get('/Eppm/api/Lookup/Project/DeliveryTypes');
  }

  deleteDraft(requestId) {
    return this.http.delete('/Eppm/api/Project/Request/Delete/' + requestId);
  }

}
