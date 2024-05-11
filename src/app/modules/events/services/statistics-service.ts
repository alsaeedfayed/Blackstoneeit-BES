import { Injectable } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpHandlerService) { }

  getStatistics(eventId: string) {
    return this.http.get(`${Config.Event.Statistics}/${eventId}`);
  }
}
