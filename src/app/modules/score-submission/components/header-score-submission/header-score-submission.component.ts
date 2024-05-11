import { Permissions } from './../../../../core/services/permissions';
import { IGroupIdentity } from './../../../group-identity/interfaces/interfaces';
import { Level } from './../../../groups/components/groups-main/enums';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ModelService } from 'src/app/shared/components/model/model.service';
@Component({
  selector: 'app-header-score-submission',
  templateUrl: './header-score-submission.component.html',
  styleUrls: ['./header-score-submission.component.scss'],
})

export class HeaderScoreSubmissionComponent implements OnInit {
  private sessionLevelKey = "Submission-Level";
  private sessionGroupKey = "Submission-Group";
  private sessionPeriodKey = "Submission-Period";

  permissionsViewStatusDetails = Permissions.Performance.Scorecard.viewStatusDetails;
  period: any[] = [];
  language: string = this.translateService.currentLang;
  selectedPeriod = 1;
  scorecardItem: any = {};
  groups: any[] = [];
  loading: boolean = true;
  isBtnLoading: boolean = false;
  selectedGroup = null;
  isSubmit: boolean = false;
  periodOpened: boolean = false;
  submitted: boolean = false;
  canClose: boolean = false;
  canExtend: boolean = false;
  canPublish: boolean = false;
  published: boolean = false;
  public levelsWithGroups: [] = [];

  public scorecardSubmissionId;

  // Tranlsations Label
  public isSubmitBtnLoading: boolean = false;
  public isExtendBtnLoading: boolean = false;
  public isCloseBtnLoading: boolean = false;
  public isPublishBtnLoading: boolean = false;
  private endSub$ = new Subject();

  extendReason: string = null;
  extended: boolean = false;

  @Input() set PeriodOpened(value: boolean) {
    this.periodOpened = value;
  }
  @Input() set Submitted(value: boolean) {
    this.submitted = value;
  }
  @Input() set canSubmit(value: boolean) {
    this.isSubmit = value;
  }
  @Input() set CanClose(value: boolean) {
    this.canClose = value;
  }
  @Input() set CanExtend(value: boolean) {
    this.canExtend = value;
  }

  @Input() set expiredAfter(value: any) {
    this.expiredAfterData = value;
  }
  @Input() set ScorecardSubmissionId(value: any) {
    this.scorecardSubmissionId = value;
  }
  @Input() set CanPublish(value: boolean) {
    this.canPublish = value;
  }
  @Input() set Published(value: boolean) {
    this.published = value;
  }
  @Input() set Extended(value: boolean) {
    this.extended = value;
  }
  @Input() set ExtendReason(value: string) {
    this.extendReason = value;
  }

  expiredAfterData = null;
  currentScorecard: any;
  isShowReopenPopup: boolean = false;

  @Output() changePeriod: EventEmitter<any> = new EventEmitter();
  @Output() changeGroup: EventEmitter<any> = new EventEmitter();
  @Output() scorecard: EventEmitter<any> = new EventEmitter();
  @Output() doneData: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onExtend: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onOpenStatusDetailsModal: EventEmitter<any> = new EventEmitter();

