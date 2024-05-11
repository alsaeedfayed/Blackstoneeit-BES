import { CommitteeDecisionService } from './../../../decisions/services/committee-decision.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { DecisionStatus } from 'src/app/modules/committees-management/enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'decisions-tab',
  templateUrl: './decisions-tab.component.html',
  styleUrls: ['./decisions-tab.component.scss']
})
export class DecisionsTabComponent implements OnInit {
  @Input() isUpdating: boolean = true;
  @Input() committeeId: number;
  @Input() meetingId: number;

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;

  list = [];
  totalItems: number = 0;
  @Output() count = new EventEmitter();


  // decision model properties
  decisionItem: any;
  isDecisionModelOpened = false;

  decisionStatus = [];
  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
    private committeeDecisionService: CommitteeDecisionService,
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    this.decisionStatus = this.committeeDecisionService.getAllDecisionStatuses();
    // fetch all decisions
    this.getAllDecisions();

   // console.log('lissst' , this.list)
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all decisions
  getAllDecisions() {
    if (!this.meetingId) { return; }

    this.loading = true;

    const query = {
      pageIndex: 1,
      pageSize: 1000000000,
    };

    // send a request to fetch decisions
    this.httpSer
      .get(`${Config.Decision.GetMeeting}/${this.meetingId}`, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.list = res?.data;
          this.totalItems = res?.count;
          this.count.emit(this.totalItems);
        }
      });
  }

  // open create/edit decision model
  openCreateDecisionModel(item?: any) {
    this.decisionItem = item;
    this.isDecisionModelOpened = true;
    this.modelService.open('create-decision');
  }

  // close create/edit decision model
  closeCreateDecisionModel() {
    this.decisionItem = null;
    this.isDecisionModelOpened = false;
    this.modelService.close();
  }

  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

}
