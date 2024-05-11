import { finalize, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IDecision } from '../../models/IDecision';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { IOption } from './iOption.interface';
import { ITask } from './iTask.interface';
import { UserService } from 'src/app/core/services/user.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import moment from 'moment';
import { CommitteeDecisionService } from '../../services/committee-decision.service';
import { bo } from '@fullcalendar/core/internal-common';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { DecisionSendHistory } from '../../models/DecisionSendHistory';

@Component({
  selector: 'app-decision-details',
  templateUrl: './decision-details.component.html',
  styleUrls: ['./decision-details.component.scss']
})
export class DecisionDetailsComponent implements OnInit, OnDestroy {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  decision: any;

  isDownloading: boolean = false;

  updatingVotes: boolean = false;

  decisionId?: any;
  committeeName: { en: string, ar: string } = null;

  committeeId: number = 0;

  descTextInitialLimit = 1000;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  userVoted: boolean = false;
  votingOptions: any[] = [];
  votingResults: any[] = [];

  decisionStatus: any[] = []
  // decisionStatus = [
  //   { id: 0, name: 'Open', nameAr: 'مفتوح', className: 'closed' },
  //   { id: 1, name: 'Pending', nameAr: 'معلق', className: 'pendingMom' },
  //   { id: 2, name: 'Rejected', nameAr: 'مرفوض', className: 'rejected' },
  //   { id: 3, name: 'Completed', nameAr: 'منتهي', className: 'active' },
  //   { id: 4, name: 'InProgress', nameAr: 'جارى التنفيذ', className: 'inProgress' },
  //   { id: 5, name: 'returned', nameAr: 'معاد', className: 'started' },
  //   { id: 5, name: 'Canceled', nameAr: 'ملغى', className: 'cancelled' },
  // ];

  //approval cycle
  public instanceId: number;
  steps = [];
  public task = {};
  options: IOption[] = [];
  tasks: ITask[] = [];

