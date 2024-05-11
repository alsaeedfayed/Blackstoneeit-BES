import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  private eventToUpdateSource = new BehaviorSubject<any>("");

  constructor(private http: HttpHandlerService) {}

  getEvents(searchModel) {
    return this.http.post(Config.Event.GetAll, searchModel);
  }

  addEvent(event) {
    return this.http.post(Config.Event.Create, event);
  }

  getEventById(id) {
    return this.http.get(`${Config.Event.GetById}/${id}`);
  }

  cancelEvent(id) {
    return this.http.get(`${Config.Event.Cancel}/${id}`);
  }

  rateEvent(data) {
    return this.http.post(Config.Event.Rating, data);
  }

  closeRatingEvent(attendeeCode) {
    return this.http.post(`${Config.Event.CloseRating}?attendeeCode=${attendeeCode}`);
  }

  deleteEvent(id) {
    return this.http.delete(`${Config.Event.Delete}/${id}`);
  }

  deleteAttendee(attendeeId) {
    return this.http.delete(`${Config.Event.DeleteAttendee}/${attendeeId}`);
  }
}
