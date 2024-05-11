import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { scorecardStatusResult } from '../../Page/interfaces';
import { PlanningService } from '../../Page/planning.service';
import { combineLatest, Subject } from 'rxjs';
import { PerformanceStatusMode } from '../../enum/enums';

@Component({
  selector: 'planning-status',
  templateUrl: './planning-status.component.html',
  styleUrls: ['./planning-status.component.scss'],
})
export class PlanningStatusComponent implements OnDestroy {
  // Props
  private endSub$ = new Subject();
  public lang: string = this.translate.currentLang;
  public performanceStatusModeEnum = PerformanceStatusMode;
  public loading: boolean = false;
  public planning: any;
  public scorecardStatusResult: scorecardStatusResult =
    {} as scorecardStatusResult;
  public selectedGroup:any;
  // INPUTS & OUTPUTS
  @Input() currentStatus: any;
  @Input() loadingstatus: boolean = false;
  @Input() public set ScorecardStatusResult(result: scorecardStatusResult) {
    if (result && result.planningInstance) {
      // Mocking Planning Obj To fit Workflow state component
      this.planning = [
        {
          current: true,
          number: '1',
          status: {
            code: 'Pending',
            en: `( ${result.planningInstance.submitedCount} / ${
              result.planningInstance.totalCount
            }) ${this.translate.instant('Planning.submitted')}`,
            ar: `( ${result.planningInstance.submitedCount} / ${
              result.planningInstance.totalCount
            }) ${this.translate.instant('Planning.submitted')}`,
          },
          date: null,
          name: {
            en: 'Planning Cycle',
            ar: 'موافقه المدير',
          },
          owner: null,
          tasks: null,
        },
      ];
    }
    this.scorecardStatusResult = result;
  }
  @Output() startingInstanceEvent: EventEmitter<void> = new EventEmitter();
  constructor(private translate: TranslateService,private planningService:PlanningService) {
    this.handleLangChange();
    this.planningService.selectedGroup.pipe(takeUntil(this.endSub$)).subscribe((group)=> {
      this.selectedGroup = group;
    });
  }

  private handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.lang = this.translate.currentLang;
      if (this.planning && this.planning[0]) {
        this.planning[0].status = {
          code: 'Pending',
          en: `( ${
            this.scorecardStatusResult.planningInstance?.submitedCount
          } / ${
            this.scorecardStatusResult.planningInstance?.totalCount
          }) ${this.translate.instant('Planning.submitted')}`,
          ar: `( ${
            this.scorecardStatusResult.planningInstance?.submitedCount
          } / ${
            this.scorecardStatusResult.planningInstance?.totalCount
          }) ${this.translate.instant('Planning.submitted')}`,
        };
      }
    });
  }

  public startInstanceHandler(){
    this.startingInstanceEvent.emit();
  }

  public get isScorecardStatusResult():boolean {
    return !!this.scorecardStatusResult.planningInstance
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
