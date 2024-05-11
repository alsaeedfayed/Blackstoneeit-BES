import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { IScorecard, IStatusDetails } from '../../../mange-scorecards/interfaces/mange-scorecards.interface';
import { TranslateService } from '@ngx-translate/core';
import { scorecardStatus } from '../../../mange-scorecards/Enums/enums';
import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'scorecard-details-modal',
  templateUrl: './scorecard-details-modal.component.html',
  styleUrls: ['./scorecard-details-modal.component.scss'],
})
export class ScorecardDetailsModalComponent extends ComponentBase implements OnDestroy {
  private endSub$ = new Subject();
  public language = this.translate.currentLang;
  public scorecardId: number = 0;
  public statusDetails: IStatusDetails[] = [];
  public scorecard: IScorecard = {} as IScorecard;
  public loading : boolean = false;

  constructor(
    private popupService: PopupService,
    private httpHandlerService: HttpHandlerService,
    translate: TranslateService,
    translateService: TranslateConfigService
  ) {
    super(translateService, translate)
    this.hanleLangChange();
    this.getScorecardId();
  }

  private hanleLangChange(){
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(()=>{
      this.language = this.translate.currentLang;
    })
  }

  private getScorecardId() {
    this.popupService.data$.pipe(take(1)).subscribe((data: {scorecard: IScorecard}) => {
      if (!!data && !!data.scorecard.id) {
        this.scorecard = data.scorecard;
        this.scorecardId = data.scorecard.id;
        this.getScorecardStatusDetails();
      }
    });
  }

  private getScorecardStatusDetails() {
    this.loading = true;
    this.httpHandlerService
      .get(`${Config.MangeScorecards.getStatusDetails}/${this.scorecardId}`)
      .pipe(takeUntil(this.endSub$),finalize(()=> this.loading = false))
      .subscribe((res) => {
        this.statusDetails = res;
      });
  }

  public getStatusName(status: scorecardStatus): { label: string, className: string } {
    let className = status == scorecardStatus.Planning ? "started" : status == scorecardStatus.Approved ? "active" : "closed";
    return { label: this.translate.instant('shared.' + scorecardStatus[status]), className: className }
  }

  public getLevelText(level: LevelMode): string {
    if (!LevelMode[level]) return "";
    return this.translate.instant('shared.' + LevelMode[level]);
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  closePopup() {
    this.popupService.close();
  }
}
