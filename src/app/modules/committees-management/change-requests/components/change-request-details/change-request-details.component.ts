import { KpiService } from 'src/app/modules/committees-management/requests/services/KpiServie/kpi.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { ICommitteeInfo } from 'src/app/modules/committees-management/models/ICommitteeInfo';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { RoutesVariables } from '../../../routes';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';

import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import { MeasurementRecurrenceService } from '../../../requests/services/measurementRecurrence/measurement-recurrence.service';
import { StatusesService } from '../../../requests/services/statuses/statuses.service';
import { MembersTypesService } from '../../../requests/services/members-types/members-types.service';
import { KPI } from '../../../requests/models/KPI';
import { MainTask } from '../../../requests/models/MainTask';
import { MeasurementRecurrences } from '../../../requests/models/MeasurementRecurrences';
import { memberTypes } from '../../../requests/enums/member-typ';
import { IOption } from './iOption.interface';
import { ITask } from './iTask.interface';
import { ModifyRequest } from '../../models/ModifyRequest';
import { basicInformationItem, changedDataMember, changedKpis, changedMainTasks } from '../../models/modify-request-details.interface';
import moment from 'moment';
import { MainTasksService } from '../../../requests/services/mainTasks/main-tasks.service';

@Component({
  selector: 'app-change-request-details',
  templateUrl: './change-request-details.component.html',
  styleUrls: ['./change-request-details.component.scss']
})
export class ChangeRequestDetailsComponent extends ComponentBase implements OnInit {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  modifyRequestId: string = '';
  public requesterId: string;
  // modifyInfo: ModifyRequest = {} as ModifyRequest;
  modifyInfo: any
  backToUrl = `${RoutesVariables.Root}/${RoutesVariables.ModifyRequests.Root}`;
  steps = [];
  public task = {};
  options: IOption[] = [];
  tasks: ITask[] = [];
  selectedOpt: any;
  strategicKpis: any[] = [];
  kpis: KPI[] = [];
  mainTasks: MainTask[] = [];
  MeasurementRecurrences: MeasurementRecurrences[];
  AllMembersTypes: any[] = []
  status: any[] = [];
  memberTypes: any[] = []
  exportUrl: string = `${Config.CommitteesManagement.ExportCR}`;
  // description see more  vars
  descTextInitialLimit = 500;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  // loading vars

  loadingData: boolean = true
  StrategicKpisLoading: boolean = false
  kpisLoading: boolean = false
  mainTasksLoading: boolean = false

  // flags
  doesHasDecision: boolean = false;
  gettingPreview: boolean = false;

  // committee decision data
  notValid: boolean = true;
  decisionData: any = {};

  //TODO changed data
  // basic information
  bacisInfoList: any[] = []
  //members
  changedDataMembers: any[] = []
  //kpis
  changedKpis: any[] = []
  //main tasks
  changedMainTasks: any[] = []

  //changed kpis details
  changedKpisData: any[] = []

  //changed main tasks details
  changedMainTasksData: any[] = []

  //committee id
  committeeId: number;
  public isPopupOpen: boolean = false;



  kpisDetailsLoader: boolean = true
  tasksDetailsLoader: boolean = true
  kpisDetails: any = {}
  tasksDetails: any = {}
  isAddedTask: boolean = false
  isAddedKpi: boolean = false
  addTask: any = {}
  addedKpi: any = {}

