import { Injectable } from '@angular/core';
import { MeasurementRecurrences } from '../../models/MeasurementRecurrences';

@Injectable({
  providedIn: 'root'
})
export class MeasurementRecurrenceService {

  private measurementRecurrences: MeasurementRecurrences[] = [
    { id: 0, title: { en: 'Monthly', ar: 'شهري' }, isActive: false, className: 'todoTask' },
    { id: 1, title: { en: 'Quarterly', ar: 'ربع سنوي' }, isActive: false, className: 'todoTask' },
    { id: 2, title: { en: 'Bi yearly', ar: 'نصف سنوي' }, isActive: false, className: 'todoTask' },
    { id: 3, title: { en: 'Yearly', ar: 'سنوي' }, isActive: false, className: 'todoTask' },
    { id: 4, title: { en: 'Date', ar: 'تاريخ محدد' }, isActive: false, className: 'todoTask' },
  ];

  private measurementTypes = [
    {id : 0 , title : {en : "" , ar : ""}},
    {id : 1 , title : {en : "Number" , ar : "رقم"}},
    {id : 2 , title : {en : "Percent" , ar : "نسبة"}},
    {id : 3 , title : {en : "Currency" , ar : "عملة"}},
  ]
  //   Monthly = 0,
  // Quarterly = 1,
  // BiYearly = 2,
  // Yearly = 3,
  // Date = 4
  constructor() { }

  getMeasures() {
    return this.measurementRecurrences;
  }

  getMeasureTypes () {
    return this.measurementTypes
  }
}
