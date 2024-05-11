import { PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ChangeRequestsService } from '../../services/change-requests.service';
import { ChangeRequestFormComponent } from 'src/app/modules/projects/components/projects-details/components/projects-change-requests/change-request-form/change-request-form.component';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { LookupService } from 'src/app/core/services/lookup.service';

@Component({
  selector: 'app-change-requests-details',
  templateUrl: './change-requests-details.component.html',
  styleUrls: ['./change-requests-details.component.scss']
})
export class ChangeRequestsDetailsComponent extends ComponentBase implements OnInit, OnDestroy {
  changeRequestData: any
  changeRequestId: any
  lang: string;
  active: number = 1
  accordionActiveIds: string[] = []
  displayLoadingModal: any;
  loading: boolean = false;
  isRequester: boolean = false;
  instanceId: number;
  private subscriptions = new Subscription();
  forceActionSteps: any;
  organizationChangesFlag: boolean = false;
  InformationChangesFlag: boolean = false;
  bodyChangeRequest: any;
  scheduleOptions: any;
  changeRequestOptions: any;
  changeRequestTypes: any;
  projectTypes = [];
  projectCategories = [];
  projectOrigins = [];
  likelihoods = [];
  risksTypes = [];
  impacts = [];

  @ViewChild(ChangeRequestFormComponent) changeRequestFormComponent: ChangeRequestFormComponent;

  constructor(
    private changeRequestsService: ChangeRequestsService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    translateService: TranslateConfigService,
    private attachmentService: AtachmentService,
    translate: TranslateService,
    public platformLocation: PlatformLocation,
    private projectsService: ProjectsService,
    private requestsCreateService: RequestsCreateService,
    private lookupService: LookupService,
    private router: Router,
  ) {
    super(translateService, translate);
    this.changeRequestId = this.route.snapshot.params['id']
  }

