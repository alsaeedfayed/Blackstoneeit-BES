import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { UserService } from 'src/app/core/services/user.service';
import { TasksSortBy, sortDirections } from 'src/app/modules/bau/enums/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ExportFilesService } from 'src/app/shared/services/export-files/export-files.service';
import { TaskEnumsDataService } from '../../../tasks/services/taskEnumsData/task-enums-data.service';
import { RoutesVariables } from 'src/app/modules/bau/routes';
import { MainTask } from '../../models/MainTask';

@Component({
  selector: 'app-main-task-details',
  templateUrl: './main-task-details.component.html',
  styleUrls: ['./main-task-details.component.scss']
})
export class MainTaskDetailsComponent extends ComponentBase implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  language: string = this.translate.currentLang;
  backToUrl: string = ''
  title: string = ''

  // loading vars
  isLoadingMainTaskDetails: boolean = true;

  mainTask: MainTask = null;

  mainTaskId: number = 0;

  public sortedCol: TasksSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    //Neet to be edited
    this.mainTaskId = +this.activatedRoute.snapshot.parent.paramMap.get('id');
    // handles language change event
    this.handleLangChange();

    this.getMainTaskDetails();

  }

  ngOnDestroy(): void {
    // Perform cleanup tasks and unsubscribe from any subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .subscribe(() => {
        this.language = this.translate.currentLang;
        this.mainTask && (this.title = this.getTitle());
      });
  }

  getMainTaskDetails() {
    // send a request to fetch tasks
    this.httpSer
      .get(`${Config.BAU.MainTasks.getDetails}/${this.mainTaskId}`)
      .pipe(finalize(() => (this.isLoadingMainTaskDetails = false)))
      .subscribe((res) => {
        if (res) {
          this.backToUrl = `${RoutesVariables.Root}/${RoutesVariables.TaskBoard.Root}/${res.year}/${RoutesVariables.TaskBoard.tasksTable}`;
          this.mainTask = res;
          this.title = this.getTitle();
          // TODO remove it after fix the user card
          this.mainTask.assignedTo = {
            ... this.mainTask.assignedTo,
            fullArabicName: this.mainTask.assignedTo.fullName
          }
        }
      });
  }

  getTitle(): string {
    let group = "";
    if (this.mainTask?.section) {
      group = this.language == 'en' ? this.mainTask.section.name : this.mainTask.section.arabicName;
    } else if (this.mainTask?.department) {
      group = this.language == 'en' ? this.mainTask.department.name : this.mainTask.department.arabicName;
    } else {
      group = this.language == 'en' ? this.mainTask.sector.name : this.mainTask.sector.arabicName;
    }
    return `${group} - ${this.mainTask.year} - ${this.language == 'en' ? this.mainTask.titleEn : this.mainTask.titleAr}`
  }
}
