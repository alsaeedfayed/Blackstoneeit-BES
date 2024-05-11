import { Component, Input, OnInit } from '@angular/core';
import { changedDataMember } from '../../models/modify-request-details.interface';
import { ModifyRequestsService } from '../../services/modify-requests.service';

@Component({
  selector: 'app-changed-data-members',
  templateUrl: './changed-data-members.component.html',
  styleUrls: ['./changed-data-members.component.scss']
})
export class ChangedDataMembersComponent implements OnInit {

  //TODO VARIABLES
  changedTypes : any
  memberTypes : any
  @Input() changedDataMembers : any
  @Input() lang : string ;


  constructor(private modifyRequests : ModifyRequestsService) {
    this.changedTypes = this.modifyRequests.getChangedTypes()
    this.memberTypes = this.modifyRequests.getMemberTypes()
  }

  ngOnInit(): void {

  }

}
