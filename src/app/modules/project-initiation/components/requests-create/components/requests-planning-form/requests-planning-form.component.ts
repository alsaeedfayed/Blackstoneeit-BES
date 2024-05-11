import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {debounceTime, distinctUntilChanged, finalize, skip, switchMap} from 'rxjs/operators';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {TranslationService} from 'src/app/core/services/translate.service';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';
import {PopupService} from 'src/app/shared/popup/popup.service';
import {RequestsCreateService} from '../../services/requests.service';

@Component({
  selector: 'app-requests-planning-form',
  templateUrl: './requests-planning-form.component.html',
  styleUrls: ['./requests-planning-form.component.scss']
})
export class RequestsPlanningFormComponent implements OnInit, OnChanges {
  emptyStateText: string = "Looks like you haven't created any milestones yet";
  @Input() readOnly: boolean
  @Input() isFormSubmitted: boolean
  @Input() data
  @Input() lang: string
  timerOnInit = 0
  projectPlanningForm: FormGroup;
  milestonesToDelete = []
  searchModel: any = {
    "keyword": "",
    "sortBy": "",
    "page": 1,
    "pageSize": 1000
  }
  templates: any
  milestones: any = []
  projectDateRange: { start: any; end: any; };
  popupConfig: any;
  selectedTemplate: any
  selectedMilestone: any;
  deliverables: any;
  tasks: any;
  milestoneForm: FormGroup;
  isMilestoneFormSubmitted: boolean;
  selectedMilestoneIndex: any;
  deletedMilestones: any = [];
  milestonesRemainingWeight: number
  milestonesRemainingCost: any;

