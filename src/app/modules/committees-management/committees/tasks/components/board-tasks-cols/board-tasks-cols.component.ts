import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { CommitteeTask } from '../../models/CommitteeTask';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { ToastrService } from 'ngx-toastr';
import { TaskEnumsDataService } from '../../services/taskEnumsData/task-enums-data.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'board-tasks-cols',
  templateUrl: './board-tasks-cols.component.html',
  styleUrls: ['./board-tasks-cols.component.scss']
})
export class BoardTasksColsComponent implements OnInit {
  allTasks: CommitteeTask[][] = [
    [], [], [], []
  ]
  statuses = [
    { id: 0, name: 'Not Started', nameAr: 'لم تبدأ بعد' },
    { id: 1, name: 'In Progress', nameAr: 'قيد التنفيذ' },
    { id: 2, name: 'Done', nameAr: 'مكتملة' },
    { id: 3, name: 'On Hold', nameAr: 'قيد الإنتظار' },
  ];

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Input() tasks: CommitteeTask[] = [];
  @Output() changeHappened = new EventEmitter();
  openedTask: any;
  isDetailsModelOpened = false;
  isUpdateProgressModelOpened = false;
  changeStatusLoading: boolean = false;

  //committeeid
  @Input() committeeId: number
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
    const oldStatus = +(droppedEl.parentElement.id).replace('status-col-', '');

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
      .put(Config.Task.ChangeStatus, { id: taskId, status: newStatus })
      .pipe(finalize(() => { this.changeStatusLoading = false, this.changeHappened.emit(); }))
      .subscribe((res) => {
        if (res) {
          let task = this.allTasks[oldStatus][taskIndex];
          this.allTasks[oldStatus].splice(taskIndex, 1)
          this.allTasks[newStatus].push(task);
          this.toastr.success(this.translate.instant('committeeTasks.changeStatuesSuccessMsg'));
          this.changeHappened.emit();
        }
      });
  }


  // open task details model
  openTaskDetailsModel(task) {
    this.isDetailsModelOpened = true;
    this.taskService.emitTask(task)


    this.openedTask = task;
    // open model only when come from board
    !this.isUpdateProgressModelOpened && setTimeout(() => {
      this.modelService.open("task-models");
    })
    this.isUpdateProgressModelOpened = false;
  }

  //edit
  isUpdatingTask: boolean = false
  updateTask() {

    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false
    this.isUpdatingTask = true
  }

  // close task details model
  closePopup() {
    this.changeHappened.emit();
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = false;
    this.modelService.close();
  }

  // update task progress
  updateTaskProgress(task) {
    this.openedTask = task;
    this.isDetailsModelOpened = false;
    this.isUpdateProgressModelOpened = true;
  }
  onChangeHappened(){
    this.changeHappened.emit();
  }

  // delete task
  confirmMsg: string
  public deleteTask() {
    this.confirmMsg = `${this.translate.instant('committeeTasks.deleteTask')} ${this.translate.currentLang == 'ar' ? `(${this.openedTask.titleAr}) ؟` : `(${this.openedTask.title}) ?`}`;
    this.confirmationPopupService.open('delete-task');
  }

  //delete task
  // Config.Task.Update, body
  onDeleteTaskConfirmed() {
    this.confirmationPopupService.close('delete-task');
    this.httpSer
      .delete(`${Config.Task.Delete}/${this.openedTask?.id}`)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeTasks.deleteSuccessMsg'));
          this.changeHappened.emit();
        }
      });

  }
}
