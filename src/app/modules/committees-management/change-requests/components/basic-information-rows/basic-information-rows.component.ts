import { Component, Input, OnInit } from '@angular/core';
import { basicInformationItem } from '../../models/modify-request-details.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-basic-information-rows',
  templateUrl: './basic-information-rows.component.html',
  styleUrls: ['./basic-information-rows.component.scss']
})
export class BasicInformationRowsComponent implements OnInit {

  //TODO VARIABLES
  @Input() basicInfoList: any[]
  @Input() lang: string;
  @Input() title: string;
  @Input() noDataMsg: string

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    // let fieldIndex = this.basicInfoList?.findIndex(f => f.fieldName == "CommitteeType");

    //   (fieldIndex >= 0) && (this.basicInfoList[fieldIndex].fieldName = "Committee Category");
  }



}
