import { Injectable } from '@angular/core';
import { KPI } from '../../models/KPI';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  private kPIs: KPI[] = [];

  constructor() { }
  // get all KPIs
  getKPIs(): KPI[] {
    return this.kPIs;
  }
  // set the kPIs
  setKPis(kpis: KPI[] = []) {
    this.kPIs = kpis;
  }
  // get KPI data
  getKPIByName(name: string): KPI {
    return this.kPIs.find(kpi => kpi.name === name);
  }

  //delete KPI
  deleteKPIByName(name: string): boolean {
    let index = this.kPIs.findIndex(k => k.name === name);
    if (index >= 0) {
      this.kPIs.splice(index, 1);
      return true;
    } else
      return false;
  }

  // update KPIs
  updateKPI(kpi: KPI, index: number): boolean {
    if (this.isDuplicated(kpi.name, kpi.nameAr, index)) {
      return false;
    } else {
      this.kPIs.splice(index, 1, kpi);
      return true;
    }
  }
  // add new KPI
  AddKPI(kpi: KPI): boolean {
    if (this.isDuplicated(kpi.name, kpi.nameAr)) {
      return false;
    } else {
      this.kPIs.push(kpi);
      return true;
    }
  }

  isDuplicated(name: string, nameAr: string, index: number = -1): boolean {

    for (let i = 0; i < this.kPIs.length; i++) {
      let kpi = this.kPIs[i];
      if (i != index && (kpi.name == name || kpi.nameAr == nameAr))
        return true;
    }
    return false;
  }

  getKPIIndex(name: string): number {
    let index = this.kPIs.findIndex(kpi => kpi.name === name);
    return index;
  }
}
