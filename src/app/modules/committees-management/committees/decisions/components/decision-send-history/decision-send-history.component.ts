import { DecisionSendHistory } from './../../models/DecisionSendHistory';
import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ImageService } from 'src/app/shared/PersonItem/image.service';
import { CommitteeDecisionService } from '../../services/committee-decision.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-decision-send-history',
  templateUrl: './decision-send-history.component.html',
  styleUrls: ['./decision-send-history.component.scss']
})
export class DecisionSendHistoryComponent implements OnInit {

  @Input() language: string = '';

  // private _decisionId: number = 0;

  isDetailsModalOpened: boolean;
  selectedMessage: null;

  // historyLoading: boolean = true;

  history: DecisionSendHistory[] = [];
   @Input() 
   public set newDecisionAdded(v:boolean) {
     if (v){
      this.history = this.committeeDecisionService.sharingHistory;
    }
   }
     

  constructor(
    private httpSer: HttpHandlerService,
    private imageService: ImageService,
    private committeeDecisionService: CommitteeDecisionService,
    private modelService: ModelService,
  ) { }

  ngOnInit(): void {
    this.history = this.committeeDecisionService.sharingHistory;
  }

  // close new KPI model
  closeNewKPIModel() {
    this.isDetailsModalOpened = false;
    this.selectedMessage = null;
    this.modelService.close();
  }
  openDetailsModel(message) {
    this.isDetailsModalOpened = true;
    this.selectedMessage = message;
    this.modelService.open('history-details-modal');
  }
}