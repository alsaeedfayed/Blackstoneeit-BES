import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddScorecardModel } from './add-scorecard.model';

@Component({
  selector: 'add-scorecard',
  templateUrl: './add-scorecard.component.html',
  styleUrls: ['./add-scorecard.component.scss'],
  providers: [AddScorecardModel]
})
export class AddScorecardComponent implements OnInit,OnDestroy {

  constructor(public model: AddScorecardModel) { }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.model.endSubs()
  }

}
