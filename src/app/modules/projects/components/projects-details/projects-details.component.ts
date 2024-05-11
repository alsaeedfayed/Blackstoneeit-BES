import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/core/services/lookup.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ProjectsService } from '../../services/projects.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.scss']
})
export class ProjectsDetailsComponent extends ComponentBase implements OnInit, OnDestroy {
  active = 1;
  readonly: boolean;
  projectData: any
  projectParamId;
  displayLoadingModal: any;
  likelihoods: any;
  impacts: any;
  confirmationModalConfig: any;
  requestChangeTypes: any;
  changeRequests: any;
  lang: any;
  selectedMilestone: any;
  private subscriptions = new Subscription();
  plannedPercentage: any;
  projectStatus: any;
  plannedBudgetPercentage: any;
  plannedBudget: any;
  isPmo: any;
  isPm: any;
  risksTypes: any;

  constructor(private route: ActivatedRoute,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private userService: UserService,
    private projectsService: ProjectsService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    public platformLocation : PlatformLocation) {
    super(translateService, translate);
    this.route.paramMap.subscribe(paramMap => {
      this.projectParamId = paramMap.get('id');
      this.readonly = paramMap.get('id') ? true : false;
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    this.getProjectById(this.projectParamId)
    this.subscriptions.add(this.projectsService.displayLoadingModal.subscribe(state => {
      this.displayLoadingModal = state
    }))
    this.subscriptions.add(this.projectsService.confirmationPopupConfig.subscribe(config => {
      this.confirmationModalConfig = config
    }))
    this.getImpacts()
    this.getLikelihoods()
    this.getRisksTypes()
    this.isPmo = this.userService.getCurrentUserClaims().includes(4000)

    this.subscriptions.add(this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    }))
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getProjectById(id) {
    this.projectsService.saveLoadingModalState(true)
    this.subscriptions.add(this.projectsService.getProjectById(id).subscribe(res => {
      this.isPm = res.hasPMPrivilege
      let deliverables = []
      let tasks = []
      const startDate: any = moment(new Date(res.startDate))
      const endDate: any = moment(new Date(res.endDate))
      res['duration'] = {
        year: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).years,
        month: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).months,
        day: this.getCountdownFromDays(this.getRemainingDays(startDate, endDate)).days,
      }
      res.milestones.forEach(element => {
        element.deliverables.forEach(deliverable => {
          deliverables.push(deliverable)
        });
        element.tasks.forEach(task => {
          tasks.push(task)
        });
      });
      res['deliverables'] = deliverables
      res['tasks'] = tasks
      res['projectTeam'] = [...new Set(res.teamMemebers.concat(res.sponsers))]
      this.plannedPercentage = res.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).map(item => item.weight).length === 0 ? 0 : res.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).map(item => item.weight).reduce((prev, next) => prev + next)
      // if (res?.status?.code === 'Closed') {
      //   this.projectStatus = {
      //     title: {
      //       en: "Closed",
      //       ar: "مغلق",
      //     },
      //     outerColor: this.plannedPercentage > res.progress ? '#FF285C' : '#00DB99',
      //     innerColor: this.plannedPercentage > res.progress ? '#FFA5BB' : '#E6FBD9',
      //   }
      // } else {
      //   this.projectStatus = {
      //     title: {
      //       en: this.plannedPercentage > res.progress ? "Off Track" : "On Track",
      //       ar: this.plannedPercentage > res.progress ? "متأخر" : "وفق الخطة",
      //     },
      //     outerColor: this.plannedPercentage > res.progress ? '#FF285C' : '#00DB99',
      //     innerColor: this.plannedPercentage > res.progress ? '#FFA5BB' : '#E6FBD9',
      //   }
      // }

      if (res?.status?.code === 'Closed' || res?.status?.code === 'OffTrack' || res?.status?.code === 'Delayed') {
        this.projectStatus = {
          title: res.status.title,
          outerColor: '#FF285C',
          innerColor: '#FFA5BB',
        }
      } else if (res?.status?.code === 'OnTrack') {
        this.projectStatus = {
          title: res.status.title,
          outerColor: '#00DB99',
          innerColor: '#E6FBD9',
        }
      }else if (res?.status?.code === 'NotStarted') {
        this.projectStatus = {
          title: res.status.title,
          outerColor: '#00DB99',
          innerColor: '#E6FBD9',
        }
      }
      res['isProjectClosed'] = res?.status?.code === 'Closed'
      this.plannedBudget = res.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).length !== 0 ? res.milestones.filter(item => moment(item.dueDate).isBefore(new Date())).map(item => item.cost).reduce((prev, next) => prev + next) : 0
      this.projectData = res
      this.projectsService.saveLoadingModalState(false)
    }, err => {
      this.toastr.error(err.message)
    }))
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
    return { years, months, days };
  }

  getRisksTypes() {
    this.projectsService.getLookups().subscribe(res => {
      this.risksTypes = res.find(item => item.lookupType === 'RiskType').result;
      this.risksTypes.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }


  getLikelihoods() {
    this.subscriptions.add(this.lookupService.getLikelihoods().subscribe(res => {
      this.likelihoods = res;
      this.likelihoods.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    }));
  }

  getImpacts() {
    this.subscriptions.add(this.lookupService.getImpacts().subscribe(res => {
      this.impacts = res;
      this.impacts.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    }));
  }

  onPopupConfirm(e) {
    if (this.confirmationModalConfig?.mode === "risk") {
      this.onDeleteRisk(this.confirmationModalConfig.riskId)
    }
    if (this.confirmationModalConfig?.mode === "document") {
      this.onDeleteDocument(this.confirmationModalConfig.documentId)
    }
    if (this.confirmationModalConfig?.mode === "invoice") {
      this.onDeleteInvoiceConfirmed(this.confirmationModalConfig?.invoiceToUpdate?.id)
    }
    if (this.confirmationModalConfig?.mode === "task-delete") {
      this.onDeleteTaskConfirmed(this.confirmationModalConfig.taskToDeleteId)
    }
  }

  onDeleteTaskConfirmed(taskId) {
    this.projectsService.deleteTask(taskId).subscribe(res => {
      this.toastr.success(this.translate.instant("projects.taskWasSuccessfullyDeleted"))
      this.getProjectById(this.projectParamId)
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

  onDeleteRisk(id) {
    this.projectsService.deleteRisk(id).subscribe(res => {
      this.toastr.success(this.translate.instant("projects.riskWasSuccessfullyDeleted"))
      this.getProjectById(this.projectParamId)
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }

  onDeleteDocument(id) {
    this.projectsService.deleteDocument(id).subscribe(res => {
      this.toastr.success(this.translate.instant("projects.documentWasSuccessfullyDeleted"))
      this.ngOnInit()
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }



  onDeleteInvoiceConfirmed(id) {
    this.displayLoadingModal = true
    this.projectsService.deleteInvoice(id).subscribe(res => {
      this.toastr.success(this.translate.instant("projects.invoiceWasSuccessfullyDeleted"))
      this.ngOnInit()
      this.displayLoadingModal = false
    }, err => {
      this.toastr.error(err.message[this.lang])
      this.displayLoadingModal = false
    })
  }

  navigateToTab(event) {
    this.active = event.tab
    this.selectedMilestone = event.selectedMilestone
  }


  onProjectSettingBtnClick() {
    this.popupService.open('project')
    this.projectsService.savepopupConfig({
      title: {
        en: "Project Settings",
        ar: "إعدادات المشروع",
      },
      mode: "setting",
      project: this.projectData,
    })
  }

  back(){
    this.platformLocation.back();
  }
}
