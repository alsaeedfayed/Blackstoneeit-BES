
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesVariables } from '../../../routes';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-committee',
  templateUrl: './new-committee.component.html',
  styleUrls: ['./new-committee.component.scss']
})
export class NewCommitteeComponent extends ComponentBase implements OnInit, OnDestroy {

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


  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
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

    // // check if in edit page
    this.checkEdit();

  }
  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
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


  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
    .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }
  // // check if in edit page
  checkEdit() {
    if (this.router.url.includes('/edit/')) {

      //get id
      this.requestId = +this.activatedRoute.snapshot.paramMap.get('id');
      //check if fake id
      if (isNaN(this.requestId)) {
        this.goToNotFound();
        this.requestId = null;
      }
      else {
        this.isUpdating = true;
      }
    }
    else {
      this.isUpdating = false;
    }
  }

  // next button clicked
  checkTab(__isLastTab) {
   this.isLastTab =__isLastTab
  }
  isLastTab:boolean =false;
  toNextTabFlag: boolean = false;
  activeNextTab() {
    this.toNextTabFlag  = !this.toNextTabFlag ;
    
  }

  // save committee as draft
  saveDraft() {
    this.sendingLoading = true;

    this.httpSer
      .post(Config.CommitteesManagement.SaveDraft, this.CommitteeBasicInfo)
      .pipe(takeUntil(this.endSub$),finalize(() => (this.sendingLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.sendingLoading = true;
        // if (this.isUpdating) this.toastr.success(this.translate.instant('committeesNewRequest.editDraftSuccessMsg'));
        /* else*/ this.toastr.success(this.translate.instant('committeesNewRequest.saveDraftSuccessMsg'));
          this.goToList();
        }
      })


  }
  sendRequestBtn() {
    this.confirmationPopupService.open('send-request');
  }
  //  send request
  sendRequest() {
    this.confirmationPopupService.close('send-request');
    this.sendingLoading = true;

    this.httpSer.post(Config.CommitteesManagement.Save, this.CommitteeBasicInfo)
      .pipe(takeUntil(this.endSub$),finalize(() => (this.sendingLoading = false)))
      .subscribe(res => {
        if (res) {

          this.requestId = res.id;

          // send request
          this.httpSer.post(Config.CommitteesManagement.SendRequest, { "id": this.requestId })
          .pipe(takeUntil(this.endSub$))
            .subscribe(res2 => {
              if (res2) {
                this.toastr.success(this.translate.instant('committeesNewRequest.sendRequestSuccessMsg'));
                this.goToList();
              }
            });
        }
      });
  }



  // back to last page
  backToLastPage() {
    if (this.isUpdating) this.goToList();
    else this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`);
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  // go to details page
  goToList() {
    let path = `${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`;
    this.router.navigateByUrl(path);
  }

}
