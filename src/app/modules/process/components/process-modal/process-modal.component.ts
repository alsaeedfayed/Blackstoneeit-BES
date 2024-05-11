import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SidePanelService } from 'src/app/shared/components/side-panel/side-panel.service';
import { Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter, catchError, tap, switchMap } from 'rxjs/operators';
import { ProcessService } from '../../processes-service/process.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-process-modal',
  templateUrl: './process-modal.component.html',
  styleUrls: ['./process-modal.component.scss']
})

export class ProcessModalComponent implements OnInit, OnChanges {
  @Input() modalState;
  @Input() title;
  @Input() processId;
  @Input() processData;
  @Input() currentState;
  @Output() refreshProcessList: EventEmitter<any> = new EventEmitter()
  @Output() refreshProcessDetail: EventEmitter<any> = new EventEmitter()
  @Output() updateConfirmationState: EventEmitter<any> = new EventEmitter()
  processForm: FormGroup;
  stateForm: FormGroup;
  transitionForm: FormGroup;
  selectedRoles = []
  selectedUsers = []
  rolesInput
  authorizationType = 'Requester'
  isFormSubmitted: boolean;
  isBtnLoading;
  processENLoading;
  processARLoading;
  stateENLoading;
  stateARLoading;
  searchUsersLoading: boolean;
  searchRolesLoading: boolean;
  searchFailed: boolean;
  currentTransition: any;
  transitionARLoading: boolean;
  transitionENLoading: boolean;
  originState;
  commentTitleFlag: boolean;
  lang: string;
  transitionTitleLanguage;
  processTitleLanguage;
  processDescriptionLanguage;
  buttonLabelLanguage;
  commentTitleLanguage;
  stateTitleLanguage;
  constructor(private translationService: TranslationService,private fb: FormBuilder, private sidepanelService: SidePanelService, private processesService: ProcessService, private toastr: ToastrService) { }


  ngOnInit() {
    this.lang = this.translationService.language
    this.processTitleLanguage = this.lang
    this.processDescriptionLanguage = this.lang
    this.stateTitleLanguage = this.lang    
    this.buttonLabelLanguage = this.lang    
    this.transitionTitleLanguage = this.lang    
    this.commentTitleLanguage = this.lang    
  }

  ngOnChanges() {    
    if (this.modalState == 'processForm' || this.modalState == 'processFormEdit') {
      this.initProcessForm(this.processData)
    }

    if (this.modalState == 'processStateForm' || this.modalState == 'processEditStateForm') {
      this.initStateFrom()
    }

    if (this.modalState == 'transitionForm') {
      this.initTransitionForm()
    }
  }

  handleOutsideClick(e) {
    if (this.modalState == 'processEditStateForm' || this.modalState == 'transitionForm' || this.modalState == 'stateDetails' || this.modalState == 'transitionEditForm' ) {
      this.modalState = 'stateDetails'
    }
  }

  ////////////////////////////////Process logic///////////////////////////////////
  initProcessForm(processToUpdate) {
    this.processForm = this.fb.group({
      processName: [processToUpdate ? processToUpdate.title.en : null, [Validators.required], [this.validateProcessViaServer(false)]],
      processNameArabic: [processToUpdate ? processToUpdate.title.ar : null, [Validators.required], [this.validateProcessViaServer(true)]],
      processDescription: [processToUpdate ? processToUpdate.description.en : null, [Validators.required]],
      processDescriptionAr: [processToUpdate ? processToUpdate.description.ar : null, [Validators.required]],
      processStatus: [processToUpdate ? processToUpdate.isEnabled : true, []],
    })
  }
  get getProcessForm() {
    return this.processForm.controls
  }

  checkProcessTitle(value: string, isArabic): Observable<boolean> {
    let processInfo = {
      title: value,
      isArabic: isArabic
    }
    return this.processesService.validateProcessName(processInfo)
  }

