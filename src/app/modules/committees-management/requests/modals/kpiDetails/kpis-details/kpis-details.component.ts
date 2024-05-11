import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeasurementRecurrences } from '../../../models/MeasurementRecurrences';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ModifyRequestsService } from 'src/app/modules/committees-management/change-requests/services/modify-requests.service';
import { MeasurementRecurrenceService } from '../../../services/measurementRecurrence/measurement-recurrence.service';
import { MeasurementTypeService } from '../../../services/measurementType/measurement-type.service';

@Component({
  selector: 'app-kpis-details',
  templateUrl: './kpis-details.component.html',
  styleUrls: ['./kpis-details.component.scss']
})
export class KpisDetailsComponent implements  OnInit {

  //TODO VARIABLES
  changedTypes : any
  @Input() changedDataKpis : any [] = []
  @Input() kpiDetails : any
  @Input() language : string
  @Input() isAddedKpi : boolean =false
  @Output() closeKpisModal : EventEmitter<any> = new EventEmitter()
  attatchments : any[]
  MeasurementRecurrences: MeasurementRecurrences[];
  measurementTypes: any[] = [];


  constructor(private modalService : ModelService, private measurmentRecurrenceService: MeasurementRecurrenceService, private measurementTypeService: MeasurementTypeService,
    private modifyRequests : ModifyRequestsService) {
      this.changedTypes = this.modifyRequests.getChangedTypes()

    }

  ngOnInit(): void {
    this.measurementTypes = this.measurementTypeService.getMeasures();

    this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();

   // console.log('kpi details' , this.kpiDetails)
    if (this.kpiDetails?.attachments) {
      this.attatchments = this.kpiDetails?.attachments?.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));
    }

  }

  closePopup(){
    this.modalService.close()
    this.closeKpisModal.emit()
  }
}
