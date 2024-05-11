import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskEnumsDataService {

  constructor() { }

  private taskStatuses: any[] = [
    { id: 0, name: 'Not Started', nameAr: 'لم تبدأ بعد', className: 'cancelled' },
    { id: 1, name: 'In Progress', nameAr: 'قيد التنفيذ', className: 'mediumLevel' },
    { id: 2, name: 'Closed', nameAr: 'مغلقة  ', className: 'doneTask' },
    { id: 3, name: 'Canceled', nameAr: 'ملغية', className: 'highLevel' },
  ];

  private taskPriorities: any[] = [
    { id: 0, name: '--', nameAr: '--', className: 'lowLevel' },
    { id: 1, name: 'Low', nameAr: 'منخفضة', className: 'lowLevel' },
    { id: 2, name: 'Medium', nameAr: 'متوسطة', className: 'mediumLevel' },
    { id: 3, name: 'High', nameAr: 'عالية', className: 'highLevel' },
  ];

  private taskTrackStatuses: any[] = [

    { id: 0, name: '', nameAr: '', className: 'mediumLevel' },
    { id: 1, name: 'On Track', nameAr: 'وفق الخطة', className: 'doneTask' },
    { id: 2, name: 'Off Track', nameAr: ' متأخرة', className: 'highLevel' },

  ];
  getTaskStatuses() {
    return this.taskStatuses;
  }
  getTasksPriorities() {
    return this.taskPriorities;
  }
  getTaskTrackStatus() {
    return this.taskTrackStatuses;
  }

}
