import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { environment } from 'src/environments/environment';
import { Config } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  refresh: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) {}

  getStatusofRequest(serviceRequestId: number) {}
}
