import {CdkStepper} from '@angular/cdk/stepper';
import {
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
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {Observable, of, OperatorFunction, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, switchMap, catchError} from 'rxjs/operators';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {ProjectsService} from '../../../../../services/projects.service'
import {ArabicLettersAndNumbersOnly} from "../../../../../../../core/helpers/Arabic-Letters-And-Numbers-Only.validator";
import {EnglishLettersAndNumbersWithComma} from "../../../../../../../core/helpers/Emglish-letters-Numbers-Comma";
import {
  EnglishLettersAndNumbersOnly
} from "../../../../../../../core/helpers/English-Letters-And-Numbers-Only.validator";

@Component({
  selector: 'app-change-request-form',
  templateUrl: './change-request-form.component.html',
  styleUrls: ['./change-request-form.component.scss'],
})
export class ChangeRequestFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @Input() changeRequestTypes: any
  @Input() changeRequestOptions: any
  @Input() scheduleOptions: any
  @Input() projectData: any
  @Input() projectTypes: any
  @Input() projectCategories: any
  @Input() projectOrigins: any
  @Input() changeRequestData: any
  @Input() hideActions: boolean = false;
  @Output() sendData: EventEmitter<any> = new EventEmitter();
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();
  submitBtnText: string = "next"
  form: FormGroup
  sectorsList: any;
  lang: string
  cardActions: any = [
    {
      item: 'shared.update',
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit'
    },
  ]
  departmentsList: any;
  selectedAttachments: any = [];
  milestones: any = [];
  deletedMilestones: any = []
  projectEndDate: any;
  private subscriptions = new Subscription();
  deletedDeliverables: any;
  id;
  isEdit: boolean = false;
  oldChanges;

  scopeOptionsDesc = {
    increase: {en: "Add new deliverables", ar: "أضف تسليمات جديدة"},
    decrease: {en: "Remove deliverables", ar: "إزالة تسليمات"},
    readjust: {en: "Re-arranging project milestones deliverables", ar: "إعادة ترتيب تسليمات مراحل المشروع"},
  }
  scheduleOptionsDesc = {
    increase: {en: "Extend the project duration", ar: "تمديد مدة المشروع"},
    readjust: {en: "Change the due date for project milestones", ar: "تغيير موعد استحقاق مراحل المشروع"},
  }
  costOptionsDesc = {
    increase: {en: "Increase the project budget", ar: "زيادة ميزانية المشروع"},
    decrease: {en: "Reducing project budget", ar: "تقليل ميزانية المشروع"},
    readjust: {en: "Redistribute the budget over the project milestones", ar: "إعادة توزيع الموازنة على مراحل المشروع"},
  }

  constructor(private fb: FormBuilder,
              private popupService: PopupService,
              private toastr: ToastrService,
              private instantTranslator: TranslateService,
              private projectsService: ProjectsService,
              private translationService: TranslateConfigService) {
    this.lang = this.translationService.getSystemLang();
    this.form = this.fb.group({
      title: [null, Validators.required],
      requestType: new FormArray([], Validators.required),
      organization: this.fb.group({
        managerId: [null],
        sponserIds: this.fb.array([]),
        sectorId: [null],
        departmentId: [null],
        reasons: [null, Validators.required],
      }),
      schedule: this.fb.group({
        endDate: [null, Validators.required],
        reasons: [null, Validators.required],
        changeType: [null, Validators.required]
      }),
      cost: this.fb.group({
        amount: [null, Validators.required],
        reasons: [null, Validators.required],
        changeType: [null, Validators.required],
      }),
      scope: this.fb.group({
        reasons: [null, Validators.required],
        changeType: [null, Validators.required]
      }),
      information: this.fb.group({
        projectName: [this.projectData?.name.en ?? null, Validators.required],
        projectNameAr: [this.projectData?.name?.ar ?? null, Validators.required],
        projectType: [this.projectData?.types ?? [], Validators.required],
        projectDescription: [this.projectData?.description?.en ?? null, EnglishLettersAndNumbersWithComma()],
        projectDescriptionAr: [this.projectData?.description?.ar ?? null, ArabicLettersAndNumbersOnly()],
        projectCategory: [this.projectData?.categories ?? [], Validators.required],
        projectScope: [this.projectData?.projectScope?.en ?? null, EnglishLettersAndNumbersWithComma()],
        projectScopeAr: [this.projectData?.projectScope?.ar ?? null, ArabicLettersAndNumbersOnly()],
        projectOutOfScope: [this.projectData?.outOfScope?.en ?? null, EnglishLettersAndNumbersWithComma()],
        projectOutOfScopeAr: [this.projectData?.outOfScope?.ar ?? null, ArabicLettersAndNumbersOnly()],
        projectOutcomes: [this.projectData?.expectedOutcomes?.en ?? null, EnglishLettersAndNumbersWithComma()],
        projectOutcomesAr: [this.projectData?.expectedOutcomes?.ar ?? null, ArabicLettersAndNumbersOnly()],
        projectExpectedBenefits: [this.projectData?.expectedBenefits?.en ?? null, EnglishLettersAndNumbersWithComma()],
        projectExpectedBenefitsAr: [this.projectData?.expectedBenefits?.ar ?? null, ArabicLettersAndNumbersOnly()],
        projectOrigin: [this.projectData?.origins ?? [], Validators.required],
        projectIdea: [this.projectData?.projectIdea ?? null],
        reasons: [null, Validators.required],
      }),
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Copy milestones array
    if (this.changeRequestData) {
      this.isEdit = true;
      this.projectData.budget = this.changeRequestData?.project?.budget;
      this.id = this.changeRequestData.id;
      this.milestones = []
      if (this.changeRequestData?.milestones?.length > 0) {
        this.changeRequestData?.milestones.forEach((element, i) => {
          element.deliverables = element?.deliverables?.map(item => ({
            ...item,
            title: typeof item?.title === 'object' ? item?.title[this.lang] : item?.title,
            deliverableId: item?.deliverableId
          }))
          element.generatedId = i + 1;
          this.milestones.push(element)
        });
      } else {
        this.changeRequestData?.project?.milestones.forEach((element, i) => {
          element.deliverables = element?.deliverables?.map(item => ({
            ...item,
            title: typeof item?.title === 'object' ? item?.title[this.lang] : item?.title,
            deliverableId: item?.id
          }))
          element.generatedId = i + 1;
          element.milestoneId = element?.id;
          delete element.id;
          this.milestones.push(element)
        });
      }
      this.projectEndDate = this.formatDateToObject(this.changeRequestData.project.endDate);

      this.form.get('title').setValue(this.changeRequestData.title);
      const scope = this.changeRequestData?.changeTypes.filter(type => {
        return type.type.code == 'Scope'
      })[0];
      const cost = this.changeRequestData?.changeTypes.filter(type => {
        return type.type.code == 'Cost'
      })[0];
      const schedule = this.changeRequestData?.changeTypes.filter(type => {
        return type.type.code == 'Schedule'
      })[0];
      const organization = this.changeRequestData?.changeTypes.filter(type => {
        return type.type.code == 'Organization'
      })[0];
      const information = this.changeRequestData?.changeTypes.filter(type => {
        return type.type.code == 'Information'
      })[0];
      const requestTypes: FormArray = this.form.controls.requestType as FormArray
      if (scope) {
        this.form.get('scope').get('changeType').setValue(scope?.changeType);
        this.form.get('scope').get('reasons').setValue(scope?.reasons);
        requestTypes.push(new FormControl('Scope'))
      }
      if (cost) {
        this.form.get('cost').get('changeType').setValue(cost?.changeType);
        this.form.get('cost').get('reasons').setValue(cost?.reasons);
        this.form.get('cost').get('amount').setValue(this.changeRequestData?.amount);
        requestTypes.push(new FormControl('Cost'))
      }
      if (schedule) {
        this.form.get('schedule').get('changeType').setValue(schedule?.changeType);
        this.form.get('schedule').get('reasons').setValue(schedule?.reasons);
        this.form.get('schedule').get('endDate').setValue(this.formatDateToObject(this.changeRequestData?.newEndDate));
        requestTypes.push(new FormControl('Schedule'));
      }
      if (organization) {
        this.form.get('organization').get('reasons').setValue(organization?.reasons);
        this.form.get('organization').get('departmentId').setValue(this.changeRequestData?.department?.id);
        this.form.get('organization').get('managerId').setValue(this.changeRequestData?.manager);
        this.form.get('organization').get('sectorId').setValue(this.changeRequestData?.sector?.id);
        if (this.changeRequestData?.sector?.id) {
          this.getDepartments(this.changeRequestData?.sector?.id);
        }
        requestTypes.push(new FormControl('Organization'));
        const sponserIds: FormArray = new FormArray([...this.changeRequestData?.sponsers.map(item => new FormControl(item))]);
        (this.form.get('organization') as FormGroup).setControl('sponserIds', sponserIds);
      }
      if (information) {
        this.form.get('information').get('projectName').setValue(this.changeRequestData?.information?.name?.en ?? null);
        this.form.get('information').get('projectNameAr').setValue(this.changeRequestData?.information?.name?.ar ?? null);
        this.form.get('information').get('projectType').setValue(this.changeRequestData?.information?.types ?? null);
        this.form.get('information').get('projectDescription').setValue(this.changeRequestData?.information?.description?.en ?? null);
        this.form.get('information').get('projectDescriptionAr').setValue(this.changeRequestData?.information?.description?.ar ?? null);
        this.form.get('information').get('projectCategory').setValue(this.changeRequestData?.information?.categories ?? null);
        this.form.get('information').get('projectScope').setValue(this.changeRequestData?.information?.projectScope?.en ?? null);
        this.form.get('information').get('projectScopeAr').setValue(this.changeRequestData?.information?.projectScope?.ar ?? null);
        this.form.get('information').get('projectOutOfScope').setValue(this.changeRequestData?.information?.outOfScope?.en ?? null);
        this.form.get('information').get('projectOutOfScopeAr').setValue(this.changeRequestData?.information?.outOfScope?.ar ?? null);
        this.form.get('information').get('projectOutcomes').setValue(this.changeRequestData?.information?.expectedOutcomes?.en ?? null);
        this.form.get('information').get('projectOutcomesAr').setValue(this.changeRequestData?.information?.expectedOutcomes?.ar ?? null);
        this.form.get('information').get('projectExpectedBenefits').setValue(this.changeRequestData?.information?.expectedBenefits?.en ?? null);
        this.form.get('information').get('projectExpectedBenefitsAr').setValue(this.changeRequestData?.information?.expectedBenefits?.ar ?? null);
        this.form.get('information').get('projectOrigin').setValue(this.changeRequestData?.information?.origins ?? null);
        this.form.get('information').get('projectIdea').setValue(this.changeRequestData?.information?.projectIdea ?? null);
        this.form.get('information').get('reasons').setValue(information?.reasons);
        requestTypes.push(new FormControl('Information'));
      }
      this.selectedAttachments = this.changeRequestData?.attachments;
      if (this.getForm.requestType?.value?.includes('Schedule')) {
        if (!this.cardActions.find(item => item.item === 'shared.delete'))
          this.cardActions.push({
            item: 'shared.delete',
            disabled: false,
            textColor: '',
            icon: 'bx bx-trash'
          })
      }
    } else if (this.projectData) {
      this.milestones = []
      this.projectData.milestones.forEach((element, i) => {
        element.deliverables = element?.deliverables?.map(item => ({
          ...item,
          title: typeof item?.title === 'object' ? item?.title[this.lang] : item?.title
        }))
        element.generatedId = i + 1;
        this.milestones.push(element)
      });
      this.projectEndDate = this.formatDateToObject(this.projectData.endDate);
    }
  }

  ngOnInit() {
    this.subscriptions.add(this.projectsService.milestone.subscribe(milestone => {
      if (milestone) {
        if (this.milestones.find(item => item.generatedId === milestone.generatedId)) {
          const milestoneToUpdate = this.milestones[this.milestones.findIndex(item => item.generatedId === milestone.generatedId)]
          milestone?.deliverables?.forEach(deliverable => {
            milestoneToUpdate?.deliverables?.forEach(element => {
              if (deliverable.id == element.id) {
                deliverable.deliverableId = element?.deliverableId;
              }
            });
          });
          this.milestones[this.milestones.findIndex(item => item.generatedId === milestone.generatedId)] = {
            ...milestone,
            dueDate: this.formatDate(milestone.dueDate),
            status: "Updated",
            // oldName: milestoneToUpdate.name == milestone.name ? null : milestoneToUpdate.name,
            // oldDueDate: milestoneToUpdate.dueDate == milestone.dueDate ? null : milestoneToUpdate.dueDate,
          }
          this.milestones[this.milestones.findIndex(item => item.generatedId === milestone.generatedId)].milestoneId = milestoneToUpdate.milestoneId ?? undefined;
        } else {
          this.milestones.push({...milestone, dueDate: this.formatDate(milestone.dueDate), status: "New"})
        }
      }
    }))

    this.subscriptions.add(this.projectsService.deletedDeliverables.subscribe(deliverables => {
      if (deliverables)
        this.deletedDeliverables = deliverables
    }))
    this.getSectorsList();
    this.form.valueChanges.subscribe(val => {
      const data = this.getData();
      this.sendData.emit(data);
      if (this.getForm.requestType?.value?.includes('Schedule')) {
        if (!this.cardActions.find(item => item.item === 'shared.delete'))
          this.cardActions.push({
            item: 'shared.delete',
            disabled: false,
            textColor: '',
            icon: 'bx bx-trash'
          })
      } else {
        this.cardActions = this.cardActions.filter(
          item => {
            return item.item !== "shared.delete"
          }
        );
      }
    })
    if (this.getForm.requestType?.value?.includes('Schedule')) {
      if (!this.cardActions.find(item => item.item === 'shared.delete'))
        this.cardActions.push({
          item: 'shared.delete',
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash'
        })
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  get getOverviewForm() {
    return (this.form.controls['information'] as FormGroup).controls;
  }

  get isIdea() {
    return this.form.controls['information'].get('projectOrigin').value.find(e => e.code == 'Idea');
  }

  get invalidOrganization() {
    if (this.getForm.organization.invalid || (!this.form.value.organization.managerId && !this.form.value.organization.sponserIds.length &&
      !this.form.value.organization.sectorId && !this.form.value.organization.departmentId)) {
      return true;
    }
    return false;
  }

  get IsNextBtnDisabled(): boolean {
    if (this.getForm.title.invalid ||
      this.getForm.requestType.invalid ||
      (this.getForm.requestType?.value?.includes('Organization') && this.invalidOrganization) ||
      (this.getForm.requestType?.value?.includes('Schedule') && this.getForm.schedule.invalid) ||
      (this.getForm.requestType?.value?.includes('Cost') && this.getForm.cost.invalid) ||
      (this.getForm.requestType?.value?.includes('Scope') && this.getForm.scope.invalid) ||
      (this.getForm.requestType?.value?.includes('Information') && this.getForm.information.invalid)) {
      return true;
    }
    return false;
  }

  getSectorsList() {
    this.projectsService.getSectors().subscribe(res => {
      this.sectorsList = res;
      this.sectorsList.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getDepartments(sectorId) {
    this.projectsService.getDepartments(sectorId).subscribe(res => {
      this.departmentsList = res;
      this.departmentsList.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  get getForm() {
    return this.form.controls
  }

  get getSponsors() {
    return this.form.controls.organization['controls'].sponserIds as FormArray
  }

  onChangeTypeChange(e, groupName) {
    const group: FormGroup = this.form.controls[groupName] as FormGroup
    if (groupName === 'cost') {
      if (e.code.toLowerCase() === 'readjust') {
        this.form.get('cost.amount').removeValidators(Validators.required);
        this.form.get('cost.amount').updateValueAndValidity();
      } else {
        this.form.get('cost.amount').setValidators(Validators.required);
        this.form.get('cost.amount').updateValueAndValidity();
      }
      group.controls.amount.reset()
    }
    if (groupName === 'schedule') {
      if (e.code.toLowerCase() === 'readjust') {
        this.form.get('schedule.endDate').removeValidators(Validators.required);
        this.form.get('schedule.endDate').updateValueAndValidity();
      } else {
        this.form.get('schedule.endDate').setValidators(Validators.required);
        this.form.get('schedule.endDate').updateValueAndValidity();
      }
      group.controls.endDate.reset()
    }
  }

  type: any;

  returnSharedInputs() {
    let key = this.type.toLowerCase()
    console.log(this.form.get(key))
    return this.form.get(key)
  }

  onRequestTypeChange(type, checked, i) {
    this.type = type
    this.returnSharedInputs()
    const requestTypes: FormArray = this.form.controls.requestType as FormArray

    if (checked && !requestTypes.value.includes(type)) {
      requestTypes.push(new FormControl(type))
    } else {
      requestTypes.removeAt(requestTypes.value.findIndex(item => item === type))
      this.form.controls[type.toLowerCase()].reset()
    }
    requestTypes.updateValueAndValidity()

    if (this.getForm.requestType?.value?.includes('Schedule')) {
      if (!this.cardActions.find(item => item.item === 'shared.delete'))
        this.cardActions.push({
          item: 'shared.delete',
          disabled: false,
          textColor: '',
          icon: 'bx bx-trash'
        })
    }

    if (this.getForm.requestType?.value.find(item => item != 'Organization' && item != 'Information') && type != ('Information' || 'Organization')) {
      this.submitBtnText = 'next';
    } else {
      this.submitBtnText = 'submit';
    }

    if (type == 'Information' && checked) {
      this.form.get('information').get('projectName').setValue(this.changeRequestData?.project.name.en ?? this.projectData?.name.en ?? null);
      this.form.get('information').get('projectNameAr').setValue(this.changeRequestData?.project.name.ar ?? this.projectData?.name.ar ?? null);
      this.form.get('information').get('projectType').setValue(this.changeRequestData?.project.types ?? this.projectData?.types ?? []);
      this.form.get('information').get('projectDescription').setValue(this.changeRequestData?.project.description.en ?? this.projectData?.description.en ?? null);
      this.form.get('information').get('projectDescriptionAr').setValue(this.changeRequestData?.project.description.ar ?? this.projectData?.description.ar ?? null);
      this.form.get('information').get('projectCategory').setValue(this.changeRequestData?.project.categories ?? this.projectData?.categories ?? []);
      this.form.get('information').get('projectScope').setValue(this.changeRequestData?.project.projectScope.en ?? this.projectData?.projectScope.en ?? null);
      this.form.get('information').get('projectScopeAr').setValue(this.changeRequestData?.project.projectScope.ar ?? this.projectData?.projectScope.ar ?? null);
      this.form.get('information').get('projectOutOfScope').setValue(this.changeRequestData?.project.outOfScope.en ?? this.projectData?.outOfScope.en ?? null);
      this.form.get('information').get('projectOutOfScopeAr').setValue(this.changeRequestData?.project.outOfScope.ar ?? this.projectData?.outOfScope.ar ?? null);
      this.form.get('information').get('projectOutcomes').setValue(this.changeRequestData?.project.expectedOutcomes.en ?? this.projectData?.expectedOutcomes.en ?? null);
      this.form.get('information').get('projectOutcomesAr').setValue(this.changeRequestData?.project.expectedOutcomes.ar ?? this.projectData?.expectedOutcomes.ar ?? null);
      this.form.get('information').get('projectExpectedBenefits').setValue(this.changeRequestData?.project.expectedBenefits.en ?? this.projectData?.expectedBenefits.en ?? null);
      this.form.get('information').get('projectExpectedBenefitsAr').setValue(this.changeRequestData?.project.expectedBenefits.ar ?? this.projectData?.expectedBenefits.ar ?? null);
      this.form.get('information').get('projectOrigin').setValue(this.changeRequestData?.project.origins ?? this.projectData?.origins ?? []);
      this.form.get('information').get('projectIdea').setValue(this.changeRequestData?.project.projectIdea ?? this.projectData?.projectIdea ?? null);
    }
  }

  onStepperNavigate() {
    if (this.cdkStepper.selectedIndex === 0 && (this.getForm.requestType?.value.find(item => item != 'Organization' && item != 'Information'))) {
      this.cdkStepper.next()
      this.submitBtnText = 'submit';
      // this.onRegisterChangeRequest()
      return
    }

    if (this.cdkStepper.selectedIndex === 0 && (this.getForm.requestType?.value.find(item => item == 'Organization' || item == 'Information'))) {
      //  this.cdkStepper.next()
      this.submitBtnText = 'submit';
      this.onRegisterChangeRequest()
      return
    }

    if (this.cdkStepper.selectedIndex !== 0) {
      this.onRegisterChangeRequest()
      return
    }

  }

  onPrevious() {
    this.cdkStepper.previous()
    if (this.getForm.requestType?.value.find(item => item != 'Organization' && item != 'Information')) {
      this.submitBtnText = 'next';
    } else {
      this.submitBtnText = 'submit';
    }
  }

  onDropDownSelect(event, milestone, index) {
    const newProjectBudget = this.form.value.cost?.changeType?.code === 'Decrease' ? this.projectData.budget - Number(this.form.value?.cost?.amount) : Number(this.form.value?.cost?.amount) + this.projectData.budget
    if (event === 'shared.update') {
      this.projectsService.savepopupConfig({
        title: {en: "Edit Phase", ar: "تحديث مرحلة"},
        mode: "milestone",
        milestone: milestone,
        crConfig: this.form.value,
        milestones: this.milestones,
        projectBudget: this.form.value?.cost?.amount ? newProjectBudget : this.projectData.budget,
        projectEndDate: this.form.value?.schedule?.endDate && JSON.stringify(this.form.value?.schedule?.endDate) != JSON.stringify({
          day: 1,
          month: 1,
          year: 1970
        }) ? this.form.value?.schedule?.endDate : this.projectData.endDate
      })
      this.popupService.open('project')
    }
    if (event === 'shared.delete') {
      this.deletedMilestones.push(milestone)
      this.milestones.splice(index, 1)
    }
  }

  onAddMilestone() {
    const newProjectBudget = this.form.value.cost?.changeType?.code === 'Decrease' ? this.projectData.budget - Number(this.form.value?.cost?.amount) : Number(this.form.value?.cost?.amount) + this.projectData.budget

    this.projectsService.savepopupConfig({
      title: {en: "Add Phase", ar: "إضافة مرحلة"},
      mode: "milestone",
      crConfig: this.form.value,
      milestones: this.milestones,
      projectBudget: this.form.value?.cost?.amount ? newProjectBudget : this.projectData.budget,
      projectEndDate: this.form.value?.schedule?.endDate && JSON.stringify(this.form.value?.schedule?.endDate) != JSON.stringify({
        day: 1,
        month: 1,
        year: 1970
      }) ? this.form.value?.schedule?.endDate : this.projectData.endDate
    })
    this.popupService.open('project')
  }

  onSelectSponsor(e, input) {
    const formArr: FormArray = this.form.controls.organization['controls'].sponserIds as FormArray
    e.preventDefault()
    if (this.form.controls.organization['controls'].sponserIds.value.filter(item => item.id === e.item.id).length === 0) {
      formArr.push(new FormControl(e.item))
      input.value = '';
    }
  }

  onUnselectSponsor(index) {
    const formArr: FormArray = this.form.controls.organization['controls'].sponserIds as FormArray
    formArr.removeAt(index)
  }

  onAttachmentChange(e) {
    this.projectsService.saveLoadingModalState(true)
    this.projectsService.onUploadAttachment(e.target.files[0]).subscribe((res: any) => {
      this.selectedAttachments.push({
        data: e.target.files[0],
        title: e.target.files[0].name,
        fileName: res.fileName,
        extension: res.extension,
        uploadedFileName: e.target.files[0].name
      })
      this.projectsService.saveLoadingModalState(false)
    }, err => {
      console.log(err)
      this.projectsService.saveLoadingModalState(false)
      this.toastr.error(err.message)
    })
  }

  onAttachmentDelete(i) {
    this.selectedAttachments.splice(i, 1)
  }

  onRegisterChangeRequest() {
    // debugger
    if (this.getForm.requestType?.value?.includes('Cost') || this.getForm.requestType?.value?.includes('Schedule')) {
      //check if milestones total weight equals 100%
      const sumOfMilestones = this.milestones.reduce((accumulator, object) => {
        return accumulator + object.weight;
      }, 0);
      if (sumOfMilestones !== 100) {
        this.toastr.error(this.instantTranslator.instant("projects.milestoneValidationMsg"))
        return
      }
      //Check if milestones total is equal to project budget
      const newProjectBudget = this.form.value.cost?.changeType?.code === 'Decrease' ? this.projectData.budget - Number(this.form.value?.cost?.amount) : Number(this.form.value?.cost?.amount) + this.projectData.budget
      const sumOfMilestonesCost = this.milestones.reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0);

      if (sumOfMilestonesCost !== newProjectBudget && this.getForm.requestType?.value?.includes('Cost')) {
        this.toastr.error(`${this.instantTranslator.instant("projects.milestonesTotalCostValidation1")} AED${sumOfMilestonesCost} ${this.instantTranslator.instant("projects.milestonesTotalCostValidation2")} AED${newProjectBudget}`)
        return
      }
    }

    if (this.getForm.requestType?.value?.includes('Schedule')) {
      if (new Date(this.formatDate(this.form.value.schedule.endDate)) <= new Date(this.projectData.startDate)) {
        this.toastr.error(this.instantTranslator.instant("projects.projectEndDateValidation"))
        return
      }
    }


    //Include deleted milestones
    const milestones = [...this.milestones, ...this.deletedMilestones.map(item => ({...item, isRemoved: true}))]

    this.projectsService.saveLoadingModalState(true)
    const newChangeRequest = {
      id: this?.id,
      projectId: this?.projectData?.id,
      title: this.form?.value?.title,
      information: this.form.value?.requestType?.includes("Information") ? {
        "reasons": this.form.value.information.reasons,
        "projectIdeaId": this.form.value.information.projectIdea,
        "name": this.form.value.information.projectName,
        "arabicName": this.form.value.information.projectNameAr,
        "description": this.form.value.information.projectDescription,
        "arabicDescription": this.form.value.information.projectDescriptionAr,
        "projectScope": this.form.value.information.projectScope,
        "arabicProjectScope": this.form.value.information.projectScopeAr,
        "expectedOutcomes": this.form.value.information.projectOutcomes,
        "arabicExpectedOutcomes": this.form.value.information.projectOutcomesAr,
        "expectedBenefits": this.form.value.information.projectExpectedBenefits,
        "arabicExpectedBenefits": this.form.value.information.projectExpectedBenefitsAr,
        "outOfScope": this.form.value.information.projectOutOfScope,
        "arabicOutOfScope": this.form.value.information.projectOutOfScopeAr,
        "types": this.form.value.information.projectType,
        "categories": this.form.value.information.projectCategory,
        "origins": this.form.value.information.projectOrigin
      } : null,
      organization: this.form.value?.requestType?.includes("Organization") ? {
        ...this.form.value.organization,
        sponserIds: this.form.value?.organization?.sponserIds?.map(item => item.id).filter(item => item).length === 0 ? null : this.form.value?.organization?.sponserIds?.map(item => item.id).filter(item => item),
        managerId: this.form.value?.organization?.managerId?.id,
      } : null,
      schedule: this.form.value?.requestType?.includes("Schedule") ? {
        ...this.form?.value?.schedule,
        changeType: this.form.value?.schedule?.changeType?.id,
        endDate: this.form.value?.schedule?.endDate ? this.formatDate(this.form.value?.schedule?.endDate) : null
      } : null,
      cost: this.form.value?.requestType?.includes("Cost") ? {
        ...this.form?.value?.cost,
        changeType: this.form?.value?.cost?.changeType?.id,
      } : null,
      scope: this.form.value?.requestType?.includes("Scope") ? {
        ...this.form?.value?.scope,
        changeType: this.form?.value?.scope?.changeType?.id,
      } : null,
      milestones: this.form.value?.requestType?.includes("Organization") && this.form.value?.requestType?.length === 1 ? null :
        milestones.map(item => ({
          name: !item?.name ? null : item?.name[this.lang] || item?.name,
          description: !item?.description ? null : item?.description[this.lang] || item?.description,
          cost: item?.cost,
          milestoneId: item?.id ? item?.id : null,
          dueDate: item?.dueDate,
          isRemoved: item?.isRemoved ? true : false,
          deliverables: item?.deliverables.map(deliverable => (
            {
              "deliverableId": deliverable?.id,
              "isRemoved": false,
              "title": deliverable?.title[this.lang] || deliverable?.title
            }
          )).concat(this.deletedDeliverables?.filter(x => x?.milestoneId === item.id).map(deletedDeliverable => ({
            "deliverableId": deletedDeliverable?.id,
            "id": deletedDeliverable?.id,
            "isRemoved": true,
            "title": deletedDeliverable?.title[this.lang] || deletedDeliverable?.title
          }))).filter(deliverable => deliverable),
          weight: item.weight,
        })),
      attachments: this.selectedAttachments.map(item => ({
        fileName: item.fileName,
        extension: item.extension,
        uploadedFileName: item.uploadedFileName
      }))
    }

    if (this.form.value?.requestType?.includes("Organization") && this.getForm.requestType?.value?.length === 1) {
      delete newChangeRequest.milestones
    }

    this.projectsService.registerChangeRequest(newChangeRequest).subscribe(res => {
      //debugger
      this.toastr.success(this.instantTranslator.instant("projects.changeRequestSuccess"))
      this.refreshParentComponent.emit()
      this.projectsService.saveLoadingModalState(false)
      this.form.reset()
      this.selectedAttachments = []
      this.milestones = []
      this.deletedMilestones = []
    }, err => {
      this.projectsService.saveLoadingModalState(false)
      // this.toastr.error(err["Scope.Reasons"])
    })
  }

  onTypeChange(e) {
    let innovativeProjectType;
    if (Array.isArray(e)) {
      innovativeProjectType = e.find(type => type.code === 'Innovative Project');
    } else if (e) {
      innovativeProjectType = (e.code === 'Innovative Project');
    }

    if (innovativeProjectType) {
      (this.form.controls.information as FormGroup).controls.projectIdea.setValidators([Validators.required]);
      (this.form.controls.information as FormGroup).controls.projectIdea.updateValueAndValidity();
    } else {
      (this.form.controls.information as FormGroup).controls.projectIdea.setValidators([]);
      (this.form.controls.information as FormGroup).controls.projectIdea.setValue(null);
    }
  }

  onOriginChange(e) {
    let innovativeProjectOrigin;
    if (Array.isArray(e)) {
      innovativeProjectOrigin = e.find(origin => origin.code === 'Idea');
    } else if (e) {
      innovativeProjectOrigin = (e.code === 'Innovative Idea');
    }

    if (innovativeProjectOrigin) {
      (this.form.controls.information as FormGroup).controls.projectIdea.setValidators([Validators.required]);
      (this.form.controls.information as FormGroup).controls.projectIdea.updateValueAndValidity();
    } else {
      (this.form.controls.information as FormGroup).controls.projectIdea.setValidators([]);
      (this.form.controls.information as FormGroup).controls.projectIdea.setValue(null);
    }
  }

  formatDate(date) {
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }


  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  getData() {

    const requestTypes: FormArray = this.form.controls.requestType as FormArray;

    if (!this.form.get('scope').valid && requestTypes.value.includes('Scope')) {
      return this.instantTranslator.instant("shared.validations.multipleRequired");
    }


    if (requestTypes.value.includes('Information')) {
      if (((this.form.get('information').get('projectName').value == "" || this.form.get('information').get('projectName').value == null || this.form.get('information').get('projectName').value == undefined || this.form.get('information').get('projectName').value == "null") &&
          (this.form.get('information').get('projectNameAr').value == "" || this.form.get('information').get('projectNameAr').value == null || this.form.get('information').get('projectNameAr').value == undefined || this.form.get('information').get('projectNameAr').value == "null") &&
          (this.form.get('information').get('projectType').value == "" || this.form.get('information').get('projectType').value == null || this.form.get('information').get('projectType').value == undefined || this.form.get('information').get('projectType').value == "null") &&
          (this.form.get('information').get('projectOrigin').value == "" || this.form.get('information').get('projectOrigin').value == null || this.form.get('information').get('projectOrigin').value == undefined || this.form.get('information').get('projectOrigin').value == "null") &&
          (this.form.get('information').get('projectCategory').value == "" || this.form.get('information').get('projectCategory').value == null || this.form.get('information').get('projectCategory').value == undefined || this.form.get('information').get('projectCategory').value == "null")) ||
        (!this.form.get('information').get('reasons').value || this.form.get('information').get('reasons').value == "" || this.form.get('information').get('reasons').value === null)) {
        return this.instantTranslator.instant("shared.validations.multipleRequired");
      }
    }

    if (requestTypes.value.includes('Organization')) {
      if (((this.form.get('organization').get('sectorId').value == "" || this.form.get('organization').get('sectorId').value == null || this.form.get('organization').get('sectorId').value == undefined || this.form.get('organization').get('sectorId').value == "null") &&
          (this.form.get('organization').get('departmentId').value == "" || this.form.get('organization').get('departmentId').value == null || this.form.get('organization').get('departmentId').value == undefined || this.form.get('organization').get('departmentId').value == "null") &&
          (this.form.get('organization').get('managerId').value == "" || this.form.get('organization').get('managerId').value == null || this.form.get('organization').get('managerId').value == undefined || this.form.get('organization').get('managerId').value == "null") &&
          (this.form.get('organization').get('sponserIds').value == "" || this.form.get('organization').get('sponserIds').value == null || this.form.get('organization').get('sponserIds').value == undefined || this.form.get('organization').get('sponserIds').value == "null")) ||
        (!this.form.get('organization').get('reasons').value || this.form.get('organization').get('reasons').value == "" || this.form.get('organization').get('reasons').value === null)) {
        return this.instantTranslator.instant("shared.validations.multipleRequired");
      }
    }

    if (requestTypes.value.includes('Schedule') &&
      (!this.form.get('schedule').get('changeType').value ||
        !this.form.get('schedule').get('reasons').value || this.form.get('schedule').get('reasons').value == "" ||
        this.form.get('schedule').get('changeType').value.id == 1 && !this.form.get('schedule').get('endDate').value
      )
    ) {
      return this.instantTranslator.instant("shared.validations.multipleRequired");
    }

    if (requestTypes.value.includes('Cost') &&
      (!this.form.get('cost').get('changeType').value ||
        !this.form.get('cost').get('reasons').value || this.form.get('cost').get('reasons').value == "" ||
        this.form.get('cost').get('changeType').value.id == 1 && !this.form.get('cost').get('amount').value
      )
    ) {
      return this.instantTranslator.instant("shared.validations.multipleRequired");
    }

    if (this.getForm.requestType?.value?.includes('Cost') || this.getForm.requestType?.value?.includes('Schedule')) {
      //check if milestones total weight equals 100%
      const sumOfMilestones = this.milestones.filter(milestone => {
        return milestone?.status?.code != 'Deleted'
      }).reduce((accumulator, object) => {
        return accumulator + object.weight;
      }, 0);
      if (sumOfMilestones !== 100) {
        return this.instantTranslator.instant("projects.milestoneValidationMsg");
      }
      //Check if milestones total is equal to project budget
      const newProjectBudget = this.form.value.cost?.changeType?.code === 'Readjust' ? this.projectData.budget : this.form.value.cost?.changeType?.code === 'Decrease' ? this.projectData.budget - Number(this.form.value?.cost?.amount) : Number(this.form.value?.cost?.amount) + this.projectData.budget
      const sumOfMilestonesCost = this.milestones.filter(milestone => {
        return milestone?.status?.code != 'Deleted'
      }).reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0);

      if (sumOfMilestonesCost !== newProjectBudget && this.getForm.requestType?.value?.includes('Cost')) {
        return this.instantTranslator.instant(`${this.instantTranslator.instant("projects.milestonesTotalCostValidation1")} AED${sumOfMilestonesCost} ${this.instantTranslator.instant("projects.milestonesTotalCostValidation2")} AED${newProjectBudget}`);
      }
    }

    if (this.getForm.requestType?.value?.includes('Schedule')) {
      if (this.form.value.schedule?.changeType?.code != 'Readjust' && new Date(this.formatDate(this.form.value.schedule.endDate)) <= new Date(this.projectData.startDate)) {
        return this.instantTranslator.instant("projects.projectEndDateValidation");
      }
      if (this.form.value.schedule?.changeType?.code === 'Readjust') {
        this.form.get('schedule').get('endDate').setValue(null);
      }
    }


    //Include deleted milestones
    const milestones = [...this.milestones, ...this.deletedMilestones.map(item => ({...item, isRemoved: true}))]

    const newChangeRequest = {
      id: this?.id,
      projectId: this?.projectData?.id,
      title: this.form?.value?.title,
      information: this.form.value?.requestType?.includes("Information") ? {
        "reasons": this.form.value.information.reasons,
        "projectIdeaId": this.form.value.information.projectIdea,
        "name": this.form.value.information.projectName,
        "arabicName": this.form.value.information.projectNameAr,
        "description": this.form.value.information.projectDescription,
        "arabicDescription": this.form.value.information.projectDescriptionAr,
        "projectScope": this.form.value.information.projectScope,
        "arabicProjectScope": this.form.value.information.projectScopeAr,
        "expectedOutcomes": this.form.value.information.projectOutcomes,
        "arabicExpectedOutcomes": this.form.value.information.projectOutcomesAr,
        "expectedBenefits": this.form.value.information.projectExpectedBenefits,
        "arabicExpectedBenefits": this.form.value.information.projectExpectedBenefitsAr,
        "outOfScope": this.form.value.information.projectOutOfScope,
        "arabicOutOfScope": this.form.value.information.projectOutOfScopeAr,
        "types": this.form.value.information.projectType,
        "categories": this.form.value.information.projectCategory,
        "origins": this.form.value.information.projectOrigin
      } : null,
      organization: this.form.value?.requestType?.includes("Organization") ? {
        ...this.form.value.organization,
        sponserIds: this.form.value?.organization?.sponserIds?.map(item => item.id).filter(item => item).length === 0 ? null : this.form.value?.organization?.sponserIds?.map(item => item.id).filter(item => item),
        managerId: this.form.value?.organization?.managerId?.id,
      } : null,
      schedule: this.form.value?.requestType?.includes("Schedule") ? {
        ...this.form?.value?.schedule,
        changeType: this.form.value?.schedule?.changeType?.id,
        endDate: this.form.value?.schedule?.endDate ? this.formatDate(this.form.value?.schedule?.endDate) : null
      } : null,
      cost: this.form.value?.requestType?.includes("Cost") ? {
        ...this.form?.value?.cost,
        changeType: this.form?.value?.cost?.changeType?.id,
      } : null,
      scope: this.form.value?.requestType?.includes("Scope") ? {
        ...this.form?.value?.scope,
        changeType: this.form?.value?.scope?.changeType?.id,
      } : null,
      milestones: this.form.value?.requestType?.includes("Organization") && this.form.value?.requestType?.length === 1 ? null :
        milestones.map(item => ({
          id: item?.id ?? undefined,
          name: !item?.name ? null : item?.name[this.lang] || item?.name,
          description: !item?.description ? null : item?.description[this.lang] || item?.description,
          cost: item?.cost,
          milestoneId: item?.milestoneId ?? undefined,
          dueDate: item?.dueDate,
          isRemoved: item?.isRemoved ? true : false,
          deliverables: item?.deliverables.map(deliverable => (
            {
              "id": deliverable?.id,
              "deliverableId": deliverable?.deliverableId,
              "isRemoved": false,
              "title": deliverable?.title[this.lang] || deliverable?.title
            }
          )).concat(this.deletedDeliverables?.filter(x => x?.milestoneId === item.id).map(deletedDeliverable => ({
            "id": deletedDeliverable?.id,
            "deliverableId": deletedDeliverable?.deliverableId,
            "isRemoved": true,
            "title": deletedDeliverable?.title[this.lang] || deletedDeliverable?.title
          }))).filter(deliverable => deliverable),
          weight: item.weight,
        })),
      // attachments: this.selectedAttachments.map(item => ({ fileName: item.fileName, extension: item.extension, uploadedFileName: item.uploadedFileName }))
      attachments: this.selectedAttachments
    }

    if (newChangeRequest.organization) {
      newChangeRequest.organization.sectorId = newChangeRequest?.organization?.sectorId == "null" ? null : newChangeRequest?.organization?.sectorId;
      newChangeRequest.organization.departmentId = newChangeRequest?.organization?.departmentId == "null" ? null : newChangeRequest?.organization?.departmentId;
    }

    if (this.form.value?.requestType?.includes("Organization") && this.getForm.requestType?.value?.length === 1) {
      delete newChangeRequest.milestones
    }

    return newChangeRequest;
  }

  sendDataEvent() {
    const data = this.getData();
    this.sendData.emit(data);
  }

  filter(data: any[]) {
    return data.filter(item => !item?.isRemoved);
  }

  formatter = (x: any) => x.name ? x.name[this.lang] : x?.fullName;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.projectsService.searchUsers({
          "FullName": term,
          "PageSize": 10,
          "PageIndex": 1,
        }).pipe(
          catchError(() => {
            return of([]);
          }))
      ),
    )
}
