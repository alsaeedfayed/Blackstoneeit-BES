import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class IdeasService {
  private modalConfigSource = new BehaviorSubject<any>(null)
  modalConfigModal = this.modalConfigSource.asObservable();
  constructor(private http: HttpHandlerService) { }


  getIdeas(searchModel) {
    return this.http.post("/Eppm/api/Project/Idea/Search", searchModel)
  }

  registerIdea(idea) {
    return this.http.post("/Eppm/api/Project/Idea/Register", idea)
  }

  saveModalConfig(config) {
    this.modalConfigSource.next(config)
  }

}
