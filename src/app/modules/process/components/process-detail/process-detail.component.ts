import { finalize, takeUntil } from 'rxjs/operators';
import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SidePanelService } from 'src/app/shared/components/side-panel/side-panel.service';
import { ProcessService } from '../../processes-service/process.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { Subject } from 'rxjs';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-process-detail',
  templateUrl: './process-detail.component.html',
  styleUrls: ['./process-detail.component.scss']
})
export class ProcessDetailComponent extends ComponentBase implements OnInit, AfterContentInit {
  stateCardActions: any = [
    {
      item: this.translate.instant('processDetails.statesList.deleteState'),
      disabled: false,
      textColor: '',
      icon: 'bx bx-trash-alt'
    },
  ];
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  isChangeStatsClicked: boolean = false;
  processId: string = '';

  // description see more  vars
  descTextInitialLimit = 700;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  //loading vars 
  loadingData: boolean = true;

  modalState;
  isViewSwitchChecked;
  sidepaneTitle;
  processData;
  isProcessStatusLoading: boolean;
  currentState: any;
  deleteState: string = 'deleteProcess';
  transitionId: any;
  languageState: string;
  status: any;
  letters = '0123456789ABCDEF';
  color = '#';
  randomClasses = [
    'name-blue',
    'name-purple',
    'name-bluesky',
    'name-orange',
    'name-success',
    'name-purple-light',
    'name-navy-blue',
    'name-navy-color'
  ]
  randomClass: string;
  coloredStates = [];

  //state model vars 
  isStateModelOpened: boolean = false;
  selectedState: any = null
  processHasInitial: boolean = false;
  isNewTransition = false;

