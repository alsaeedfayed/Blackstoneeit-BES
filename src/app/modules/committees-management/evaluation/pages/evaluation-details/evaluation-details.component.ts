import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Config } from 'src/app/core/config/api.config';
import { Evaluation } from '../../models/Evaluations';
import { EvaluationService } from '../../services/evaluationService/evaluation.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { Observation } from '../../models/Observation';
import { ToastrService } from 'ngx-toastr';
import { EvaluationStatistics } from '../../models/EvaluationStatistics';
import { MainTasksStatistics } from '../../model/MainTasksStatistics';
import { Permissions } from "src/app/core/services/permissions";

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.scss']
})
export class EvaluationDetailsComponent extends ComponentBase implements OnInit {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loadingData: boolean = true;
  loadingStatistics: boolean = true;
  evaluationId: number = 0;
  // new observation model vars
  isNewObservationModelOpen: boolean = false;
  cancelEvaluationLoading: boolean = false;
  isCommentModelOpen: boolean = false;
  isCloseEvaluationModelOpen: boolean = false;
  selectedObservation: Observation = null;
  confirmMsg: string = "";

  evaluation: Evaluation = {} as Evaluation;
  evaluationStatistics: any
  statuses = [];
  openMode: boolean = false
  closedMode: boolean = false

  // accessed by array index not by id
  observationsStatuses = [
    {},
    { id: 1, name: 'open', nameAr: 'جديد', className: 'active' },
    { id: 2, name: 'Closed', nameAr: 'مغلق', className: 'rejected' },
    { id: 3, name: 'Reopened', nameAr: 'معاد فتحه', className: 'active' },
  ];

  // accessed by array index not by id
  observationsAction = [
    {},
    { id: 1, name: 'Close', nameAr: 'غلق', className: 'text-danger fw-bold' },
    { id: 0, name: 'Reopen', nameAr: 'إعادة فتح', className: 'text-success fw-bold' },
    { id: 1, name: 'Close', nameAr: 'غلق', className: 'text-danger fw-bold' },
  ];
  // description see more  vars
  descTextInitialLimit = 200;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;

  oldAttachments: any[] = [];
  recommendationAttachments: any[] = [];
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private modelService: ModelService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,

  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.checkId();
    this.statuses = this.evaluationService.getStatuses();
   // this.getMembersPerformance()