  constructor(private translateService: TranslateService, private httpHandlerService: HttpHandlerService, private fb: FormBuilder, private modelService: ModelService) {
    if(localStorage.getItem('currentScorecard'))
      this.currentScorecard = localStorage.getItem('currentScorecard');
    this.modelService.closeModel$.pipe(takeUntil(this.endSub$)).subscribe(() => this.isShowReopenPopup = false)
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      this.language = this.translateService.currentLang;
    });
    this.getHeaderData();
  }

  ngOnDestroy(): void {
    this.endSub$.next('');
    this.endSub$.complete();
  }

  public onSelectedGroupChange(group:IGroupIdentity) {
    const selectedGroup = group ? group.id : null;
    this.changeGroup.emit(selectedGroup);
    this.doneData.emit();
    localStorage.setItem(this.sessionGroupKey, selectedGroup ? selectedGroup.toString() : null);
  }

  public openStatusDetailsPopup(){
    this.onOpenStatusDetailsModal.emit();
  }

  getHeaderData() {
    this.loading = true;
    const submissionPeriodGetAll = this.httpHandlerService.get(Config.Performance.SubmissionPeriod);
    const getCurrentScorecard = this.httpHandlerService.get(Config.Performance.GetCurrent);
    // const getMyGroups = this.httpHandlerService.get(Config.Performance.GetMyGroups);

    // forkJoin({ submissionPeriodGetAll, getCurrentScorecard, getMyGroups })
    forkJoin({ submissionPeriodGetAll, getCurrentScorecard })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.period = res.submissionPeriodGetAll;
        this.handelSelectPeriod();
        this.scorecardItem = res.getCurrentScorecard;
        this.scorecard.emit(this.scorecardItem);
        localStorage.setItem('currentScorecard', JSON.stringify(this.scorecardItem))

        let sessionPeriod = localStorage.getItem(this.sessionPeriodKey);
        if (sessionPeriod) {
          this.selectedPeriod = Number(sessionPeriod);
          this.handelChangePeriod(Number(sessionPeriod));

          let sessionLevel = localStorage.getItem(this.sessionLevelKey);
          if (sessionLevel) {
            setTimeout(() => {
              let lev = JSON.parse(sessionLevel);
              // this.f['level'].setValue(Number(lev.id));

              let group = localStorage.getItem(this.sessionGroupKey);
              if (group && Number(lev.id) != Level.L0) {
                // this.f['groupId'].setValue(Number(group));
                // this.groupSelectedHandler();
              }
            }, 300);
          }
        }
      });
  }

  handelSelectPeriod() {
    this.selectedPeriod = this.period.find((item) => item.current)?.id || this.period[0]?.id;
    this.changePeriod.emit(this.selectedPeriod);
  }

  handelChangePeriod(value) {
    localStorage.setItem(this.sessionPeriodKey,value);
    this.changePeriod.emit(value);
    //this.change.emit()
    this.doneData.emit();
  }

  submitScore() {
    this.isSubmitBtnLoading = true;
    this.modelService.close();
    this.httpHandlerService.put(`${Config.ScorecardSubmission.SubmitScorecard}/${this.scorecardSubmissionId}`)
      .pipe(finalize(() => (this.isSubmitBtnLoading = false)))
      .subscribe((res) => {
        this.onSubmit.emit();
      });
  }

  extend(body) {
    this.isExtendBtnLoading = true;
   // this.modelService.close();
    this.httpHandlerService.put(`${Config.ScorecardSubmission.Extend}/${this.scorecardSubmissionId}`, {
      extendReason: body.reason
    })
      .pipe(finalize(() => this.isExtendBtnLoading = false))
      .subscribe((res) => {
        this.canExtend = false;
        this.canClose = true;
        this.isShowReopenPopup = false;
        this.getHeaderData();
        this.onExtend.emit();
      });
  }

  close() {
    this.isCloseBtnLoading = true;
    this.modelService.close();
    this.httpHandlerService.put(`${Config.ScorecardSubmission.Close}/${this.scorecardSubmissionId}`)
      .pipe(finalize(() => (this.isCloseBtnLoading = false)))
      .subscribe((res) => {
        this.canClose = false;
        this.canExtend = true;
        this.getHeaderData();
        this.onClose.emit();
      });
  }

  public isPublished() {
    return this.published;
  }

  public publish() {
    this.isPublishBtnLoading = true;
    this.modelService.close();
    this.httpHandlerService.put(`${Config.ScorecardSubmission.Publish}/${this.scorecardItem.id}/${this.selectedPeriod}`)
      .pipe(finalize(() => (this.isPublishBtnLoading = false)))
      .subscribe((res) => {
        this.getHeaderData();
      });
  }

  openSubmitScoreConfirmation() {
    this.modelService.open('confrontation-msg-submit');
  }

  openPublishConfirmation() {
    this.modelService.open('confrontation-msg-publish');
  }

  openExtend() {
   // this.modelService.open('confrontation-msg-extend');
    this.isShowReopenPopup = true;
    this.modelService.open("reopen-submittion");
  }

  closeExtend() {
    this.isShowReopenPopup = false;
    this.modelService.close();
  }

  openCloseConfirmation() {
    this.modelService.open('confrontation-msg-close');
  }

}
