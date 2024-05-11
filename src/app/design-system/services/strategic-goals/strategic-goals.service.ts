import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StrategicGoalsService {
  private _selectedGoalsIds: number[] = [];
  public changeHappened$ = new Subject();
  public totalWeight: number = 0;
  
  private _measurementMethods: any[] = [
    { id: 1, title: { en: 'Percentage', ar: 'نسبة مئوية' }, isActive: false, prefix: { en: '%', ar: '%' } },
    { id: 2, title: { en: 'Number', ar: 'رقم ' }, isActive: false, prefix: { en: '#', ar: ' #' } },
    { id: 3, title: { en: '', ar: ' ' }, isActive: false, prefix: { en: '', ar: ' ' } },
    { id: 4, title: { en: 'Currency', ar: ' عملة' }, isActive: false, prefix: { en: 'AED', ar: ' (الدرهم الإماراتي)' } },
    { id: 5, title: { en: '', ar: ' ' }, isActive: false, prefix: { en: '', ar: ' ' } },
  ];
  get measurementMethods() {
    return this._measurementMethods;
  }
  get selectedGoalsIds() {
    return this._selectedGoalsIds;
  }
  set selectedGoalsIds(goalsIds: number[]) {
    this._selectedGoalsIds = goalsIds;
  }

  constructor() { }
}