    // set permission
    this.setPermission();
  }

  // permissions
  cancelEvaluationPermission:number = 0;
  closeEvaluationPermission: number = 0;

  createObservationPermission: number = 0;
  closeObservationPermission: number = 0;
  reopenObservationPermission: number = 0;

  setPermission() {
    this.cancelEvaluationPermission = Permissions.Committees.Evaluations.cancel;
    this.closeEvaluationPermission = Permissions.Committees.Evaluations.close;

    this.createObservationPermission =  Permissions.Committees.Evaluations.Observation.create;
    this.closeObservationPermission =  Permissions.Committees.Evaluations.Observation.close;
    this.reopenObservationPermission =  Permissions.Committees.Evaluations.Observation.reopen;


  }
  //see more
  descTextInitialLimit2 = 2000;
  descTextLimit2 = this.descTextInitialLimit2;
  isDescMoreTextDisplayed2 = false;

  toggleMoreText2() {
    this.isDescMoreTextDisplayed2 = !this.isDescMoreTextDisplayed2;

    this.descTextLimit2 = this.isDescMoreTextDisplayed2 ? 100000000000 : this.descTextInitialLimit2
  }



  checkId() {
    //get id
    this.evaluationId = +this.activatedRoute.snapshot.paramMap.get('id');


    if (isNaN(this.evaluationId)) {
      this.goToNotFound();
      this.evaluationId = null;
    }
    else {

      // handles language change event
      this.handleLangChange();

      //get audit  details
      this.getEvaluationsDetails();




    }
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }

  //evaluations details
  getEvaluationsDetails() {
    this.loadingData = true;
    this.httpSer
      .get(`${Config.CommitteeEvaluations.GetDetails}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingData = false, this.loadingStatistics = false)))
      .subscribe((res: any) => {
        if (res) {
          this.evaluation = res;
          this.evaluation.observations = this.evaluation.observations.map(obj => ({ ...obj, ...{ showMore: false } }));
          //old attachments
          this.oldAttachments = res.attachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
          this.recommendationAttachments = res.recommendationAttachments.map(a => (
            {
              name: a.uploadedFileName,
              extension: a.extension,
              fileName: a.fileName,
              uploadedFileName: a.uploadedFileName
            }
          ));
          if (res?.status == 0) {

            this.openMode = true;
            this.closedMode = false;
            // get meetings statistics
            this.getMeetingsStatistics()
            // get kpis statistics
            this.getKPIsStatistics()
            // get tasks
            this.getKMainTasks()

            // get the evaluation statistics
            this.getEvaluationsStatistics();
            this.getMembersPerformance()
          }
          //TODO in closed mode
          else if (res?.status == 1) {
            this.isLoadingMembersPerformance = false
            this.membersPerformance = res?.membersPerformance
            this.closedMode = true;
            this.openMode = false;
            this.getClosedStatistics()
          }


        } else {
          this.goToNotFound();
        }
      });
  }


  getEvaluationsStatistics() {
    this.httpSer
      .get(`${Config.EvaluationStatics.Statistics}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingStatistics = false)))
      .subscribe((res: EvaluationStatistics) => {
        if (res) {
          this.evaluationStatistics = res;
        }
      });
  }


  // approve & close evaluation action confirmed
  approveAndCloseAudit() {
    this.isCloseEvaluationModelOpen = true;
    this.modelService.open("close-evaluation");
  }

  //open comments model
  openCommentsModel(observation) {
    this.isCommentModelOpen = true;
    this.selectedObservation = observation;
    this.modelService.open("observation-comments");
  }

  //create an  observation confirmed action
  openNewObservationModel() {
    this.isNewObservationModelOpen = true;
    this.modelService.open("new-observation");
  }

  // when model closed cleaning
  closePopup() {

    this.modelService.close();

    this.isNewObservationModelOpen = false;
    this.isCommentModelOpen = false;
    this.isCloseEvaluationModelOpen = false;

    this.selectedObservation = null;
    // update data
    this.getEvaluationsDetails();
  }

  //change observation status button clicked
  takeObservationActionBtn(observation) {
    this.confirmationPopupService.open('change-status');
    this.selectedObservation = observation;

    if (this.selectedObservation.status == 1) {
      // was open --> close
      this.confirmMsg = 'committeesEvaluations.details.table.confirmCLose'
    } else if (this.selectedObservation.status == 2) {
      // wad closed --> open
      this.confirmMsg = 'committeesEvaluations.details.table.confirmReopen'
    } else if (this.selectedObservation.status == 3) {
      //was reopened --> close
      this.confirmMsg = 'committeesEvaluations.details.table.confirmCLose'

    }
  }

  //change observation status confirmed action
  takeObservationAction() {
    this.confirmationPopupService.close('change-status');
    let status = this.selectedObservation.status;
    let id = this.selectedObservation.id;
    let observation = this.evaluation.observations.find(o => o.id === id);
    observation.loadingAction = true;
    // status is open or reopened
    if (status == 1 || status == 3) {
      this.httpSer
        .put(`${Config.CommitteeObservations.Close}/${id}`)
        .pipe(finalize(() => { observation.loadingAction = false; }))
        .subscribe((res: boolean) => {
          if (res) {
            observation.status = 2;
            this.toastr.success(this.translate.instant('committeesEvaluations.details.table.sussesClose'));
          }
        });
      //  status is closed
    } else if (status == 2) {
      this.httpSer
        .put(`${Config.CommitteeObservations.Reopen}/${id}`)
        .pipe(finalize(() => { observation.loadingAction = false; }))
        .subscribe((res: boolean) => {
          if (res) {
            observation.status = 3;
            this.toastr.success(this.translate.instant('committeesEvaluations.details.table.sussesReopen'));
          }
        });
    }
  }

  // cancel evaluation button clicked
  cancelEvaluationBtn() {
    this.confirmationPopupService.open('cancel-evaluation');
  }


  MeetingsStatistics;
  mainTasksStatistics: MainTasksStatistics = {} as MainTasksStatistics;
  KPIsStatistics;
  closedStatistics;
  // cancel evaluation confirmed action
  cancelEvaluation() {
    this.confirmationPopupService.close('cancel-evaluation');
    this.cancelEvaluationLoading = true;
    this.httpSer
      .put(`${Config.CommitteeEvaluations.Cancel}/${this.evaluationId}`)
      .pipe(finalize(() => { this.cancelEvaluationLoading = false; }))
      .subscribe((res: boolean) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeesEvaluations.details.sussesCancel'));
          this.getEvaluationsDetails();
        }

      });
  }

  // get meetings statistics

  getMeetingsStatistics() {
    this.httpSer
      .get(`${Config.EvaluationStatics.Meetings}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingStatistics = false)))
      .subscribe((res: any) => {
        if (res) {
          this.MeetingsStatistics = res;
        }
      });
  }
  // get meetings statistics
  getKPIsStatistics() {
    this.httpSer
      .get(`${Config.EvaluationStatics.KPIs}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingStatistics = false)))
      .subscribe((res: any) => {
        if (res) {
          this.KPIsStatistics = res;
        }
      });
  }

  // get meetings statistics
  getKMainTasks() {
    this.httpSer
      .get(`${Config.EvaluationStatics.Tasks}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingStatistics = false)))
      .subscribe((res: MainTasksStatistics) => {
        if (res) {
          this.mainTasksStatistics = res;
        }
      });
  }

  // get closed statistics
  getClosedStatistics() {
    this.httpSer
      .get(`${Config.EvaluationStatics.ClosedStatistics}/${this.evaluationId}`)
      .pipe(finalize(() => (this.loadingStatistics = false)))
      .subscribe((res: any) => {
        if (res) {
          //this.closedStatistics = res;
          this.evaluationStatistics = res
          this.membersPerformance =  res?.membersPerformance
        }
      });
  }


  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }


  clickedItem : number;
  openIds : any[] = []
  clickRow(item) {
    if(item?.invited) {
      console.log('person' , item)
      let  index = this.openIds.indexOf(item?.member?.id);
      if(index != -1){
        this.openIds.splice(index , 1)
      }
      else {
        this.openIds.push(item?.member?.id)
      }
      // if(item == this.clickedItem){
      //   this.showHidden = !this.showHidden;
      //   this.clickedItem = item
      // }
      // else {
      //    this.clickedItem = item
      // }
    }


  }

  isLoadingMembersPerformance : boolean = true
  membersPerformance : any[] = []
  getMembersPerformance(){
    this.httpSer
      .get(`${Config.CommitteeEvaluations.membersPerformance}/${this.evaluationId}`)
      .pipe(finalize(() => (this.isLoadingMembersPerformance = false)))
      .subscribe((res: any) => {
        if (res) {
          this.membersPerformance = res;
         //console.log('membs' , res)
        }
      });
  }

  isOpen : boolean =false;
  expandTable(){
    this.isOpen = true
    this.openIds = [];
    this.membersPerformance.forEach((item) => {
      if(item?.invited) {
        this.openIds.push(item?.member?.id)

      }
    })
   // console.log(this.openIds)
  }

  closeTable(){
    this.isOpen = false
    this.openIds =[]
  }
}
