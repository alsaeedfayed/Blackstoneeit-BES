import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

interface IPopupConfig {
  text: String;
  confirmationBtnText: string;
  data: any;
  onConfirmEvent: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  confirmationPopupConfig$ = new BehaviorSubject<IPopupConfig | null>(null)
  constructor(private http: HttpHandlerService) { }


  // Set confirmation popup config 
  setPopupConfig(config: IPopupConfig){
    this.confirmationPopupConfig$.next(config)
  }

  // get confirmation popup config 
  get getPopupConfig(){
    return this.confirmationPopupConfig$.asObservable()
  }
  

  getProcesses(config) {
    return this.http.post(Config.Process.GetAll, config)
  }

  addProcess(process) {
    return this.http.post(Config.Process.Add, process)
  }

  editProcess(process) {
    return this.http.put(Config.Process.Update, process)
  }

  getProcessById(processId) {
    return this.http.get(`${Config.Process.Get}/${processId}`)
  }
  
  deleteProcess(processId) {
    return this.http.put(`${Config.Process.Delete}/${processId}`)
  }

  toggleEnable(processId) {
    return this.http.put(`${Config.Process.ToggleEnable}/${processId}`)
  }
  
  validateProcessName(process) {
    return this.http.post(Config.Process.ValidateTitle, process)
  }

  addState(state) {
    return this.http.post('/State/Add', state)
  }

  editState(state) {
    return this.http.put('/State/Update', state)
  }

  deleteState(stateId) {
    return this.http.delete('/WorkflowEngine/api/State/Delete/' + stateId)
  }

  validateStateName(state, processId) {
    return this.http.post('/State/Validate/' + processId, state)
  }

  addTransition(transition) {
    return this.http.post('/Transition/Add', transition)
  }

  editTransition(transition) {
    return this.http.put('/Transition/Update', transition)
  }

  deleteTransition(id) {
    return this.http.delete('/WorkflowEngine/api/Transition/Delete/' + id)
  }

  validateTransitionName(transition, processId) {
    return this.http.post('/Transition/Validate/' + processId, transition)
  }


  searchUsers(config) {
    if (config.keyword === '') {
      return of([]);
    }
    return this.http.post('/User/Search', config).pipe(
      map(response => response.data)
    );
  }

  searchRoles(config) {
    if (config.keyword === '') {
      return of([]);
    }
    return this.http.post('/Role/Search', config).pipe(
      map(response => response.data)
    );
  }



}