import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { IOption } from './iOption.interface';
import { ITask } from './iTask.interface';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Component({
  selector: "app-request-details",
  templateUrl: "./request-details.component.html",
  styleUrls: ["./request-details.component.scss"],
})
export class RequestDetailsComponent extends ComponentBase implements OnInit {
  //capture screen used for exportDataAsImage()
  @ViewChild("screen", { read: ElementRef })
  childElement: ElementRef<HTMLElement>;
  exportAsConfig: ExportAsConfig = {
    type: "png", // the type you want to download
    elementIdOrContent: "detailsImage", // the id of html/table element
    options: {
      // Options references:
      // https://html2canvas.hertzen.com/documentation
      // https://github.com/microsoft/SiteInspector/blob/310958e2f271cd3003218409a58453097dcb8dfe/src/Tabs/CaptureTab/views/component.jsx#L27
      // Helpful samples: https://snyk.io/advisor/npm-package/html2canvas/functions/html2canvas
      logging: true,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 5000,
      onclone: clonedElement => this.applyStylesToClonedHTML(clonedElement),
    },
  };

  status: any;
  tempStatus: any;
  options: IOption[] = [];
  tasks: ITask[] = [];
  steps = [];
  isLoading: boolean = false;
  public lang: string = this.translate.currentLang;
  public task = {};
  public isPopupOpen: boolean = false;
  selectedOpt: any;
  public requesterId: string;
  public isCapturing: boolean = false;
  public instanceId: number;
  serviceId: number;
  serviceRequestId: number;
  constructor(
    private httpHandlerService: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private modalService: ModelService,
    private userService: UserService,
    private exportAsService: ExportAsService,
    private router: Router
  ) {
    super(translateService, translate);

    // this.requestsService.refresh.subscribe(() => {
    //   this.getStatus();
    // });
    this.modalService.closeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isPopupOpen = false;
      });
  }

  ngOnInit(): void {
    this.getStatus();
    this.handleLangChange();
  }

  editRequestDetails() {
    this.router.navigate(["service-catalog/start-service"], {
      queryParams: {
        serviceId: this.serviceId,
        requesteId: this.serviceRequestId,
      },
    });
  }

  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        //this.translate.onLangChange.subscribe((language) => {
        this.lang = language.lang;
        // this.reloadRequest();
      });
  }

  reloadRequest() {
    this.getStatus();
  }

  getStatus() {
    this.status = null;
    this.options = [];
    this.steps = [];
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // this.activatedRoute.params.subscribe((params) => {
        this.httpHandlerService
          .get(Config.requests.GetStatus, { serviceRequestId: params["id"] })
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.status = res;
            this.requesterId = res?.requestInformation?.userData?.userId;
            this.serviceId = res?.requestInformation?.serviceId;
            this.serviceRequestId = params["id"];
            this.task = res.workflowDetails?.task;
            this.options = res.workflowDetails?.task?.options
              ? res.workflowDetails?.task?.options
              : [];
            this.steps = res.workflowDetails?.states;
            this.instanceId = res.workflowDetails?.instanceId;
          });
      });
  }

  // This function applying styles to the cloned HTML before exporting it to an image.
  private applyStylesToClonedHTML(clonedElement) {
    // console.log("clone");

    // Step 1: create <style> tag to contain the styles for the element before export.
    const style = clonedElement.createElement("style");

    // Step 2: create all required styles to modify the element before export.
    // Note: some styles are not supported by html2canvas the package that handles exporting element.
    // Please check html2canvas documentations -> features -> Unsupported CSS properties.
    style.innerHTML = `
			.status{
			margin-bottom:0;
			}
			.status,.details{padding:2rem;}
			.approval-timeline-item,
			.req-date .data-info,
			.req-date .data-details{
			box-shadow: unset!important;
			}
			.approval-timeline-item.upcoming,
			.req-date .data-info,
			.req-date .data-details{
			border: 1px solid #64748b!important;
			}
			`;

    // Step append the style element to the target element of export to apply the styling before exporting the image.
    clonedElement.body.appendChild(style);
  }

  public exportDataAsImage() {
    this.isCapturing = true;

    // download the file using old school javascript method
    setTimeout(() => {
      this.exportAsService
        .save(
          this.exportAsConfig,
          this.status?.requestInformation?.requestNumber
        )
        .subscribe({
          next: x => {
            // console.log(`exportAsService: observer next ${x}`);
          },
          error: err => {
            // console.error(`exportAsService: observer error ${err}`);
          },
          complete: () => {
            // console.log("Observer got a complete notification");
            this.isCapturing = false;
          },
        });
    }, 1000);
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.exportAsConfig).subscribe(content => {
    //   console.log("content", content);
    // });
  }

  get ShowTasks() {
    return (
      this.requesterId.toLocaleLowerCase() !=
      this.userService.getCurrentUserId().toLocaleLowerCase()
    );
  }

  openActionModel(option) {
    this.isPopupOpen = true;
    this.selectedOpt = option;
    this.modalService.open("req-details-action-model" + option?.id);
  }

  actionTakenHandler() {
    this.isLoading = true;
    setTimeout(() => {
      this.reloadRequest();
    }, 3000);
  }
}