  ngOnInit() {

    this.getChangeRequestById(this.changeRequestId);
    this.getChangeRequestTypes();
    this.getChangeRequestOptions();
    this.getOverviewLookups();
    this.getRisksTypes();
    this.getLikelihoods();
    this.getImpacts();

    this.lang = this.translateService.getSystemLang()
    this.changeRequestsService.displayLoadingModal.subscribe(state => {
      this.displayLoadingModal = state
    })

    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getRisksTypes() {
    this.projectsService.getLookups().subscribe(res => {
      this.risksTypes = res.find(item => item.lookupType === 'RiskType').result;
      this.risksTypes.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }


  getLikelihoods() {
    this.subscriptions.add(this.lookupService.getLikelihoods().subscribe(res => {
      this.likelihoods = res;
      this.likelihoods.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    }));
  }

  getImpacts() {
    this.subscriptions.add(this.lookupService.getImpacts().subscribe(res => {
      this.impacts = res;
      this.impacts.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    }));
  }

  back() {
    this.platformLocation.back();
  }

  getChangeRequestOptions() {
    this.projectsService.getChangeRequestOptions().subscribe(res => {
      this.changeRequestOptions = res
      this.scheduleOptions = res.filter(item => item.code !== 'Decrease')
    })
  }

  getOverviewLookups() {
    this.requestsCreateService.getOverviewLookups().subscribe(res => {
      this.projectOrigins = res.find(item => item.lookupType === 'ProjectOrigin').result
      this.projectTypes = res.find(item => item.lookupType === 'ProjectType').result
      this.projectCategories = res.find(item => item.lookupType === 'ProjectCategory').result
    })
  }

  getChangeRequestTypes() {
    this.projectsService.getChangeRequestTypes().subscribe(res => {
      this.changeRequestTypes = res.map(item => ({ ...item, highlightChanges: false }))

      res.forEach((element, index) => {
        this.accordionActiveIds.push('ngb-panel-' + index)
      });
      this.accordionActiveIds.push('ngb-panel-' + res.length + 1)
    })
  }

  getChangeRequestById(id) {
    this.loading = true;
    this.changeRequestsService.saveLoadingModalState(true)
    this.subscriptions.add(this.changeRequestsService.getChangeRequest(id).subscribe(res => {
      this.loading = false;
      this.changeRequestData = res
      // this.changeRequestData["highlightChanges"] = false
      this.isRequester = (localStorage.getItem('$EPPM$userId') == this.changeRequestData?.createdBy?.id);
      this.instanceId = res?.instanceId;

      this.changeRequestData.milestones.map(milestone => {
        if (milestone.status.code === 'Edited') {
          this.changeRequestData.showHighlightChanges = true;
          this.changeRequestData.highlightMilestonesChanges = true;
        }
      })

      this.changeRequestData.changeTypes.forEach((element, index) => {
        this.accordionActiveIds.push('ngb-panel-' + index)
      });
      this.accordionActiveIds.push('ngb-panel-' + (this.changeRequestData.changeTypes.length + 1))

      this.changeRequestsService.saveLoadingModalState(false)
      this.getRequestInstances(res.instanceId)

    }
      , err => {
        this.toastr.error(err.message)
      }))
  }

  tojson(data) {
    return JSON.stringify(data);
  }

  getRequestInstances(instanceId) {
    this.changeRequestsService.getInstanceStates(instanceId).subscribe(res => {
      this.forceActionSteps = res
    })
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

  onActionClick(e) {
    this.changeRequestsService.savePopupConfig({
      optionId: e.id,
      title: e.title,
      btnLabel: e.label,
      mode: "workflow-form",
      isCommentRequired: e.isCommentRequired,
      action: e
    })
    this.popupService.open('change-request')
  }

  setBody(data) {
    this.bodyChangeRequest = data;
  }

  async updateChangeRequest() {
    if (this.bodyChangeRequest === undefined) {
      this.bodyChangeRequest = this.changeRequestFormComponent?.getData();
    }
    if (typeof this.bodyChangeRequest == "string") {
      this.toastr.error(this.bodyChangeRequest);
      return null;
    } else {
      try {
        // const response = await this.projectsService.registerChangeRequest(this.bodyChangeRequest).toPromise();
        // return response
        await this.projectsService.registerChangeRequest(this.bodyChangeRequest).subscribe(res => {
          if (res) {
            this.toastr.success(this.translate.instant("changeRequests.successUpdateMsg"))
            this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl('change-requests/details/' + this.changeRequestId)
            })
          }
        })
      } catch (e) {
        this.changeRequestsService.saveLoadingModalState(false);
        this.toastr.error(e?.message !== undefined ? e?.message[this.lang] : e[Object.keys(e)[0]])
        return null;
      }
    }
  }

  mileStoneUpdated() {
    if (this.isRequester && this.changeRequestData?.status?.mappedStatusCode == 'ReturnedForCorrection') {
      this.changeRequestFormComponent.sendDataEvent();
    }
  }

  async onActionConfirmed(e, isReturnedCorrection) {
    // if (!e) {
    this.getChangeRequestById(this.changeRequestId);
    // this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
    //   this.router.navigateByUrl('change-requests/details/' + this.changeRequestId,)
    // })
    // } else {


    //   this.changeRequestsService.saveLoadingModalState(true)

    //   if (e?.action?.type === 'ForceAction') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       stateId: e?.stateId,
    //       instanceId: this.changeRequestData.instanceId
    //     }
    //     this.changeRequestsService.forceAction(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.changeRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }

    //   if (e?.action?.type === 'Transition') {
    //     const requestData = {
    //       "optionId": e?.optionId,
    //       "comments": e?.comments,
    //       "attachments": e?.attachments
    //     }

    //     if (isReturnedCorrection && this.isRequester) {
    //       const response = await this.updateChangeRequest();
    //       if (response !== null) {
    //         this.changeRequestsService.actionPerform(requestData).subscribe(res => {
    //           this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //           this.getChangeRequestById(this.changeRequestId)
    //           this.popupService.close()
    //         }, err => {
    //           this.toastr.error(err.message)
    //           this.changeRequestsService.saveLoadingModalState(false)
    //         })
    //         return
    //       } else {
    //         this.changeRequestsService.saveLoadingModalState(false);
    //       }
    //     }
    //     else {
    //       this.changeRequestsService.actionPerform(requestData).subscribe(res => {
    //         this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //         this.getChangeRequestById(this.changeRequestId)
    //         this.popupService.close()
    //       }, err => {
    //         this.toastr.error(err.message)
    //         this.changeRequestsService.saveLoadingModalState(false)
    //       })
    //     }
    //     return
    //   }

    //   if (e?.action?.type === 'ReassignAction') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       usersIds: e?.usersIds,
    //       taskId: e?.taskId
    //     }
    //     this.changeRequestsService.reassignAction(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.changeRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }

    //   if (e?.action?.type === 'CancelReassign') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       instanceId: this.changeRequestData.instanceId
    //     }
    //     this.changeRequestsService.cancelReassign(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.changeRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }
    // }
  }

}
