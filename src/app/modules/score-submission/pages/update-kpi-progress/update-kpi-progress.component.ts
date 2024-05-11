import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { ActivatedRoute, Params } from '@angular/router';
import { Level } from 'src/app/modules/groups/components/groups-main/enums';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import {
  FrequenclyMode,
  MeasurementMethodStatus,
  SubmissionState,
  TrackStatus,
} from './enums';
import { Location, PlatformLocation } from '@angular/common';
import { LevelMode } from 'src/app/modules/Planning/enum/enums';

@Component({
  selector: 'app-update-kpi-progress',
  templateUrl: './update-kpi-progress.component.html',
  styleUrls: ['./update-kpi-progress.component.scss'],
})
export class UpdateKpiProgressComponent
  extends ComponentBase
  implements OnInit {
  lang: string = this.translate.currentLang;
  isShowModel = false;
  goal;
  personItem: IPerson;
  parentPersonItem: IPerson;
  progress: FormControl = new FormControl();
  loading: boolean = false;
  levels = [
    {
      value: Level.L0,
      label: 'L0',
      labelAr: 'L0',
    },
    {
      value: Level.L1,
      label: 'L1',
      labelAr: 'L1',
    },
    {
      value: Level.L2,
      label: 'L2',
      labelAr: 'L2',
    },
    {
      value: Level.L3,
      label: 'L3',
      labelAr: 'L3',
    },
  ];
  commentsNumber;
  historyList;

  @ViewChild('myChart') myChart: any;
  canvas: any;
  ctx: any;
  chart;
  selectedHistory;
  modalData: any;

  goalId;
  scoreCardSubmissionId;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 10,
  };
  children: [] = [];
  // viewMode: FormMode = FormMode.ViewMode;
  // editMode: FormMode = FormMode.EditMode;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private popupService: PopupService,
    private http: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private _platformLocation: PlatformLocation
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.loadDetails();
  }

  loadDetails() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.scoreCardSubmissionId = params['scorecardSubmissionId'];
      this.goalId = params['goalId'];
      this.getGoalDetails(this.scoreCardSubmissionId, this.goalId);
    });
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      if (this.chart) {
        this.chart.destroy();
        this.createChart();
      }
    });
  }

  getGoalDetails(scorecardSubmissionId, goalId) {
    this.loading = true;
    this.http
      .get(
        Config.Performance.GetGoalForUpdate +
        scorecardSubmissionId +
        '/' +
        goalId
      )
      .subscribe((res) => {
        this.loading = false;
        if (res) {
          this.goal = res;
          this.goal.Level = this.levels.find(
            (level) => level?.value === this.goal?.level
          );
          if (this.goal.parent)
            this.goal.parent.Level = this.levels.find(
              (level) => level?.value === this.goal?.parent?.level
            );
          this.personItem = {
            id: this.goal.owner.id,
            name: this.goal.owner.fullName,
            image: this.goal.owner.fileName,
            backgroundColor: '#0075ff',
            isActive: true,
            position: this.goal.owner.position,
          };
          this.parentPersonItem = {
            id: this.goal?.parent?.owner?.id,
            name: this.goal?.parent?.owner?.fullName,
            image: this.goal?.parent?.owner?.fileName,
            backgroundColor: '#0075ff',
            isActive: true,
            position: this.goal?.parent?.owner?.position,
          };

          this.progress = new FormControl();
          this.progress.setValue(
            Math.round(
              this.goal?.automaticCalculation
                ? this.goal?.childrenProgress?.progressToDate
                : this.goal?.progressToDate
            )
          );
          this.progress.updateValueAndValidity();

          res.history?.map((item) => {
            if (item.comment) ++this.commentsNumber;
          });
          this.historyList = res.history;
          this.children = res.children;
          if (this.historyList?.length) this.createChart();
        }
      });
  }

  get PercentageMeasurementMethod() {
    return this.goal?.measurementMethod == MeasurementMethodStatus.Percentage;
  }

  get MeasurementMethodText() {
    return this.translate.instant(
      `scoreSubmission.${MeasurementMethodStatus[this.goal?.measurementMethod]}`
    );
  }

  addittion(measurementMethod) {
    if (measurementMethod == MeasurementMethodStatus.Currency)
      return this.translate.instant('scoreSubmission.AED');
    else if (measurementMethod == MeasurementMethodStatus.Percentage)
      return '%';
    else return '';
  }

  get Date() {
    return this.goal?.measurementMethod == MeasurementMethodStatus.DateKpi;
  }
  get Yearly() {
    return (
      this.goal?.frequency == FrequenclyMode.Yearly &&
      this.goal?.measurementMethod != MeasurementMethodStatus.DateKpi
    );
  }
  get BiYearly() {
    return this.goal?.frequency == FrequenclyMode.Biyearly;
  }
  get Quarterly() {
    return this.goal?.frequency == FrequenclyMode.Quarterly;
  }
  get Monthly() {
    return this.goal?.frequency == FrequenclyMode.Monthly;
  }

  get TrackStatus() {
    let status: number = this.goal?.automaticCalculation
      ? this.goal?.childrenProgress?.achievementStatus
      : this.goal?.trackStatus;
    return this.translate.instant(`scoreSubmission.${TrackStatus[status]}`);
  }

  get TrackStatusStyle() {
    let status: number = this.goal?.automaticCalculation
      ? this.goal?.childrenProgress?.achievementStatus
      : this.goal?.trackStatus;
    return status == TrackStatus.OffTrack ? 'off' : 'on';
  }

  state(state: SubmissionState) {
    if (state === SubmissionState.Achieved) {
      return 'achieved';
    } else if (state === SubmissionState.Missed) {
      return 'missed';
    } else if (state === SubmissionState.NotDefined) {
      return 'notDefined';
    } else if (state === SubmissionState.NotDue) {
      return 'notDue';
    } else if (state === SubmissionState.OverAchieved) {
      return 'overAchieved';
    } else if (state === SubmissionState.PendingForSubmission) {
      return 'pendingForSubmission';
    } else return '';
  }

  stateClass(state: SubmissionState) {
    if (state === SubmissionState.Achieved) {
      return 'achieved';
    } else if (state === SubmissionState.Missed) {
      return 'missed';
    } else if (state === SubmissionState.NotDefined) {
      return 'not-defined';
    } else if (state === SubmissionState.NotDue) {
      return 'not-due';
    } else if (state === SubmissionState.OverAchieved) {
      return 'over-achieved';
    } else if (state === SubmissionState.PendingForSubmission) {
      return 'pendingForSubmission';
    } else return '';
  }

  showEditBtn(state: SubmissionState, period: number) {
    return (
      this.goal?.canUpdateProgress &&
      (period === -1 || this.goal.period === period) &&
      state != null &&
      state != SubmissionState.NotDefined &&
      state != SubmissionState.NotDue
    );
  }

  onEdit(title, value, obj) {
    this.isShowModel = true;
    // this.modalData = {
    //   title: title,
    //   targetValue: targetValue,
    //   actualValue: actualValue
    // }
    this.modalData = { title, value, obj };
    // console.log('this.modalData ', this.modalData);
    setTimeout(() => {
      this.popupService.open('update-progress');
    }, 400);
  }

  public get BaseLine() {
    return this.translate.instant('scoreSubmission.baseLine');
  }

  createChart() {
    if (this.historyList == null) return;

    if (!this.goal?.baseLine && !this.goal?.automaticCalculation) {
      const labels = [];
      const dataPoints = [];
      this.historyList.map((item) => {
        labels.push(
          moment(item.date).locale(this.lang).format('MMMM Do, h:mm')
        );
        dataPoints.push(item.actualvalue);
      });

      const data = {
        labels: labels,
        datasets: [
          {
            label: this.translate.instant('scoreSubmission.progressUpdate'),
            data: dataPoints,
            borderColor: '#3c81fb',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            pointRadius: 8,
            pointHoverRadius: 12,
          },
        ],
      };

      this.canvas = this.myChart.nativeElement;

      if (!this.ctx) this.ctx = this.canvas.getContext('2d');

      Chart.register(...registerables);

      if (!this.chart) {
        this.chart = new Chart(this.ctx, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            onClick: (evt, activeElements, chart) => {
              const labelIndex = activeElements[0]?.element.$context.parsed.x;
              this.selectedHistory = this.historyList[labelIndex];
              //  console.log("this.selectedHistory ", this.selectedHistory)
              this.popupService.open('history');
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: this.translate.instant('scoreSubmission.actualValue'),
                },
                suggestedMin: 0,
                suggestedMax: 200,
              },
            },
          },
        } as any);
      } else this.chart.data = data;
    }
  }

  back() {
    this._platformLocation.back();
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;
  }

  public GoalLevelText(level: number) {
    return this.translate.instant('scoreSubmission.' + LevelMode[level]);
  }
}
