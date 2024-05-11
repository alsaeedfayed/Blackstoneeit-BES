import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';

@Component({
  selector: 'app-board-tasks-cols',
  templateUrl: './board-tasks-cols.component.html',
  styleUrls: ['./board-tasks-cols.component.scss']
})
export class BoardTasksColsComponent implements OnInit {
  allTasks: any[][] = [
    [], [], [], []
  ]
  statuses = [];

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Input() tasks: any[] = [];
  @Output() changeHappened = new EventEmitter();
  openedTask: any;
  isDetailsModelOpened = false;
  isUpdateProgressModelOpened = false;
  changeStatusLoading: boolean = false;


  constructor(
    private translate: TranslateService,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private taskService: TaskEnumsDataService,
    private confirmationPopupService: ConfirmModalService,

  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    this.statuses = this.taskService.getTaskStatuses();
    // split tasks
    this.splitTasks();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  splitTasks() {
    this.tasks.forEach((task) => {
      this.allTasks[task.status].push(task);
    })
  }
  // card actions on drag start
  cardDragStart(e, id, taskIndex) {
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.setData("taskIndex", taskIndex);
    e.dataTransfer.effectAllowed = "move";
  }

  // dropzone actions on drag over
  dropzoneDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // add class active
    e.target.classList.add("active");
  }

  // dropzone actions on drag leave
  dropzoneDragLeave(e) {

    // remove class active
    e.target.classList.remove("active");
  }

  // dropzone actions on drop cards
  dropzoneDropCards(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    const el = e.currentTarget;
    const taskId = e.dataTransfer.getData("taskId");
    const taskIndex = e.dataTransfer.getData("taskIndex");

    const droppedEl = document.getElementById(taskId);

    //old column status
    const oldStatus = + +(droppedEl.parentElement.id).replace('status-col-', '');

    const nextDropzone = droppedEl.nextElementSibling;
    const prevDropzone = droppedEl.previousElementSibling;
    // remove class active
    el.classList.remove("active");

    // insert dropped card into dropzone
    if (el.classList.contains("board-tasks-col")) {
      el.appendChild(droppedEl);
      el.appendChild(nextDropzone);
    } else {
      //in the same place
      if (el === nextDropzone || el === prevDropzone) { return; }

      el.insertAdjacentElement("afterend", droppedEl);
      droppedEl.insertAdjacentElement("afterend", nextDropzone);
    }
    //new column status
    const newStatus = +(droppedEl.parentElement.id).replace('status-col-', '');
    //changeTaskStatus
    if (oldStatus != newStatus)
      this.ChangeTaskStatus(taskId, oldStatus, newStatus, taskIndex);
  }

  //changeTaskStatus
  ChangeTaskStatus(taskId: number, oldStatus: number, newStatus: number, taskIndex: number) {

    this.changeStatusLoading = true;
    this.httpSer
      .put(Config.BAU.Tasks.updateStatus, { taskId: taskId, newStatus: newStatus })
      .pipe(finalize(() => { this.changeStatusLoading = false, this.changeHappened.emit(); }))
      .subscribe((res) => {
        if (res) {
          let task = this.allTasks[oldStatus][taskIndex];
          this.allTasks[oldStatus].splice(taskIndex, 1)
          this.allTasks[newStatus].push(task);
          this.toastr.success(this.translate.instant('bau.bauTasks.changeStatuesSuccessMsg'));
          this.changeHappened.emit();
        }
      });
  }


  // open task details model
  openTaskDetailsModel(task) {
    this.isDetailsModelOpened = true;

    this.openedTask = task;
    // open model only when come from board
    !this.isUpdateProgressModelOpened && setTimeout(() => {
      this.modelService.open("task-models");
    })
    this.isUpdateProgressModelOpened = false;
  }

  progressUpdated: boolean = false;
  // close task details model
  closePopup() {
    (this.progressUpdated || this.isStatusChanged) && this.changeHappened.emit();
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false;
    this.progressUpdated = false;
    this.isStatusChanged = false;
    this.modelService.close();
  }
  onUpdateTaskProgress() {
    this.progressUpdated = true;
    this.openTaskDetailsModel(this.openedTask);
  }

  // update task progress
  updateTaskProgress(task) {
    this.openedTask = task;
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = true;
  }
  isStatusChanged: boolean = false;
  updateTaskStatus() {
    this.isStatusChanged = true;
  }

}
