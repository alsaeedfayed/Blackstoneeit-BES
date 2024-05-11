import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeetingStatusService {

  constructor() { }
  // meeting status 
  private statuses = [
    { id: 0, name: 'Draft', nameAr: 'مسودة', className: 'draft' },
    { id: 1, name: 'Not Due yet', nameAr: 'منشور', className: 'notDueYet' },
    { id: 2, name: 'Pending MOM', nameAr: 'بانتظار نقاط الاجتماع ', className: 'pendingMom' },
    { id: 3, name: 'Under Review', nameAr: 'تحت المراجعة', className: 'momReviewed' },
    { id: 4, name: 'Completed', nameAr: 'منتهي', className: 'complete' },
    { id: 5, name: 'returned', nameAr: 'معاد', className: 'started' },
    // { id: 6, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
    // { id: 7, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },

  ];


  getStatuses() {
    return this.statuses;
  }
}
