import { Injectable } from '@angular/core';
import { DecisionSendHistory } from '../models/DecisionSendHistory';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommitteeDecisionService {

  private _sharingHistory: DecisionSendHistory[] = null;
  private _votingHistory: any[] = null;

  decisionSent$: Subject<any> = new Subject();

  private _votingOptions = [
    { id: 0, icon: "bx bx-meh ", title: { en: "Not Voted Yet", ar: "لم يصوت بعد" }, status: { en: "Not Voted", ar: "لم يصوت" }, color: "secondary" },
    { id: 1, icon: "bx bx-like", title: { en: "I vote yes", ar: "أُصوت بنعم" }, status: { en: "Yes", ar: "نعم" }, color: "success"},
    { id: 2, icon: "bx bx-like bx-rotate-180", title: { en: "I vote no", ar: "أُصوت بلا" }, status: { en: "No", ar: "لا" }, color: "danger" },
    { id: 3, icon: "bx bx-meh ", title: { en: "I abstain", ar: "أمتنع" }, status: { en: "Abstain", ar: "إمتناع" }, color: "secondary" }

  ]
  private _votingResults = [
    { id: 0, title: { en: "Yes", ar: "نعم" }, votersCount: 35, voterPercentage: 70, color: "success" },
    { id: 1, title: { en: "No", ar: "لا" }, votersCount: 5, voterPercentage: 10, color: "danger" },
    { id: 2, title: { en: "Abstain", ar: "أمتنع" }, votersCount: 10, voterPercentage: 20, color: "secondary" },
  ];

  private decisionsStatus = [
    { id: 0, name: 'Draft', nameAr: 'مسودة', className: 'closed' },
    { id: 4, name: 'Voting In Progress', nameAr: 'تصويت جارى تنفيذه', className: 'inProgress' },
    { id: 7, name: 'Confirmed', nameAr: 'تم تاكيده', className: 'active' }
  ];

   //   { id: 0, name: 'Open', nameAr: 'مفتوح', className: 'closed' },
  //   { id: 1, name: 'Pending', nameAr: 'معلق', className: 'pendingMom' },
  //   { id: 2, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
  //   { id: 3, name: 'Completed', nameAr: 'منتهي', className: 'active' },
  //   { id: 4, name: 'In Progress', nameAr: 'جارى تنفيذه', className: 'inProgress' },
  //   { id: 5, name: 'returned', nameAr: 'معاد', className: 'started' },
  //   { id: 5, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },


  private decisionsStatuses = [
    { id: 0, name: 'Draft', nameAr: 'مسودة', className: 'closed' },
    {id: '', name: '', nameAr: '', className: ''},
    {id: '', name: '', nameAr: '', className: ''},
    {id: '', name: '', nameAr: '', className: ''},
    { id: 4, name: 'Voting In Progress', nameAr: ' تصويت جارى تنفيذه', className: 'inProgress' },
    {id: '', name: '', nameAr: '', className: ''},
    {id: '', name: '', nameAr: '', className: ''},
    { id: 7, name: 'Confirmed', nameAr: 'تم تاكيده', className: 'active' }
  ];
  constructor() { }

  get votingResults() {
    return this._votingResults;
  }
  get votingOptions() {
    return this._votingOptions;
  }

  get sharingHistory() {
    return this._sharingHistory;
  }
  set sharingHistory(history: DecisionSendHistory[]) {
    this._sharingHistory = history;
  }
  get votingHistory() {
    return this._votingHistory;
  }
  set votingHistory(voting: any[]) {
    this._votingHistory = voting;
  }

  getDecisionStatuses(){
    return this.decisionsStatus;
  }

  getAllDecisionStatuses(){
    return this.decisionsStatuses
  }
}
