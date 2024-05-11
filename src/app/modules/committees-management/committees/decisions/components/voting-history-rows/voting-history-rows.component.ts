import { Component, Input, OnInit } from '@angular/core';
import { IDecisionVotingHistory } from '../../models/IDecisionVotingHistory';
import { CommitteeDecisionService } from '../../services/committee-decision.service';
import { CommitteeBasicInfoService } from 'src/app/modules/committees-management/services/committee-basic-info/committee-basic-info.service';

@Component({
  selector: 'app-voting-history-rows',
  templateUrl: './voting-history-rows.component.html',
  styleUrls: ['./voting-history-rows.component.scss']
})
export class VotingHistoryRowsComponent implements OnInit {

  @Input() list: IDecisionVotingHistory[] = [];
  @Input() language: string = '';
  votingOptions:any[] = [];
  committeeMemberTypes:any[] = [];
  constructor(
    private committeeBasicInfoService: CommitteeBasicInfoService,
    private committeeDecisionService: CommitteeDecisionService
  ) { }

  ngOnInit(): void {
    this.committeeMemberTypes = this.committeeBasicInfoService.committeeMemberTypes;
    this.votingOptions = this.committeeDecisionService.votingOptions;
  }

}
