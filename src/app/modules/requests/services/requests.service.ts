import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  refresh: BehaviorSubject<any> = new BehaviorSubject<any>('');


  constructor(private http: HttpClient) {}

  getStatusofRequest(serviceRequestId: number) {}
}
