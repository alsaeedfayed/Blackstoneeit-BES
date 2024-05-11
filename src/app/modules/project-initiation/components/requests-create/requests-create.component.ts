import {CdkStepper} from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  RequestsOrganizationFormComponent
} from './components/requests-organization-form/requests-organization-form.component';
import {RequestsOverviewFormComponent} from './components/requests-overview-form/requests-overview-form.component';
import {RequestsPlanningFormComponent} from './components/requests-planning-form/requests-planning-form.component';
import {
  RequestsStrategicImpactComponent
} from "./components/requests-strategic-impact/requests-strategic-impact.component";
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {RequestsCreateService} from './services/requests.service';
import {TranslationService} from 'src/app/core/services/translate.service';
import {RequestsModalComponent} from './components/requests-modal/requests-modal.component';
import {FormArray, FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {RequestsTranslationsComponent} from './components/requests-translations/requests-translations.component';
import {ProjectDocumentListComponent} from 'src/app/shared/project-document-list/project-document-list.component';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {LookupService} from 'src/app/core/services/lookup.service';
import {UserService} from 'src/app/core/services/user.service';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';
import {finalize} from "rxjs/operators";
import {log} from "ng-zorro-antd/core/logger";

declare let $: any;

@Component({
  selector: 'app-requests-create',
  templateUrl: './requests-create.component.html',
  styleUrls: ['./requests-create.component.scss']
})
export class RequestsCreateComponent extends ComponentBase implements OnInit, OnDestroy {
  readonly: boolean;
  requestData: any;
  requestActions: any;
  @Input() criterias: any;
  isTranslationRequired: any;
  @ViewChild('cdkStepper')
  cdkStepper: CdkStepper;
  @ViewChild(RequestsOverviewFormComponent) requestsOverviewFormComponent;
  @ViewChild(RequestsStrategicImpactComponent) requestsStrategicImpactComponent;
  @ViewChild(RequestsOrganizationFormComponent) requestsOrganizationFormComponent;
  @ViewChild(RequestsPlanningFormComponent) requestsPlanningFormComponent;
  @ViewChild(RequestsModalComponent) requestsModalComponent;
  @ViewChild(RequestsTranslationsComponent) requestsTranslationsComponent;
  @ViewChild(ProjectDocumentListComponent) requestsDocumentListComponent;
  overviewForm: any;
  strategicImpactForm: any;
  oraganizationForm: any;
  planningForm: any;
  lang: string;
  milestonesArr: any = [];
  popupConfig: any;
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();
  @Output() cloneRequest: EventEmitter<any> = new EventEmitter();
  @Input() displayLoadingModal: boolean;
  isFormSubmitted: boolean;
  isStepperValid: boolean
  newRequestData: any;
  private subscriptions = new Subscription();
  overviewOrigins: any;
  overviewTypes: any;
  overviewCategories: any;
  organizationDeliveryTypes: any;
  translationForm: any;
  createdRequestId: any;
  documentsToUpload: any;
  treeData: any;
  public instanceId: number;
  requestId: string;
  isOwner: boolean;
  isPm: boolean;
  isPmo: boolean;

  constructor(private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private popupService: PopupService,
              private requestsCreateService: RequestsCreateService,
              private translationService: TranslateConfigService,
              private instantTranslator: TranslateService,
              private lookupService: LookupService,
              private userService: UserService,
              private toastr: ToastrService,
              private router: Router,
              private confirmationPopupService: ConfirmModalService
  ) {
    super(translationService, instantTranslator);
    this.route.paramMap.subscribe(paramMap => {
      this.requestId = paramMap.get('id')
    })

  }


  getRequestData(id) {
    this.requestsCreateService.saveLoadingModalState(true)
    this.subscriptions.add(this.requestsCreateService.getRequestById(id).subscribe(res => {
      this.requestData = res;
      this.instanceId = res?.instanceId;
      this.isOwner = res.owner.id == this.userService.getCurrentUserId()
      this.isPm = res.manager?.id == this.userService.getCurrentUserId()
      this.isPmo = this.userService.getCurrentUserClaims().includes(4000)
      //Open edit mode for returned and drafted requests
      // if (this.isOwner && (res.status.mappedStatusCode === 'ReturnedForCorrection' || res.status.code === 'Draft')) {
      if (this.isOwner && (res.canEdit)) {
        this.readonly = false
        this.displayLoadingModal = false
        this.getTranslationSetting()
        this.bindFormsValues(res)
        return
      }
      //Get states for overtstep actions
      if (res.instanceId) {
        this.getRequestInstances(res.instanceId)
      }
      this.readonly = true
      this.displayLoadingModal = false
    }, err => {
      this.toastr.error(err.message)
    }))
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.requestsCreateService.resetStepperState()
    this.requestsCreateService.resetLoadingModalState()
  }

  ngAfterViewInit(): void {
    this.overviewForm = this.requestsOverviewFormComponent?.overviewFrom
    this.strategicImpactForm = this.requestsStrategicImpactComponent?.strategicImpactForm
    this.oraganizationForm = this.requestsOrganizationFormComponent?.oraganizationForm
    this.planningForm = this.requestsPlanningFormComponent?.projectPlanningForm
    this.translationForm = this.requestsTranslationsComponent?.translatedEnFieldsForm
    this.cdr.detectChanges()
  }

  ngOnInit() {
    this.lang = this.translationService.getSystemLang()
    this.subscriptions.add(this.requestsCreateService.stepperState.subscribe(res => {
      if (res) {
        this.isStepperValid = Object.values(res).filter(item => item).length >= 4 ? true : false
      } else {
        this.isStepperValid = false
      }
    }))

    if (this.requestId) {
      this.getRequestData(this.requestId)
      this.getCriterias()
    }

    this.getOverviewLookups()
    this.getProjectDeliveryTypes()
    this.getStrategicKpis()

    this.subscriptions.add(this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    }))
    this.subscriptions.add(this.requestsCreateService.loadingModalState.subscribe(state => {
        this.displayLoadingModal = state
      })
    )
  }

  private handleLangChange() {

  }

  getRequestInstances(instanceId) {
    this.requestsCreateService.getInstanceStates(instanceId).subscribe(res => {
      this.requestsCreateService.saveForceActionSteps(res)
    })
  }

  getOverviewLookups() {
    this.subscriptions.add(this.requestsCreateService.getOverviewLookups().subscribe(res => {
      this.overviewOrigins = res.find(item => item.lookupType === 'ProjectOrigin').result
      this.overviewTypes = res.find(item => item.lookupType === 'ProjectType').result
      this.overviewCategories = res.find(item => item.lookupType === 'ProjectCategory').result
    }))
  }

  getProjectDeliveryTypes() {
    this.subscriptions.add(this.requestsCreateService.getDeliveryTypes().subscribe(res => {
      this.organizationDeliveryTypes = res
    }))
  }

  getStrategicKpis(goalIds?) {
    this.requestsCreateService.getStrategicKpis(goalIds).subscribe(res => {
      this.treeData = res
    })
  }

  getTranslationSetting() {
    this.lookupService.getSetting("IsTranslationRequired").subscribe(res => {
      this.isTranslationRequired = res.value === "true" ? true : false
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

  getCriterias() {
    this.lookupService.getCriterias().subscribe(res => {
      res.forEach(element => {
        element['code'] = element.id
      });
      this.criterias = res
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

  bindFormsValues(requestData): void {
    if (requestData) {
      //Bind overview data
      this.requestsOverviewFormComponent.overviewFrom.patchValue({
        projectName: this.requestData.name[this.lang],
        projectType: this.requestData.types,
        projectDescription: this.requestData.description[this.lang],
        projectCategory: this.requestData.categories,
        projectScope: this.requestData.projectScope[this.lang],
        projectOutOfScope: this.requestData.outOfScope[this.lang],
        projectOutcomes: this.requestData.expectedOutcomes[this.lang],
        projectExpectedBenefits: this.requestData.expectedBenefits[this.lang],
        projectOrigin: this.requestData.origins,
        projectIdea: this.requestData.projectIdea,
      })
      //Bind Organization data
      this.requestsOrganizationFormComponent.oraganizationForm.patchValue({
        managerId: this.requestData.manager,
        deliveryType: this.requestData?.deliveryType,
        sector: this.requestData.sector?.id ? this.requestData.sector?.id : null,
        area: this.requestData.area?.id ? this.requestData.area?.id : null,
        department: this.requestData.department?.id ? this.requestData.department?.id : null,
        externalEntities: this.requestData.externalEntities[this.lang]
      })

      const teamMembersFormArr: FormArray = this.requestsOrganizationFormComponent.oraganizationForm.controls.teamMemeberIds as FormArray
      this.requestData.teamMemebers.forEach(element => {
        teamMembersFormArr.push(new FormControl(element))
      });
      const sponsersFormArr: FormArray = this.requestsOrganizationFormComponent.oraganizationForm.controls.sponserIds as FormArray
      this.requestData.sponsers.forEach(element => {
        sponsersFormArr.push(new FormControl(element))
      });
      const externalStakeholdersFormArr: FormArray = this.requestsOrganizationFormComponent.oraganizationForm.controls.externalStakeholders as FormArray
      this.requestData.externalStakeholders.forEach(element => {
        externalStakeholdersFormArr.push(new FormControl(element))
      });

      this.requestsOrganizationFormComponent.getDepartmentsList(this.requestData.sector?.id)
      this.requestsOrganizationFormComponent.getAreasList(this.requestData.department?.id)

      // //Bind Strategic impact form
      this.requestsStrategicImpactComponent.strategicImpactForm.controls.projectStrategicKPI.setValue(true)
      //Bind Planning form
      this.requestsPlanningFormComponent.projectPlanningForm.patchValue({
        firstGroup: {
          projectBudget: this.requestData.budget,
          projectFromDuration: this.requestData.startDate ? this.formatDateToObject(this.requestData.startDate) : null,
          projectEndDuration: this.requestData.endDate ? this.formatDateToObject(this.requestData.endDate) : null,
        },
      })
      const milestonesFormArr: FormArray = this.requestsPlanningFormComponent.projectPlanningForm.controls.milestones as FormArray
      while (milestonesFormArr.length !== 0) {
        milestonesFormArr.removeAt(0)
      }
      this.requestsPlanningFormComponent.milestones = []
      this.requestData.milestones.forEach((element, index) => {
        milestonesFormArr.push(new FormControl({...element, generatedId: index + 1}))
        this.requestsPlanningFormComponent.milestones.push({...element, generatedId: index + 1})
      });

      //Bind translations


      this.subscriptions.add(this.requestsCreateService.stepperState.subscribe(res => {
        if (res) {
          this.isStepperValid = Object.values(res).filter(item => item).length >= 4 ? true : false
        } else {
          this.isStepperValid = false
        }
      }))

    }
  }

  // Stepper Controls
  onNext() {
    this.cdkStepper.next()
    this.isFormSubmitted = this.cdkStepper.selected.hasError

  }

  onPrev() {
    this.cdkStepper.previous()
  }

  //Request save
  saveRequest() {
    this.requestsCreateService.saveLoadingModalState(true)
    //check if milestones total equals 100%
    const sumOfMilestones = this.requestsPlanningFormComponent?.projectPlanningForm?.value.milestones.reduce((accumulator, object) => {
      return accumulator + object.weight;
    }, 0);
    if (sumOfMilestones !== 100) {
      this.toastr.error(this.instantTranslator.instant("initiationForm.milestoneValidationMsg"))
      this.requestsCreateService.saveLoadingModalState(false)
      return
    }
    //Check if milestones total is equal to project budget
    const sumOfMilestonesCost = this.requestsPlanningFormComponent?.projectPlanningForm?.value.milestones.reduce((accumulator, object) => {
      return accumulator + Number(object.cost);
    }, 0);

    if (sumOfMilestonesCost !== Number(this.requestsPlanningFormComponent?.projectPlanningForm?.value.firstGroup.projectBudget)) {
      this.toastr.error(this.instantTranslator.instant("initiationForm.totalCostValidationMsg"))
      this.requestsCreateService.saveLoadingModalState(false)
      return
    }

    if (this.isTranslationRequired) {
      this.toastr.error(this.instantTranslator.instant("initiationForm.translationValidationMsg"))
      this.requestsCreateService.saveLoadingModalState(false)
      return
    }
    this.submitRequestConfirmed(this.requestsTranslationsComponent?.translatedEnFieldsForm.value, false)

  }

  //Request Draft
  saveAsDraft() {
    this.submitRequestConfirmed(this.requestsTranslationsComponent?.translatedEnFieldsForm.value, true)
  }

  //Request Save confirmed
  submitRequestConfirmed(e, isDraft) {
    this.requestsCreateService.saveLoadingModalState(true)
    //Stepper forms
    const overviewForm = this.requestsOverviewFormComponent?.overviewFrom?.value
    const strategicImpactForm = this.requestsStrategicImpactComponent?.strategicImpactForm?.value
    const oraganizationForm = this.requestsOrganizationFormComponent?.oraganizationForm?.value
    const planningForm = this.requestsPlanningFormComponent?.projectPlanningForm?.value

    //Request object
    this.newRequestData = {
      categories: overviewForm?.projectCategory,
      id: this.requestData?.id ? this.requestData?.id : 0,
      isDraft: isDraft,
      name: e?.projectNameEn,
      types: overviewForm?.projectType ? overviewForm?.projectType : null,
      description: e?.projectDescriptionEn,
      projectScope: e?.projectScopeEn,
      expectedOutcomes: e?.projectExpectedOutcomesEn,
      expectedBenefits: e?.projectExpectedBenefitsEn,
      // strategicKPIs: strategicImpactForm?.projectStrategicKPI?.map(item => ({ id: item.id, title: item.title })).length !== 0 ? strategicImpactForm?.projectStrategicKPI?.map(item => ({ id: item.id, title: item.title })) : null,
      sectorId: oraganizationForm?.sector,
      areaId: oraganizationForm?.area,
      departmentId: oraganizationForm?.department,
      managerId: oraganizationForm?.managerId?.id ? oraganizationForm?.managerId?.id : null,
      teamMemeberIds: oraganizationForm?.teamMemeberIds?.map(item => item.id).length !== 0 ? oraganizationForm?.teamMemeberIds?.map(item => item.id) : null,
      sponserIds: oraganizationForm?.sponserIds?.map(item => item.id).length !== 0 ? oraganizationForm?.sponserIds?.map(item => item.id) : null,
      startDate: planningForm.firstGroup.projectFromDuration ? this.formatDate(planningForm.firstGroup.projectFromDuration) : null,
      endDate: planningForm.firstGroup.projectEndDuration ? this.formatDate(planningForm.firstGroup.projectEndDuration) : null,
      budget: planningForm?.firstGroup?.projectBudget,
      arabicDescription: e?.projectDescriptionAr,
      arabicProjectScope: e?.projectScopeAr,
      arabicExpectedOutcomes: e?.projectExpectedOutcomesAr,
      arabicExpectedBenefits: e?.projectExpectedBenefitsAr,
      arabicName: e?.projectNameAr ? e?.projectNameAr : e.projectNameEn,
      outOfScope: e.projectOutScopeEn,
      arabicOutOfScope: e?.projectOutScopeAr,
      origins: overviewForm?.projectOrigin,
      externalStakeholders: oraganizationForm?.externalStakeholders,
      deliveryType: oraganizationForm?.deliveryType?.id ? oraganizationForm?.deliveryType?.id : null,
      projectIdeaId: overviewForm?.projectIdea?.id ? overviewForm?.projectIdea?.id : null,
      externalEntities: e?.externalEntitiesEn,
      arabicExternalEntities: e?.externalEntitiesAr,
    }
    if (oraganizationForm?.deliveryType?.code == 'InhouseTeam') {
      delete this.newRequestData.externalEntities
      delete this.newRequestData.arabicExternalEntities
    }
    //Filter null values for draft request
    const filtredRequestObj = Object.entries(this.newRequestData).reduce((a, [k, v]) => (v === null ? a : (a[k] = v, a)), {})
    this.requestsCreateService.createRequest(filtredRequestObj).pipe(finalize(() => {
      this.requestsCreateService.saveLoadingModalState(false);
      this.displayLoadingModal = false
      this.removeModal()
    })).subscribe(res => {
      this.createdRequestId = res.id
      this.saveMilestones(res.id)
      this.removeModal()
    }, err => {
      this.requestsCreateService.saveLoadingModalState(false);
      const errorMsg = err.message[this.lang] ? err.message[this.lang] : err.message;
      this.toastr.error(errorMsg);
      this.removeModal()
    })

  }

  getCategories(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.overviewCategories.find(category => {
        return category.id == arr[i]
      });
    }
    return arr;
  }

  getTypes(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.overviewTypes.find(type => {
        return type.id == arr[i]
      });
    }
    return arr;
  }

  getOrigins(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.overviewOrigins.find(origin => {
        return origin.id == arr[i]
      });
    }
    return arr;
  }

  removeModal() {
    $("body").removeClass("modal-open")
  }

  //Save milestone
  saveMilestones(projectId) {
    //Check if there are no milestones added
    if (this.planningForm.value.milestones.length === 0) {
      this.toastr.success(this.instantTranslator.instant('initiationForm.requestSuccess'))
     this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('create-project/'+this.requestId)
      });
    } else {
      this.planningForm.value.milestones.forEach(element => {
        element['projectId'] = projectId
        this.milestonesArr.push({
          ...element,
          name: element.name[this.lang] ? element.name[this.lang] : element.name,
          // description: element?.id && element?.description ? element.description[this.lang] : element?.description,
          // description: element?.id && element?.description ? element?.description : null,
          deliverables: element.deliverables.map(function (a) {
            return a.title ? a.title.en : a.en;
          }),
          tasks: element.tasks.map(function (a) {
            return a.name ? a.name.en : a.en;
          }),
          dueDate: element?.dueDate?.day ? this.formatDate(element.dueDate) : element.dueDate
        })
      })
      this.milestonesArr.forEach(element => {
        delete element.generatedId
      });

      if (this.milestonesArr.length === 0) {
        this.toastr.success(this.instantTranslator.instant('initiationForm.requestSuccess'))
        this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl('create-project/'+this.requestId)
        });
      } else {
        this.createMilestonesInOrder()
      }
    }
    this.requestsCreateService.saveLoadingModalState(false)
  }

  //Create milestone in order
  createMilestonesInOrder(i = 0) {
    this.milestoneApiCall(this.milestonesArr[i], () => {
      if ((i + 1) == this.milestonesArr.length) {
        //Checking if user uploaded documents
        if (this.requestsDocumentListComponent.documents.filter(item => !item?.id).length !== 0) {

          this.documentsToUpload = this.requestsDocumentListComponent.documents.filter(item => !item?.id).map(item => ({
            projectId: this.createdRequestId,
            attachment: item.attachment,
            description: item.description
          }))
          this.uploadDocumentsInOrder()
        } else {
          this.resetStepperState()
        }
      } else {
        i++;
        this.createMilestonesInOrder(i)
      }
    })
  }

  uploadDocumentsInOrder(i = 0) {
    this.uploadDocumentApiCall(this.documentsToUpload[i], () => {
      if ((i + 1) == this.documentsToUpload.length) {
        this.resetStepperState()
      } else {
        i++;
        this.uploadDocumentsInOrder(i)
      }
    })
  }

  uploadDocumentApiCall(document, done) {
    this.requestsCreateService.addAttachment(document).subscribe(res => {
      done()
    }, err => {
      this.requestsCreateService.saveLoadingModalState(false)
      this.toastr.error(err.message[this.lang])
    })
  }


  //Reset state
  resetStepperState() {
    // this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
    //   this.router.navigateByUrl('create-project/'+this.requestId)
    // });
    this.router.navigateByUrl('/eppm-requests')
    this.toastr.success(this.instantTranslator.instant('initiationForm.requestSuccess'))
    this.milestonesArr = []
    this.documentsToUpload = []
  }

  // Milestone API Call
  milestoneApiCall(milestone, done) {
    console.log(milestone)
    this.requestsCreateService.createMilestone(milestone).subscribe(res => {
      done()
    }, err => {
      this.requestsCreateService.saveLoadingModalState(false)
      this.toastr.error(err.message[this.lang])
    })
  }

  //Workflow action click
  onActionClick(e) {
    //To be edited
    if (this.requestData.status.mappedStatusCode === 'ReturnedForCorrection' && e?.type === 'Transition') {
      //check if milestones total equals 100%
      const sumOfMilestones = this.requestsPlanningFormComponent?.projectPlanningForm?.value.milestones.reduce((accumulator, object) => {
        return accumulator + object.weight;
      }, 0);
      if (sumOfMilestones !== 100) {
        this.toastr.error(this.instantTranslator.instant("initiationForm.milestoneValidationMsg"))
        return
      }
      //Check if milestones total is equal to project budget
      const sumOfMilestonesCost = this.requestsPlanningFormComponent?.projectPlanningForm?.value.milestones.reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0);

      if (sumOfMilestonesCost !== Number(this.requestsPlanningFormComponent?.projectPlanningForm?.value.firstGroup.projectBudget)) {
        this.toastr.error(this.instantTranslator.instant("initiationForm.totalCostValidationMsg"))
        return
      }
    }
    this.popupConfig = {
      title: e.title,
      mode: 'action',
      dimensions: {
        height: 700,
        width: 800,
      },
      action: e
    }
    this.popupService.open('request-create')
  }


  //Workflow action click confirmed
  onActionConfirmed(e) {
    if (!e) {
      // this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
      //   this.router.navigateByUrl('create-project/'+this.requestId)
      // });
      this.router.navigateByUrl('/eppm-requests')
    } else {
      this.requestsCreateService.saveLoadingModalState(true)
      e.attachments?.forEach(element => {
        delete element.title
      });

      //Workflow actions
      if (e.type === 'Transition') {
        const requestData = {
          "optionId": e.optionId,
          "comments": e.comments,
          "attachments": e.attachments
        }
        this.requestsCreateService.actionPerform(requestData).subscribe(res => {
          if (this.requestData.status.mappedStatusCode === 'ReturnedForCorrection') {
            this.submitRequestConfirmed(this.requestsTranslationsComponent?.translatedEnFieldsForm.value, false)
          } else {
            this.getRequestData(this.requestId)
            this.toastr.success(this.instantTranslator.instant('initiationForm.actionSuccess'))
            this.popupService.close()
            this.requestsCreateService.saveLoadingModalState(false)

            this.isFormSubmitted = false
          }
        }, err => {
          this.requestsCreateService.saveLoadingModalState(false)

          this.toastr.error(err.message[this.lang])
        })
      }
      //Force Action
      if (e.type === 'ForceAction') {
        const requestData = {
          "instanceId": this.requestData.instanceId,
          "stateId": e.stateId,
          "comments": e.comments,
          "attachments": e.attachments
        }
        this.requestsCreateService.forceAction(requestData).subscribe(res => {
          this.getRequestData(this.requestId)
          this.toastr.success(this.instantTranslator.instant('initiationForm.actionSuccess'))
          this.popupService.close()
          this.requestsCreateService.saveLoadingModalState(false)
          this.isFormSubmitted = false
        }, err => {
          this.requestsCreateService.saveLoadingModalState(false)
          this.toastr.error(err.message[this.lang])
        })
      }
      //Reassgin
      if (e.type === 'ReassignAction') {
        const requestData = {
          "taskId": this.requestData.task.id,
          "usersIds": e.assignees.map(item => item.id),
          "comments": e.comments,
          "attachments": e.attachments
        }
        this.requestsCreateService.reassignAction(requestData).subscribe(res => {
          this.getRequestData(this.requestId)
          this.toastr.success(this.instantTranslator.instant('initiationForm.actionSuccess'))
          this.popupService.close()
          this.requestsCreateService.saveLoadingModalState(false)
          this.isFormSubmitted = false
        }, err => {
          this.requestsCreateService.saveLoadingModalState(false)
          this.toastr.error(err.message[this.lang])
        })
      }
      //Cancel Reassign
      if (e.type === 'CancelReassign') {
        const requestData = {
          "instanceId": this.requestData.instanceId,
          "comments": e.comments,
          "attachments": e.attachments
        }
        this.requestsCreateService.cancelReassign(requestData).subscribe(res => {
          this.getRequestData(this.requestId)
          this.toastr.success(this.instantTranslator.instant('initiationForm.actionSuccess'))
          this.popupService.close()
          this.requestsCreateService.saveLoadingModalState(false)
          this.isFormSubmitted = false
        }, err => {
          this.requestsCreateService.saveLoadingModalState(false)
          this.toastr.error(err.message[this.lang])
        })
      }
      this.popupService.close()
    }
  }

  onSetPriority() {
    const formattedCriterias = {
      overriding: this.criterias.filter(item => item.type === "Overriding"),
      strategicFit: this.criterias.filter(item => item.type === "Strategic Fit"),
      feasibility: this.criterias.filter(item => item.type === "Feasibility"),
    }
    formattedCriterias.overriding.forEach(element => {
      if (element.id) {

      }
    });
    formattedCriterias.strategicFit.forEach(x => {
      x["value"] = this.requestData?.scoreSheet?.criteriaScores?.find(item => item.criteriaId == x.id)?.score
    })
    formattedCriterias.feasibility.forEach(x => {
      x["value"] = this.requestData?.scoreSheet?.criteriaScores?.find(item => item.criteriaId == x.id)?.score
    }),

      this.popupConfig = {
        mode: 'priority',
        title: {en: "Set Priority", ar: "تحديد الأولوية"},
        dimensions: {width: 900, height: 900},
        criterias: formattedCriterias
      }
    this.popupService.open('request-create')
  }


  onSubmitPriority(priority) {
    this.requestsCreateService.saveLoadingModalState(true)
    this.requestsCreateService.submitPriority(priority).subscribe(res => {
      this.getRequestData(this.requestId)
      this.toastr.success(this.instantTranslator.instant("initiationForm.prioritySuccess"))
      this.popupService.close()
      this.requestsCreateService.saveLoadingModalState(false)

    }, err => {
      this.requestsCreateService.saveLoadingModalState(false)
      this.toastr.error(err.message)
    })
  }

  //Clone Request
  onCloneRequest() {

  }

  onUpdateData() {
    this.requestsCreateService.cloneRequest(this.requestData.id).subscribe(res => {
      // this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
      //   this.router.navigateByUrl('create-project/'+this.requestId)
      // });
      this.router.navigateByUrl('/eppm-requests')
    }, err => {
      this.toastr.error(err.message)
    })
  }


  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  formatDate(date) {
    const formatedDate = new Date(Date.UTC(date.year, date.month - 1, date.day))
    return formatedDate;
  }

  onPopupClose() {
    this.popupService.close()
  }

  onDelete() {
    this.confirmationPopupService.open();
  }

  deleteDraft() {
    this.requestsCreateService.deleteDraft(this.requestId).subscribe(res => {
      this.toastr.success(this.instantTranslator.instant('initiationForm.draftWasSuccessfullyDeleted'))
      this.router.navigateByUrl('/eppm-requests')
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

}
