import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BauDashboardService {
  public  Filters$ = new Subject<boolean>();
  constructor() { }

  private taskStatuses: any[] = [
    { id: 0, name: 'Not Started', nameAr: 'لم تبدأ بعد', className: 'todoTask' },
    { id: 1, name: 'In Progress', nameAr: 'قيد التنفيذ', className: 'inProgressTask' },
    { id: 2, name: 'Done', nameAr: 'مكتملة  ', className: 'doneTask' },
    { id: 3, name: 'On Hold', nameAr: 'قيد الإنتظار', className: 'underReviewTask' },
  ];
  private taskPriorities: any[] = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];
  getTaskStatuses() {
    return this.taskStatuses;
  }
  getTasksPriorities() {
    return this.taskPriorities;
  }



}
