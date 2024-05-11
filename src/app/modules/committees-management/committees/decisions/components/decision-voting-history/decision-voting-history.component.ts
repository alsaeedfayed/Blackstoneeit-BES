import { Component, Input, OnInit } from '@angular/core';
import { IDecisionVotingHistory } from '../../models/IDecisionVotingHistory';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-decision-voting-history',
  templateUrl: './decision-voting-history.component.html',
  styleUrls: ['./decision-voting-history.component.scss']
})
export class DecisionVotingHistoryComponent implements OnInit {

  @Input() language = '';
  
  decisionId: number = 0;
  committeeId: number = 0;
  votingHistory: IDecisionVotingHistory[] = [];
  selectedOption: number = null;
  loading: boolean = true;

  constructor(
    private httpSer: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    //get id
    this.decisionId = +this.activatedRoute.snapshot.paramMap.get('decisionId');
    this.committeeId = +this.activatedRoute.snapshot.paramMap.get('committeeId');

    this.getVotingHistory();
  }

  getVotingHistory(option: number = null) {
    this.loading = true;
    this.httpSer
      .get(`${Config.Decision.VotingHistory}/${this.decisionId}/${this.committeeId}`, { votingAnswer: option })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.votingHistory = res;
        }
      });
  }
  filterHistory(option: number) {
    this.selectedOption = option;
    this.getVotingHistory(option);
  }
}
