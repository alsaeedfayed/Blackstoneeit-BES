import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeasurementRecurrences } from '../../models/MeasurementRecurrences';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { MeasurementRecurrenceService } from '../../services/measurementRecurrence/measurement-recurrence.service';
import { ModifyRequestsService } from '../../../change-requests/services/modify-requests.service';
import { MainTask } from '../../models/MainTask';

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrls: ['./tasks-details.component.scss']
})
export class TasksDetailsComponent implements OnInit {

  //TODO VARIABLES
  changedTypes: any
  @Input() changedDataTasks: any[] = []
  @Input() language: string
  @Input() taskDetails: MainTask = {} as MainTask;
  @Input() isAddedTask: boolean = false
  @Output() closeTasksDetailsModal: EventEmitter<any> = new EventEmitter()

  uploadedFiles: any = [];
  attachments: any[] = null;
  oldAttachments: any = [];
  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];

  constructor(
    private modalService: ModelService,
    private modifyRequests: ModifyRequestsService
  ) {
    this.changedTypes = this.modifyRequests.getChangedTypes()
  }

  ngOnInit(): void {
    // console.log(this.taskDetails)
    if (this.taskDetails.attachments) {
      this.oldAttachments = this.taskDetails.attachments?.map(a => (
        {
          name: a.uploadedFileName,
          extension: a.extension,
          fileName: a.fileName,
          uploadedFileName: a.uploadedFileName
        }
      ));
    }
  }

  closePopup() {
    this.modalService.close()
    this.closeTasksDetailsModal.emit()
  }

}
