import { Component, Input, OnInit } from '@angular/core';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-send-decision-history-details',
  templateUrl: './send-decision-history-details.component.html',
  styleUrls: ['./send-decision-history-details.component.scss']
})
export class SendDecisionHistoryDetailsComponent implements OnInit {

  @Input() language: string = '';
  @Input() message: any = null;

  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  constructor(private modelService: ModelService,) { }



  ngOnInit(): void {
    this.message = { ...this.message, showMore: false };
  }
  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;
    this.descTextLimit = this.isDescMoreTextDisplayed ? 1000000000000 : this.descTextInitialLimit;
  }
  closePopup() {
    this.modelService.close();
  }
}
