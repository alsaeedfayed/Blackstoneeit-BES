import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeasurementRecurrences } from 'src/app/modules/committees-management/requests/models/MeasurementRecurrences';
import { MeasurementRecurrenceService } from 'src/app/modules/committees-management/requests/services/measurementRecurrence/measurement-recurrence.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ModifyRequestsService } from '../../../services/modify-requests.service';

@Component({
  selector: 'app-changed-kpis-modal',
  templateUrl: './changed-kpis-modal.component.html',
  styleUrls: ['./changed-kpis-modal.component.scss']
})
export class ChangedKpisModalComponent implements OnInit {

  //TODO VARIABLES
  changedTypes : any
  @Input() changedDataKpis : any [] = []
  @Input() kpiDetails : any
  @Input() language : string
  @Input() isAddedKpi : boolean =false
  @Output() closeKpisModal : EventEmitter<any> = new EventEmitter()
  attatchments : any[]
  MeasurementRecurrences: MeasurementRecurrences[];

  constructor(private modalService : ModelService, private measurmentRecurrenceService: MeasurementRecurrenceService,
    private modifyRequests : ModifyRequestsService) {
      this.changedTypes = this.modifyRequests.getChangedTypes()

    }

  ngOnInit(): void {
    this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();

    if (this.kpiDetails?.changedAttatchments) {
      this.attatchments = this.kpiDetails?.changedAttatchments?.map(a => (
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
