import { take, takeUntil } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { PopupService } from "src/app/shared/popup/popup.service";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Subject } from "rxjs";
import { LevelMode } from "src/app/modules/Planning/enum/enums";
import { TranslateService } from "@ngx-translate/core";
import { Config } from "src/app/core/config/api.config";

@Component({
  selector: "submit-score-submittion-status",
  templateUrl: "./submit-score-submittion-status.component.html",
  styleUrls: ["./submit-score-submittion-status.component.scss"],
})
export class SubmitScoreSubmittionStatusComponent implements OnInit, OnDestroy {

  private endSub$ = new Subject();
  public loading: boolean = false;
  public periodId: number = 0;
  public scorecardId: number = 0;
  public data;

  constructor(
    private popupService: PopupService,
    private _http: HttpHandlerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.popupService.data.pipe(take(1)).subscribe(data => {
      if (!!data) {
        this.periodId = data?.periodId;
        this.scorecardId = data?.scorecardId;
        this.getDatails();
      }
    });
  }

  private getDatails() {
    this._http
      .get(
        `${Config.Performance.submittionStatusDetails}/${this.scorecardId}/${this.periodId}`
      )
      .pipe(takeUntil(this.endSub$))
      .subscribe(data => {
        this.data = data;
      });
  }

  public getLevelText(level: LevelMode): string {
    if (!LevelMode[level]) return "";
    return this.translate.instant("shared." + LevelMode[level]);
  }

  public getStatusName(status: any): { label: string; className: string } {
    if (status == 0) {
      return {
        label: this.translate.instant("shared.NotSubmitted"),
        className: "inprogress",
      };
    } else if (status == 1) {
      return {
        label: this.translate.instant("shared.Submitted"),
        className: "active",
      };
    } else {
      return { label: "", className: "" };
    }
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

  closePopup() {
    this.popupService.close();
  }
}
