import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { StrategicGoalsService } from 'src/app/design-system/services/strategic-goals/strategic-goals.service';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { StrategyMappingKPI } from 'src/app/shared/interfaces/StrategyMapping';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { ICommitteeInfo } from '../../models/ICommitteeInfo';
import { KPI } from '../../requests/models/KPI';
import { MainTask } from '../../requests/models/MainTask';
import { KpiService } from '../../requests/services/KpiServie/kpi.service';
import { ExternalUsersService } from '../../requests/services/external-committee-users/external-users.service';
import { MainTasksService } from '../../requests/services/mainTasks/main-tasks.service';
import { RoutesVariables } from '../../routes';
import { CommitteeBasicInfoService } from '../../services/committee-basic-info/committee-basic-info.service';

@Component({
  selector: 'app-committee-creation-basic-info',
  templateUrl: './committee-creation-basic-info.component.html',
  styleUrls: ['./committee-creation-basic-info.component.scss']
})
export class CommitteeCreationBasicInfoComponent extends ComponentBase implements OnInit, OnDestroy {

  isUpdating: boolean = null;
  isChangeRequest: boolean = null;
  requestId?: number = null;

  @Input()
  public set isCommitteeChangeRequest(v: boolean) {
    this.isChangeRequest = v;
    if (this.isUpdating != null && this.requestId != null) {
      this.checkEdit();
    }
  }

  @Input()
  public set id(v: number) {
    this.requestId = v;
    if (this.isUpdating != null && this.isChangeRequest != null) {
      this.checkEdit();
    }
  }

  @Input() language: string = "";
  @Input()
  public set nextTab(v: number) {
    this.activeNextTab();
  }
  @Input()
  public set isRequestUpdating(v: boolean) {
    this.isUpdating = v;
    if (this.requestId != null && this.isChangeRequest != null) {
      this.checkEdit();
    }
  }

  @Output() currentTab = new EventEmitter<boolean>();
  @Output() isValid = new EventEmitter<boolean>();
  @Output() isNameValid = new EventEmitter<boolean>();
  @Output() isFileUploading = new EventEmitter<boolean>();
  @Output() getBasicInfo = new EventEmitter<ICommitteeInfo>();
  @Output() isLoadingData = new EventEmitter<boolean>();

  @Output() changeRequestReasonData = new EventEmitter<{ reason: string, description: string }>();
  private endSub$ = new Subject();
  searchSubject = new Subject<string>();


  // tabs vars
  breakpoint: string = 'lg';
  currentTabIndex: number = -1;

  // tabs vars
  tabs: any[] = [
    {
      label: '1. Committee Information',
      labelAr: '1. المعلومات الأساسية',
      active: true,
      valid: false
    },
    {
      label: '2. Committee Members',
      labelAr: '2. الأعضاء',
      active: false,
      valid: false
    },
    {
      label: '3. Committee KPIs ',
      labelAr: '3. المؤشرات الاستراتيجية',
      active: false,
      warning: false,
    },
    {
      label: '4. Committee Main Tasks',
      labelAr: '4. المهام الرئيسية ',
      active: false,
      valid: false,
      warning: false
    }
  ];

  //loading vars
  loadingDetails: boolean = true;
  lookupsLoading = true;
  loadingUsers: boolean = true;
  // StrategicKpisLoading: boolean = true;
  kpisLoading: boolean = true;
  mainTasksLoading: boolean = true;

  loadingCRPermission: boolean = true;
  // buttons vars
  // isFileUploading: boolean = false;
  // isSendRequestBtnClicked: boolean = false;

  // request validation
  validRequest: boolean = false




  form: FormGroup;
  committeeCategories: [] = [];
  committeeDurations: [] = [];
  employees: any[] = [];
  sponsorsList: any[] = [];
  employeeLoadCount: number = 1;
  sponsorsLoadCount: number = 1;
  gettingEmployees = false;
  memberSearchValue: string = '';

  //users loading icon appearance icon flags
  selectedInput: string = '';
  chairmanListFlag: boolean = false;
  viceChairmanListFlag: boolean = false;
  sponsorListFlag: boolean = false;
  secretaryListFlag: boolean = false;
  memberIdsListFlag: boolean = false;

