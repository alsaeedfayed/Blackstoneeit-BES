import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.scss']
})
export class WorkloadComponent implements OnInit {


  //TODO VARIABLES
  @Input() language: string;
  @Input() colsData!: { userField: any, field1: string, field2: string, header: string, headerAr: string }[] //table headers
  @Input() workLoadData: any[] // table data arr

  constructor() { }

  ngOnInit(): void {
    // TODO remove it after fix the user card
    this.workLoadData.map((data) => {
      data.basicInfo && (data.basicInfo = { ...data.basicInfo, fullArabicName: data.basicInfo.fullName })
      data.employee && (data.employee = { ...data.employee, fullArabicName: data.employee.fullName })
    });
  }

}
