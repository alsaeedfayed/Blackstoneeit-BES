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
export class ProjectsService {
  private popupConfigSource = new BehaviorSubject<any>({})
  popupConfig = this.popupConfigSource.asObservable();

  private confirmationPopupConfigSource = new BehaviorSubject<any>({})
  confirmationPopupConfig = this.confirmationPopupConfigSource.asObservable();

  private displayLoadingModalSource = new BehaviorSubject<any>(false)
  displayLoadingModal = this.displayLoadingModalSource.asObservable();

  private milestoneSource = new BehaviorSubject<any>(false)
  milestone = this.milestoneSource.asObservable();

  private deletedDeliverablesSource = new BehaviorSubject<any>(false)
  deletedDeliverables = this.deletedDeliverablesSource.asObservable();

  constructor(private http: HttpHandlerService, private httpClient: HttpClient, private userService: UserService) { }

  getChangeRequestTypes() {
    return this.http.get('/Eppm/api/Lookup/ChangeRequest/Types')
  }
  getChangeRequestOptions() {
    return this.http.get('/Eppm/api/Lookup/ChangeRequest/Options')
  }

  getCostStats(projectId) {
    return this.http.get(`/Eppm/api/Invoice/CostStatistics/${projectId}`)
  }

  createInvoice(invoice) {
    return this.http.post("/Eppm/api/Invoice/Add", invoice)
  }

  deleteInvoice(invoiceId) {
    return this.http.delete(`/Eppm/api/Invoice/Delete/${invoiceId}`)
  }

  getInvoices(searchModel, filterModel, projectId) {
    return this.http.post(`/Eppm/api/Invoice/Search/${projectId}`, { searchModel, filterModel })
  }

  rejectDeliverable(config) {
    return this.http.post("/Eppm/api/Milestone/Deliverable/Reject", config)
  }
  acceptDeliverable(config) {
    return this.http.post("/Eppm/api/Milestone/Deliverable/Accept", config)
  }
  submitDeliverable(config) {
    return this.http.post("/Eppm/api/Milestone/Deliverable/Submit", config)
  }
  reopenDeliverable(deliverableId) {
    return this.http.post('/Eppm/api/Milestone/Deliverable/Open/', null, { deliverableId })
  }

  uploadDeliverableActionDocument(actionId, file) {
    return this.http.post(`/Eppm/api/Milestone/Deliverable/Action/Attachment/${actionId}`, file)
  }

  closeProject(closureData) {
    return this.http.post("/Eppm/api/Project/Close", closureData)
  }

  addChangeRequest(changeRequest) {
    return this.http.post("/Eppm/api/Project/ChangeRequest/Add", changeRequest)
  }

  getDeliverablesStats(projectId) {
    return this.http.get(`/Eppm/api/Milestone/Deliverable/Statistics/${projectId}`)
  }

  getProjectsDeliverables(projectId, searchModel, filterModel) {
    return this.http.post(`/Eppm/api/Milestone/Deliverable/Search/${projectId}`, { searchModel, filterModel })
  }

  getProjectChangeRequests(projectId) {
    return this.http.get(`/Eppm/api/ChangeRequest/GetAll/${projectId}`)
  }

  getProjects(searchModel, filterModel) {
    return this.http.post("/Eppm/api/Project/Search", { searchModel, filterModel })
  }

  getProjectById(projectId) {
    return this.http.get(`/Eppm/api/Project/Get/${projectId}`)
  }

  addTask(task) {
    return this.http.post("/Eppm/api/Milestone/Task/Add", task)
  }

  uploadTaskFile(file, taskId) {
    return this.http.post(`/Eppm/api/Milestone/Task/Attachment/Add/${taskId}`, file)
  }


  savepopupConfig(config) {
    this.popupConfigSource.next(config)
  }

  saveConfirmationPopupConfig(config) {
    this.confirmationPopupConfigSource.next(config)
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

  completeMilestone(milestoneDeliverableEvidences) {
    return this.http.post("/Eppm/api/Milestone/Complete", milestoneDeliverableEvidences)
  }

  uploadEvidenceDocument(file, deliverableId) {
    return this.http.post(`/Eppm/api/Milestone/Deliverable/Attachment/Add/${deliverableId}`, file)
  }

  uploadChangeRequestFile(file, requestId) {
    return this.http.post(`/Eppm/api/Project/ChangeRequest/Attachment/Add/${requestId}`, file)
  }

  addRisk(risk) {
    return this.http.post("/Eppm/api/Project/Risk/Add", risk)
  }
  uploadRiskFile(file, riskId) {
    return this.http.post(`/Eppm/api/Project/Risk/Attachment/Add/${riskId}`, file)
  }
  deleteRisk(id) {
    return this.http.delete(`/Eppm/api/Project/Risk/Delete/${id}`)
  }
  deleteTask(id) {
    return this.http.delete(`/Eppm/api/Milestone/Task/Delete/${id}`)
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


  saveLoadingModalState(state) {
    this.displayLoadingModalSource.next(state)
  }

  deleteDocument(attachmentId) {
    return this.http.delete(`/Eppm/api/Project/Attachment/Delete/${attachmentId}`)
  }


  getLookups() {
    return this.http.get('/Eppm/api/Lookup/Project/ExternalLookups')
  }

  getSectors() {
    return this.http.get("/Eppm/api/Lookup/Project/GetSectors")
  }
  getDepartments(sectorId?) {
    return this.http.get("/Eppm/api/Lookup/Project/GetDepartments", { sectorId })
  }
  getPriorities() {
    return this.http.get("/Eppm/api/Lookup/Project/PriorityLevels")
  }
  registerChangeRequest(changeRequest) {
    return this.http.post("/Eppm/api/ChangeRequest/Register", changeRequest)
  }

  onJustifyCrToggle(requestId) {
    return this.http.put(`/Eppm/api/ChangeRequest/Justified/Toggle/${requestId}`)
  }


  getClosureQuestions() {
    return this.http.get("/Eppm/api/Project/Closure/ClosureQuestions")
  }
  getClosureRequests(projectId) {
    return this.http.get(`/Eppm/api/Project/Closure/GetAll/${projectId}`)
  }
  getClosureStatus() {
    return this.http.get(`/Eppm/api/Lookup/Project/Closure/Status`)
  }

  submitCloserQuestions(closureRequest) {
    return this.http.post("/Eppm/api/Project/Closure/Register", closureRequest)
  }


  saveProjectSetting(projectId, delegatedManagerId) {
    return this.http.put(`/Eppm/api/Project/Settings/${projectId}`, { delegatedManagerId })
  }

  saveMilestone(milestone) {
    this.milestoneSource.next(milestone)
  }
  saveDeletedDeliverables(deliverables) {
    this.deletedDeliverablesSource.next(deliverables)
  }

  updateProgress(data) {
    return this.http.post("/Eppm/api/Milestone/Task/Progress/Update", data)
  }
}
