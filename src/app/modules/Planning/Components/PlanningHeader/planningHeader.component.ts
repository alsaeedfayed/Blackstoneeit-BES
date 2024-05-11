import { Permissions } from './../../../../core/services/permissions';
import { Router } from '@angular/router';
import { PopupService } from './../../../../shared/popup/popup.service';
import { Constant } from 'src/app/core/config/constant';
import { Level } from './../../../groups/components/groups-main/enums';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { LevelMode, PerformanceStatusMode } from '../../enum/enums';
import { TranslateService } from '@ngx-translate/core';
import { IScorecard, IAllScorecardsRes } from '../../Page/interfaces';
import { PlanningService } from '../../Page/planning.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'planning-header',
  templateUrl: './planningHeader.component.html',
  styleUrls: ['./planningHeader.component.scss'],
})
export class PlanningHeaderComponent implements OnInit, OnDestroy {
  // DATA
  /**************** Private props **********************/
  private endSub$ = new Subject();
  /**************** Public props **********************/
  public scoreCardPlanningItems: IScorecard[] = [];
  public isShowDetailsPopup: boolean = false;
  public selectedScorecard: IScorecard;
  permissionsViewStatusDetails = Permissions.Performance.Scorecard.viewStatusDetails;
  title: string;
  status: string;
  statusValue: PerformanceStatusMode;
  submitable: boolean;
  currentLevelValue: Level;
  levelToshow: Level;
  public isSubmitting: boolean = false;
  // public moveToNextLevel: boolean = false;
  isMovingToNextLevel: boolean;
  isScorecardApproving: boolean;
  submittedgroupId: number;
  public closeScorecard: boolean;
  canChangeRequest: boolean;
  canEditScorecard: boolean;
  confirmMsg: string;
  confirmCloseMsg: string;
  closedLable: string;
  statusEnum: PerformanceStatusMode = PerformanceStatusMode.notStarted;

  /**************** Inputs and Outputs **********************/
  @Input() public set Status(status: string) {
    this.status = status;
  }
  @Input() public set StatusValue(statusValue: PerformanceStatusMode) {
    this.statusValue = statusValue;
    this.closedLable = this.translateService.instant(
      'Planning.closed'
    )
  }
  @Input() public set currentLevel(level: number) {
    this.currentLevelValue = level;
  }
  @Input() public set LevelToShow(level: number) {
    this.levelToshow = level;
  }
  @Input() public set selectedGroupId(id: number) {
    this.submittedgroupId = id;
  }
  @Input() submissionTotalWeight: number = 0;
  @Input() public set Submitable(submitable: boolean) {
    this.submitable = submitable;
  }
  @Input() public set CanEditScorecard(canEditScorecard: boolean) {
    this.canEditScorecard = canEditScorecard;
  }

  @Input() public set CanChangeRequest(canChangeRequest: boolean) {
    this.canChangeRequest = canChangeRequest;
  }
  @Input() public set CloseScorecard(closeScorecard: boolean) {
    this.closeScorecard = closeScorecard;
  }
  @Output() public onSelect: EventEmitter<IScorecard> =
    new EventEmitter<IScorecard>();
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  lang: string = this.translateService.currentLang;

  constructor(
    private httpHandlerService: HttpHandlerService,
    private router: Router,
    private ToastrService: ToastrService,
    private translateService: TranslateService,
    private planningSer: PlanningService,
    private popupSer: PopupService,
    private confirmationPopupService: ConfirmModalService
  ) {
    this.popupSer.reset$.pipe(takeUntil(this.endSub$)).subscribe(() => this.isShowDetailsPopup = false)
  }

  // Life Cycles
  ngOnInit(): void {
    this.handleLangChange();
    this.getScorecardAll();
    this.checkIfNewScorecardAdded();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.scoreCardPlanningItems = [...this.scoreCardPlanningItems];
      this.closedLable = this.translateService.instant(
        'Planning.closed'
      );
    });
  }

  ngOnDestroy(): void {
    this.endSub$.next('');
    this.endSub$.complete();
  }

  // Methods

  private getScorecardAll() {
    this.httpHandlerService
      .get(Config.Performance.getScorecardAll)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res: IAllScorecardsRes) => {
        this.scoreCardPlanningItems = res.scorecards ?? [];
        if (res && res.scorecards && res.scorecards[0]) {
          const scorecardId =
            +localStorage.getItem(Constant.selectedScorecardId) ||
            this.scoreCardPlanningItems[0].id;
          const scorecard = this.scoreCardPlanningItems.find(
            (scorecard) => scorecard.id == scorecardId
          );
          this.selectedScorecard = scorecard;
          this.onSelect.emit(this.selectedScorecard);
          this.planningSer.selectScoreCard(this.selectedScorecard);
        }
        this.onSelect.emit(null);
      });
  }

  private checkIfNewScorecardAdded() {
    this.planningSer.isNewScorecardAdded$
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.getScorecardAll();
        }
      });
  }

  public openConfirmForSubmitScorecard() {
    this.confirmMsg = `${this.translateService.instant(
      'Planning.submitScorecardConfirm'
    )}?`;
    this.confirmationPopupService.open('submit-scorecard');
  }

  submitScorecard() {
    this.confirmationPopupService.close('submit-scorecard');
    this.isSubmitting = true;
    const reqBody = {
      scorecardId: this.selectedScorecard.id,
      groupId: this.submittedgroupId ?? null,
    };
    this.httpHandlerService
      .put(Config.Performance.sumbitScoreCard, reqBody)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isSubmitting = false))
      )
      .subscribe({
        next: () => {
          this.ToastrService.success(
            this.translateService.instant('Planning.submittedSuccessfully')
          );
          this.submitable = false;
          this.onSubmit.emit();
        },
      });
  }

  openConfirmationCloseScorecard() {
    this.confirmCloseMsg = `${this.translateService.instant(
      'Planning.closeScorecardConfirm'
    )}`;
    this.confirmationPopupService.open('close-scorecard');
  }

  scorecardApproveHandler() {
    this.confirmationPopupService.close('close-scorecard');
    this.isScorecardApproving = true;
    this.httpHandlerService
      .put(
        `${Config.Performance.CloseApprovalCycle}${this.selectedScorecard.id}`
      )
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isScorecardApproving = false))
      )
      .subscribe({
        next: () => {
          this.ToastrService.success('Done successfully');
          this.closeScorecard = false;
          this.onSubmit.emit();
        },
      });
  }

  handelSelectCardPlanning() {
    localStorage.setItem(
      Constant.selectedScorecardId,
      this.selectedScorecard.id.toString()
    );
    this.onSelect.emit(this.selectedScorecard);
    this.planningSer.selectScoreCard(this.selectedScorecard);
  }

  navigateToEditScorecard() {
    this.router.navigate([`/planning/edit/${this.selectedScorecard.id}`]);
  }

  openChnageRequestPopup() {
    this.planningSer.chnageRequest(true);
    this.router.navigate(['/performance-change-requests']);
  }

  openStatusDetailsPopup() {
    this.isShowDetailsPopup = true;
    this.popupSer.open("scorecardStatusDetailsPlanning", { scorecard: this.selectedScorecard })
  }

  closeStatusDetailsPopup() {
    this.isShowDetailsPopup = false;
    this.popupSer.close();
  }

  public openAddscorecardPopup() {
    this.popupSer.open('addScorecard');
  }

  public get GoalLevelText() {
    return LevelMode[this.levelToshow];
  }

  public get GoalNextLevel() {
    return LevelMode[this.currentLevelValue + 1];
  }

  public get isPlanning(): boolean {
    return this.status === "Planning"
  }
}