  statuses = [
    { id: 0, name: 'Inactive', nameAr: 'غير فعالة', className: 'closed' },
    { id: 1, name: 'Active', nameAr: 'فعالة', className: 'active' },
  ];
  popupConfig: any;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sidepanelService: SidePanelService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public processesService: ProcessService,
    private confirmationPopupService: ConfirmModalService,
    private modelService: ModelService,

  ) {
    super(translateService, translate);
    processesService.getPopupConfig.subscribe(config => {
      this.popupConfig = config
    })
  }

  ngOnInit() {
    // handles language change event
    this.handleLangChange();

    // get request id
    this.processId = this.route.snapshot.params['id'];

    this.getProcessById()

    if (localStorage.getItem('viewMode')) {
      this.isViewSwitchChecked = localStorage.getItem('viewMode')
    } else {
      this.isViewSwitchChecked = 'card'
    }
  }

  ngAfterContentInit(): void {
    this.cd.detectChanges();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }


  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  getProcessById() {
    this.processesService.getProcessById(this.processId)
      .pipe(finalize(() => { this.loadingData = false }))
      .subscribe(res => {       
        this.processData = res
        this.selectedState = this.processData.states[this.processData.states.findIndex(item => item.id == this.selectedState?.id)]
        this.status = this.processData.states.sort(this.dynamicSort('displayOrder'))
        this.coloredStates = []
        this.status.forEach(state => {
          if (state.isDefaultFlow) {
            this.coloredStates.push({ ...state, color: this.getRandomColor() })
          }
          if (state.isInitial) this.processHasInitial = true;
        });
      }, err => {
        this.toastr.error(err.message)
      })
  }

  getRandomColor() {
    this.color = '#'; // <-----------
    for (var i = 0; i < 6; i++) {
      this.color += this.letters[Math.floor(Math.random() * 16)];
    }
    return this.color
  }

  refreshProcessDetail() {
    this.getProcessById()
  }

  editProcess() {
    this.router.navigateByUrl(`process/edit/${this.processId}`);
  }

  // Delete button clicked
  DeleteBtnClicked() {
    this.confirmationPopupService.open('delete-process');
  }

  //delete process confirmed
  deleteProcessConfirmed() {
    this.confirmationPopupService.close('delete-process');
    this.processesService.deleteProcess(this.processId).subscribe(res => {
      this.router.navigateByUrl('/process');
      this.toastr.success(this.translate.instant('processDetails.deleteSuccessMsg'));
    }, err => {
      this.toastr.error(err.message)
    })
  }

  //status toggle button
  toggleStatusBtn() {
    this.isChangeStatsClicked = true;
    this.processesService.toggleEnable(this.processId)
      .pipe(finalize(() => { this.isChangeStatsClicked = false }))
      .subscribe(res => {
        this.processData.isEnabled = !this.processData.isEnabled;
        this.toastr.success(this.translate.instant(
          'processDetails.changeStatusSuccess',
          {
            action:
              this.translate.instant(
                this.processData.isEnabled ? 'processDetails.activate' : 'processDetails.deactivate')
          }));
      }, err => {
        this.isChangeStatsClicked = false
        this.toastr.error(err.message)
      })
  }

  addState() {
    this.switchMode('processStateForm')
    this.sidepaneTitle = {
      en: "Add State",
      ar: "اضف حالة"
    }
    this.sidepanelService.show()
  }

  handleViewSwitch(e) {
    localStorage.setItem('viewMode', e)
    if (this.isViewSwitchChecked == 'flow') {
      this.isViewSwitchChecked = 'card'
    } else {
      this.isViewSwitchChecked = 'flow'
    }
  }

  viewState(state) {
    this.currentState = state
    this.modalState = 'stateDetails'
    this.sidepaneTitle = ''
    this.sidepanelService.show()
  }

  viewFlowchartOperator(stateId) {
    this.currentState = this.getCurrentState(stateId)
    this.modalState = 'stateDetails'

    this.sidepanelService.show()
  }

  switchMode(mode) {
    this.modalState = mode
  }

  deleteProcess() {
    this.deleteState = 'deleteProcess'
  }

  deleteStateConfirmed(id) {
    this.processesService.deleteState(id).subscribe(res => {
      this.getProcessById()
      this.toastr.success('State was successfully deleted')
    }, err => {
      this.toastr.error(err.message)
    })
  }

  deleteTranstionConfirmed(id) {
    this.processesService.deleteTransition(id).subscribe(res => {
      this.getProcessById()
      this.toastr.success('Transition was successfully deleted')
      this.switchMode('stateDetails')
      this.sidepanelService.show()
    }, err => {
      this.toastr.error(err.message)
    })
  }

  confirmModalDeleteHandler() {
    if (this.deleteState == 'deleteProcess') {
      // return this.deleteProcessConfirmed(this.route.snapshot.params['id'])
    }
    if (this.deleteState == 'deleteTransition') {
      return this.deleteTranstionConfirmed(this.transitionId)
    }
    if (this.deleteState == 'deleteState') {
      return this.deleteStateConfirmed(this.currentState.id)
    }
  }

  updateConfirmationState(e) {
    this.deleteState = e.state
    this.transitionId = e.id
  }

  getCurrentState(id) {
    if (this.processData) {
      return this.processData.states.find(item => item.id == id)
    }
  }

  generateRandomClass(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }

  // open new state model
  openNewStateModel(item: any = null) {
    this.selectedState = item;
    this.isStateModelOpened = true;
    this.modelService.open('new-state');
  }

  // close new state model
  closeNewStateModel() {
    this.isStateModelOpened = false;
    this.selectedState = null;
    this.modelService.close();
  }

  //open state transition
  openStateTransitions(item){    
    this.selectedState = item;
    this.isStateModelOpened = true;
    this.modelService.open('state-transitions');
  }
  //close state transition
  closeStateTransitions(){
    this.isStateModelOpened = false;
    this.selectedState = null;
    this.modelService.close();
  }


  // Handle state deletion
  onStateOptionsSelect(e, state) {
    this.processesService.setPopupConfig({
      text: this.translate.instant('stateTransitions.confirmModal.confirmDeleteStateMsg'),
      confirmationBtnText: 'Confirm',
      data: {state},      
      onConfirmEvent: () =>{ 
        this.processesService.deleteState(state.id).subscribe(res =>{
          this.confirmationPopupService.close('process')
          this.getProcessById()
          this.toastr.success('State was successfully deleted')
        }, err =>{
          this.confirmationPopupService.close('process')
        })
      }
    })
    this.confirmationPopupService.open('process')
  }

}
