import { Injectable } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {

  constructor(private http: HttpHandlerService) { }

  getEventById(id) {
    return this.http.get(`${Config.Event.GetById}/${id}`);
  }


  register(application) {
    return this.http.post(Config.Event.Registration, application);
  }

}
