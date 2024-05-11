import { takeUntil, finalize } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICommitteeInfo } from 'src/app/modules/committees-management/models/ICommitteeInfo';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Config } from 'src/app/core/config/api.config';
import { Subject } from 'rxjs';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { KPI } from '../../../requests/models/KPI';
import { MainTask } from '../../../requests/models/MainTask';
import { RoutesVariables } from '../../../routes';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { KpiService } from '../../../requests/services/KpiServie/kpi.service';

@Component({
  selector: 'app-committee-info',
  templateUrl: './committee-info.component.html',
  styleUrls: ['./committee-info.component.scss']
})
export class CommitteeInfoComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string;
  // loading vars
  isLoading: boolean = true;
  StrategicKpisLoading: boolean = true;
  kpisLoading: boolean = true;
  mainTasksLoading: boolean = true;

  strategicKpis: any[] = [];
  kpis: KPI[] = [];
  mainTasks: MainTask[] = [];

  // description see more  vars
  descTextInitialLimit = 500;
  descTextLimit = this.descTextInitialLimit;
  isDescMoreTextDisplayed = false;
  @Input() id: string;

  @Output()
  public onLoad: EventEmitter<ICommitteeInfo> = new EventEmitter();
  committeeInfo: ICommitteeInfo;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requestsCreateService: RequestsCreateService,
    private modelService: ModelService,
    private kpiService: KpiService,

  ) {
    super(translateService, translate);
    this.language = this.translate.currentLang;
  }

  ngOnInit(): void {
    //check id
    this.checkId();

    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  //check id
  checkId() {
    if (isNaN(+this.id)) {
      this.goToNotFound();
      this.id = null;
    } else {
      //get all details
      this.GetRequestDetails();

      // get committee KPis
      this.getCommitteeKPis();

      // get committee Main tasks
      this.getCommitteeMainTasks();

    }

  }
  // toggle more text in description
  toggleMoreText() {
    this.isDescMoreTextDisplayed = !this.isDescMoreTextDisplayed;

    this.descTextLimit = this.isDescMoreTextDisplayed ? 100000000000 : this.descTextInitialLimit
  }

  //get request Details
  GetRequestDetails() {

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.httpSer
        .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.id}`, { includeUserDetails: true })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (res: ICommitteeInfo) => {
            if (res) {
              this.committeeInfo = res;
              this.committeeInfo.duration ? this.committeeInfo.committeeDurationType = 2 : this.committeeInfo.committeeDurationType = 1; //temporarily committee
              this.onLoad.emit(this.committeeInfo);

              // this.committeeInfo.goalIds?.length > 0 && this.getStrategicKpisRequest(this.committeeInfo.goalIds);
              let combinedArray = [...this.committeeInfo.goalIds, ...this.committeeInfo.measurableGoalIds];
              this.getGoalTreeData(combinedArray);
            } else this.goToNotFound();
          });
    });
  }

  // get strategy mappings data
  // getStrategicKpisRequest(goalIds?) {
  //   this.requestsCreateService.getStrategicKpisList(goalIds)
  //     .pipe(finalize(() => { this.StrategicKpisLoading = false }))
  //     .subscribe(res => {
  //       this.strategicKpis = res;

  //     })
  // }
  goaltreeData: any[] = [];
  importedKPIsCount: number = 0;

  getGoalTreeData(goalIds) {
    const body = {
      goalIds: goalIds
    }
    this.httpSer.post(`${Config.MangeScorecards.selectedItems}`, body).pipe(finalize(() => (this.isLoading = false)))
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
  // get committee KPis
  getCommitteeKPis() {
    let body = {
      pageSize: 5
    }
    this.httpSer
      .get(`${Config.CommitteeKpi.GetAllByCommitteeId}/${this.id}`, body)
      .pipe(
        finalize(() => (this.StrategicKpisLoading = false)))
      .subscribe((res) => {
        this.kpiService.setKPis(res.data);
        this.kpis = this.kpiService.getKPIs();

      })
  }

  // get committee Main tasks
  getCommitteeMainTasks() {
    this.httpSer
      .get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.id}/MainTasks`)
      .pipe(
        finalize(() => (this.mainTasksLoading = false)))
      .subscribe((res) => {
     //   console.log('mainTasks' , res)
        if (res) {
          this.mainTasks = res.slice(0, 5);

        }
      })
  }
  goToTasks() {
    let path = `/committees-management/committee-details/${this.id}/tasks`;
    this.router.navigateByUrl(path);
  }
  goToKpis() {
    let path = `/committees-management/committee-details/${this.id}/KPIs`;
    this.router.navigateByUrl(path);
  }
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  tasksDetailsData: any
  openTasksModal(item: any) {
    this.tasksDetailsData = item
    this.modelService.open('tasks-details')
  }

  //open kpis modal
  kpisDetailsData: any
  openKpisModal(item: any) {
    this.kpisDetailsData = item
    this.modelService.open('kpis-details')
  }

  closePopup() {
    this.tasksDetailsData = null;
    this.kpisDetailsData = null;
  }

}
