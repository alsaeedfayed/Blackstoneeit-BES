import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { finalize, debounceTime, takeUntil } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmModalService } from "src/app/shared/confirm-modal/confirm-modal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { RoutesVariables } from "../../../routes";
import { Subject } from "rxjs";
@Component({
  selector: "app-new-modify-requests",
  templateUrl: "./new-modify-requests.component.html",
  styleUrls: ["./new-modify-requests.component.scss"],
})
export class NewModifyRequestsComponent
  extends ComponentBase
  implements OnInit, OnDestroy {
    private endSub$ = new Subject();
  language: string = this.translate.currentLang;

  CommitteeBasicInfo: any = null;

  // // buttons vars
  sendingLoading: boolean = false;

  // validation
  isUpdating: boolean = false;
  isBasicInfoValid: boolean = false;
  isNameValid: boolean = false;
  isFileUploading: boolean = false;
  isLoadingData: boolean = true;

  requestId?: number = null;

  // validate cr reason
  isReasonValid: boolean = false
  // validate cr description
  isDescriptionValid: boolean = false


  //loading vars
  loadingDetails: boolean = true;
  lookupsLoading = true;
  loadingUsers: boolean = true;
  StrategicKpisLoading: boolean = true;
  kpisLoading: boolean = true;
  mainTasksLoading: boolean = true;

  form: FormGroup;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(translateService, translate);

  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // initialize change request form controls
    this.initChangeRequestFormControls();

    // check if in edit page
    this.checkEdit();
    this.form.valueChanges.pipe(debounceTime(250),takeUntil(this.endSub$)).subscribe((formValues) => {
      this.isReasonValid = this.form.get('reason').valid;
    })
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  // initialize new committee form controls
  initChangeRequestFormControls() {
    this.form = this.fb.group({
      reason: [null, Validators.required],
      description: [null]
    });
  }

  // check if in edit page ====================================================================
  checkEdit() {
    this.requestId = +this.activatedRoute.snapshot.paramMap.get("id");
    if (isNaN(this.requestId)) {
      this.goToNotFound();
      this.requestId = null;
    }
    if (this.router.url.includes("/modify-request/")) {
      // guard the route and set CR data
      this.getLocalStorageCR();
      this.isUpdating = false;

    } else if (this.router.url.includes("/edit-change-request/")) {
      this.isUpdating = true;
    }
  }
  // get CR from local storage in case new modify request
  getLocalStorageCR() {
    //get change request object

    if (localStorage.getItem("changeRequestData")) {
      let changeRequestData = JSON.parse(
        localStorage.getItem("changeRequestData")
      );
      this.form.patchValue({
        reason: changeRequestData?.reason,
        description: changeRequestData?.description
      })
      this.isReasonValid = this.form.get('reason').valid;
    } else {
      this.router.navigateByUrl(
        `${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`
      );
    }
  }

  // next button clicked
  checkTab(__isLastTab) {
    this.isLastTab = __isLastTab
  }
  isLastTab: boolean = false;
  toNextTabFlag: boolean = false;
  activeNextTab() {
    this.toNextTabFlag = !this.toNextTabFlag;

  }

  // getReasonData
  getReasonData(data: any) {
    if (this.isUpdating) {

      this.form.patchValue({
        reason: data?.reason,
        description: data?.description
      })
      this.isReasonValid = this.form.get('reason').valid;
    }

  }
  // getBasicInfo
  getCommitteeBasicInfo(body) {
    this.CommitteeBasicInfo = body;
  }

  // check basic info validity
  checkBasicInfoValidation(isValid: boolean) {
    this.isBasicInfoValid = isValid
  }

  // check name validation
  checkNameValidation(isValid: boolean) {
    this.isNameValid = isValid;
  }

  // check if uploading files
  checkFileUploading(isValid: boolean) {
    this.isFileUploading = isValid;
  }

  // check if Loading data
  checkLoadingData(isValid: boolean) {
    this.isLoadingData = isValid;
  }
  // save draft
  saveDraft() {
    this.sendingLoading = true;

    const body = {
      committeeData: this.CommitteeBasicInfo,
      reason: this.form.value.reason,
      description: this.form.value.description,
      committeeId: this.CommitteeBasicInfo?.id,
      id: 0
    }

    if (this.isUpdating) body.id = this.requestId
    this.httpSer
      .post(Config.CommitteeModifyRequests.SaveDraft, body)
      .pipe(takeUntil(this.endSub$),finalize(() => (this.sendingLoading = false)))
      .subscribe(res => {
        if (res) {
          this.sendingLoading = true;
          // if (this.isUpdating) this.toastr.success(this.translate.instant('changeRequests.editDraftSuccessMsg'));
          /*else*/ this.toastr.success(this.translate.instant('changeRequests.saveDraftSuccessMsg'));

          this.form.reset();
          this.goToList();
        }
      });
  }

  sendRequestBtn() {
    this.confirmationPopupService.open("send-request");
  }
  // save and send request
  sendRequest() {
    this.confirmationPopupService.close("send-request");
    this.sendingLoading = true;

    const body = {
      committeeData: this.CommitteeBasicInfo,
      reason: this.form.value.reason,
      description: this.form.value.description,
      committeeId: this.CommitteeBasicInfo?.id,
      id: 0
    }
    if (this.isUpdating) body.id = this.requestId
    this.httpSer
      .post(Config.CommitteeModifyRequests.Save, body)
      .pipe(takeUntil(this.endSub$),finalize(() => (this.sendingLoading = false)))
      .subscribe(res => {
        if (res) {
          this.requestId = res.id;

          this.httpSer.post(Config.CommitteeModifyRequests.SendRequest, {
            id: this.requestId,
          })
          .pipe(takeUntil(this.endSub$))
          .subscribe(res2 => {
            if (res2) {
              this.toastr.success(
                this.translate.instant("changeRequests.sendRequestSuccessMsg")
              );
              this.form.reset();
              this.goToList();
            }
          })
        }
      });
  }

  // back to last page
  backToLastPage() {
    if (this.isUpdating) this.goToList();
    else
      this.router.navigateByUrl(
        `${RoutesVariables.Root}/${RoutesVariables.ModifyRequests.Root}`
      );
  }
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
  // go to list page
  goToList() {
    this.router.navigateByUrl('committees-management/modify-requests');
  }
  ngOnDestroy(): void {
    localStorage.removeItem("changeRequestData");
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
