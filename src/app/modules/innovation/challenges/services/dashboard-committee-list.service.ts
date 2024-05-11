import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardCommitteeListService {

  constructor() { }

  private statuses = [
    { id: 0, name: 'Open', nameAr: 'مفتوح', className: 'active' },
    { id: 1, name: 'Closed', nameAr: 'مغلق', className: 'rejected' },
    { id: 2, name: 'Canceled', nameAr: 'ملغى', className: 'closed' },
  ];

  getStatuses() {
    return this.statuses;
  }
}
