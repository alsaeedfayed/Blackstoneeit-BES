import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { LevelMode } from 'src/app/modules/Planning/enum/enums';
import { MeasurementMethodStatus } from '../../pages/update-kpi-progress/enums';

@Component({
  selector: 'app-tabel-score-submission',
  templateUrl: './tabel-score-submission.component.html',
  styleUrls: ['./tabel-score-submission.component.scss'],
})
export class TabelScoreSubmissionComponent implements OnInit {
  @Input() list: any[] = [];
  @Input() scorecardSubmissionId: number;
  lang: string = this.translateService.currentLang;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 200,
  };
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpHandlerService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;
  }

  toRoute(id) {
    this.router.navigate([this.scorecardSubmissionId, id], { relativeTo: this.route });
  }

  public GoalLevelText(level: number) {
    return this.translateService.instant('scoreSubmission.' + LevelMode[level]);
  }
  
  getMeasurementMethodText(measurementMethod) {
    return this.translateService.instant(
      `scoreSubmission.${MeasurementMethodStatus[measurementMethod]}`
    );
  }

  addittion(measurementMethod) {
    if(measurementMethod == MeasurementMethodStatus.Currency)
      return this.translateService.instant('scoreSubmission.AED');
    else if(measurementMethod == MeasurementMethodStatus.Percentage)
      return '%';
    else 
      return ""
  }

  refresh(item) {
    this.getGoalDetails(item);
  }

  getGoalDetails(item) {
    this.http.get(Config.Performance.GetGoalForUpdate + this.scorecardSubmissionId + '/' + item.id)
      .subscribe((res) => {
       // console.log(res)
        item.automaticCalculation = false;
        item.periodTarget = res?.childrenProgress?.periodTarget;
        item.periodActual = res?.childrenProgress?.periodActual;
        item.targetTD = res?.childrenProgress?.targetTD;
        item.actualTD = res?.childrenProgress?.actualTD;
        item.score = res?.childrenProgress?.score;
      });
  }

}
