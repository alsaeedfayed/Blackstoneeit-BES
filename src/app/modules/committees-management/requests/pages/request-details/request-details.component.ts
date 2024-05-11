import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, Subscription } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { IOption } from './iOption.interface';
import { ITask } from './iTask.interface';
import { ICommitteeInfo } from 'src/app/modules/committees-management/models/ICommitteeInfo';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { RoutesVariables } from '../../../routes';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { KPI } from '../../models/KPI';
import { MainTask } from '../../models/MainTask';
import { MeasurementRecurrences } from '../../models/MeasurementRecurrences';
import { MeasurementRecurrenceService } from '../../services/measurementRecurrence/measurement-recurrence.service';
import { StatusesService } from '../../services/statuses/statuses.service';
import { memberTypes } from '../../enums/member-typ';
import { MembersTypesService } from '../../services/members-types/members-types.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import { GetDecisionTextService } from '../../services/get-decision-text/get-decision-text.service';
import moment from 'moment';
import { membersTypes } from '../../../change-requests/enums/modify-requests.enum';
import { MeasurementTypeService } from '../../services/measurementType/measurement-type.service';
import { MeasurementType } from '../../models/MeasurementType';
import { KpiService } from '../../services/KpiServie/kpi.service';


@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent extends ComponentBase implements OnInit, OnDestroy {
  private endSub$ = new Subject();
  private subscriptions: Subscription[] = [];

  language: string = this.translate.currentLang;

  requestId: string = '';
  public instanceId: number;
  public requesterId: string;
  committeeInfo: ICommitteeInfo;
  backToUrl = `${RoutesVariables.Root}/${RoutesVariables.Requests.Root}`;
  exportUrl: string = `${Config.CommitteesManagement.ExportDecision}`;
  steps = [];
  public task = {};
  options: IOption[] = [];
  tasks: ITask[] = [];
  selectedOpt: any;
  // committee decision data
  notValid: boolean = true;
  decisionData: any = {};

  public isPopupOpen: boolean = false;
  //----------------------------------------------------------------
  //requests details
  StrategicKpisLoading: boolean = false
  isLoading: boolean = false
  kpisLoading: boolean = false
  mainTasksLoading: boolean = false
  strategicKpis: any[] = [];
  kpis: KPI[] = [];
  mainTasks: MainTask[] = [];
  MeasurementRecurrences: MeasurementRecurrences[];
  AllMembersTypes: any[] = []
  status: any[] = [];
  memberTypes: any[] = []
  measurementTypes: MeasurementType[] = [];

  
  // description see more  vars
  descTextInitialLimit = 500;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  gettingPreview: boolean = false;
  fileName: string = null;
  committeeName: { en: string, ar: string } = null;
  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];
  goaltreeData: any;
  selectedKPIsIds: any;
  otherKPIs = {
    title: { en: "Other KPIs", ar: "المؤشرات الاخرى" },
    mainColor: "#000000",
    kpiColor: "#ff1a8c",
    open: false
  }
  @Output()
  public onLoad: EventEmitter<ICommitteeInfo> = new EventEmitter();
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,
    private requestsCreateService: RequestsCreateService,
    private measurmentRecurrenceService: MeasurementRecurrenceService,
    private statuses: StatusesService,
    private memberTypesService: MembersTypesService,
    private exportFilesService: ExportFilesService,
    private getDecisionTextService: GetDecisionTextService,
    private measurementTypeService: MeasurementTypeService,
    private kpiService: KpiService,


  ) {
    super(translateService, translate);

    this.modelService.closeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isPopupOpen = false;
      });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  ngOnInit(): void {

    //get statuses
    this.status = this.statuses.getStatuses()
    //get all member types
    this.memberTypes = this.memberTypesService.getMembersTypes(); 
    this.measurementTypes = this.measurementTypeService.getMeasures();


    // get request id
    this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();
    
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkId()


    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }
  doesHasDecision: boolean = false;
  // get workflow states
  getWorkflowStates(): void {
    this.subscriptions.push(this.httpSer.get(`${Config.CommitteesManagement.GetStatus}/${this.requestId}`)
      .subscribe((res) => {
        this.instanceId = res?.instance?.instanceId;

        if (this.instanceId) {

          this.subscriptions.push(this.httpSer.get(`${Config.WorkflowEngine.GetInstance}/${this.instanceId}`)
            .subscribe(res => {
              this.steps = res?.states;
              this.task = res?.task;
              this.options = res?.task?.options ? res?.task?.options : [];
              // this.isLegalCurrent = res?.currentState.title.en == 'Legal Department HOS';
              // this.isLegalCurrent = res?.currentState.code == 'LegalDepartment';


            }))

          // get create committee decision default text
          this.getDecisionTextService.getDecisionText(this.instanceId)
            // .subscribe(res=>{
            // });
            .then((resp) => resp.text())
            .then((res) => {
              this.getDecisionTextService.setText(res);
            })
        }
      }))
  }

  get ShowTasks() {
    return this.requesterId?.toLocaleLowerCase() != this.userService.getCurrentUserId()?.toLocaleLowerCase();
  }
  checkAction(option) {
    // check if the option has formFields with decision text
    this.doesHasDecision = option?.formFields
      .find(f => f.key == 'DecisionText')
  }
  // save action on click
  saveAction(event) {
    // clear decision text
    this.getDecisionTextService.setText('');

    this.router.navigateByUrl(`committees-management/requests`);
  }

  // Delete button clicked
  DeleteBtnClicked() {
    this.confirmationPopupService.open('delete-request');
  }

  //delete request confirmed
  deleteRequest() {
    this.confirmationPopupService.close('delete-request');

    this.subscriptions.push(this.httpSer
      .delete(`${Config.CommitteesManagement.DeleteRequest}/${this.requestId}`)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesRequestDetails.draftRequests.deleteSuccessMsg'));
          this.router.navigateByUrl(`committees-management/requests`);
        } else {
          this.toastr.error(this.translate.instant('committeesRequestDetails.draftRequests.deleteError'));
        }
      }));
  }
  //get request info
  getInfo(details: ICommitteeInfo) {
    this.committeeInfo = details;
    if (this.committeeInfo.status != 0) {
      // get workflow states
      this.getWorkflowStates();
    }
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }
  // get decision preview
  public exportDataAsPDF() {

    // check if the button has been clicked
    if (this.gettingPreview) return;
    this.gettingPreview = true;
    let body = {
      decisionNumber: this.decisionData.DecisionNumber,
      decisionText: this.decisionData.DecisionText,
      isPreview: true
    }
    let fileName = this.committeeName[this.language] + ' - ' +
      this.decisionData.DecisionNumber + ' - ' +
      (moment(this.convertUTCDateToLocalDate(this.committeeInfo.creationDate))).locale(this.language).format('DD/MMM/YYYY');
    this.exportFilesService.exportData('POST', `${this.exportUrl}/${this.requestId}`, fileName, body)
      .finally(() => {
        this.gettingPreview = false;
      });
  }

  // go to Edit committee page
  goToEditCommittee() {
    this.router.navigateByUrl(`committees-management/edit/${this.requestId}`);
  }

  getBuildedFormValues(values) {
    this.decisionData = values;
    this.notValid = this.isNotValid(values);
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
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  //check id
  checkId() {
    if (isNaN(+this.requestId)) {
      this.goToNotFound();
      this.requestId = null;
    } else {
      //get all details
      this.GetRequestDetails();

      // get committee KPis
      this.getCommitteeKPis();

      // get committee Main tasks
      this.getCommitteeMainTasks();

    }

  }
  decisionNumber: any;
  GetRequestDetails() {

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.subscriptions.push(this.httpSer
        .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.requestId}`, { includeUserDetails: true })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (res: ICommitteeInfo) => {

            if (res) {
              if (res.status == 0)
                this.goToEditCommittee()
              this.committeeInfo = res;
              this.selectedKPIsIds = res.measurableGoalIds;
              let combinedArray = [...this.committeeInfo.goalIds, ...this.committeeInfo.measurableGoalIds];
              this.getGoalTreeData(combinedArray);
              
              

              this.committeeName = { en: this.committeeInfo.name, ar: this.committeeInfo.nameAr };
              //assign enum type for other types members
              if (this.committeeInfo?.chairmanInfo) {
                this.committeeInfo.chairmanInfo.type = membersTypes.Chairman
                this.AllMembersTypes.push(this.committeeInfo?.chairmanInfo)
              }

              if (this.committeeInfo?.viceChairmanInfo) {
                this.committeeInfo?.viceChairmanInfo?.forEach((viceChairman) => {
                  viceChairman.type = membersTypes.ViceChairman
                  this.AllMembersTypes.push(viceChairman)
                })
              }

              if (this.committeeInfo?.committeeSecretaryInfo) {
                this.committeeInfo?.committeeSecretaryInfo?.forEach((secretary) => {
                  secretary.type = membersTypes.Secretary
                  this.AllMembersTypes.push(secretary)
                })

              }

              this.committeeInfo?.members?.forEach((member) => {
                member.type = membersTypes.Member;
                this.AllMembersTypes.push(member)
              })

              this.committeeInfo.duration ? this.committeeInfo.committeeDurationType = 2 : this.committeeInfo.committeeDurationType = 1; //temporarily committee
              // this.onLoad.emit(this.committeeInfo);
              this.getInfo(res)
              this.committeeInfo.goalIds?.length > 0 && this.getStrategicKpisRequest(this.committeeInfo.goalIds);
              this.fileName = this.committeeName[this.language] + ' - ' +
                this.committeeInfo?.decisionNumber + ' - ' +
                (moment(this.convertUTCDateToLocalDate(this.committeeInfo.creationDate))).locale(this.language).format('DD/MMM/YYYY');
            } else this.goToNotFound();
          }));
    });
  }

  // 
  importedKPIsCount:number = 0;
  getGoalTreeData(goalIds){
    const body = {
      goalIds : goalIds
    }
    this.subscriptions.push(this.httpSer.post(`${Config.MangeScorecards.selectedItems}`, body).pipe(finalize(() => (this.isLoading = false)))
    .subscribe(res =>{
      this.goaltreeData = res;
      this.importedKPIsCount = 0;
      res.forEach(element => {
        this.importedKPIsCount += this.countNodesOfType(element);
      });
      
    }))
  }

  // get strategy mappings data

  getStrategicKpisRequest(goalIds?) {
    this.StrategicKpisLoading = true
    this.subscriptions.push(this.requestsCreateService.getStrategicKpisList(goalIds)
      .pipe(finalize(() => { this.StrategicKpisLoading = false }))
      .subscribe(res => {
        this.strategicKpis = res;
       
      }))
  }
  countNodesOfType(node): number {
    let count = node.goalTypeId === 4 ? 1 : 0;

    if (node.children) {
      for (const child of node.children) {
        count += this.countNodesOfType(child);
      }
    }

    return count;
  }
  // get committee KPis
  getCommitteeKPis() {
    this.kpisLoading = true
    let body = {
      pageSize: 100000
    }
    this.subscriptions.push(this.httpSer
      .get(`${Config.CommitteeKpi.GetAllByCommitteeId}/${this.requestId}`, body)
      .pipe(
        finalize(() => (this.kpisLoading = false)))
      .subscribe((res) => {
        this.kpiService.setKPis(res.data);
          this.kpis = this.kpiService.getKPIs();
        
      }))
  }

  // get committee Main tasks
  getCommitteeMainTasks() {
    this.mainTasksLoading = true
    this.subscriptions.push(this.httpSer
      .get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.requestId}/MainTasks`)
      .pipe(
        finalize(() => (this.mainTasksLoading = false)))
      .subscribe((res) => {

        this.mainTasks = res;
      }))
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }

  //open kpis modal
  kpisDetailsData: any
  openKpisModal(item: any) {    
    this.kpisDetailsData = item
    this.modelService.open('kpis-details')
  }

  tasksDetailsData: any
  openTasksModal(item: any) {    
    this.tasksDetailsData = item
    this.modelService.open('tasks-details')
  }


  closePopup() {
    this.tasksDetailsData = null;
    this.kpisDetailsData = null;
  }

  toggleNestedList() {
    this.otherKPIs.open = !this.otherKPIs.open;
  }
  
}
