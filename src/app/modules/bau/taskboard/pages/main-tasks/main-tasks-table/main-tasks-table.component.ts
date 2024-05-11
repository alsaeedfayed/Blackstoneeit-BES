import { Component, OnInit, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import {
  TaskTrackStaus,
  TaskImportanceLevel,
  TaskRecurrentType,
} from "../../../enums/enums";
import { Config } from "src/app/core/config/api.config";
import { BAUStateService } from "../../../services/bau-state.service";
import { openCloseScaleAnimation } from "../../../animation/open-close-scale.animation";
import { finalize } from "rxjs/operators";
import { ModelService } from "src/app/shared/components/model/model.service";
import { TaskEnumsDataService } from "../../../tasks/services/taskEnumsData/task-enums-data.service";

@Component({
  selector: "app-main-tasks-table",
  templateUrl: "./main-tasks-table.component.html",
  styleUrls: ["./main-tasks-table.component.scss"],
})
export class MainTasksTableComponent implements OnInit {
  isLoading: boolean = true;
  isFetchingBoard: boolean = false;
  lang: string = this.translate.currentLang;

  mainTasks = [];
  filteredTasks: any;
  canCreateTask: boolean = false;
  mainTaskProgress: number = 0;
  sector = localStorage.getItem("selectedSector");
  department = localStorage.getItem("selectedDept");
  section = localStorage.getItem("selectedfunc");
  requestBody = {
    trackStatus: null,
    status: null,
    groupId: this.section || this.department || this.sector || null,
  };
  selectedYear: string;
  taskStatuses = [];
  importanceLevels = [];
  onTrackLabel = this.translate.instant("shared.onTrack");
  offTrackLabel = this.translate.instant("shared.offTrack");
  allLabel = this.translate.instant("shared.all");
  lowLabel = this.translate.instant("bau.low");
  mediumLabel = this.translate.instant("bau.medium");
  highLabel = this.translate.instant("bau.high");
  trackStatusFilterItems = [
    { id: 1, item: this.onTrackLabel, disabled: false, icon: "" },
    { id: 2, item: this.offTrackLabel, disabled: false, icon: "" },
    { id: 3, item: this.allLabel, disabled: false, icon: "" },
  ];

  taskStatusFilterItems = [
    { id: 1, item: this.lowLabel, disabled: false, icon: "" },
    { id: 2, item: this.mediumLabel, disabled: false, icon: "" },
    { id: 3, item: this.highLabel, disabled: false, icon: "" },
    { id: 4, item: this.allLabel, disabled: false, icon: "" },
  ];

  selectedTrackStatus: string = this.allLabel;
  selectedImportance: string = this.allLabel;

  detialsLabel = this.translate.instant("shared.viewDetails");
  editLabel = this.translate.instant("shared.edit");
  copy = this.translate.instant("shared.clone");
  deleteLabel = this.translate.instant("shared.delete");
  createSubTaskLabel = this.translate.instant("bau.createTask");
  duplicateLabel = this.translate.instant("bau.duplicate");

  selectActions = [
    {
      item: this.detialsLabel,
      disabled: false,
      textColor: "",
      icon: "bx bx-detail",
    },
    {
      item: this.editLabel,
      disabled: false,
      textColor: "",
      icon: "bx bxs-edit",
    },
    {
      item: this.copy,
      disabled: false,
      textColor: "",
      icon: "bx bxs-copy",
    },
    {
      item: this.deleteLabel,
      disabled: false,
      textColor: "",
      icon: "bx bx-trash",
    },
    {
      item: this.createSubTaskLabel,
      disabled: false,
      textColor: "",
      icon: "bx bx-add-to-queue",
    },
    {
      item: this.duplicateLabel,
      disabled: false,
      textColor: "",
      icon: "bx bx-copy-alt",
    },
  ];

  subtaskActions = this.selectActions.filter(
    (_, index) => index !== 2 && index !== 3 && index !== 4
  );

  constructor(
    private translate: TranslateService,
    private httpService: HttpHandlerService,
    private stateService: BAUStateService,
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    private taskEnumsDataService: TaskEnumsDataService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();

    this.taskStatuses = this.taskEnumsDataService.getTaskStatuses();
    this.importanceLevels = this.taskEnumsDataService.getTasksPriorities();

    // subscribe to param to route to the right route if year change
    this.selectedYear = this.route.parent.snapshot.paramMap.get("year");
    this.route.parent?.paramMap.subscribe(params => {
      this.selectedYear = params.get("year");
    });

    // trigger get data if BAUSearchbarValues local storage dont exist
    const storedData = localStorage.getItem("BAUSearchbarValues");
    if (this.selectedYear && storedData == null) {
      const searchData: any = {
        selectedYear: this.selectedYear,
        groupId: null,
      };
      this.performSearch(searchData);
    }

    // get search data from url and if anything is wrong set to has no board
    const objectString = this.route.snapshot.queryParams["data"];
    if (objectString) {
      try {
        const searchData = JSON.parse(objectString);
        this.performSearch(searchData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    this.route.queryParams.subscribe(params => {
      const objectString = params["data"];

      if (objectString) {
        try {
          const searchData = JSON.parse(objectString);
          this.performSearch(searchData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    });
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;

      // change actions label to arabic
      this.detialsLabel = this.translate.instant("shared.viewDetails");
      this.editLabel = this.translate.instant("shared.edit");
      this.deleteLabel = this.translate.instant("shared.delete");
      this.createSubTaskLabel = this.translate.instant("bau.createTask");
      this.duplicateLabel = this.translate.instant("bau.duplicate");
      this.selectActions = [
        {
          item: this.detialsLabel,
          disabled: false,
          textColor: "",
          icon: "bx bx-detail",
        },
        {
          item: this.editLabel,
          disabled: false,
          textColor: "",
          icon: "bx bxs-edit",
        },
        {
          item: this.copy,
          disabled: false,
          textColor: "",
          icon: "bx bxs-copy",
        },
        {
          item: this.deleteLabel,
          disabled: false,
          textColor: "",
          icon: "bx bx-trash",
        },
        {
          item: this.createSubTaskLabel,
          disabled: false,
          textColor: "",
          icon: "bx bx-add-to-queue",
        },
        {
          item: this.duplicateLabel,
          disabled: false,
          textColor: "",
          icon: "bx bx-copy-alt",
        },
      ];
      this.subtaskActions = this.selectActions.filter(
        (_, index) => index !== 2 && index !== 3 && index !== 4
      );

      this.selectedTrackStatus = this.translate.instant("shared.all");
      this.selectedImportance = this.translate.instant("shared.all");

      this.onTrackLabel = this.translate.instant("shared.onTrack");
      this.offTrackLabel = this.translate.instant("shared.offTrack");
      this.allLabel = this.translate.instant("shared.all");
      this.lowLabel = this.translate.instant("bau.low");
      this.mediumLabel = this.translate.instant("bau.medium");
      this.highLabel = this.translate.instant("bau.high");
      this.trackStatusFilterItems = [
        { id: 1, item: this.onTrackLabel, disabled: false, icon: "" },
        { id: 2, item: this.offTrackLabel, disabled: false, icon: "" },
        { id: 3, item: this.allLabel, disabled: false, icon: "" },
      ];

      this.taskStatusFilterItems = [
        { id: 1, item: this.lowLabel, disabled: false, icon: "" },
        { id: 2, item: this.mediumLabel, disabled: false, icon: "" },
        { id: 3, item: this.highLabel, disabled: false, icon: "" },
        { id: 4, item: this.allLabel, disabled: false, icon: "" },
      ];

      this.mainTasks?.forEach(task => {
        // Check conditions and filter selectActions accordingly
        task.actions = this.selectActions.filter(action => {
          switch (action.item) {
            case this.detialsLabel:
              return true;
            case this.editLabel:
              return task.canEditTask;
            case this.duplicateLabel:
              return true;
            case this.createSubTaskLabel:
              return task.canAddTask; // Default to true if not found
            case this.duplicateLabel:
              return true; // Default to true if not found
          }
        });
      });
    });
  }

  mainTaskActions(event, taskId: number) {
    switch (event) {
      case this.detialsLabel:
        this.router.navigateByUrl(`/bau/taskboard/mainTasks/details/${taskId}`);
        break;
      case this.editLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/main-task/management/edit/${taskId}?mode=edit`
        );
        break;
      case this.duplicateLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/main-task/management/copy/${taskId}?mode=copy`
        );
        break;
      case this.deleteLabel:
        // this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        break;
      case this.createSubTaskLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/create-sub-task/${taskId}`
        );
        break;
      default:
        this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        break;
    }
  }

  subTaskActions(event, taskId: number) {
    switch (event) {
      case this.detialsLabel:
        let task = { id: taskId };
        this.openTaskDetailsModel(task);
        break;
      case this.editLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/edit-sub-task/${taskId}?mode=edit`
        );
        break;
      case this.duplicateLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/edit-sub-task/${taskId}?mode=copy`
        );
        break;
      case this.deleteLabel:
        // this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        break;
      case this.createSubTaskLabel:
        this.router.navigateByUrl(
          `/bau/taskboard/${this.selectedYear}/create-sub-task/${taskId}`
        );
        break;
      default:
        this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        break;
    }
  }

  performSearch(searchData: any) {
    const selectedYear = searchData.selectedYear;
    const groupId = searchData.groupId;
    this.requestBody.groupId = groupId;
    this.fetchMainTasks(selectedYear, this.requestBody);
  }

  fetchMainTasks(year, requestBody) {
    this.isFetchingBoard = true;
    this.httpService
      .post(`${Config.BAU.TasksManagement.getBoard}/${year}`, requestBody)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isFetchingBoard = false;
        })
      )
      .subscribe(res => {
        this.canCreateTask = res.canCreateTask;
        this.mainTaskProgress = res.mainTaskProgress;
        this.mainTasks = res.mainTasks;
        this.filteredTasks = this.mainTasks;

        // Iterate through mainTasks array
        this.mainTasks?.forEach(task => {
          // Check conditions and filter selectActions accordingly
          task.actions = this.selectActions.filter(action => {
            switch (action.item) {
              case this.detialsLabel:
                return true;
              case this.editLabel:
                return task.canEditTask;
              case this.duplicateLabel:
                return true;
              case this.createSubTaskLabel:
                return task.canAddTask; // Default to true if not found
              case this.duplicateLabel:
                return true; // Default to true if not found
            }
          });
        });
      });
  }

  expandedRow: number = -1;

  toggleRow(index: number) {
    this.expandedRow = this.expandedRow === index ? -1 : index;
  }

  isExpanded(index: number): boolean {
    return this.mainTasks[index].Task && this.mainTasks[index].Task.length > 0;
  }

  getProgressStatus(status: TaskTrackStaus): string {
    switch (status) {
      case TaskTrackStaus.OnTrack:
        return this.translate.instant("bau.onTrack");
      case TaskTrackStaus.OffTrack:
        return this.translate.instant("bau.offTrack");
      case TaskTrackStaus.NotStarted:
        return this.translate.instant("bau.notStarted");
    }
  }

  getStatusClass(status: TaskTrackStaus): string {
    switch (status) {
      case TaskTrackStaus.OnTrack:
        return "on-track";
      case TaskTrackStaus.OffTrack:
        return "off-track";
      case TaskTrackStaus.NotStarted:
        return "not-started";
    }
  }

  getImportanceClass(status: TaskImportanceLevel): string {
    switch (status) {
      case TaskImportanceLevel.Low:
        return "btn-info";
      case TaskImportanceLevel.Medium:
        return "btn-warning";
      case TaskImportanceLevel.High:
        return "btn-danger";
    }
  }

  // sub tasks modal functions

  openedTask: any;
  isDetailsModelOpened = false;
  isUpdateProgressModelOpened = false;
  changeStatusLoading: boolean = false;

  // open task details model
  openTaskDetailsModel(task) {
    this.isDetailsModelOpened = true;

    this.openedTask = task;
    // open model only when come from board
    !this.isUpdateProgressModelOpened &&
      setTimeout(() => {
        this.modelService.open("task-models");
      });
    this.isUpdateProgressModelOpened = false;
  }

  progressUpdated: boolean = false;

  // close task details model
  closePopup() {
    (this.progressUpdated || this.isStatusChanged) &&
      this.fetchMainTasks(this.selectedYear, this.requestBody);

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

  filterTasks() {
    this.filteredTasks = this.mainTasks.filter(task => {
      return (
        (this.selectedTrackStatus === this.allLabel ||
          this.getTrackStatus(task) === this.selectedTrackStatus) &&
        (this.selectedImportance === this.allLabel ||
          this.getImportance(task) === this.selectedImportance)
      );
    });
  }

  filterTrackActions(e) {
    console.log(e);
    this.selectedTrackStatus = e;
    this.filterTasks();
  }

  filterTaskActions(e) {
    this.selectedImportance = e;
    this.filterTasks();
  }

  getTrackStatus(task) {
    switch (task.progressStatus) {
      case 1:
        return this.onTrackLabel;
      case 2:
        return this.offTrackLabel;
      default:
        return this.allLabel;
    }
  }

  getImportance(task) {
    switch (task.importance) {
      case 1:
        return this.lowLabel;
      case 2:
        return this.mediumLabel;
      case 3:
        return this.highLabel;
      default:
        return this.allLabel;
    }
  }

  getTrackStatusFilterClass(): string {
    switch (this.selectedTrackStatus) {
      case this.onTrackLabel:
        return "on-track";
      case this.offTrackLabel:
        return "off-track";
      default:
        return "";
    }
  }

  getTaskStatusFilterClass(): string {
    switch (this.selectedImportance) {
      case this.highLabel:
        return "high";
      case this.mediumLabel:
        return "medium";
      case this.lowLabel:
        return "low";
      default:
        return "";
    }
  }
}
