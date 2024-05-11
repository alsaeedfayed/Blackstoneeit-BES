import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private statuses = [
    { id: 0, name: 'Open', nameAr: 'مفتوح', className: 'active' },
    { id: 1, name: 'Closed', nameAr: 'مغلق', className: 'rejected' },
    { id: 2, name: 'Canceled', nameAr: 'ملغى', className: 'closed' },
  ];

  isUpdating : BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor() { }

  getStatuses() {
    return this.statuses;
  }
}
