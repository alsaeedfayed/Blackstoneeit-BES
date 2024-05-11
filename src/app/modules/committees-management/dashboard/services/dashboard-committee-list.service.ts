import { Injectable } from "@angular/core";
import { activeStatuses } from "../enums/committeesDashboard.enum";

@Injectable({
  providedIn: "root",
})
export class DashboardCommitteeListService {
  constructor() {}

  private statuses = [
    { id: 0, name: "Open", nameAr: "مفتوح", className: "active" },
    { id: 1, name: "Closed", nameAr: "مغلق", className: "rejected" },
    { id: 2, name: "Canceled", nameAr: "ملغى", className: "closed" },
  ];

  private activeStatuses = [
    {
      id: activeStatuses.high,
      name: "Highly Active",
      nameAr: "مرتفع النشاط",
      className : 'highActive'
    },
    { id: activeStatuses.low, name: "Low Active", nameAr: "قليل النشاط" , className : 'lowActive' },
    { id: activeStatuses.notActive, name: "Not Active", nameAr: "غير نشيط" , className : 'NotActive'},
  ];

  getStatuses() {
    return this.statuses;
  }

  getActiveStatuses(){
    return this.activeStatuses
  }
}