  //hidden users from the list
  chairmanHidden: string = null
  viceChairmanHidden: any[] = []
  secretaryHidden: any[] = []
  memberIdsHidden: any[] = []
  hiddenUsers: string[] = [];




  committeeInfo: ICommitteeInfo;
  tags: string[] = [];

  //attachments
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;
  maxFileSizeInMB: number = 10;

  supportedAttachmentTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '3',
    sanitize: false,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript', ,
        'heading',
        'fontName',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  kpis: KPI[] = []
  importedKPIsIds: number[] = []
  mainTasks: MainTask[] = [];

  //change request data
  // changeRequestData: any

  strategicGoals: StrategyMappingKPI[] = [];
  importedGoalsWithKPIs: StrategyMappingKPI[] = [];
  isGoalsLoading: boolean = true;
  isImportedGoalsWithKPIsLoading: boolean = true;
  isImportedGoalsWithoutKPIsLoading: boolean = true;

  committeeMembers: any[] = []
  currentYear: string = "";
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AtachmentService,
    private requestsCreateService: RequestsCreateService,
    private kpiService: KpiService,
    private mainTasksService: MainTasksService,
    private committeeBasicInfoService: CommitteeBasicInfoService,
    private externalUsersService: ExternalUsersService,
    private strategicGoalsService: StrategicGoalsService,

  ) {
    super(translateService, translate);

    //search for employees
    this.searchSubject.pipe(debounceTime(250),takeUntil(this.endSub$)).subscribe((searchTerm: string) => {
      if (searchTerm == 'all') {
        this.employeeLoadCount = 1;
        this.employees = [];
        this.getEmployees();
      } else {
        this.sponsorsLoadCount = 1;
        this.sponsorsList = [];
        this.getSponsors();
      }
    });

    this.strategicGoalsService.changeHappened$.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.KpiVerified();
    })
  }
  ngOnInit(): void {

    // handles language change event
    // this.handleLangChange();

    this.kpiService.setKPis();
    this.mainTasksService.setKMainTasks();

    // initialize new committee form controls
    this.initNewCommitteeFormControls();
    this.currentYear = new Date().getFullYear().toString();
    // check if in edit page
    //this.checkEdit();

    // get committee types & durations
    this.getSharedLockups();

    // check tabs validation
    this.tabsValidation();

    // get this year strategic goals
    this.getAllStrategicGoals()

  }
  ngOnDestroy(): void {
    this.committeeBasicInfoService.committeeMembers$.next([])
    this.endSub$.next(null);
    this.endSub$.complete();
  }
  // check attributes validations
  isNotValid(obj) {
    for (const key in obj) {
      if (obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === '' ||
        obj[key]?.length == 0 ||
        (typeof obj[key] === 'string' && this.removeTagsAndSpaces(obj[key]) === ''))
        return true;

    }
    return false;
  }

  removeTagsAndSpaces(inputText) {
    // Remove HTML tags using a regular expression
    const textWithoutTags = inputText.replace(/<[^>]*>/g, '');

    // Remove extra spaces using another regular expression
    const textWithoutSpaces = textWithoutTags.replace(/\s+/g, ' ');

    // Trim any leading or trailing spaces
    const trimmedText = textWithoutSpaces.replace(/&#160;/g, '').trim();
    return trimmedText;
  }

  // check if in edit page
  checkEdit() {
    // new request  update change = false 
    // update request == // new change request  --> update = true change = false || update = false change = true 
    // update change request --> update = true change = true

    if (!this.isUpdating && !this.isChangeRequest) {
      //get kpis and main tasks
      this.kpis = this.kpiService.getKPIs();
      this.mainTasks = this.mainTasksService.getMainTasks();
    }
    else if ((!this.isUpdating && this.isChangeRequest) || (this.isUpdating && !this.isChangeRequest)) {

      // this.isUpdating = true;
      //get request details
      this.getRequestDetails();
      this.getCommitteeKPis();
      this.getCommitteeMainTasks();
    } else if (this.isUpdating && this.isChangeRequest) {

      this.getChangeRequestDetails();
    }

  }

  // initialize new committee form controls
  initNewCommitteeFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      committeeType: [null, Validators.required],
      duration: [null, Validators.required],
      chairman: [null, Validators.required],
      viceChairmanIds: [null, Validators.required],
      sponsor: [null, Validators.required],
      committeeSecretaryIds: [null, Validators.required],
      memberIds: [null, Validators.required],
      description: [null, Validators.required],
      tags: [null],
      attachments: [null],
      committeeDurationType: [1, Validators.required],
    });
  }

  get committeeDurationType() { return this.form.get('committeeDurationType') as FormArray; }
  // check tabs validation
  tabsValidation() {
    this.form.valueChanges.pipe(debounceTime(250),takeUntil(this.endSub$)).subscribe((formValues) => {
      let committeeInfo = {
        name: formValues.name,
        nameAr: formValues.nameAr,
        committeeType: formValues.committeeType,
        committeeDurationType: formValues.committeeDurationType,
        duration: formValues.committeeDurationType == 2 ? formValues.duration : true,
        description: formValues.description,
      }
      let committeeMembers = {
        chairman: formValues.chairman,
        viceChairmanIds: formValues.viceChairmanIds,
        sponsor: formValues.sponsor,
        committeeSecretaryIds: formValues.committeeSecretaryIds,
        memberIds: formValues.memberIds,
      }
      this.tabs[0].valid = (!this.isNotValid(committeeInfo) &&
        this.form.get('name').valid &&
        this.form.get('nameAr').valid);

      this.isNameValid.emit(this.form.get('name').valid && this.form.get('nameAr').valid);

      this.tabs[1].valid = !this.isNotValid(committeeMembers);

      this.isAllTabsValid()
    })
  }

  // active tab
  activeTab(tab: any) {
    this.currentTabIndex = this.tabs.indexOf(tab);
    this.tabs.forEach((tab) => tab.active = false);
    tab.active = true;
    this.currentTab.emit(this.currentTabIndex == 3)
  }
  // next button clicked
  activeNextTab() {
    if (this.tabs?.length > 0)
      this.activeTab(this.tabs[this.currentTabIndex + 1]);
  }

  // check KPI validation
  KpiVerified() {
    this.kpis = this.kpiService.getKPIs();
    this.tabs[2].valid = (this.kpis.length > 0 || this.strategicGoalsService.selectedGoalsIds.length > 0);
    this.isAllTabsValid();
  }

  // check mainTask validation
  mainTaskVerified() {
    this.mainTasks = this.mainTasksService.getMainTasks();
    this.tabs[3].valid = this.mainTasks.length > 0;
    this.isAllTabsValid();
  }
  // check if all required data is entered
  isAllTabsValid() {
    let tab = this.tabs.find((tab) => tab.valid == false);
    this.validRequest = !tab;
    this.isValid.emit(this.validRequest);
    this.getBasicInfo.emit(this.allData);
  }
  goalIds = [];
  get allData(): any {
    this.goalIds = [];
    // get goals ids 
    this.mappedGoals.forEach(node => {
      this.geTreeIds(node);
    });
    // console.log(this.goalIds);
    let body = {
      ...this.form.value,
      tags: this.form.value.tags ? this.form.value.tags.split(',').map(formTag => ({ tag: formTag })) : [],
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
      committeeKpis: this.kpiService.getKPIs(),
      MainTasks: this.mainTasksService.getMainTasks(),
      committeeExternalMembers: this.externalUsersService.getExternalMembers(),
      goalIds: this.goalIds,
      measurableGoalIds: this.strategicGoalsService.selectedGoalsIds
    };
    if (body.committeeDurationType == 1) delete body.duration;

    // remove unnecessary attributes
    delete body.committeeDurationType;
    //add id to request body in case of updating


    if (this.isUpdating) body.id = this.requestId;
    if (this.isChangeRequest) body.id = this.committeeInfo.id;

    body = this.replaceNullWithEmptyString(body);
    return body;
  }

  geTreeIds(node) {
    this.goalIds.push(node.id);
    if (node.children) {
      for (const child of node.children) {
        this.geTreeIds(child);
      }
    }
  }
  get isAllDataLoaded(): boolean {

    return (this.loadingDetails && this.isUpdating) ||
      (this.kpisLoading && this.isUpdating && !this.isChangeRequest) ||
      (this.mainTasksLoading && this.isUpdating && !this.isChangeRequest) ||
      this.lookupsLoading ||
      this.isGoalsLoading ||
      (this.loadingUsers && this.isUpdating) ||
      (this.isImportedGoalsWithKPIsLoading && this.isUpdating) ||
      (this.isImportedGoalsWithoutKPIsLoading && this.isUpdating) ||
      // (this.StrategicKpisLoading && this.isUpdating) ||
      (this.loadingCRPermission && this.isChangeRequest && this.isUpdating);

  }
  //change committee type
  onSelectCommitteeType() {
    this.onChangeValidation('duration', this.committeeDurationType.value == 2)
  }

  //change form control validation
  onChangeValidation(FormControlName: string, enabled: boolean) {

    if (enabled) {
      this.form.controls[FormControlName].addValidators(Validators.required);
    }
    else {
      this.form.controls[FormControlName].removeValidators(Validators.required);
    }
    this.form.controls[FormControlName].updateValueAndValidity();
  }

  // load lookups data
  private getSharedLockups() {
    const queryServiceDesk = { ServiceName: 'Committee' };
    const lookups$ = this.httpSer.get(Config.Lookups.lookupService, queryServiceDesk);

    combineLatest([lookups$]).pipe(takeUntil(this.endSub$), finalize(() => { this.lookupsLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); })).subscribe(([lookups]) => {
      //console.log(" lookupsLoading ");
      this.committeeCategories = StructureLookups(lookups).CommitteeType;
      this.committeeDurations = StructureLookups(lookups).CommitteeDuration;
    });
  }

  //fetch a slice of  users
  getUsersSlice() {
    let users = [
      ...this.committeeInfo.memberIds,
      ...this.committeeInfo.viceChairmanIds,
      this.committeeInfo.chairman,
      this.committeeInfo.sponsor,
      ...this.committeeInfo.committeeSecretaryIds
    ]
    this.httpSer

      .post(Config.UserManagement.GetUsersByIds, { usersIds: [...new Set(users)] })
      .pipe(takeUntil(this.endSub$),finalize(() => { this.loadingUsers = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe((res) => {
        //console.log(" loadingUsers ");
        if (res) {
          this.chairmanHidden = this.form.value.chairman;
          this.viceChairmanHidden = this.form.value.viceChairmanIds;
          this.secretaryHidden = this.form.value.committeeSecretaryIds;
          this.memberIdsHidden = this.form.value.memberIds;

          // users
          this.committeeBasicInfoService.committeeMembers$.next(res.activeUsers);

          res.activeUsers.forEach((emp) => {
            emp.disabled = true;
            this.employees.push(emp);
          });
          res.activeUsers.forEach((emp) => {
            this.sponsorsList.push(emp);
          });
        }

      });
  }

  // fetch all employees for members
  getEmployees() {
    this.gettingEmployees = true;
    this[`${this.selectedInput}ListFlag`] = true;
    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.employeeLoadCount, pageSize: 10, fullName: this.memberSearchValue })
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => {
          this.gettingEmployees = false;
          this.chairmanListFlag = false;
          this.viceChairmanListFlag = false;
          this.secretaryListFlag = false;
          this.memberIdsListFlag = false;
        }))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            let duplicated = false;
            let selectedMembers = [this.chairmanHidden, ...this.viceChairmanHidden, ...this.secretaryHidden, ...this.memberIdsHidden];
            if (selectedMembers.includes(emp.id)) {
              emp.disabled = true;
            }

            //check if duplicated employee exists
            for (const e of this.employees) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.employees.push(emp);
          });
        }
      });
  }

  getSponsors() {
    this.sponsorListFlag = true;
    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.sponsorsLoadCount, pageSize: 10, fullName: this.memberSearchValue })
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => {
          this.sponsorListFlag = false;
        }))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            let duplicated = false;

            //check if duplicated employee exists
            for (const e of this.sponsorsList) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.sponsorsList.push(emp);
          });
        }
      })
  }
  //focus on search bar if members selection
  onFocus(inputType: string) {
    this.selectedInput = inputType;
    this.memberSearchValue = '';
    inputType == 'sponsor' ? this.getSponsors() : this.getEmployees();
  }

  //search on members selection
  searchEmployees(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.searchSubject.next("all");
    }
  }
  //search on members selection
  searchSponsors(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.searchSubject.next("sponsor");
    }
  }

  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getEmployees();
  }
  //load more sponsors
  loadMoreSponsors() {
    this.sponsorsLoadCount++;
    this.getSponsors();
  }


  selected(id, type) {
    if (type == 'memberIds' || type == 'viceChairman' || type == 'secretary') {
      if (id?.length > 0) {
        if (this[`${type}Hidden`].length > 0) {
          //make old selected user --> disabled false
          this.employees.forEach((emp) => {
            if (this[`${type}Hidden`].includes(emp.id)) {
              emp && (emp.disabled = false);
            }
          });
          //clear disabled array
          this[`${type}Hidden`] = [];
        }
        //make new selected user --> disabled true
        this.employees.forEach((emp) => {
          if (id.includes(emp.id)) {
            emp.disabled = true;
            this[`${type}Hidden`].push(emp.id)
          }
        });
      } else {
        this.employees.forEach((emp) => {
          if (this[`${type}Hidden`].includes(emp.id)) {
            emp && (emp.disabled = false);
          }
        });
        this[`${type}Hidden`] = [];
      }
    } else {
      if (id) {
        if (this[`${type}Hidden`] && this[`${type}Hidden`] != id) {
          let emp = this.employees.find(u => u.id == this[`${type}Hidden`]);
          emp && (emp.disabled = false);
        }
        let emp = this.employees.find(u => u.id == id);
        emp.disabled = true;
        this[`${type}Hidden`] = emp.id;
      } else {
        let emp = this.employees.find(u => u.id == this[`${type}Hidden`]);
        emp && (emp.disabled = false);
        this[`${type}Hidden`] = null;
      }
    }

    let allDisabledMembers = [this.chairmanHidden, ...this.viceChairmanHidden, ...this.secretaryHidden, ...this.memberIdsHidden];

    let selectedMembers = this.employees.filter(element =>
      allDisabledMembers.includes(element.id)
    );
    this.committeeBasicInfoService.committeeMembers$.next(selectedMembers);

    // check if one of the selected users on kpis or main tasks 
    //if exists disable send request and save 
    // and show red ! in the tab
    // else do nothing 
    // this.checkSelectedMembers(selectedMembers);


  }

  // hasKPIsWithDeletedUsers: boolean = false;
  // hasTasksWithDeletedUsers: boolean = false;

  checkSelectedMembers(selectedMembers: any[]) {
    let kpis = this.kpiService.getKPIs();
    let mainTasks = this.mainTasksService.getMainTasks();

    this.tabs[3].warning = (mainTasks.filter(t => selectedMembers.map(m => m.id).includes(t.assignedTo)).length == 0)

    // // actions
    // this.hasTasksWithDeletedUsers = this.tabs[3].warning = true;
    // this.hasKPIsWithDeletedUsers = this.tabs[2].warning = true;
    // tabs show red icon disable buttons 
  }

  getAllStrategicGoals() {
    this.httpSer
      .post(`${Config.Performance.GetInformativeByYear}/${this.currentYear}`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.isGoalsLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe((res) => {
        //console.log(" isGoalsLoading ");
        if (res) {
          this.strategicGoals = res;
        }
      })
  }

  replaceNullWithEmptyString(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null) {
          result[key] = ''; // Replace null with empty string
        } else {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }


  // back to last page
  backToLastPage() {
    if (this.isUpdating) this.goToList();
    else this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`);
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
  // get request Details
  getRequestDetails() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.requestId}`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.loadingDetails = false; this.isLoadingData.emit(this.isAllDataLoaded) }))
      .subscribe((res: ICommitteeInfo) => {
        //console.log(" loadingDetails request", this.loadingDetails);
        if (res) {
          //if (false) {
          if (!res.canEdit && this.isChangeRequest == false) {
            this.router.navigateByUrl(`${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`);
          } else {
            this.committeeInfo = res;
            this.currentYear = new Date(this.committeeInfo.creationDate).getFullYear().toString();

            this.tags = this.committeeInfo.tags.map(tag => tag.tag)
            this.form.patchValue({
              name: this.committeeInfo.name,
              nameAr: this.committeeInfo.nameAr,
              committeeType: this.committeeInfo.committeeType,
              duration: this.committeeInfo.duration,
              chairman: this.committeeInfo.chairman,
              viceChairmanIds: this.committeeInfo.viceChairmanIds,
              sponsor: this.committeeInfo.sponsor,
              committeeSecretaryIds: this.committeeInfo.committeeSecretaryIds,
              memberIds: this.committeeInfo.memberIds,
              description: this.committeeInfo.description,
              committeeDurationType: this.committeeInfo.duration ? 2 : 1,
              tags: this.committeeInfo.tags.map(tag => tag.tag).toString()
            });
            this.externalUsersService.setExternalMembers(this.committeeInfo.committeeExternalMembers);
            // imported kpis 
            this.strategicGoalsService.selectedGoalsIds = this.importedKPIsIds = this.committeeInfo.measurableGoalIds;
            if (this.committeeInfo.goalIds?.length > 0) {
              // mapped goals
              this.getSelectedGoalsWithoutKPIs(this.committeeInfo.goalIds);
              this.getSelectedGoalsIds(this.committeeInfo.goalIds);
            } else {

              this.isImportedGoalsWithKPIsLoading = false;
              this.isImportedGoalsWithoutKPIsLoading = false;
              // this.StrategicKpisLoading = false;
              //console.log(" isImportedGoalsWithKPIsLoading && StrategicKpisLoading");
              this.isLoadingData.emit(this.isAllDataLoaded);
            }
            this.getUsersSlice();

            //old attachments
            this.oldAttachments = res.attachments.map(a => (
              {
                name: a.uploadedFileName,
                extension: a.extension,
                fileName: a.fileName,
                uploadedFileName: a.uploadedFileName
              }
            ));
            this.isAllTabsValid()
          }
        } else this.goToNotFound();
      });
  }
  // get request Details
  getChangeRequestDetails() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetCRById}/${this.requestId}`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.loadingDetails = false; this.isLoadingData.emit(this.isAllDataLoaded) }))
      .subscribe((res: any) => {
        //console.log(" loadingDetails changeRequest", this.loadingDetails);

        if (res) {
          // //console.log(res);
          //TODO Check if Committee id is allowed to Edit CR
          if (!this.canEditCR(res)) {
            this.router.navigateByUrl(
              `${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`
            );
          }
          else {
            // // CR Object to use in Dom
            // this.changeRequestData.reason = res?.reason
            // this.changeRequestData.description = res?.description
            // in case is allowed Bind Res Data
            this.committeeInfo = res?.committeeData;
            this.tags = this.committeeInfo.tags.map(tag => tag.tag);
            this.form.patchValue({
              name: this.committeeInfo.name,
              nameAr: this.committeeInfo.nameAr,
              committeeType: this.committeeInfo.committeeType,
              duration: this.committeeInfo.duration,
              chairman: this.committeeInfo.chairman,
              viceChairmanIds: this.committeeInfo.viceChairmanIds,
              sponsor: this.committeeInfo.sponsor,
              committeeSecretaryIds: this.committeeInfo.committeeSecretaryIds,
              memberIds: this.committeeInfo.memberIds,
              description: this.committeeInfo.description,
              committeeDurationType: this.committeeInfo.duration ? 2 : 1,
              tags: this.committeeInfo.tags.map(tag => tag.tag).toString(),
            });

            // send it back to the page
            this.changeRequestReasonData.emit({
              reason: res.reason,
              description: res.description
            });
            this.strategicGoalsService.selectedGoalsIds = this.importedKPIsIds = this.committeeInfo.measurableGoalIds;
            if (this.committeeInfo.goalIds?.length > 0) {
              this.getSelectedGoalsWithoutKPIs(this.committeeInfo.goalIds);
              this.getSelectedGoalsIds(this.committeeInfo.goalIds);
            } else {

              this.isImportedGoalsWithKPIsLoading = false;
              // this.StrategicKpisLoading = false;
              this.isLoadingData.emit(this.isAllDataLoaded);
              //console.log(" isImportedGoalsWithKPIsLoading && StrategicKpisLoading change request");
            }
            this.getUsersSlice();

            this.isAllTabsValid();
            //old attachments
            this.oldAttachments = res?.committeeData.attachments.map(a => ({
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName,
            }));
            // console.log(res?.committeeData?.committeeKpis);
            // console.log(res?.committeeData?.mainTasks);

            this.getKpis(res?.committeeData?.committeeKpis);
            this.getMainTasks(res?.committeeData?.mainTasks);
          }
        }
        // else this.goToNotFound();
      });
  }
  canEditCR(res: any): boolean {
    // debugger
    let EditSub$: Subject<boolean> = new Subject();
    let id = res?.committeeId;
    this.httpSer
      .get(`${Config.CommitteesManagement.AllowedToCR}/${id}`)
      .pipe(takeUntil(this.endSub$),finalize(() => { this.loadingCRPermission = false; }))
      .subscribe((res: boolean) => {
        //console.log(" loadingCRPermission");
        if (res) {
          EditSub$.next(true);
        } else {
          EditSub$.next(false);
        }
      });
    let ress = EditSub$.pipe(takeUntil(this.endSub$)).subscribe(res => {
      return res;
    });
    return ress ? true : false;
  }

  // Set & Get KPIs
  getKpis(KPIs: any) {
    this.kpiService.setKPis(KPIs);
    this.kpis = this.kpiService.getKPIs();
    this.tabs[2].valid = this.kpis?.length > 0;
    this.isAllTabsValid();
  }

  // Set & Get Main Tasks
  getMainTasks(Tasks: any) {
    this.mainTasksService.setKMainTasks(Tasks);
    this.mainTasks = this.mainTasksService.getMainTasks();
    this.tabs[3].valid = this.mainTasks.length > 0;
    this.isAllTabsValid();
  }
  // get committee KPis
  getCommitteeKPis() {
    let body = {
      pageSize: 100000000
    }
    this.httpSer
      .get(`${Config.CommitteeKpi.GetAllByCommitteeId}/${this.requestId}`, body)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.kpisLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe((res) => {
        //console.log(" kpisLoading ", this.kpisLoading);
        if (res) {
          this.kpiService.setKPis(res.data);
          this.kpis = this.kpiService.getKPIs();
          this.tabs[2].valid = this.kpis?.length > 0;
          this.isAllTabsValid()
        }
      })
  }


  // get committee Main tasks
  getCommitteeMainTasks() {
    this.httpSer
      .get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.requestId}/MainTasks`)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.mainTasksLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe((res) => {
        //console.log(" mainTasksLoading ", this.mainTasksLoading);
        if (res) {
          this.mainTasksService.setKMainTasks(res);
          this.mainTasks = this.mainTasksService.getMainTasks();
          this.tabs[3].valid = this.mainTasks?.length > 0;
          this.isAllTabsValid()
        }
        //this.getEmployees()
      })
  }

  // go to details page
  goToList() {
    let path = `${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`;
    this.router.navigateByUrl(path);
  }

  //attachment functions
  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.isFileUploading.emit(true)

      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0 && this.oldAttachments.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          };

          this.uploadedFiles.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(takeUntil(this.endSub$),finalize(() => { this.isFileUploading.emit(false) }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.isFileUploading.emit(false)
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      } else {
        this.isFileUploading.emit(false)
      }
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  onDeleteFile(i, type: string) {
    // TODO when delete request is created
    if (type == 'new') {
      this.uploadedFiles.splice(i, 1);
      this.attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant('shared.removed'));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }

  // get selected goals with it's kpis
  getSelectedGoalsIds(goalIds: number[]) {
    // this.importedKPIsIds = goalIds;
    this.httpSer
      .post(`${Config.Performance.GetTree}`, { goalIds })
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => { this.isImportedGoalsWithKPIsLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe((res) => {
        //console.log(" isImportedGoalsWithKPIsLoading ");
        if (res) {
          this.importedGoalsWithKPIs = res;
        }
      })
  }
  mappedGoals: any = [];
  getSelectedGoalsWithoutKPIs(goalIds) {
    const body = {
      goalIds: goalIds
    }
    this.httpSer
      .post(`${Config.MangeScorecards.selectedItems}`, body)
      .pipe(takeUntil(this.endSub$),finalize(() => { this.isImportedGoalsWithoutKPIsLoading = false; this.isLoadingData.emit(this.isAllDataLoaded); }))
      .subscribe(res => {
        this.mappedGoals = res;
        this.isAllTabsValid();

      })
  }

}
