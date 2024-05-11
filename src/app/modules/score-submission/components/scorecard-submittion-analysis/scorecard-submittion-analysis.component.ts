import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IWidgetItem } from 'src/app/shared/components/text-widget/IWidgetItem';

@Component({
  selector: 'scorecard-submittion-analysis',
  templateUrl: './scorecard-submittion-analysis.component.html',
  styleUrls: ['./scorecard-submittion-analysis.component.scss'],
})

export class ScorecardSubmittionAnalysisComponent implements OnInit {

  language: string = this.translate.currentLang;
  textWidgets: Array<IWidgetItem> = new Array<IWidgetItem>();
  @Input() actualScore: number = 0;
  @Input() targetScore: number = 0;
  @Input() performanceScore : number = 0; 
  @Input() notReportedCount: number = 0;
  @Input() offTrackCount: number = 0;
  @Input() onTrackCount: number = 0;
  @Input() overachievedCount: number = 0;
  @Input() totalKPIs: number = 0;
  @Input() notDueCount: number = 0;

  toolTips:{} = {
    "actual" : this.translate.instant('scoreSubmission.actualTooltip'),
    "target" : this.translate.instant('scoreSubmission.targetTooltip')
  }

  ngOnInit(): void {
    this.loadTextWidgets()
    this.handleLangChange();
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.loadTextWidgets();
      this.toolTips = {
        "actual" : this.translate.instant('scoreSubmission.actualTooltip'),
        "target" : this.translate.instant('scoreSubmission.targetTooltip')
      }
    });
  }

  constructor(private translate: TranslateService) {}

  loadTextWidgets() {
    this.textWidgets = [
      {
        title: this.translate.instant('scoreSubmission.totalKPIs'),
        number: this.totalKPIs,
        color: "#3c81fb"
      },
      {
        title: this.translate.instant('scoreSubmission.notDues'),
        number: this.notDueCount,
        color: "#717986"
      },
      {
        title: this.translate.instant('scoreSubmission.notReported'),
        number: this.notReportedCount,
        color: "#717986"
      },
      {
        title: this.translate.instant('scoreSubmission.OffTrack'),
        number: this.offTrackCount,
        color: "#ff285c"
      },
      {
        title: this.translate.instant('scoreSubmission.OnTrack'),
        number: this.onTrackCount,
        color: "#81d979"
      },
      {
        title: this.translate.instant('scoreSubmission.overAchieved'),
        number: this.overachievedCount,
        color: "#5271ff"
      }
    ]
  }

}