  constructor(private fb: FormBuilder,
              private popupService: PopupService,
              private translationService: TranslateConfigService,
              private instantTranslator: TranslateService,
              private toastr: ToastrService,
              private confirmationModalService: ConfirmModalService,
              private requestsCreateService: RequestsCreateService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      const startDate: any = moment(new Date(this.data.startDate))
      const endDate: any = moment(new Date(this.data.endDate))
      this.data['duration'] = {
        year: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).years,
        month: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).months,
        day: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).days,
      }
    }
  }


  getRemainingDays(startTime, endtime) {
    const total = Date.parse(endtime) - Date.parse(startTime);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days
  }

  getCountdownFromDays(numberOfDays) {
    const years = Math.floor(numberOfDays / 365);
    const months = Math.floor(numberOfDays % 365 / 30);
    const days = Math.floor(numberOfDays % 365 % 30);
    return {years, months, days};
  }


  ngOnInit() {
    this.initProjectPlanningForm()
  }

  initProjectPlanningForm() {
    this.projectPlanningForm = this.fb.group({
      firstGroup: this.fb.group({
        projectBudget: [null, Validators.required],
        projectFromDuration: [null, Validators.required],
        projectEndDuration: [null, Validators.required],
      }),
      milestones: new FormArray([], Validators.required)
    })

    this.projectPlanningForm.statusChanges.subscribe(status => {
      this.requestsCreateService.saveStepperState("organizationForm", status === "VALID" ? true : false)
    })

    this.projectPlanningForm.controls.firstGroup.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(val => {
      if (this.projectPlanningForm.controls.firstGroup.valid) {
        const projectBudget = this.projectPlanningForm.controls.firstGroup.value.projectBudget
        this.getMilestonesTemplates({
          "budget": projectBudget,
          "startDate": this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectFromDuration),
          "endDate": this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectEndDuration)
        })
        this.projectDateRange = {
          start: this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectFromDuration),
          end: this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectEndDuration)
        }
        if (this.projectPlanningForm.controls.milestones.valid) {
          this.milestones = this.projectPlanningForm.controls.milestones.value
        }
      }
    })

    this.projectPlanningForm.controls.firstGroup.valueChanges.pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(val => {
      if (this.milestones?.length && this.projectPlanningForm.controls.firstGroup.valid) {
        this.confirmationModalService.open('recalculate-milestones');
      }
    })
  }

  onRecalculateMilestones() {
    this.confirmationModalService.close('recalculate-milestones');
    const totalProjectDays = this.getRemainingDays(new Date(this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectFromDuration)), new Date(this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectEndDuration)))
    const projectStartDate = this.formatDate(this.projectPlanningForm.controls.firstGroup.value.projectFromDuration)
    if (this.projectPlanningForm.controls.milestones.valid) {
      this.projectPlanningForm.controls.milestones.value.forEach((element, index) => {
        const milestoneDurationInDays = element.weight * totalProjectDays / 100
        element.cost = this.projectPlanningForm.controls.firstGroup.value.projectBudget * element.weight / 100
        element.dueDate = index === 0 ? this.addDaysToDate(new Date(projectStartDate), milestoneDurationInDays) : this.addDaysToDate(new Date(this.projectPlanningForm.controls.milestones.value[index - 1].dueDate), milestoneDurationInDays);
      });
      this.milestones = this.projectPlanningForm.controls.milestones.value
    }
  }

  get getProjectPlanningForm() {
    return this.projectPlanningForm.controls
  }


  getMilestonesTemplates(filterModel) {
    this.templates = []
    this.requestsCreateService.getMilestonesTemplates(this.searchModel, filterModel).subscribe((res: any) => {
      this.templates = res.data
      this.selectedTemplate = res.data[0]
    })
  }

  formatDate(date) {
    const formatedDate = new Date(Date.UTC(date.year, date.month - 1, date.day))
    return formatedDate;
  }

  resetMilestonesControl() {
    const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
    while (milestones.length !== 0) {
      milestones.removeAt(0)
    }
  }


  onTemplateChoose() {
    this.popupService.open('milestone-create');
    this.popupConfig = {
      mode: "template-select",
      title: {en: "Choose Template", ar: "اختيار نموذج"},
      dimensions: {width: 900, height: 900}
    }
    this.selectedTemplate = this.templates[0]
  }

  generateMilestones(template) {
    this.timerOnInit++
    if (template) {
      if (this.timerOnInit == 1) {
        this.deletedMilestones = this.milestones.filter(item => item.id)
      }

      //Delete milestone before replacing current ones
      if (this.deletedMilestones.length !== 0) {
        this.deleteOnAddNewTemplate(0)
        return
      } else {
        this.milestones = []
        this.resetMilestonesControl()
        const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
        template.milestones.sort(function (a, b) {
          return a - b.order
        }).forEach((element, index) => {
          milestones.push(new FormControl({...element, generatedId: milestones.length + 1}))
          this.milestones.push({
            ...element, generatedId: milestones.length + 1,
          })
        });
      }

      console.log(this.milestones)
      this.selectedTemplate = null
      this.popupService.close()
    }
  }

  onAddMilestone() {
    this.popupConfig = {
      mode: "milestone-form",
      title: {en: "New Phase", ar: "مرحلة جديد"},
      dimensions: {height: 800, width: 700}
    }
    this.popupService.open('milestone-create');
    this.initMilestoneForm()
    this.selectedMilestone = null
  }

  resetForm() {
    const milestoneTasks: FormArray = this.milestoneForm.controls.tasks as FormArray;
    const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
    this.milestoneForm.reset()
    while (milestoneTasks.length !== 0) {
      milestoneTasks.removeAt(0)
    }
    while (milestoneDeliverables.length !== 0) {
      milestoneDeliverables.removeAt(0)
    }
  }


  initMilestoneForm(milestone?) {
    this.milestoneForm = this.fb.group({
      generatedId: milestone?.generatedId ? milestone?.generatedId : null,
      id: [milestone?.id ? milestone?.id : 0],
      name: [milestone ? typeof milestone.name === 'string' ? milestone.name : milestone.name[this.lang] : null, Validators.required],
      description: [milestone?.description ? milestone.description : null],
      weight: [milestone ? milestone.weight : null, Validators.required],
      dueDate: [milestone ? this.formatDateToObject(milestone?.dueDate) : null, Validators.required,],
      deliverables: new FormArray([], Validators.required),
      tasks: new FormArray([]),
      cost: [milestone?.cost ? milestone?.cost : 0, Validators.required]
    });

    if (milestone) {
      this.deliverables = milestone.deliverables;
      this.tasks = milestone.tasks;
      const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
      milestone.deliverables.forEach(element => {
        milestoneDeliverables.push(new FormControl({
          en: element.title ? element.title.en : element.en,
          ar: element.title ? element.title.ar : element.ar
        }))
      });
      const milestoneTasks: FormArray = this.milestoneForm.controls.tasks as FormArray;
      milestone.tasks.forEach(element => {
        milestoneTasks.push(new FormControl({
          en: element.name ? element.name.en : element.en,
          ar: element.name ? element.name.ar : element.ar
        }))
      });
    }
    //Calculate milestones remaining weight
    this.milestonesRemainingWeight = 100 - this.milestones.reduce((accumulator, object) => {
      return accumulator + object.weight;
    }, 0);
    //Calculate milestones remaining cost
    this.milestonesRemainingCost = this.projectPlanningForm.controls.firstGroup.value.projectBudget - this.milestones.reduce((accumulator, object) => {
      return accumulator + Number(object.cost);
    }, 0);

    this.milestoneForm.controls.cost.valueChanges.subscribe(val => {
      if (val) {
        this.onCostChange(milestone?.id || milestone?.generatedId)
      }
    })
    this.milestoneForm.controls.weight.valueChanges.subscribe(val => {
      if (val) {
        this.onWeightChange(milestone?.id || milestone?.generatedId)
      }
    })
  }

  get getMilesstoneForm() {
    return this.milestoneForm.controls;
  }

  get getMilestoneDeliverable() {
    return this.milestoneForm.controls.deliverables as FormArray;
  }

  get getMilestoneTasks() {
    return this.milestoneForm.controls.tasks as FormArray;
  }

  onAddDeliverable(val, input) {
    const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
    if (!val || val === '') {
      return;
    }
    milestoneDeliverables.push(new FormControl({en: val, ar: val}))
    input.value = '';
  }

  onDeleteDeliverable(i) {
    const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
    milestoneDeliverables.removeAt(i)
  }

  onAddTask(val, input) {
    const milestoneTasks: FormArray = this.milestoneForm.controls.tasks as FormArray;
    if (!val || val === '') {
      return;
    }
    milestoneTasks.push(new FormControl({en: val, ar: val}))
    input.value = '';
  }

  onDeleteTask(i) {
    const milestoneTasks: FormArray = this.milestoneForm.controls.tasks as FormArray;
    milestoneTasks.removeAt(i)
  }

  validateMilestonesProgress(progress, milestoneToUpdateProgress) {
    const totalProgress = this.milestones.reduce((accumulator, object) => {
      return accumulator + object.weight;
    }, 0);
    return (milestoneToUpdateProgress ? totalProgress - milestoneToUpdateProgress : totalProgress) + progress > 100 ? false : true;
  }

  validateMilestonesTotalBudget(costToAdd, costToUpdate) {
    const milestonesTotalBudget = this.milestones.reduce((accumulator, object) => {
      return accumulator + Number((object.cost ? object.cost : 0));
    }, 0);
    return (costToUpdate ? milestonesTotalBudget - costToUpdate : milestonesTotalBudget) + Number(costToAdd) > this.projectPlanningForm.controls.firstGroup.value.projectBudget
  }


  onSaveMilestone() {
    this.isMilestoneFormSubmitted = true;

    if (this.milestoneForm.valid) {
      //Validate weight total
      if (!this.validateMilestonesProgress((this.milestoneForm.value.weight?.value ? this.milestoneForm.value.weight.value : this.milestoneForm.value.weight), this.selectedMilestone?.weight)) {
        this.toastr.error(this.instantTranslator.instant('initiationForm.milestonesWeightValidation'));
        return;
      }
      // Validate if due date is between project duration range
      const milestoneDueDate = `${this.milestoneForm.value.dueDate.year}-${this.milestoneForm.value.dueDate.month}-${this.milestoneForm.value.dueDate.day}`
      if (!moment(milestoneDueDate).isBetween(this.projectDateRange.start, this.projectDateRange.end, 'day', '[]')) {
        this.toastr.error(this.instantTranslator.instant('initiationForm.milestonesDueDateValidation'));
        return;
      }
      //Validate if milestone cost doesn't exceed project budget
      if (this.validateMilestonesTotalBudget(this.milestoneForm.value?.cost, this.selectedMilestone?.cost)) {
        this.toastr.error(this.instantTranslator.instant('initiationForm.milestonesBudgetValidation'));
        return
      }

      if (this.milestoneForm.value) {
        const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
        if (this.milestoneForm.value?.generatedId) {
          // Update Milestone
          milestones.at(this.milestones.findIndex(item => item.generatedId == this.milestoneForm.value?.generatedId)).setValue({
            ...this.milestoneForm.value,
            generatedId: this.milestoneForm.value?.generatedId,
            dueDate: this.formatDate(this.milestoneForm.value.dueDate),
            name: this.milestoneForm.value.name,
            description: this.milestoneForm.value.description
          })
          this.milestones[this.milestones.findIndex(item => item.generatedId === this.milestoneForm.value.generatedId)] = {
            ...this.milestoneForm.value,
            generatedId: this.milestoneForm.value?.generatedId,
            name: this.milestoneForm.value.name,
            description: this.milestoneForm.value.description,
            dueDate: this.formatDate(this.milestoneForm.value.dueDate)
          }
        } else {
          // Add milestone
          milestones.push(new FormControl({...this.milestoneForm.value, generatedId: milestones.length + 1}))
          this.milestones.push({
            ...this.milestoneForm.value, generatedId: milestones.length + 1,
            dueDate: this.formatDate(this.milestoneForm.value.dueDate),
            name: this.milestoneForm.value.name,
            description: this.milestoneForm.value.description
          })
        }

      }
      console.log(this.milestones)
      this.popupService.close();
      this.tasks = []
      this.deliverables = []
      this.isMilestoneFormSubmitted = false;
      this.selectedMilestone = null

    }
  }

  onPopupClose() {
    this.popupService.close()
  }


  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    };
  }

  addDaysToDate(date, days) {
    return new Date(moment(date).add(days, 'day').format())
  }


  onCardOptionsSelect(e, milestone, milestoneIndex) {
    if (e === 'shared.delete') {
      this.selectedMilestoneIndex = milestoneIndex;
      this.selectedMilestone = milestone;
      this.confirmationModalService.open();
    }
    if (e === 'shared.update') {
      this.popupConfig = {
        mode: "milestone-form",
        title: {en: "Update Phase", ar: "تحديث مرحلة"},
        dimensions: {height: 800, width: 700}
      }
      this.popupService.open('milestone-create');
      this.selectedMilestone = milestone;
      this.initMilestoneForm(milestone);

    }
  }


  onDeleteMilestoneConfirmed(e) {
    this.deleteMilestone({milestoneIndex: this.selectedMilestoneIndex, milestone: this.selectedMilestone})
    this.milestones.splice(this.selectedMilestoneIndex, 1)
    this.confirmationModalService.close();
    this.selectedMilestoneIndex = null;
  }


  deleteMilestone(e) {
    const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
    milestones.removeAt(e.milestoneIndex)
    if (e?.milestone?.id) {
      this.requestsCreateService.deleteMilestone(e?.milestone?.id).subscribe(res => {
        this.toastr.success(this.instantTranslator.instant("initiationForm.milestoneDeleteSuccessMsg"))
      })
    }
  }

  milestoneDeleteApiCall(milestoneId, done) {
    this.requestsCreateService.deleteMilestone(milestoneId).subscribe(res => {
      done();
    });

  }


  deleteOnAddNewTemplate(i = 0) {
    this.requestsCreateService.saveLoadingModalState(true)
    this.milestoneDeleteApiCall(this.deletedMilestones[i].id, () => {
      if ((i + 1) == this.deletedMilestones.length) {
        let oldMileStone = [...this.milestones]
        oldMileStone = oldMileStone.map(milestone => {
          const {id, ...milestoneWithoutId} = milestone;
          return milestoneWithoutId;
        });
        this.milestones = []
        this.resetMilestonesControl()
        const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
        this.selectedTemplate.milestones.sort(function (a, b) {
          return a - b.order
        }).forEach((element, index) => {
          milestones.push(new FormControl({...element, generatedId: milestones.length}))
          this.milestones.push({
            ...element, generatedId: milestones.length,
          })
        });
        this.selectedTemplate = null
        this.popupService.close()
        this.requestsCreateService.saveLoadingModalState(false)
        this.deletedMilestones.length = 0
        console.log(this.deletedMilestones.length)
        debugger
      } else {
        i++;
        this.deleteOnAddNewTemplate(i)
      }
    })
  }

  deleteMilestoneInorder(i = 0) {
    this.requestsCreateService.saveLoadingModalState(true)
    this.milestoneDeleteApiCall(this.deletedMilestones[i].id, () => {
      if ((i + 1) == this.deletedMilestones.length) {
        this.milestones = []
        this.resetMilestonesControl()
        const milestones: FormArray = this.projectPlanningForm.controls.milestones as FormArray;
        this.milestones.sort(function (a, b) {
          return a - b.order
        }).forEach((element, index) => {
          milestones.push(new FormControl({...element, generatedId: milestones.length + 1}))
          this.milestones.push({
            ...element, generatedId: milestones.length + 1,
          })
        });
        this.selectedTemplate = null
        this.popupService.close()
        this.requestsCreateService.saveLoadingModalState(false)
      } else {
        i++;
        this.deleteMilestoneInorder(i)
      }
    })
  }

  onCostChange(milestoneId) {
    const copyOfMilestones = [...this.milestones]

    if (!milestoneId) {
      copyOfMilestones.push({
        cost: this.milestoneForm.controls.cost.value
      })
      const milestonesCostTotal = copyOfMilestones.reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0)
      this.milestonesRemainingCost = this.projectPlanningForm.controls.firstGroup.value.projectBudget - milestonesCostTotal
      return
    }

    if (copyOfMilestones[this.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)]) {
      copyOfMilestones[this.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)] = {
        ...this.milestones[this.milestones.findIndex(milestone => milestone.id === milestoneId)],
        cost: this.milestoneForm.controls.cost.value
      }
      const milestonesCostTotal = copyOfMilestones.reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0)
      this.milestonesRemainingCost = this.projectPlanningForm.controls.firstGroup.value.projectBudget - milestonesCostTotal
      return
    }
  }


  onWeightChange(milestoneId) {
    const copyOfMilestones = [...this.milestones]

    if (!milestoneId) {
      copyOfMilestones.push({
        weight: this.milestoneForm.controls.weight.value
      })
      const milestonesWeightTotal = copyOfMilestones.reduce((accumulator, object) => {
        return accumulator + Number(object.weight);
      }, 0)
      this.milestonesRemainingWeight = 100 - milestonesWeightTotal
      return
    }

    if (copyOfMilestones[this.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)]) {
      copyOfMilestones[this.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)] = {
        ...this.milestones[this.milestones.findIndex(milestone => milestone.id === milestoneId)],
        weight: this.milestoneForm.controls.weight.value
      }
      const milestonesWeightTotal = copyOfMilestones.reduce((accumulator, object) => {
        return accumulator + Number(object.weight);
      }, 0)
      this.milestonesRemainingWeight = 100 - milestonesWeightTotal
      return
    }
  }

}
