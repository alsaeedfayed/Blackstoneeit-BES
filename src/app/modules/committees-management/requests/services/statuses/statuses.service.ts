import { Injectable } from '@angular/core';
import { RequestStatus } from '../../../enums/enums';

@Injectable({
  providedIn: 'root'
})
export class StatusesService {

  requestStatus = RequestStatus;
  statuses = [
    { id: RequestStatus.Draft, name: 'Draft', nameAr: 'مسودة', className: 'inProgress' },
    { id: RequestStatus.Pending, name: 'Pending', nameAr: 'معلق', className: 'closed' },
    { id: RequestStatus.Rejected, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
    { id: RequestStatus.Completed, name: 'Completed', nameAr: 'مكتمل', className: 'active' },
    { id: RequestStatus.Canceled, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },
    { id: RequestStatus.Returned, name: 'Returned', nameAr: 'مرجع', className: 'started' },
  ];



  constructor() { }


  getStatuses() {
    return this.statuses;
  }

}
