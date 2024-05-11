import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { IWorkgroup } from '../../models/IWorkgroup';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  isLoading: boolean = true;
  gettingTasks: boolean = true;
  language: string = this.translate.currentLang;
  groupId: number = 0;
  committeeId: number = 0;
  workgroupResult: IWorkgroup;
  isChangeStatsClicked: boolean = false;
  tasks: any[] = [];

  statuses = [
    { id: 0, name: 'Inactive', nameAr: 'غير فعالة',className :'closed' },
    { id: 1, name: 'Active', nameAr: 'فعالة' ,className :'active' },
  ];
  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationPopupService: ConfirmModalService,
    private toastr: ToastrService,
    private modelService: ModelService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    //check id
    this.checkId();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }
  // check if in edit page
  checkId() {
    //get id 
    this.groupId = +this.route.snapshot.paramMap.get('groupId');
    this.committeeId = +this.route.snapshot.paramMap.get('committeeId');

    //check if fake id
    if (isNaN(this.groupId) || isNaN(this.committeeId)) {
      this.goToNotFound();
      this.groupId = null;
      this.committeeId = null;
    }
    else {
      // handles language change event
      this.handleLangChange();
      //get group details
      this.getGroupDetails();

      this.getInprogressTasks();
    }
  }

  toggleStatusBtn() {
    this.confirmationPopupService.open('toggle-status');
  }

  // toggle group status
  toggleStatus() {
    this.confirmationPopupService.close('toggle-status');
    this.isChangeStatsClicked = true;
    this.httpSer
      .put(Config.WorkGroup.ChangeStatus, { id: this.groupId })
      .pipe(finalize(() => (this.isChangeStatsClicked = false)))
      .subscribe(
        (res) => {
          if (res) {
            this.workgroupResult.status = this.workgroupResult?.status == 1 ? 0 : 1;
            this.toastr.success(this.translate.instant('committeeGroupDetails.successMsg', { action: this.translate.instant(this.workgroupResult.status == 0 ? 'committeeGroupDetails.deactivate' : 'committeeGroupDetails.activate') }));
          }

        });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

  update() {
    this.router.navigateByUrl(`committees-management/committee/${this.committeeId}/groups/update/${this.groupId}`);
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  getGroupDetails() {
    this.httpSer
      .get(`${Config.WorkGroup.GetGroupDetails}/${this.groupId}`)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (res: IWorkgroup) => {
          if (res) {
            this.workgroupResult = res;
          } else this.goToNotFound();
        });
  }

  showAllWorkgroupTasks() {
    this.router.navigate([`committees-management/committee-details/${this.committeeId}/tasks`], { queryParams: { workgroupId: JSON.stringify(this.groupId) } })
  }

  getInprogressTasks() {
    let query = {
      pageIndex: 1,
      pageSize: 100000000,
    }
    this.httpSer
      .get(`${Config.Task.GetByWorkGroupId}/${this.groupId}`,query)
      .pipe(finalize(() => (this.gettingTasks = false)))
      .subscribe((res) => {
        if (res) {
          this.tasks = res?.data
        }
      });
  }
  openTask : boolean = false
  // open create task model
  openCreateTaskModel() {
    this.openTask = true
    this.modelService.open('create-task');
  }
  closePopup() {
    this.openTask = false;
    this.modelService.close();
  }
}
