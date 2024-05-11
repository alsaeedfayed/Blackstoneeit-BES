import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { changedMainTasks } from '../../models/modify-request-details.interface';
import { ModifyRequestsService } from '../../services/modify-requests.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-changed-main-taskes',
  templateUrl: './changed-main-taskes.component.html',
  styleUrls: ['./changed-main-taskes.component.scss']
})
export class ChangedMainTaskesComponent implements OnInit {


  //TODO VARIABLES
  changedTypes : any
  @Input() changedMainTasks : changedMainTasks[]
  @Input() lang : string ;
  @Output() tasksRow : EventEmitter<any> = new EventEmitter()

  constructor(private modifyRequests : ModifyRequestsService , private modalService : ModelService) {
    this.changedTypes = this.modifyRequests.getChangedTypes()

  }
  ngOnInit(): void {
  }

  openChangedTasksModal(row : any) {
    this.tasksRow.emit(row)
    //console.log(row)
  }
}