  // tabs vars
  breakpoint: string = 'lg';
  currentTabIndex: number = 0;
  // tabs vars
  tabs: any[] = [
    {
      label: 'Voting History',
      labelAr: 'سجل التصويت',
      active: true
    },
    {
      label: ' Sharing History',
      labelAr: 'سجل نشر القرار ',
      active: false
    }
  ];
  historyLoading: boolean = true;
  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private exportFilesService: ExportFilesService,
    private modelService: ModelService,
    private committeeDecisionService: CommitteeDecisionService,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,

  ) { }
  ngOnDestroy(): void {
    this.committeeDecisionService.sharingHistory = null;
  }

  ngOnInit(): void {

    //get id
    this.decisionId = +this.activatedRoute.snapshot.paramMap.get('decisionId');
    this.committeeId = +this.activatedRoute.snapshot.paramMap.get('committeeId');
    this.decisionStatus = this.committeeDecisionService.getAllDecisionStatuses()

    // handles language change event
    this.handleLangChange();

    if (+this.decisionId > 0) {

      this.getDecisionDetails();
    } else {
      this.goToNotFound();
    }
    this.votingOptions = this.committeeDecisionService.votingOptions;

    // temp
    this.votingResults = this.committeeDecisionService.votingResults;
  }
  // get decision details
  getDecisionDetails() {
    this.loading = true;
    this.httpSer
      .get(`${Config.Decision.GetById}/${this.decisionId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.decision = res;
          //console.log('dec' , this.decision)
          this.committeeName = { en: this.decision.committeeInfo.name, ar: this.decision.committeeInfo.nameAr };
          let userId = this.userService.getCurrentUserId();
          if (this.decision?.decisionVoting) {
            let votersId = this.decision?.decisionVoting?.decisionVotingAnswers.map(v => v.votedBy).filter(v => v == userId);
            this.userVoted = votersId.length > 0;
          }
          if (res.status == 7) {
            this.getSendDecisionHistory();
          }else{
            this.historyLoading = false;
          }
        }
      });
  }
  // active tab
  activeTab(tab: any) {
    this.currentTabIndex = this.tabs.indexOf(tab);
    this.tabs.forEach((tab) => tab.active = false);
    tab.active = true;
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  onDecisionVoted(vote: number) {
    this.updatingVotes = true;

    const query = {
      decisionId: this.decisionId,
      decisionVotingId: this.decision.decisionVoting?.id,
      vote: vote,
    };

    this.httpSer
      .put(Config.Decision.Vote, query)
      .pipe(finalize(() => (this.updatingVotes = false)))
      .subscribe((res) => {
        if (res) {
          // get decision details
          this.getDecisionDetails();
        }
      });
  }

  openConfirmDecison() {
    console.log('dec' , this.decision)
    if (!this.decision?.canConfirm) {
      this.toastr.error(this.translate.instant('committeeDecisions.notAllowd'));
      return
    }
    if(this.decision?.canConfirm && this.decision?.votingPercentage < 50) {
      this.toastr.error(this.translate.instant('committeeDecisions.decError'));
      //this.confirmationPopupService.open('confirm-decision');

    }

    else {
      this.confirmationPopupService.open('confirm-decision');
    }

  }

  isConfirmingDecision: boolean = false;
  confirmDecision() {
    this.confirmationPopupService.close('confirm-decision');
    this.isConfirmingDecision = true
    let body = { decisionId: this.decisionId }
    this.httpSer
      .put(`${Config.Decision.Confirm}`, body)
      .pipe(finalize(() => (this.isConfirmingDecision = false)))
      .subscribe((res) => {
        if (res) {
          this.getDecisionDetails()
        }
      });
  }
  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

  goToEdit() {
    let path = `/committees-management/${RoutesVariables.Decision.Update}`.replace(':committeeId', `${this.committeeId}`)
      .replace(`:${RoutesVariables.Decision.DecisionId}`, `${this.decisionId}`);
    this.router.navigateByUrl(path);
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
  saveAction(event) {
    let path = `/committees-management/${RoutesVariables.Decision.List}`.replace(`:${RoutesVariables.Decision.CommitteeId}`, `${this.committeeId}`);
    this.router.navigateByUrl(path);
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }


  exportDataAsPDF() {

    // check if the button has been clicked
    if (this.isDownloading) return;
    this.isDownloading = true;

    let url = `${Config.Decision.ExportPDF}?Id=${this.decisionId}`;
    let fileName = this.committeeName[this.language] + ' - ' +
      this.decisionId + ' - ' +
      moment(this.convertUTCDateToLocalDate(this.decision.creationDate)).locale(this.language).format('DD/MMM/YYYY');

    this.exportFilesService.exportData('GET', url, fileName)
      .finally(() => {
        this.isDownloading = false;
      });
  }
  // get workflow states
  // getWorkflowStates(): void {
  //   this.httpSer.get(`${Config.Decision.GetInstanceId}/${this.decisionId}`)
  //     .subscribe((res) => {
  //       this.instanceId = res?.instanceId;

  //       if (this.instanceId) {
  //         this.httpSer.get(`${Config.WorkflowEngine.GetInstance}/${this.instanceId}`)
  //           .subscribe(res => {
  //             this.steps = res?.states;
  //             this.task = res?.task;
  //             this.options = res?.task?.options ? res?.task?.options : [];
  //             // this.requesterId = res?.createdBy;
  //           });
  //       }
  //     });
  // }

  isSendDecision: boolean = false;
  // open send decision model
  openDecisionDetailsModel() {
    this.isSendDecision = true;
    this.modelService.open("send-decision");
  }

  closePopup() {
    this.isSendDecision = false;
  }

  /////////////////////////
  // decision send history
  newDecisionAdded:boolean = false;
  getSendDecisionHistory() {
    this.newDecisionAdded= false;
    this.httpSer.get(`${Config.Decision.MessageHistory}/${this.decisionId}`)
      .pipe(
        finalize(() => (this.historyLoading = false)))
      .subscribe((res: DecisionSendHistory[]) => {
        if (res) {
          this.committeeDecisionService.sharingHistory = res;
          this.newDecisionAdded= true;
        }
      })
  }
}
