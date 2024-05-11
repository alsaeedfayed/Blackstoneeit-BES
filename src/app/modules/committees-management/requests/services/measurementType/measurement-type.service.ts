import { Injectable } from '@angular/core';
import { MeasurementType } from '../../models/MeasurementType';

@Injectable({
  providedIn: 'root'
})
export class MeasurementTypeService {

  constructor() { }

  private measurementTypes: MeasurementType[] = [
    { id: 1, title: { en: 'Number', ar: 'رقم ' }, isActive: false, prefix: { en: '#', ar: ' #' } },
    { id: 2, title: { en: 'Percentage', ar: 'نسبة مئوية' }, isActive: false, prefix: { en: '%', ar: '%' } },
    { id: 3, title: { en: 'Currency', ar: ' عملة' }, isActive: false, prefix: { en: 'AED', ar: ' (الدرهم الإماراتي)' } }

  ];

  // Number = 1,
  // Percentage = 2,
  // AED = 3
  getMeasures() {
    return this.measurementTypes;
  }
}
