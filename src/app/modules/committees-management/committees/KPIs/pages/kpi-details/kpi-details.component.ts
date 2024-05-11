import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { take, takeUntil, map, finalize } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { MeasurementRecurrences } from "src/app/modules/committees-management/requests/models/MeasurementRecurrences";
import { MeasurementRecurrenceService } from "src/app/modules/committees-management/requests/services/measurementRecurrence/measurement-recurrence.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { attachmentModel } from "../../../models/attach";
import { AtachmentService } from "src/app/core/services/atachment.service";

@Component({
  selector: "app-kpi-details",
  templateUrl: "./kpi-details.component.html",
  styleUrls: ["./kpi-details.component.scss"],
})

export class KPIDetailsComponent extends ComponentBase implements OnInit {
  private endSub$ = new Subject();

  isLoading: boolean = true;
  pageTitle: string;
  kpiId: number;
  data: any;
  committeeId: number;
  measurementRecurrence: MeasurementRecurrences[];
  measurementTypes : any[] = []
  selectedProgress: any;
  isProgressModalOpen: boolean = false;
  oldAttachments: attachmentModel[][] = [];
  lang: string = this.translate.currentLang;
  measurmentType: number;

  // description see more  vars
  descTextInitialLimit = 100;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  @Output() onClose = new EventEmitter();

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private toastSer: ToastrService,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private measurmentRecurrenceService: MeasurementRecurrenceService,
    private httpService: HttpHandlerService,
    private modelService: ModelService,
    private attachmentService: AtachmentService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.loadData();
    //this.pageTitle = this.translate.instant('committeeKPIs.details.header')

    this.handleLangChange();
    //this.pageTitle = this.translate.instant('')
    this.measurementRecurrence = this.measurmentRecurrenceService.getMeasures();
    this.measurementTypes= this.measurmentRecurrenceService.getMeasureTypes()
  }

  private loadData() {
    this.activeRouted.params.pipe(take(1)).subscribe((params: Params) => {
      this.kpiId = params["kpiId"];

      this.committeeId = params["committeeId"];

      this.getDetails(this.kpiId);
    });
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }
  private getDetails(id) {
    this.httpService
      .get(`${Config.CommitteeKpi.GetById}/${id}`)
      .pipe(takeUntil(this.endSub$), finalize(() => { this.isLoading = false; }))
      .subscribe(res => {

        this.data = res;
        this.measurmentType = res.measurementType;

        res.progress.forEach((progress, i) => {
          this.oldAttachments[i] = [];
          this.oldAttachments[i] = (
            progress.attachments.map((a, j) => ({
              id: j,
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName,
            }))
          );
        });

        this.translate.get("committeeKPIs.details.header").pipe(takeUntil(this.endSub$)).subscribe(res => {
          this.pageTitle =
            res +
            " " +
            "-" +
            " " +
            (this.lang == "en" ? this.data?.name : this.data?.nameAr);


        });
      });
  }


  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.lang = this.translate.currentLang;
      this.translate.get("committeeKPIs.details.header").subscribe(res => {
        this.pageTitle =
          res +
          " " +
          "-" +
          " " +
          (this.lang == "en" ? this.data?.name : this.data?.nameAr);
      });
    });
  }

  // open kpi details model
  showProgress(item: any) {
    this.isProgressModalOpen = true;
    this.selectedProgress = item;
    this.modelService.open("kpi-details");
  }

  closePopup() {
    this.selectedProgress = null;
    this.onClose.emit();
    this.modelService.close();
    this.isProgressModalOpen = false;
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}
