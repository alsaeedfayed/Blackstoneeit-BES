import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModifyRequestsService } from '../../services/modify-requests.service';
import { changedKpis } from '../../models/modify-request-details.interface';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-changed-kpis-rows',
  templateUrl: './changed-kpis-rows.component.html',
  styleUrls: ['./changed-kpis-rows.component.scss']
})
export class ChangedKpisRowsComponent implements OnInit {

  //TODO VARIABLES
  changedTypes : any
  @Input() changedKpis : any[]
  @Input() lang : string ;
  @Output() kpiItem : EventEmitter<changedKpis> = new EventEmitter()


  constructor(private modifyRequests : ModifyRequestsService) {
    this.changedTypes = this.modifyRequests.getChangedTypes()

  }

  ngOnInit(): void {
  }

  openKpisDetailsModal(item : changedKpis){
    //this.modelService.open('changed-kpis-details')
    this.kpiItem.emit(item)
    //console.log(item)

  }
}
