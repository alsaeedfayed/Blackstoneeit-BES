import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { CommitteeDecisionService } from 'src/app/modules/committees-management/committees/decisions/services/committee-decision.service';

@Component({
  selector: 'app-decision-voting-options',
  templateUrl: './decision-voting-options.component.html',
  styleUrls: ['./decision-voting-options.component.scss']
})
export class DecisionVotingOptionsComponent implements OnInit {
  votingDate : an
  @Input() title: string;
  @Input() selectedOption: any = null;
  @Input() options: any[] = [];
  @Input() language: string = '';
  @Input() closingDate: string = '';

  @Input() set userVoting (value) {
    if(value) {
      this.votingOptions = this.committeeDecisionService.votingOptions;
      this.selectedOption = this.votingOptions[value?.votingAnswer]
      this.votingDate = value?.voteDate
    }
  }

  cantVoteDecision : boolean = false;

  @Input() set cantVote (value) {
    if(!value) {
     this.cantVoteDecision = true
    }
  }

  disableVoting : boolean = false
  @Input() set decisionStatus (value) {
    if(value ==7) {
      this.disableVoting = true
    }
  }


  @Output() onVote = new EventEmitter<number>();


  votingOptions: any[] = [];

  constructor(private committeeDecisionService: CommitteeDecisionService,) { }

  ngOnInit(): void {


  }

  vote(option: any) {
    this.selectedOption = option;
    this.onVote.emit(option.id);
  }


}
