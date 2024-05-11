import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { IDecision } from '../../models/IDecision';
import { RoutesVariables } from '../../../../routes';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import moment from 'moment';

@Component({
  selector: 'decision-details-model',
  templateUrl: './decision-details-model.component.html',
  styleUrls: ['./decision-details-model.component.scss']
})
export class DecisionDetailsModelComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;
  decision: IDecision;
  isDownloading: boolean = false;

  @Input() decisionId?: number;
  @Input() committeeId?: number;
  @Output() onPaginateEvent = new EventEmitter();
  @Output() onVote = new EventEmitter();

  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  committeeName: { en: string, ar: string } = null;

  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private toastr: ToastrService,
    private userSer: UserService,
    private modelService: ModelService,
    private exportFilesService: ExportFilesService
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    if (this.decisionId > 0) {
      // get decision details
      this.getDecisionDetails();
    }
  }

  // get decision details
  getDecisionDetails() {
    this.httpSer
      .get(`${Config.Decision.GetById}/${this.decisionId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          if (res.status == 1) {
            this.router.navigateByUrl(`/committees-management/${RoutesVariables.Decision.List}`.replace(':committeeId', `${this.committeeId}`));
          } else {
            this.decision = res;
            this.committeeName = { en: this.decision.committeeInfo.name, ar: this.decision.committeeInfo.nameAr };
            // this.form.patchValue(this.decision);
          }
        }
      });
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  onDecisionVoted(vote: boolean) {
    this.loading = true;

    const query = {
      decisionId: this.decisionId,
      decisionVotingId: this.decision.decisionVoting.id,
      vote,
    };

    this.httpSer
      .put(Config.Decision.Vote, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          // get decision details
          this.getDecisionDetails();
          this.onVote.emit();
          this.toastr.success(this.translate.instant('committeeDecisions.voteSuccessMsg'));
        }
      });
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 10000000 : this.descTextInitialLimit
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }
  public exportDataAsPDF() {

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
  closePopup() {
    this.modelService.close();
  }
}
