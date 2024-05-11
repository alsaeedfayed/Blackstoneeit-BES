import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainTaskStatusService {

  constructor() { }

  private mainTaskTrackStatuses: any[] = [

    { id: 0, name: '', nameAr: '', className: 'mediumLevel' },
    { id: 1, name: 'Opened', nameAr: 'مفتوحة', className: 'mediumLevel' },
    { id: 2, name: 'Closed', nameAr: 'مغلقة', className: 'highLevel' },

  ];
  private taskPriorities: any[] = [
    { id: 0, name: '--', nameAr: '--', className: 'lowLevel' },
    { id: 1, name: 'Low', nameAr: 'منخفضة', className: 'lowLevel' },
    { id: 2, name: 'Medium', nameAr: 'متوسطة', className: 'mediumLevel' },
    { id: 3, name: 'High', nameAr: 'عالية', className: 'highLevel' },
  ];
  getMainTasksPriorities() {
    return this.taskPriorities;
  }
  getMainTasksTrackStatus() {
    return this.mainTaskTrackStatuses;
  }
}