  committeeName: { en: string, ar: string } = null;
  fileName: string = ''
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
    private kpiService: KpiService,
    private mainTaskService: MainTasksService
  ) {
    super(translateService, translate);

    this.modelService.closeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isPopupOpen = false;
      });
  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    //get statuses
    this.status = this.statuses.getStatuses()

    //get all member types
    this.memberTypes = this.memberTypesService.getMembersTypes()

    // get request id
    this.MeasurementRecurrences = this.measurmentRecurrenceService.getMeasures();
    this.modifyRequestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkId()



  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.subscribe((lang) => {
      this.language = lang.lang;
    });
  }

  // get workflow states
  getWorkflowStates(): void {

    this.httpSer.get(`${Config.WorkflowEngine.GetInstance}/${this.modifyInfo.instanceId}`)
      .subscribe(res => {
        this.steps = res?.states;
        this.task = res?.task;
        this.options = res?.task?.options ? res?.task?.options : [];

        // this.doesHasDecision = res?.currentState.code == 'LegalDepartment';
      });

  }

  get ShowTasks() {
    return this.requesterId?.toLocaleLowerCase() != this.userService.getCurrentUserId().toLocaleLowerCase();
  }
  checkAction(option) {
    // check if the option has formFields with decision text
    this.doesHasDecision = option?.formFields
      .find(f => f.key == 'DecisionText')
  }
  // save action on click
  saveAction(event) {
    this.router.navigateByUrl(`committees-management/modify-requests`);
  }

  // Delete button clicked
  DeleteBtnClicked() {
    this.confirmationPopupService.open('delete-request');
  }

  //delete request confirmed
  deleteRequest() {
    this.confirmationPopupService.close('delete-request');

    this.httpSer
      .delete(`${Config.CommitteesManagement.DeleteRequest}/${this.modifyRequestId}`)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesRequestDetails.draftRequests.deleteSuccessMsg'));
          this.router.navigateByUrl(`committees-management/requests`);
        } else {
          this.toastr.error(this.translate.instant('committeesRequestDetails.draftRequests.deleteError'));
        }
      });
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
      (moment(this.convertUTCDateToLocalDate(this.modifyInfo.creationDate))).locale(this.language).format('DD/MMM/YYYY');

    this.exportFilesService.exportData('POST', `${this.exportUrl}/${this.modifyInfo.id}`, fileName, body)
      .finally(() => {
        this.gettingPreview = false;
      });
  }

  // go to Edit committee page
  goToEditCommittee() {
    this.router.navigateByUrl(`committees-management/edit-change-request/${this.modifyRequestId}`);
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
    //this.router.navigateByUrl(`/oops/not-found`);
  }
  //----------------------------------------------------------------
  //requests details

  //check id
  checkId() {
    if (isNaN(+this.modifyRequestId)) {
      this.goToNotFound();
      this.modifyRequestId = null;
    } else {

      //get all details
      this.GetRequestDetails();

      // get committee KPis
      //this.getCommitteeKPis();

      // get committee Main tasks
      // this.getCommitteeMainTasks();

    }

  }

  GetRequestDetails() {

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.httpSer
        .get(`${Config.CommitteesManagement.GetCRDetails}/${this.modifyRequestId}`)
        .pipe(finalize(() => (this.loadingData = false)))
        .subscribe(
          (res: ModifyRequest) => {
            if (res) {
              //set modify info
              this.modifyInfo = res;
              this.committeeName = { en: this.modifyInfo.committeeData.name, ar: this.modifyInfo.committeeData.nameAr };
              //set committe id
              this.committeeId = res?.committeeId
              //set kpis
              // this.kpis = this.modifyInfo?.committeeData?.committeeKpis

              //set main tasks
              // this.mainTasks = this.modifyInfo?.committeeData?.mainTasks
              //assign enum type for other types members

              //basic info
              this.bacisInfoList = this.modifyInfo?.changedBasicInfo

              if (this.modifyInfo?.changedSponsors?.length > 0) {
                this.modifyInfo?.changedSponsors.forEach(item => {
                  this.bacisInfoList.push(item)
                });
              }
              //changed members
              this.changedDataMembers = this.modifyInfo?.changedMembers

              //changed kpis
              this.changedKpis = this.modifyInfo?.changedKpis

              //changed main tasks
              this.changedMainTasks = this.modifyInfo?.changedMainTasks
              //console.log(this.changedMainTasks)

              this.GetCommitteeFullDetails();
              //committee kpis
              this.getCommitteeKPis()

              //committee main tasks
              this.getCommitteeMainTasks()

              if (this.modifyInfo?.committeeData?.chairmanInfo) {
                this.modifyInfo.committeeData.chairmanInfo.type = memberTypes.chairman
                this.AllMembersTypes.push(this.modifyInfo?.committeeData?.chairmanInfo)
              }

              if (this.modifyInfo?.committeeData?.viceChairmanInfo) {

                this.modifyInfo?.committeeData?.viceChairmanInfo?.forEach((viceChairman) => {
                  viceChairman.type = memberTypes.viceChairman
                  this.AllMembersTypes.push(viceChairman)
                })
              }

              if (this.modifyInfo?.committeeData?.committeeSecretaryInfo) {
                this.modifyInfo?.committeeData?.committeeSecretaryInfo?.forEach((secretary) => {
                  secretary.type = memberTypes.secretary
                  this.AllMembersTypes.push(secretary)
                })

              }

              this.modifyInfo?.committeeData?.members?.forEach((member) => {
                member.type = memberTypes.member;
                this.AllMembersTypes.push(member)
              })



              this.modifyInfo?.committeeData?.duration ? this.modifyInfo.committeeData.committeeDurationType = 2 : this.modifyInfo.committeeData.committeeDurationType = 1; //temporarily committee
              // this.onLoad.emit(this.committeeInfo);
              // this.modifyInfo?.committeeData?.goalIds?.length > 0 && this.getStrategicKpisRequest(this.modifyInfo?.committeeData?.goalIds);

              if (this.modifyInfo.status != 0) {
                // get workflow states
                this.getWorkflowStates();
              }

              else {
                this.goToEditCommittee()
              }
              this.fileName = this.committeeName[this.language] + ' - ' +
                this.modifyInfo.decisionNumber + ' - ' +
                (moment(this.convertUTCDateToLocalDate(this.modifyInfo.creationDate))).locale(this.language).format('DD/MMM/YYYY');
            } else this.goToNotFound();
          });
    });
  }

  isFullDataLoading: boolean = false;
  committeeInfo: ICommitteeInfo = {} as ICommitteeInfo;
  GetCommitteeFullDetails() {
    this.isFullDataLoading = true;

    this.httpSer
      .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.committeeId}`, { includeUserDetails: true })
      .pipe(finalize(() => (this.isFullDataLoading = false)))
      .subscribe(
        (res: ICommitteeInfo) => {

          if (res) {
            if (res.status == 0)
              this.goToEditCommittee()
            this.committeeInfo = res;
            let combinedArray = [...this.committeeInfo.goalIds, ...this.committeeInfo.measurableGoalIds];
            this.getGoalTreeData(combinedArray);
          } else this.goToNotFound();
        });

  }
  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }


  //open kpis model
  openKpiModal(row: any) {
    this.changedKpisData = row?.changedData
    for (let i = 0; i < this.changedKpisData.length; i++) {
      if (this.changedKpisData[i]?.fieldName === "Attachment") {
        this.changedKpisData.splice(i, 1)
      }
    }

    if (row?.changedAttatchments?.length > 0) {
      row?.changedAttatchments.forEach(item => {
        this.changedKpisData.push(item)
      });
    }

    if (row?.id === 0) {
      this.isAddedKpi = true
      this.kpisDetails = row;
      this.kpisDetailsLoader = false
    } else { this.getKpisDetails(row?.id) }
    this.modelService.open('changed-kpis-details')
  }

  //close kpis details modal
  closeKpisModal() {
    this.kpisDetails = {}
    this.isAddedKpi = false
    this.isAddedTask = false
    this.addedKpi = {}
  }

  //open tasks modal
  openTaskModal(row) {
    this.changedMainTasksData = row?.changedData
    if (row?.id === 0) {
      this.tasksDetailsLoader = false
      this.isAddedTask = true
      this.tasksDetails = row
    }
    else { this.getMainTaskDetails(row?.id) }
    this.modelService.open('changed-main-tasks-details')
  }

  //close tasks modal
  closeTasksDetailsModal() {
    this.tasksDetails = {}
    this.isAddedKpi = false
    this.isAddedTask = false
  }

  // get strategy mappings data
  // getStrategicKpisRequest(goalIds?) {
  //   this.StrategicKpisLoading = true
  //   this.requestsCreateService.getStrategicKpisList(goalIds)
  //     .pipe(finalize(() => { this.StrategicKpisLoading = false }))
  //     .subscribe(res => {
  //       this.strategicKpis = res;

  //     })
  // }

  // get committee KPis
  getCommitteeKPis() {
    this.kpisLoading = true
    let body = {
      pageSize: 100000
    }
    this.httpSer
      .get(`${Config.CommitteeKpi.GetAllByCommitteeId}/${this.committeeId}`, body)
      .pipe(
        finalize(() => (this.kpisLoading = false)))
      .subscribe((res) => {
        this.kpis = res.data;
        this.kpiService.setKPis(this.kpis);
      })
  }

  // get committee Main tasks
  getCommitteeMainTasks() {
    this.mainTasksLoading = true
    this.httpSer
      .get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.committeeId}/MainTasks`)
      .pipe(
        finalize(() => (this.mainTasksLoading = false)))
      .subscribe((res) => {

        this.mainTasks = res;
        this.mainTaskService.setKMainTasks(this.mainTasks);
      })
  }
  //get kpis full details
  getKpisDetails(id) {
    this.kpisDetailsLoader = true

    this.httpSer
      .get(`${Config.chnageRequest.GetKpisDetails}/${id}`)
      .pipe(
        finalize(() => (this.kpisDetailsLoader = false)))
      .subscribe((res) => {
        this.kpisDetails = res;
      })
  }

  getMainTaskDetails(id) {
    this.tasksDetailsLoader = true

    this.httpSer
      .get(`${Config.chnageRequest.GetTasksDetails}/${id}`)
      .pipe(
        finalize(() => (this.tasksDetailsLoader = false)))
      .subscribe((res) => {
        this.tasksDetails = res;

      })
  }
  //
  importedKPIsCount: number = 0;
  goaltreeData: any[] = [];
  getGoalTreeData(goalIds) {
    const body = {
      goalIds: goalIds
    }
    this.httpSer
      .post(`${Config.MangeScorecards.selectedItems}`, body)
      .pipe(finalize(() => (this.StrategicKpisLoading = false)))
      .subscribe(res => {
        this.goaltreeData = res;
        this.importedKPIsCount = 0;
        res.forEach(element => {
          this.importedKPIsCount += this.countNodesOfType(element);

        });

      })
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

}
