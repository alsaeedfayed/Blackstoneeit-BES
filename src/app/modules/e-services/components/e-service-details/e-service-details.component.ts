import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { finalize, takeUntil } from "rxjs/operators";

import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";
import { TranslateService } from "@ngx-translate/core";
import { NgxCaptureService } from "ngx-capture";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";

@Component({
  selector: "app-e-service-details",
  templateUrl: "./e-service-details.component.html",
  styleUrls: ["./e-service-details.component.scss"],
})
export class EServiceDetailsComponent extends ComponentBase implements OnInit {
  eServiceId: string;
  EService;
  isLoading: boolean = false;
  lang: string = this.translate.currentLang;
  isCapturing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private httpHandlerService: HttpHandlerService,
    private captureService: NgxCaptureService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private elementRef: ElementRef
  ) {
    super(translateService, translate);

    this.eServiceId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getEServiceById();
    this.handleLangChange();
  }

  ngAfterViewInit() {
    // Get all elements with class "text-editor"
    const TextEditors =
      this.elementRef.nativeElement.querySelectorAll(".text-editor");
    // Loop through each "text-editor" element
    TextEditors.forEach(TextEditorContainer => {
      // Check if TextEditorContainer exists
      if (TextEditorContainer) {
        // Find all unordered lists (ul) within the TextEditorContainer
        const ulElements = TextEditorContainer.querySelectorAll("ul");
        // Loop through each ul element and apply the list style type
        ulElements.forEach(ul => {
          ul.style.listStyleType = "disc";
        });
      }
    });
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  getEServiceById() {
    this.isLoading = true;
    this.httpHandlerService
      .get(`${Config.EService.getEService}/${this.eServiceId}`)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        this.EService = res;
        for (let i = 0; i < this.EService.eServiceFields.length; i++) {
          if (
            this.EService.eServiceFields[i].name === "Addition Reason" ||
            this.EService.eServiceFields[i].name ===
              "Addition Main Objectives" ||
            this.EService.eServiceFields[i].name ===
              "Expected effects and results of implementing the request (positive and negative effects “risk management”)" ||
            this.EService.eServiceFields[i].name === "Attachments" ||
            this.EService.eServiceFields[i].name === "Moving Reason" ||
            this.EService.eServiceFields[i].name === "Moving Main Objective" ||
            this.EService.eServiceFields[i].name === "groupId" ||
            this.EService.eServiceFields[i].name === "relatedEServiceId" ||
            this.EService.eServiceFields[i].name ===
              "Change Units And Committees"
          )
            this.EService.eServiceFields[i].hidden = true;
        }

        // Get all elements with class "text-editor"
        const TextEditors =
          this.elementRef.nativeElement.querySelectorAll(".bulletpoints");
        // Loop through each "text-editor" element
        TextEditors.forEach(TextEditorContainer => {
          // Check if TextEditorContainer exists
          if (TextEditorContainer) {
            // Find all unordered lists (ul) within the TextEditorContainer
            const ulElements = TextEditorContainer.querySelectorAll("ul");
            // Loop through each ul element and apply the list style type
            ulElements.forEach(ul => {
              ul.style.listStyleType = "disc";
            });
          }
        });
      });
  }

  exportDataAsImage() {
    this.isCapturing = true;
    const imageElementContainer = document.querySelector(
      ".details-image"
    ) as HTMLElement;
    if (!imageElementContainer) return;
    setTimeout(() => {
      this.captureService
        .getImage(imageElementContainer, true)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isCapturing = false))
        )
        .subscribe(image => {
          var a = document.createElement("a"); //Create <a>
          a.href = image; //Image Base64 Goes here
          a.download = "Customer Serivce " + this.eServiceId + ".png"; //File name Here
          a.click(); //Downloaded file
        });
    }, 100);
  }
}
