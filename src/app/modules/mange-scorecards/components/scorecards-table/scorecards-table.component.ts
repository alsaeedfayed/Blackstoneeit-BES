import { PopupService } from 'src/app/shared/popup/popup.service';
import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IScorecard } from './../../interfaces/mange-scorecards.interface';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { scorecardStatus } from '../../Enums/enums';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'scorecards-table',
  templateUrl: './scorecards-table.component.html',
  styleUrls: ['./scorecards-table.component.scss'],
})
export class ScorecardsTableComponent implements OnInit, OnDestroy {
  // PRIVATE PROP
  private endSub$ = new Subject()
  //  PUBLIC PROPS
  public language = this.translate.currentLang;
  public loading: boolean = false;
  public scorecards: IScorecard[] = [];
  public isShowDetailsPopup: boolean = false;
  //  INPUTS & OUTPUTS
  @Input() public set Scorecards(scorecards: IScorecard[]) {
    this.scorecards = scorecards;
    // this.scorecards.forEach((scorecard) => scorecard.current ? localStorage.setItem('currentScorecard', JSON.stringify(scorecard)) : null)
  };
  @Output() currentChanged: EventEmitter<IScorecard> = new EventEmitter()
  @Output() onChangeHandler = new EventEmitter()

  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');
  detailsLabel = this.translate.instant("shared.viewDetails")
  deleteConfirmMsg: string;
  scorecardId: number;

  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-trash',
    },
    {
      item: this.detailsLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bx-show',
    }
  ];

  constructor(
    private translate: TranslateService,
    private httpHandlerService: HttpHandlerService,
    private toastr: ToastrService,
    private modelService: ModelService,
    private popupService:PopupService
  ) {
    this.handleLangChnage();
    this.popupService.reset$.pipe(takeUntil(this.endSub$)).subscribe(()=> this.isShowDetailsPopup = false);
  }

  ngOnInit(): void { }

  private handleLangChnage() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
      this.editLabel = this.translate.instant('shared.edit');
      this.deleteLabel = this.translate.instant('shared.delete');
      this.detailsLabel = this.translate.instant("shared.viewDetails")
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-trash',
        },
        {
          item: this.detailsLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bx-show',
        }
      ];
    })
  }

  msgText(scorecard: IScorecard) {
    if (!scorecard.current) {
      return `${this.translate.instant(
        'mangeScorecards.areYouSureYouWantToMake'
      )} "${this.language === 'en' ? scorecard.title : scorecard.titleAr}" ${this.translate.instant("mangeScorecards.cuurentScorecard")}`;
    }
    return `${this.translate.instant(
      'mangeScorecards.areYouSureYouWantNotMake'
    )} "${this.language === 'en' ? scorecard.title : scorecard.titleAr}" ${this.translate.instant("mangeScorecards.cuurentScorecard")}`;
  }

  openModel(scorecard: IScorecard) {
    if (scorecard.current) return;
    this.modelService.open('confrontation-msg' + scorecard.id);
  }

  toggleActive(scorecard: IScorecard) {
    this.loading = true;
    this.modelService.close();
    this.httpHandlerService
      .put(`${Config.MangeScorecards.setCurrent}/${scorecard.id}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.currentChanged.emit(scorecard)
        localStorage.setItem('currentScorecard', JSON.stringify(scorecard))
        this.scorecards.forEach((scorecard) => scorecard.current = false)
        scorecard.current = !scorecard.current
      });
  }

  openPopup(scorecard: IScorecard) {
    scorecard.edit = true;
    this.popupService.open('new-scorecard' + scorecard.id,scorecard);
    // this.modelService.open('new-scorecard' + scorecard.id);
  }

  closePopup(scorecard: IScorecard) {
    scorecard.edit = false;
    this.popupService.close();
  }

  openDeletePopup(scorecard: IScorecard) {
    // this.popupService.open('new-scorecard' + scorecard.id,scorecard);
    this.scorecardId = scorecard.id;
    if(this.language == 'en')
      this.deleteConfirmMsg = `${this.translate.instant(
        'mangeScorecards.deleteMsg'
      )} "${scorecard.title}"? ${this.translate.instant(
        'mangeScorecards.deleteMsgNote'
      )} `;
    else
    this.deleteConfirmMsg = `${this.translate.instant(
      'mangeScorecards.deleteMsg'
    )} "${scorecard.titleAr} "؟ ${this.translate.instant(
      'mangeScorecards.deleteMsgNote'
    )} `;
    this.modelService.open('delete-scorecard');
  }

  openDetailsPopup(scorecard: IScorecard){
    this.isShowDetailsPopup = true;
    this.popupService.open('scorecardStatusDetails', { scorecard });
  }

  closeDetailsPopup() {
    this.isShowDetailsPopup = false;
    this.popupService.close();
  }

  update(event) {
    let index = this.scorecards.findIndex(
      (scorecard: IScorecard) => scorecard.id == event.id
    );
    this.scorecards[index] = { ...this.scorecards[index], ...event };
  }

  //Getters and Setters

  public getStatusName(status: scorecardStatus): { label: string, className: string } {
    let className = status == scorecardStatus.Planning ? "started" : status == scorecardStatus.Approved ? "active" : "closed";
    return { label: this.translate.instant('mangeScorecards.' + scorecardStatus[status]), className: className }
  }

  public getLevelText(level: LevelMode): string {
    if (!LevelMode[level]) return "";
    return this.translate.instant('mangeScorecards.' + LevelMode[level]) + " - ";
  }

  public delete() {
    this.scorecards.forEach((scorecard) => {
      if(scorecard.id == this.scorecardId && scorecard.current)
        localStorage.setItem('currentScorecard', '')
    })
    let path = Config.MangeScorecards.delete.replace("{id}", this.scorecardId.toString());
    this.modelService.close();
    this.httpHandlerService
      .delete(path)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('mangeScorecards.deleteSuccessMsg'));
          this.reset();
        }
      });
  }

  private reset() {
    this.scorecardId = 0;
    this.onChangeHandler.emit();
  }

  ngOnDestroy(): void {
    this.endSub$.next(null)
    this.endSub$.complete()
  }

  onOptionSelect(e, scorecard: IScorecard) {
    if (e === this.editLabel) {
      this.openPopup(scorecard);
    }
    else if (e === this.deleteLabel) {
      this.openDeletePopup(scorecard);
    } else if (e === this.detailsLabel){
      this.openDetailsPopup(scorecard);
    }
  }
}
