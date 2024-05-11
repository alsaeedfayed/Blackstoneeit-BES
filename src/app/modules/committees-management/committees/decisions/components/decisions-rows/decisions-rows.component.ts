import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { DecisionStatus } from 'src/app/modules/committees-management/enums/enums';
import { CommitteeDecisionService } from '../../services/committee-decision.service';

@Component({
  selector: 'decisions-rows',
  templateUrl: './decisions-rows.component.html',
  styleUrls: ['./decisions-rows.component.scss']
})
export class DecisionsRowsComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  committeeId: number;

  decisionStatus : any[] = []
  // decisionStatus = [
  //   { id: 0, name: 'Open', nameAr: 'مفتوح', className: 'closed' },
  //   { id: 1, name: 'Pending', nameAr: 'معلق', className: 'pendingMom' },
  //   { id: 2, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
  //   { id: 3, name: 'Completed', nameAr: 'منتهي', className: 'active' },
  //   { id: 4, name: 'In Progress', nameAr: 'جارى تنفيذه', className: 'inProgress' },
  //   { id: 5, name: 'returned', nameAr: 'معاد', className: 'started' },
  //   { id: 5, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },
  // ];
  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() onPaginateEvent = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private modelService: ModelService,
    private decisionService : CommitteeDecisionService
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    this.decisionStatus = this.decisionService.getAllDecisionStatuses()
    //console.log('dec list' , this.list)
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  onVoteChanged(e) {
    this.onPaginate(e);
  }

  // open decision details model
  openDecisionDetailsModel(item) {
    item.isDetailsOpened = true;
    this.committeeId = item.committeeId;
    this.modelService.open("decision-details" + item.id);
  }
}
