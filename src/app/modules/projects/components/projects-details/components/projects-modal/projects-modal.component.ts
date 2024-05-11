import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {merge, Observable, of, OperatorFunction, Subject, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {ProjectsService} from 'src/app/modules/projects/services/projects.service';
import {PopupService} from 'src/app/shared/popup/popup.service';


@Component({
  selector: 'app-projects-modal',
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects-modal.component.scss']
})
export class ProjectsModalComponent implements OnInit, OnChanges, OnDestroy {

  popupConfig: any = {};
  lang: string;
  taskForm: FormGroup;
  selectedFiles: any = [];
  searching: boolean;
  selectedUsers: any = [];
  deliverableEvidancesDocs = {}
  riskStatus: any;

  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();
  @Output() mileStoneUpdated: EventEmitter<any> = new EventEmitter();

  convertedAttachements: any = [];
  attachmentsToConvert: any = [];
  riskForm: FormGroup;
  @Input() likelihoods;
  @Input() impacts;
  @Input() projectData;
  @Input() risksTypes;
  requestChangeTypes = [
    {
      type: 'Scope',
      isActive: false
    },
    {
      type: 'Time',
      isActive: false
    },
    {
      type: 'Cost',
      isActive: false
    },
  ];
  requestChangeValuesControls;
  changeRequestForm: FormGroup;
  changeRequestSelectedFiles: any = []
  selectedFilesconvertedAttachements: any = [];
  closureForm: FormGroup;
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  invoiceStatusList = [
    {title: {en: "Paid", ar: "مدفوع"}, code: "paid"},
    {title: {en: "Unpaid", ar: "غير مدفوع"}, code: "unpaid"},
  ]
  invoiceForm: FormGroup;
  selectedDeliverables: any = [];
  isFormSubmitted: boolean;
  settingsForm: FormGroup;
  isFileUploading: boolean
  selectedAttachments: any[] = []
  private subscriptions = new Subscription();
  milestoneForm: FormGroup;
  milestonesRemainingBudget: any;
  projectEndDate: any;
  projectBudget: any;
  deletedDeliverables: any = [];
  projectLeftDuration: number;
  milestonesRemainingWeight: any;
  projectId;


  constructor(private popupService: PopupService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private projectsService: ProjectsService,
              private translateService: TranslateService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.isFormSubmitted = false;
    // this.getRiskStatus();
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.projectsService.popupConfig.subscribe(config => {
      if (config.task) {
        this.initTaskForm(config.task)
      } else {
        this.initTaskForm()
      }
      if (config.mode === "risk") {
        this.initRiskForm(config.riskToUpdate)
      }
      if (config.mode === "invoice") {
        this.initInvoiceForm(config?.invoiceToUpdate)
      }
      if (config.mode === "setting") {
        this.initSettingForm()
      }
      if (config.mode === "milestone") {
        const milestonesCostTotal = config.milestones.filter(milestone => {
          return milestone?.status?.code != 'Deleted'
        }).reduce((accumulator, object) => {
          return accumulator + Number(object.cost);
        }, 0)
        const milestonesWeightTotal = config.milestones.filter(milestone => {
          return milestone?.status?.code != 'Deleted'
        }).reduce((accumulator, object) => {
          return accumulator + Number(object.weight);
        }, 0)
        this.initMilestoneform(config?.milestone, config?.milestones);
        this.milestonesRemainingBudget = config.projectBudget - milestonesCostTotal;
        this.milestonesRemainingWeight = 100 - milestonesWeightTotal;
        this.projectEndDate = typeof config.projectEndDate === 'object' ? this.formatDate(config.projectEndDate) : config.projectEndDate
        this.projectLeftDuration = this.getRemainingDays(new Date(this.projectData?.startDate), new Date(this.projectEndDate))
      }

      this.popupConfig = config


    })
  }


  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  //Risk form logic

  initRiskForm(risk?) {
    this.riskForm = this.fb.group({
      "ownerId": [risk ? risk.owner : null, Validators.required],
      "title": [risk ? risk.title : null, Validators.required],
      "notes": [risk ? risk?.notes : null],
      "type": [risk ? risk?.type?.id : null, Validators.required],
      "riskControl": [risk ? risk.riskControl : null, Validators.required],
      "likelihood": [risk ? risk.likelihood.title.en : null, Validators.required],
      "impact": [risk ? risk.impact.title.en : null, Validators.required],
      "mitigationDate": [risk ? this.formatDateToObject(risk.mitigationDate) : null, Validators.required],
      riskRate: [null]
    })


    if (risk) {
      this.selectedAttachments = []
      this.selectedAttachments = risk.attachments.map(item => ({...item, title: item.uploadedFileName}))
    }

  }

  get getRiskForm() {
    return this.riskForm?.controls
  }

  getRiskRate() {
    const likelihoodSum = this.likelihoods.findIndex(item => item.title.en === this.riskForm.value.likelihood) + 1
    const impactSum = this.impacts.findIndex(item => item.title.en === this.riskForm.value.impact) + 1
    if (likelihoodSum + impactSum <= 4) {
      this.riskForm.controls.riskRate.setValue("Low")
      return
    }
    if (likelihoodSum + impactSum <= 6) {
      this.riskForm.controls.riskRate.setValue("Medium")
      return
    }
    if (likelihoodSum + impactSum <= 8) {
      this.riskForm.controls.riskRate.setValue("High")
      return
    }
    if (likelihoodSum + impactSum <= 10) {
      this.riskForm.controls.riskRate.setValue("Very High")
      return
    }
  }


  onSaveRisk() {
    if (this.riskForm.valid) {
      this.projectsService.saveLoadingModalState(true)
      const newRisk = {
        "id": this.popupConfig?.riskToUpdate ? this.popupConfig?.riskToUpdate?.id : 0,
        "projectId": this.popupConfig?.project?.id,
        "ownerId": this.riskForm.value.ownerId?.id,
        "title": this.riskForm.value.title,
        "type": this.risksTypes.find(item => item?.id == this.riskForm.value.type),
        "riskControl": this.riskForm.value.riskControl,
        "likelihood": this.riskForm.value.likelihood,
        "impact": this.riskForm.value.impact,
        "notes": this.riskForm.value.notes,
        "mitigationDate": this.formatDate(this.riskForm.value.mitigationDate),
        attachments: this.selectedAttachments.map(item => ({
          fileName: item.fileName,
          extension: item.extension,
          uploadedFileName: item.uploadedFileName
        }))
      }

      this.projectsService.addRisk(newRisk).subscribe(res => {
        this.refreshParentComponent.emit()
        this.toastr.success(this.translateService.instant('projects.riskWasSuccessfullyAdded'))
        this.selectedAttachments = []
        this.riskForm.reset()
        this.isFormSubmitted = false
        this.projectsService.saveLoadingModalState(false)
        this.popupService.close()
      }, err => {
        this.projectsService.saveLoadingModalState(false)
        this.toastr.error(err.message)
      })
    }
  }


  //Task form logic
  initTaskForm(task?) {
    this.taskForm = this.fb.group({
      id: task ? task.id : 0,
      name: [task ? task.name[this.lang] : null, Validators.required],
      description: [task ? task.description : null],
      startDate: [task ? this.formatDateToObject(task.startDate) : null, Validators.required],
      dueDate: [task ? this.formatDateToObject(task.dueDate) : null, Validators.required],
      progress: [task ? task.progress : null, Validators.required],
    })

    if (task) {
      this.selectedUsers = task.assignedToUsers;
      this.selectedAttachments = task.attachments.map(item => ({...item, title: item.uploadedFileName}))

    }

  }

  get getTaskForm() {
    return this.taskForm?.controls
  }

  formatDateToObject(date: string) {
    if (date) {
      return {
        day: new Date(date).getDate(),
        month: new Date(date).getMonth() + 1,
        year: new Date(date).getFullYear(),
      }
    }
    return {
      day: '',
      month: '',
      year: '',
    };
  }

  formatter = (x: any) => x.name ? x.name[this.lang] : x?.fullName;
  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
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

  onSelectUser(e, input) {
    e.preventDefault()
    if (this.selectedUsers.filter(item => item.id === e.item.id).length === 0) {
      this.selectedUsers.push(e.item)
      input.value = '';
    }
  }

  onUnselectUser(id) {
    this.selectedUsers = this.selectedUsers.filter(item => item.id !== id)
  }

  onPopupClose() {
    this.isFormSubmitted = false
    this.taskForm?.reset()
    this.selectedUsers = [];
    this.riskForm?.reset()
    this.invoiceForm?.reset()
    this.milestoneForm?.reset()
    this.selectedAttachments = []
    this.popupService.close()
  }

  onSaveTask() {
    if (this.formatDate(this.taskForm.controls.startDate?.value) > this.formatDate(this.taskForm.controls.dueDate?.value)) {
      this.toastr.error("Due date must be greater than start date")
      return
    }
    if (this.taskForm.valid && this.selectedUsers?.length !== 0) {
      const newTask = {
        id: this.taskForm.controls.id.value,
        milestoneId: this.popupConfig?.milestoneId,
        name: this.taskForm.controls.name.value,
        description: this.taskForm.controls.description.value,
        startDate: this.formatDate(this.taskForm.controls.startDate.value),
        dueDate: this.formatDate(this.taskForm.controls.dueDate.value),
        progress: this.taskForm.controls.progress.value,
        assignedToUsers: this.selectedUsers.map(function (a) {
          return a.id;
        }),
        attachments: this.selectedAttachments.map(item => ({
          fileName: item.fileName,
          extension: item.extension,
          uploadedFileName: item.uploadedFileName
        }))
      }
      this.popupService.close()
      this.projectsService.saveLoadingModalState(true)
      this.projectsService.addTask(newTask).subscribe(res => {
        this.toastr.success(this.translateService.instant('projects.taskWasSuccessfullySaved'))
        this.taskForm.reset()
        this.refreshParentComponent.emit()
        this.selectedUsers = []
        this.projectsService.saveLoadingModalState(false)
        this.isFormSubmitted = false
        this.selectedAttachments = []
      }, err => {
        this.toastr.error(err.message)
      })
    }
  }

  formatDate(date) {
    if (date) {
      const formatedDate = new Date(Date.UTC(date.year, date.month - 1, date.day))
      return formatedDate;
    }
    return '';
  }


  //Change request form logic
  initChangeRequestForm() {
    this.changeRequestForm = this.fb.group({
      requestTypes: this.fb.group({}),
      comment: [null, Validators.required],
      title: [null, Validators.required]
    })

  }

  deliverablesInputformatter = (result: any) => result.title[this.lang];
  searchDeliverables: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.projectData?.deliverables
        : this.projectData?.deliverables.filter(v => v.title[this.lang].toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  };


  initInvoiceForm(invoice?) {
    this.invoiceForm = this.fb.group({
      id: invoice ? invoice?.id : 0,
      "number": [invoice ? invoice.number : null, Validators.required],
      "date": [invoice ? this.formatDateToObject(invoice.date) : null, Validators.required],
      "amount": [invoice ? invoice.amount : null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      "isPaid": [invoice ? (invoice.isPaid ? this.invoiceStatusList[0] : this.invoiceStatusList[1]) : null, Validators.required],
      "deliverables": [[], Validators.required]
    })
    if (invoice) {
      this.selectedDeliverables = invoice.deliverables
      this.invoiceForm.controls.deliverables.setValue(invoice.deliverables.map(item => item.id))
      this.selectedAttachments = []
      this.selectedAttachments = invoice.attachments.map(item => ({...item, title: item.uploadedFileName}))
    }
  }

  get getInvoiceForm() {
    return this.invoiceForm?.controls
  }

  onSelectDeliverable(e, input) {
    e.preventDefault()
    if (this.selectedDeliverables.filter(item => item.id === e.item.id).length === 0) {
      this.selectedDeliverables.push(e.item)
      this.invoiceForm.controls.deliverables.setValue(this.selectedDeliverables.map(item => item.id))
      input.value = '';
    }
  }

  onUnselectDeliverable(id) {
    this.selectedDeliverables = this.selectedDeliverables.filter(item => item.id !== id)
    this.invoiceForm.controls.deliverables.setValue(this.selectedDeliverables.map(item => item.id))
  }

  validateInvoicesTotal(invoiceAmount, invoiceToUpdateAmount) {
    const invoicesTotal = this.popupConfig.invoices.reduce((accumulator, object) => {
      return accumulator + parseInt((object.amount ? object.amount : 0));
    }, 0);
    return invoiceToUpdateAmount ? invoicesTotal - invoiceToUpdateAmount : invoicesTotal + parseInt(invoiceAmount) > this.projectData?.budget
  }

  onCreateInvoice() {
    if (this.invoiceForm.valid) {

      //Validate if invoices total doesn't exceed project budget
      if (this.validateInvoicesTotal(this.invoiceForm.value.amount, this.invoiceForm.value?.id ? this.invoiceForm.value : null)) {
        this.toastr.error(this.translateService.instant('projects.invoicesErrorMsg'))
        return
      }

      this.projectsService.saveLoadingModalState(true)


      const newInvoice = {
        ...this.invoiceForm.value,
        isPaid: this.invoiceForm.value?.isPaid.code === 'paid' ? true : false,
        projectId: this.projectData?.id,
        date: this.formatDate(this.invoiceForm?.value.date),
        attachments: this.selectedAttachments.map(item => ({
          fileName: item.fileName,
          extension: item.extension,
          uploadedFileName: item.uploadedFileName
        }))
      }
      this.projectsService.createInvoice(newInvoice).subscribe(res => {
        this.refreshParentComponent.emit()
        this.selectedDeliverables = []
        this.invoiceForm.reset()
        this.toastr.success(this.translateService.instant('projects.invoiceWasSuccessfullySaved'))
        this.projectsService.saveLoadingModalState(false)
        this.isFormSubmitted = false
        this.selectedAttachments = []
        this.popupService.close()
      }, err => {
        this.projectsService.saveLoadingModalState(false)
        this.toastr.error(err.message[this.lang])
      })
    }
  }


  onPopupSave() {
    this.isFormSubmitted = true
    if (this.popupConfig.mode === 'task') {
      this.onSaveTask()
      return
    }
    if (this.popupConfig.mode === 'risk') {
      this.onSaveRisk()
      return
    }
    if (this.popupConfig.mode === 'invoice') {
      this.onCreateInvoice()
      return
    }
    if (this.popupConfig.mode === 'setting') {
      this.onSaveProjectSetting()
      return
    }
    if (this.popupConfig.mode === 'milestone') {
      if (this.milestoneForm.invalid) {
        return
      }

      if (!moment(this.formatDate(this.milestoneForm.value.dueDate)).isBetween(this.projectData.startDate, this.projectEndDate, 'day', '[]')) {
        this.toastr.error(this.translateService.instant("projects.milestonesDueDateValidation"))
        return
      }
      this.projectsService.saveMilestone({...this.milestoneForm.value})
      this.projectsService.saveDeletedDeliverables(this.deletedDeliverables)
      this.mileStoneUpdated.emit();
      this.isFormSubmitted = false
      this.popupService.close()
      return
    }
  }


  //Settings Logic
  initSettingForm() {
    this.settingsForm = this.fb.group({
      delegatedManagerId: [this.projectData?.delegatedManager ? this.projectData?.delegatedManager : null]
    })
  }

  searchProjectTeamMembers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.projectData?.projectTeam : this.projectData?.projectTeam.filter((v) => v.name[this.lang].toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
      ),
    );
  };

  onSaveProjectSetting() {
    this.projectsService.saveLoadingModalState(true)
    this.projectsService.saveProjectSetting(this.projectData.id, this.settingsForm.value?.delegatedManagerId?.id).subscribe(res => {
      this.projectsService.saveLoadingModalState(false)
      this.settingsForm.reset()
      this.toastr.success(this.translateService.instant("projects.projectSettingsSuccessMsg"))
      this.isFormSubmitted = false
      this.popupService.close()
      this.refreshParentComponent.emit()
    }, err => {
      this.projectsService.saveLoadingModalState(false)
      this.toastr.error(err.message)
    })
  }


  onUploadFile(e, input?) {
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
      input.value = null
    }, err => {
      this.projectsService.saveLoadingModalState(false)
      this.toastr.error(err.message)
    })
  }

  onFileDelete(i) {
    this.selectedAttachments.splice(i, 1)
  }

  //Milestone logic
  initMilestoneform(milestone?, milestones?) {
    this.milestoneForm = this.fb.group({
      generatedId: milestone?.generatedId ? milestone?.generatedId : (Math.random() + 1).toString(36).substring(2),
      id: [milestone?.id ? milestone?.id : 0],
      name: [milestone ? milestone.name[this.lang] || milestone.name : null, Validators.required],
      description: [milestone?.description ? milestone.description[this.lang] || milestone.description : null],
      weight: [milestone ? milestone.weight : null, Validators.required],
      dueDate: [milestone ? this.formatDateToObject(milestone?.dueDate) : null, Validators.required,],
      deliverables: new FormArray([], Validators.required),
      cost: [milestone?.cost ? milestone?.cost : 0, Validators.required]
    });
    if (milestone) {
      const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
      milestone.deliverables.forEach(element => {
        milestoneDeliverables.push(new FormControl({
          title: element?.title,
          status: element?.status,
          id: element.id,
          milestoneId: milestone.id,
          deliverableId: element?.deliverableId,
          isAccepted: element?.isAccepted
        }))
      });
    }

    this.subscriptions.add(this.milestoneForm.controls.weight.valueChanges.subscribe(val => {
      this.onWeightChange(milestone?.id || milestone?.generatedId)
    }))
  }

  get getMilestoneDeliverable() {
    return this.milestoneForm?.controls.deliverables as FormArray;
  }

  get getMilestoneForm() {
    return this.milestoneForm?.controls;
  }

  onAddDeliverable(val, input) {
    const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
    if (!val || val === '') {
      return;
    }
    milestoneDeliverables.push(new FormControl({title: val}))
    input.value = '';
  }


  onDeleteDeliverable(i, milestoneId) {
    const milestoneDeliverables: FormArray = this.milestoneForm.controls.deliverables as FormArray;
    if (this.milestoneForm.controls.deliverables?.value[i]?.id && this.deletedDeliverables.findIndex(x => x.id === this.milestoneForm.controls.deliverables?.value[i]?.id) == -1) {
      this.deletedDeliverables.push(this.milestoneForm.controls.deliverables?.value[i])
    }
    milestoneDeliverables.removeAt(i)
  }

  onCostChange(milestoneId) {
    const copyOfMilestones = [...this.popupConfig.milestones]

    if (!milestoneId) {
      copyOfMilestones.push({
        cost: this.milestoneForm.controls.cost.value
      })
      const milestonesCostTotal = copyOfMilestones.reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0)
      this.milestonesRemainingBudget = this.popupConfig.projectBudget - milestonesCostTotal
      return
    }

    if (copyOfMilestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)]) {
      copyOfMilestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)] = {
        ...this.popupConfig.milestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId)],
        cost: this.milestoneForm.controls.cost.value
      }
      const milestonesCostTotal = copyOfMilestones.filter(milestone => {
        return milestone?.status?.code != 'Deleted'
      }).reduce((accumulator, object) => {
        return accumulator + Number(object.cost);
      }, 0)
      this.milestonesRemainingBudget = this.popupConfig.projectBudget - milestonesCostTotal
      return
    }
  }

  onWeightChange(milestoneId) {
    const copyOfMilestones = [...this.popupConfig.milestones]

    if (!milestoneId) {
      copyOfMilestones.push({
        weight: this.milestoneForm.controls.weight.value
      })
      const milestonesWeightTotal = copyOfMilestones.filter(milestone => {
        return milestone?.status?.code != 'Deleted'
      }).reduce((accumulator, object) => {
        return accumulator + Number(object.weight);
      }, 0)
      this.milestonesRemainingWeight = 100 - milestonesWeightTotal
      return
    }

    if (copyOfMilestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)]) {
      copyOfMilestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId || milestone.generatedId === milestoneId)] = {
        ...this.popupConfig.milestones[this.popupConfig.milestones.findIndex(milestone => milestone.id === milestoneId)],
        weight: this.milestoneForm.controls.weight.value
      }
      const milestonesWeightTotal = copyOfMilestones.filter(milestone => {
        return milestone?.status?.code != 'Deleted'
      }).reduce((accumulator, object) => {
        return accumulator + Number(object.weight);
      }, 0)
      this.milestonesRemainingWeight = 100 - milestonesWeightTotal
      return
    }
  }

  filter(data: any[]) {
    return data.filter(item => item?.value?.status?.code != "Deleted");
  }


  getRemainingDays(startTime, endtime) {
    const total = Date.parse(endtime) - Date.parse(startTime);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days
  }

}
