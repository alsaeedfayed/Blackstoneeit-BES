import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { MainTasksService } from '../../services/mainTasks/main-tasks.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { MainTask } from '../../models/MainTask';
import { id } from '@swimlane/ngx-charts';
import { CommitteeBasicInfoService } from '../../../services/committee-basic-info/committee-basic-info.service';

@Component({
  selector: 'app-main-tasks-rows',
  templateUrl: './main-tasks-rows.component.html',
  styleUrls: ['./main-tasks-rows.component.scss']
})
export class MainTasksRowsComponent extends ComponentBase implements OnInit {

  mainTasks: MainTask[] = null;

  @Input() language: string = '';
  @Input() isRequired: boolean = false;
  @Output() onAdd = new EventEmitter();

  //mainTask model vars
  isTaskModelOpened: boolean = false;
  selectedMainTask: MainTask = null
  deletedTitle: string = null;

  importanceLevels = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private mainTasksService: MainTasksService,
    private modelService: ModelService,
    private toastr: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private committeeBasicInfo : CommitteeBasicInfoService,
  ) {
    super(translateService, translate);
  }


  committeeMembersIds : any[] = []
  ngOnInit(): void {
    this.mainTasks = this.mainTasksService.getMainTasks();

    this.committeeBasicInfo.committeeMembers$.subscribe(res => {
      res.forEach(item => {
        this.committeeMembersIds.push(item.id)
      })
    })
  }

  // open new Main Task model
  openNewMainTaskModel(item: any = null) {
    this.selectedMainTask = item;
    this.isTaskModelOpened = true;
    this.modelService.open('new-main-task');
  }

  // close new Main Task model
  closeNewMainTaskModel() {
    this.onAdd.emit(this.mainTasks.length > 0);
    this.isTaskModelOpened = false;
    this.selectedMainTask = null;
    this.modelService.close();
  }

  // delete KPI
  deleteMainTask(title: string) {
    this.deletedTitle = title;
    this.confirmationPopupService.open('delete-task');

  }

  deleteMainTaskConfirmed() {
    this.confirmationPopupService.close('delete-task');
    if (this.mainTasksService.deleteMainTaskByTitle(this.deletedTitle)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.mainTasksRows.successDeleteMsg'));
      this.onAdd.emit();
    }
    else
      this.toastr.error(this.translate.instant('shared.noData'));
  }

}
