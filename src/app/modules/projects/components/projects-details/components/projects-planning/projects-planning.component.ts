import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import {log} from "ng-zorro-antd/core/logger";

@Component({
  selector: 'app-projects-planning',
  templateUrl: './projects-planning.component.html',
  styleUrls: ['./projects-planning.component.scss']
})
export class ProjectsPlanningComponent implements OnInit, OnChanges {
  @Input() data
  @Input() isPmo
  @Input() isPm
  @Input() lang: string
  isShowAllDesc: boolean = false;
  editTaskLabel: string = this.translateService.instant('projects.editTask');
  markAsCompletedLabel: string = this.translateService.instant('projects.markAsCompleted');
  deleteLabel: string = this.translateService.instant('shared.delete');
  addTasksLabel: string = this.translateService.instant('projects.addTasks');
  manageDeliverablesLabel: string = this.translateService.instant('projects.manageDeliverables');
  viewCompletionEvidenceLabel: string = this.translateService.instant('projects.viewCompletionEvidence');
  tasksText: string = this.translateService.instant('projects.tasks');
  progressText: string = this.translateService.instant('projects.progress');
  taskOptions = [
    {
      item: this.editTaskLabel,
      disabled: false,
      textColor: '',
      icon: ''
    },
    {
      item: this.markAsCompletedLabel,
      disabled: false,
      textColor: '',
      icon: ''
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: '',
      icon: ''
    }
  ]
  milestoneOptions = [
    {
      item: this.addTasksLabel,
      disabled: false,
      textColor: '',
      icon: ''
    },
    {
      item: this.manageDeliverablesLabel,
      disabled: false,
      textColor: '',
      icon: ''
    }
  ]
  view: string = 'card'
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();
  @Output() navigateToTab: EventEmitter<any> = new EventEmitter();

  constructor(private popupService: PopupService,
    private projectsService: ProjectsService,
    private translateService: TranslateService,
    private confirmationModalService: ConfirmModalService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      changes.data?.currentValue.milestones.forEach(element => {
        element['completedTasks'] = element.tasks.filter(item => item.progress === 100).length
        element['deliverablesStats'] = {
          pending: element.deliverables.filter(item => item.status === 'Pending').length,
          accepted: element.deliverables.filter(item => item.status === 'Accepted').length,
          rejected: element.deliverables.filter(item => item.status === 'Rejected').length,
          submitted: element.deliverables.filter(item => item.status === 'Submitted').length,
          total: element.deliverables.length
        }
        element["options"] = element.isCompleted ? this.milestoneOptions.filter(item => item.item !== this.markAsCompletedLabel) : this.milestoneOptions.filter(item => item.item !== this.viewCompletionEvidenceLabel)
      });
    }
  }

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.editTaskLabel = this.translateService.instant('projects.editTask');
      this.markAsCompletedLabel = this.translateService.instant('projects.markAsCompleted');
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.addTasksLabel = this.translateService.instant('projects.addTasks');
      this.manageDeliverablesLabel = this.translateService.instant('projects.manageDeliverables');
      this.viewCompletionEvidenceLabel = this.translateService.instant('projects.viewCompletionEvidence');
      this.tasksText = this.translateService.instant('projects.tasks');
      this.progressText = this.translateService.instant('projects.progress');
      this.taskOptions[0].item = this.editTaskLabel;
      this.taskOptions[1].item = this.markAsCompletedLabel;
      this.taskOptions[2].item = this.deleteLabel;
      this.milestoneOptions[0].item = this.addTasksLabel;
      this.milestoneOptions[1].item = this.manageDeliverablesLabel;
    });
  }

  onMilestoneDropDownSelect(e, milestone) {
    log(e, milestone)
    if (e === this.addTasksLabel) {
      this.projectsService.savepopupConfig({
        title: {
          en: 'Add Task',
          ar: 'أضف مهمة'
        },
        milestoneId: milestone.id,
        milestone: milestone,
        mode: 'task'
      })
      this.popupService.open('project')
    }
    if (e === this.manageDeliverablesLabel) {
      this.navigateToTab.emit({ tab: 3, selectedMilestone: milestone })
      this.refreshParentComponent.emit()

    }
    if (e === this.markAsCompletedLabel) {
      this.projectsService.savepopupConfig({
        title: {
          en: 'Mark Milestone as completed',
          ar: 'وضع علامة مكتملة على المرحلة'
        },
        milestoneId: milestone.id,
        milestone: milestone,
        mode: 'milestone-completion'
      })
      this.popupService.open('project')
    }
    if (e === this.viewCompletionEvidenceLabel) {
      this.projectsService.savepopupConfig({
        title: {
          en: 'Milestone Completion Evidence',
          ar: 'دليل إنجاز المرحلة'
        },
        milestoneId: milestone.id,
        milestone: milestone,
        mode: 'milestone-completion-evidence'
      })
      this.popupService.open('project')
    }

  }

  onTaskDropDownSelect(e, task, milestoneId) {
    if (e === this.editTaskLabel) {
      this.projectsService.savepopupConfig({
        title: {
          en: 'Edit Task',
          ar: 'تعديل المهمة'
        },
        milestoneId: milestoneId,
        task: task,
        mode: 'task'
      })
      this.popupService.open('project')
    }

    if (e === this.markAsCompletedLabel) {
      this.onTaskComplete(task, milestoneId)
    }

    if (e === this.deleteLabel) {
      this.projectsService.saveConfirmationPopupConfig({
        btnText: this.translateService.instant('shared.confirm'),
        text: this.translateService.instant('shared.confirmModalText'),
        mode: "task-delete",
        taskToDeleteId: task?.id
      })
      this.confirmationModalService.open()
    }

  }

  // onTaskComplete(task, milestoneId) {
  //   this.projectsService.addTask({
  //     ...task,
  //     name: task?.name[this.lang],
  //     progress: 100,
  //     milestoneId: milestoneId,
  //     id: task.id,
  //     assignedToUsers: task.assignedToUsers.map(item => item.id)
  //   }).subscribe(res => {
  //     this.refreshParentComponent.emit()
  //   })
  // }

  onTaskComplete(task, milestoneId) {
    if (!this.data?.isProjectClosed){
      this.projectsService.updateProgress({
        taskId: task.id,
        progress: 100,
      }).subscribe(res => {
        this.refreshParentComponent.emit()
      })
    }

  }

}
