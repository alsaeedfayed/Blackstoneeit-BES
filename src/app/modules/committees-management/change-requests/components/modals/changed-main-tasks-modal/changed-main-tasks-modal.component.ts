import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ModifyRequestsService } from '../../../services/modify-requests.service';

@Component({
  selector: 'app-changed-main-tasks-modal',
  templateUrl: './changed-main-tasks-modal.component.html',
  styleUrls: ['./changed-main-tasks-modal.component.scss']
})
export class ChangedMainTasksModalComponent implements OnInit {

    //TODO VARIABLES
    changedTypes : any
    @Input() changedDataTasks : any [] = []
    @Input() language : string
    @Input() taskDetails
    attatchments : any[]
    @Input() isAddedTask : boolean = false
    @Output() closeTasksDetailsModal : EventEmitter<any> = new EventEmitter()
    constructor(private modalService : ModelService , private modifyRequests : ModifyRequestsService) {
      this.changedTypes = this.modifyRequests.getChangedTypes()
    }

    ngOnInit(): void {
     // console.log('tsk details' , this.taskDetails)
      if (this.taskDetails?.changedAttatchments) {
        this.attatchments = this.taskDetails?.changedAttatchments?.map(a => (
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
      this.closeTasksDetailsModal.emit()
    }

}