  validateProcessViaServer(isArabic): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.processData?.title?.en == control.value || this.processData?.title?.ar == control.value) {
        return of(null)
      } else {
        isArabic ? this.processARLoading = true : this.processENLoading = true
      }
      return this.checkProcessTitle(control.value, isArabic).pipe(
        map(res => {
          isArabic ? this.processARLoading = false : this.processENLoading = false
          return null;
        }),
        catchError((err) => {
          isArabic ? this.processARLoading = false : this.processENLoading = false
          return of({ invalidProcessName: true })
        })
      )
    }
  }

  addProcess() {
    this.isFormSubmitted = true
    if (this.processForm.valid) {
      this.isFormSubmitted = false
      this.isBtnLoading = true
      const newProcess = {
        title: this.processForm.value.processName,
        arabicTitle: this.processForm.value.processNameArabic,
        description: this.processForm.value.processDescription,
        arabicDescription: this.processForm.value.processDescriptionAr,
        isEnabled: this.processForm.value.processStatus
      }
      this.processesService.addProcess(newProcess).subscribe(res => {
        this.isBtnLoading = false
        this.sidepanelService.hide()
        this.refreshProcessList.emit()
        this.processForm.reset()
      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }

  editProcess() {
    this.isFormSubmitted = true
    if (this.processForm.valid) {
      this.isFormSubmitted = false
      this.isBtnLoading = true
      const processToEdit = {
        id: this.processId,
        title: this.processForm.value.processName,
        arabicTitle: this.processForm.value.processNameArabic,
        description: this.processForm.value.processDescription,
        arabicDescription: this.processForm.value.processDescriptionAr,
        isEnabled: this.processForm.value.processStatus
      }
      this.processesService.editProcess(processToEdit).subscribe(res => {
        this.isBtnLoading = false
        this.sidepanelService.hide()
        this.toastr.success('Process was successfully updated')
        this.refreshProcessDetail.emit()
      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }


  /////////////////////////state logic///////////////////////////////////
  initStateFrom(stateToUpdate?) {
    this.stateTitleLanguage = this.lang
    this.stateForm = this.fb.group({
      stateName: [stateToUpdate ? stateToUpdate?.title?.en : null, [Validators.required], [this.validateStateViaServer(false)]],
      stateNameArabic: [stateToUpdate ? stateToUpdate?.title?.ar : null, [Validators.required], [this.validateStateViaServer(true)]],
      order: [stateToUpdate ? stateToUpdate?.displayOrder : 1, [Validators.required, this.validateNegativeNumber]],
      externalStatus: [stateToUpdate ? stateToUpdate?.mappedStatusCode : null, [Validators.required]],
      stage: new FormGroup({
        isInitial: new FormControl(stateToUpdate ? stateToUpdate?.isInitial : false),
        isFinal: new FormControl(stateToUpdate ? stateToUpdate?.isFinal : false),
        isDefaultFlow: new FormControl(stateToUpdate ? stateToUpdate?.isDefaultFlow : false),
      }),
    })
  }
  get getStateForm() {
    return this.stateForm.controls
  }

  validateNegativeNumber(control: AbstractControl): ValidationErrors | null {
    if (control.value <= 0) {
      return { invalidNumber: true };
    }
    return null;
  }

  validateSingleSelection(e) {
    if (e.target.value == 'firstState') {
      this.stateForm.get('stage.isFinal').setValue(false)
    }
    if (e.target.value == 'lastState') {
      this.stateForm.get('stage.isInitial').setValue(false)
    }
  }


  checkStateTitle(value: string, isArabic) {
    let stateInfo = {
      title: value,
      isArabic: isArabic
    }
    return this.processesService.validateStateName(stateInfo, this.processData.id)
  }

  validateStateViaServer(isArabic): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.currentState?.title?.en == control.value || this.currentState?.title?.ar == control.value) {
        return of(null)
      } else {
        isArabic ? this.stateARLoading = true : this.stateENLoading = true
      }
      return this.checkStateTitle(control.value, isArabic).pipe(
        map(res => {
          isArabic ? this.stateARLoading = false : this.stateENLoading = false
          return null;
        }),
        catchError((err) => {
          isArabic ? this.stateARLoading = false : this.stateENLoading = false
          return of({ invalidStateName: true })
        })
      )
    }
  }

  requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }

  addState() {
    this.isFormSubmitted = true

    if (this.stateForm.valid) {
      this.isBtnLoading = true
      this.isFormSubmitted = false
      const newState = {
        processId: this.processId,
        title: this.stateForm.value.stateName,
        arabicTitle: this.stateForm.value.stateNameArabic,
        displayOrder: this.stateForm.value.order,
        isInitial: this.stateForm.value.stage.isInitial,
        isFinal: this.stateForm.value.stage.isFinal,
        isDefaultFlow: this.stateForm.value.stage.isDefaultFlow,
        mappedStatusCode: this.stateForm.value.externalStatus
      }
      this.processesService.addState(newState).subscribe(res => {
        this.sidepanelService.hide()
        this.refreshProcessDetail.emit()
        this.stateForm.reset()
        this.toastr.success('State was successfuly added')
        this.isBtnLoading = false
      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }

  editState() {
    this.isFormSubmitted = true
    if (this.stateForm.valid) {
      this.isBtnLoading = true
      this.isFormSubmitted = false
      const stateToUpdate = {
        id: this.currentState.id,
        processId: this.processId,
        title: this.stateForm.value.stateName,
        arabicTitle: this.stateForm.value.stateNameArabic,
        displayOrder: this.stateForm.value.order,
        isInitial: this.stateForm.value.stage.isInitial,
        isFinal: this.stateForm.value.stage.isFinal,
        isDefaultFlow: this.stateForm.value.stage.isDefaultFlow,
        mappedStatusCode: "string"
      }
      this.processesService.editState(stateToUpdate).subscribe(res => {
        this.sidepanelService.hide()
        this.refreshProcessDetail.emit()
        this.switchMode('stateDetails')
        this.stateForm.reset()
        this.toastr.success('State was successfuly added')
        this.isBtnLoading = false

      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }

  openEditStateForm() {
    this.title = 'Edit State'
    this.modalState = 'processEditStateForm'
    this.initStateFrom(this.currentState)
  }

  closeEditStateForm() {
    this.title = ''
    this.switchMode('stateDetails')
  }

  deleteState() {
    this.updateConfirmationState.emit({ state: 'deleteState' })
  }

  //////////////////////////////transition logic/////////////////////////

  usersFormatter = (user) => user.fullName;
  rolesFormatter = (role) => role.name;
  statesFormatter = (state) => state.title.en;

  searchUsers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchUsersLoading = true),
      switchMap(term =>
        this.processesService.searchUsers({ keyword: term, sortBy: '', page: 1, pageSize: 10 }).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searchUsersLoading = false)
    )

  searchRoles: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchRolesLoading = true),
      switchMap(term =>
        this.processesService.searchRoles({ keyword: term, sortBy: '', page: 1, pageSize: 10 }).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searchRolesLoading = false)
    )

  searchStates: OperatorFunction<string, readonly { id, name }[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.processData.states.filter(state => new RegExp(term, 'mi').test(state.title.en)).slice(0, 10))
  )

  selectRole(e) {
    e.preventDefault()
    if (this.selectedRoles.includes(e.item.name)) {
      this.rolesInput = ''
      return
    }
    this.selectedRoles.push(e.item)
    this.rolesInput = ''
  }

  removeRole(id) {
    this.selectedRoles = this.selectedRoles.filter(item => item.id != id)
  }

  selectUser(e) {
    e.preventDefault()
    if (this.selectedUsers.includes(e.item.username)) {
      this.rolesInput = ''
      return
    }
    this.selectedUsers.push(e.item)
    this.rolesInput = ''
  }
  removeUser(id) {
    this.selectedUsers = this.selectedUsers.filter(item => item.id != id)
  }

  initTransitionForm(transitionToUpdate?) {  
    this.commentTitleFlag = transitionToUpdate?.isCommentRequired
      
    this.transitionForm = this.fb.group({
      transitionTitle: [transitionToUpdate ? transitionToUpdate.title.en : null, [Validators.required], [this.validateTransitionTitleEN()]],
      transitionTitleAr: [transitionToUpdate ? transitionToUpdate.title.ar : null, [Validators.required], [this.validateTransitionTitleAR()]],
      originState: [transitionToUpdate ? this.currentState.title[this.lang] : this.currentState.title[this.lang], [Validators.required]],
      destinationState: [transitionToUpdate ? this.processData.states.find(item => item.id == transitionToUpdate.toStateId) : null, [Validators.required]],
      buttonLabel: [transitionToUpdate ? transitionToUpdate.label.en : null, [Validators.required]],
      buttonLabelAr: [transitionToUpdate ? transitionToUpdate.label.ar : null, [Validators.required]],
      buttonColor: [transitionToUpdate ? transitionToUpdate.buttonTag : null, [Validators.required]],
      minimumVote: [transitionToUpdate ? transitionToUpdate.minVoteCount : 1, [Validators.required, this.validateNegativeNumber]],
      option: [transitionToUpdate ? transitionToUpdate.option : 'Single', [Validators.required]],
      commentTag: [transitionToUpdate ? transitionToUpdate.isCommentRequired : false, []],
      attachmentTag: [transitionToUpdate ? transitionToUpdate.isAttachmentRequired : false, []],
      actionVisibility: [transitionToUpdate ? transitionToUpdate.isActionVisibleExternally : false, []],
      authorizationType: [transitionToUpdate ? transitionToUpdate.authorizationType : 'Requester', [Validators.required]],
      commentTitle: [transitionToUpdate ? transitionToUpdate.commentTitle.en : null, []],
      commentTitleAr: [transitionToUpdate ? transitionToUpdate.commentTitle.ar : null, []],
    })
  }


  get getTransitionForm() {
    return this.transitionForm.controls
  }

  checkTransitionTitle(value: string, isArabic) {
    let transitionInfo = {
      title: value,
      isArabic: isArabic
    }
    return this.processesService.validateTransitionName(transitionInfo, this.processData.id)
  }

  validateTransitionTitleEN(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.currentTransition?.title?.en == control.value) {
        this.transitionENLoading = false
        return of(null)
      } else {
        this.transitionENLoading = true
      }
      return this.checkTransitionTitle(control.value, false).pipe(
        map(res => {
          this.transitionENLoading = false
          return null;
        }),
        catchError((err) => {
          this.transitionENLoading = false
          return of({ invalidTransitionName: true })
        })
      )
    }
  }
  validateTransitionTitleAR(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.currentTransition?.title?.ar == control.value) {
        this.transitionARLoading = false
        return of(null)
      } else {
        this.transitionARLoading = true
      }
      return this.checkTransitionTitle(control.value, true).pipe(
        map(res => {
          this.transitionARLoading = false
          return null;
        }),
        catchError((err) => {
          this.transitionARLoading = false
          return of({ invalidTransitionName: true })
        })
      )
    }
  }

  switchInputs(state, inputName) {
    if (inputName == 'processTitle') {
      this.processTitleLanguage = state
    }

    if (inputName == 'processDescription') {
      this.processDescriptionLanguage = state
    }

    if (inputName == 'stateTitle') {
      this.stateTitleLanguage = state
    }

    if (inputName == 'transitionTitle') {
      this.transitionTitleLanguage = state
    }

    if (inputName == 'buttonLabel') {
      this.buttonLabelLanguage = state
    }

    if (inputName == 'commentTitle') {
      this.commentTitleLanguage = state
    }
  }

  toggleCommentTitle() {
    if (this.commentTitleFlag) {
      this.transitionForm.controls['commentTitle'].clearValidators()
      this.transitionForm.controls['commentTitleAr'].clearValidators()
      this.transitionForm.controls['commentTitle'].updateValueAndValidity()
      this.transitionForm.controls['commentTitleAr'].updateValueAndValidity()

      this.commentTitleFlag = false
    } else {
      this.transitionForm.controls['commentTitle'].setValidators([Validators.required])
      this.transitionForm.controls['commentTitleAr'].setValidators([Validators.required])
      this.transitionForm.controls['commentTitle'].updateValueAndValidity()
      this.transitionForm.controls['commentTitleAr'].updateValueAndValidity()
      this.commentTitleFlag = true
    }
  }

  hideSidepanel() {
    this.sidepanelService.hide()
  }

  switchToTransition() {
    this.title = {
      en: "Add transition",
      ar: "إضافة انتقال"
    }
    this.switchMode('transitionForm')
    this.initTransitionForm()
    this.selectedUsers = []
    this.selectedRoles = []
    this.authorizationType = 'Requester'
  }

  authorizationTypeChange(event, state) {
    this.authorizationType = state
  }

  cancelTransitionMode() {
    this.title = ''
    this.switchMode('stateDetails')
  }

  switchMode(mode) {
    this.modalState = mode
  }

  addTransition() {
    this.isFormSubmitted = true
    //checking if roles and users are valid
    let isAuthorizationTypeValid;
    if ((this.authorizationType == 'Role' && this.selectedRoles.length == 0) || (this.authorizationType == 'User' && this.selectedUsers.length == 0)) {
      isAuthorizationTypeValid = false
      return
    } else {
      isAuthorizationTypeValid = true
    }

    if (this.transitionForm.valid && isAuthorizationTypeValid) {
      this.isFormSubmitted = false
      this.isBtnLoading = true
      const usersIdsArr = []
      const rolesIdsArr = []
      this.selectedUsers.forEach(item => {
        usersIdsArr.push({ id: item.id })
      })
      this.selectedRoles.forEach(item => {
        rolesIdsArr.push({ id: item.id })
      })

      const newTransition = {
        title: this.transitionForm.value.transitionTitle,
        arabicTitle: this.transitionForm.value.transitionTitleAr,
        minVoteCount: this.transitionForm.value.minimumVote,
        authorizationType: this.transitionForm.value.authorizationType,
        option: this.transitionForm.value.option,
        roles: this.authorizationType == 'Role' ? rolesIdsArr : null,
        users: this.authorizationType == 'User' ? usersIdsArr : null,
        label: this.transitionForm.value.buttonLabel,
        arabicLabel: this.transitionForm.value.buttonLabelAr,
        commentTitle: this.transitionForm.value.commentTitle,
        arabicCommentTitle: this.transitionForm.value.commentTitleAr,
        isCommentRequired: this.transitionForm.value.commentTag,
        isAttachmentRequired: this.transitionForm.value.attachmentTag,
        buttonTag: this.transitionForm.value.buttonColor,
        processId: this.processId,
        fromStateId: this.currentState.id,
        toStateId: this.transitionForm.value.destinationState.id,
        isActionVisibleExternally: this.transitionForm.value.actionVisibility
      }

      this.processesService.addTransition(newTransition).subscribe(res => {
        this.isBtnLoading = false
        this.refreshProcessDetail.emit()
        this.modalState = 'stateDetails'
        this.transitionForm.reset()
        this.toastr.success('Transition was successfully added')
        this.authorizationType = 'Requester'
        this.transitionTitleLanguage = 'en';
        this.buttonLabelLanguage = 'en';
      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }

  editTransition() {
    this.isFormSubmitted = true
    //reformat users & roles objects to comply with backend expecation
    const usersIdsArr = []
    const rolesIdsArr = []
    this.selectedUsers.forEach(item => {
      usersIdsArr.push({ id: item.id })
    })
    this.selectedRoles.forEach(item => {
      rolesIdsArr.push({ id: item.id })
    })

    //checking if roles and users are valid
    let isAuthorizationTypeValid;
    if ((this.authorizationType == 'Role' && this.selectedRoles.length == 0) || (this.authorizationType == 'User' && this.selectedUsers.length == 0)) {
      isAuthorizationTypeValid = false
      return
    } else {
      isAuthorizationTypeValid = true
    }

    if (this.transitionForm.valid && isAuthorizationTypeValid) {
      this.isFormSubmitted = false
      this.isBtnLoading = true
      const newTransition = {
        id: this.currentTransition.id,
        title: this.transitionForm.value.transitionTitle,
        arabicTitle: this.transitionForm.value.transitionTitleAr,
        minVoteCount: this.transitionForm.value.minimumVote,
        authorizationType: this.transitionForm.value.authorizationType,
        option: this.transitionForm.value.option,
        roles: this.authorizationType == 'Role' ? rolesIdsArr : null,
        users: this.authorizationType == 'User' ? usersIdsArr : null,
        label: this.transitionForm.value.buttonLabel,
        arabicLabel: this.transitionForm.value.buttonLabelAr,
        commentTitle: this.transitionForm.value.commentTag ? this.transitionForm.value.commentTitle : null,
        arabicCommentTitle: this.transitionForm.value.commentTag ? this.transitionForm.value.commentTitleAr : null,
        isCommentRequired: this.transitionForm.value.commentTag,
        isAttachmentRequired: this.transitionForm.value.attachmentTag,
        buttonTag: this.transitionForm.value.buttonColor,
        processId: this.processId,
        fromStateId: this.currentState.id,
        toStateId: this.transitionForm.value.destinationState.id,
        isActionVisibleExternally: this.transitionForm.value.actionVisibility 
      }      

      this.processesService.editTransition(newTransition).subscribe(res => {
        this.isBtnLoading = false
        this.refreshProcessDetail.emit()
        this.modalState = 'stateDetails'
        this.transitionForm.reset()
        this.toastr.success('Transition was successfully updated')
        this.authorizationType = 'Requester'
        this.transitionTitleLanguage = 'EN';
        this.buttonLabelLanguage = 'EN';
      }, err => {
        this.toastr.error(err.message)
        this.isBtnLoading = false
      })
    }
  }

  editTransitionMode(id, transition?) {    
    this.title = {
      en: 'Edit Transition',
      ar: 'تحديث الانتقال'
    }
    this.modalState = 'transitionEditForm'
    this.initTransitionForm(transition)
    this.currentTransition = transition
    this.authorizationType = this.currentTransition.authorizationType
    if (this.currentTransition.authorizationType == 'User') {
      this.selectedUsers = this.currentTransition.users
    } else if (this.currentTransition.authorizationType == 'Role') {
      this.selectedRoles = this.currentTransition.roles
    }
  }

  deleteTransition(id) {
    this.updateConfirmationState.emit({ state: 'deleteTransition', id })
  }

}
