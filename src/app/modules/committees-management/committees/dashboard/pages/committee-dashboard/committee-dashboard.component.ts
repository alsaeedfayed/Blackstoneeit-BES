import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import Chart from "chart.js/auto";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { RoutesVariables } from "src/app/modules/committees-management/routes";
import { ImageService } from "src/app/shared/PersonItem/image.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { CommitteeTask } from "../../../tasks/models/CommitteeTask";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { NgxCaptureService } from "ngx-capture";
import { TaskEnumsDataService } from "../../../tasks/services/taskEnumsData/task-enums-data.service";
import { ConfirmModalService } from "src/app/shared/confirm-modal/confirm-modal.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-committee-dashboard",
  templateUrl: "./committee-dashboard.component.html",
  styleUrls: ["./committee-dashboard.component.scss"],
})
export class CommitteeDashboardComponent
  implements OnInit, AfterViewChecked, AfterViewInit, AfterContentInit {
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  committeeId: number = null;

  gettingStatistics: boolean = true;
  gettingTasksStatuses: boolean = true;
  gettingMeetings: boolean = true;
  gettingTasks: boolean = true;
  gettingDecisions: boolean = true;
  gettingActivePolls: boolean = true;
  gettingRecentActivities: boolean = true;

  //statistics counts
  membersCount: number = 0;
  tasksCount: number = 0;
  groupsCount: number = 0;

  //task statuses
  taskStatus: any[] = [];

  //tasks
  tasks: any[] = [];

  //upComing meetings
  meetings: any[] = [];
  meetingsCount: number = 0;

  //latest decisions
  decisions: any[] = [];
  decisionStatus = [
    { id: 0, name: "Open", nameAr: "مفتوح", className: "closed" },
    { id: 1, name: "Pending", nameAr: "معلق", className: "pendingMom" },
    { id: 2, name: "Rejected", nameAr: "مرفوض", className: "rejected" },
    { id: 3, name: "Completed", nameAr: "منتهي", className: "active" },
    { id: 4, name: "InProgress", nameAr: "متوسط", className: "inProgress" },
    { id: 5, name: "returned", nameAr: "معاد", className: "started" },
    { id: 6, name: "Canceled", nameAr: "ملغى", className: "cancelled" },
  ];

  //active polls
  polls: any[] = [];
  pollsCount: number = 0;
  yesPercentage: number = 0;
  votersInfo: any[][] = [[], []];

  //Recent Activities
  recentActivities: any[] = [];
  recentActivitiesCount: number = 0;

  detailsLabel = this.translate.instant("shared.viewDetails");

  @Input() public set committeeDetails(val: any) {
    this.committeeId = val?.id;
    if (this.committeeId) {
      //get today upcoming meetings
      this.getUpComingMeetingToday();

      //get Statistics counts
      this.getMyStatistics();

      //get tasks statuses
      this.getTasksStatuses();

      // get tasks
      this.getActiveTwoTasks();

      //get latest decisions
      // this.getLatestFourDecisions();

      //get active polls
      this.getActivePolls();

      //get Recent Activities
      // this.getRecentActivities();
    }
  }

  destChart: boolean = false;
  constructor(
    private translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private imageService: ImageService,
    private modelService: ModelService,
    private exportAsService: ExportAsService,
    private captureService : NgxCaptureService,
    private taskService : TaskEnumsDataService,
    private confirmationPopupService : ConfirmModalService,
    private toastr: ToastrService,

  ) { }


  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementIdOrContent: 'myTableElementId', // the id of html/table element
  }

  isCapturing : boolean = false;
  exportPng(){
    this.isCapturing = true;
    const imageElementContainer = document.querySelector(".dashboard-container") as HTMLElement;
    if (!imageElementContainer) return;
    setTimeout(() => {
      this.captureService.getImage(imageElementContainer, true)
        .pipe(

          finalize(() => this.isCapturing = false)
        ).subscribe((image) => {
          var a = document.createElement("a"); //Create <a>
          a.href = image; //Image Base64 Goes here

          a.download = "Customer Serivce " + ".png"; //File name Here
          a.click(); //Downloaded file
        });
    }, 100);

  }

  destroyedChartt(event: boolean) {
    this.destChart = event

  }
  ngAfterContentInit(): void {
    // this.getKPisData()
    // setTimeout(() => {
    //   this.destChart = true
    // }, 3000);
  }

  // kpis numbers
  totalTasks: number = 0;
  inProgress: number = 0;
  completed: number = 0;
  onTrack: number = 0;

  trackRate: boolean = false;

  kpiData: any = [
    { label: "A", rate: 10 },
    { label: "b", rate: 20 },
    { label: "c", rate: 15 },
    { label: "d", rate: 25 },
  ];

  onSwitchChange(e) {
  }
  goToKpis() {
    let path = `/committees-management/committee-details/${this.committeeId}/KPIs`;
    this.router.navigateByUrl(path);
  }

  ngAfterViewInit(): void {
    //debugger
    //this.canvas = this.myChart?.nativeElement;
    var ctx: any = document.querySelector("#myChart"); // node
    var ctx2 = ctx?.getContext("2d"); // 2d context
    // this.ctx = ctx2
    // this.initIsDone = true
  }
  ngAfterViewChecked(): void { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date);
    const newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  onOptionSelect(e, item) {
    if (e === this.detailsLabel) {
      switch (item.entityType) {
        case 0: //meeting log
          this.goToMeetingDetails(item.entityId);
          break;
        case 1: //task log
          this.goToTaskDetails(item.entityId);
          break;
        case 2: //decision log
          this.goToDecisionDetails(item.entityId);
          break;
        case 3: // group log
          this.goToGroupDetails(item.entityId);
          break;
        case 4: // meeting Comment log
          this.getMeetingId(item.entityId);
          break;
        default:
          break;
      }
    }
  }

  getItems(item): any[] {
    const options = [];
    options.push({
      item: this.detailsLabel,
      icon: "bx bx-detail",
    });

    return options;
  }

  getMyStatistics() {
    this.httpSer
      .get(`${Config.CommitteeDashboard.GetMyStatistics}/${this.committeeId}`)
      .pipe(
        finalize(() => {
          this.gettingStatistics = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.membersCount = res.membersCount;
          this.groupsCount = res.workGroupsCount;
        }
      });
  }

  getTasksStatuses() {
    this.httpSer
      .get(`${Config.CommitteeDashboard.GetTasksStatuses}/${this.committeeId}`)
      .pipe(
        finalize(() => {
          this.gettingTasksStatuses = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.tasksCount = res.taskTotalCount;

          this.taskStatus = [
            {
              percent: res.todoPercent,
              count: res.todoCount,
              label: "committeeDashboard.taskStatus.toDo",
              color: "#0500FF",
            },
            {
              percent: res.inProgressPercent,
              count: res.inProgressCount,
              label: "committeeDashboard.taskStatus.inProgress",
              color: "#FF6B00",
            },
            {
              percent: res.underReviewPercent,
              count: res.underReviewCount,
              label: "committeeDashboard.taskStatus.underReview",
              color: "#3CA6BD",
            },
            {
              percent: res.donePercent,
              count: res.doneCount,
              label: "committeeDashboard.taskStatus.done",
              color: "#0FC196",
            },
          ];
        }
      });
  }

  getUpComingMeetingToday() {
    let body = {
      pageIndex: 1,
      pageSize: 10000000,
    };
    this.httpSer
      .get(
        `${Config.CommitteeDashboard.GetUpComingMeetingToday}/${this.committeeId}`,
        body
      )
      .pipe(
        finalize(() => {
          this.gettingMeetings = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.meetings = res.data;
          this.meetingsCount = res.count;
        }
      });
  }

  getActiveTwoTasks() {
    this.httpSer
      .get(`${Config.CommitteeDashboard.GetActiveTwoTasks}/${this.committeeId}`)
      .pipe(finalize(() => { this.gettingTasks = false; }))
      .subscribe(res => {
        if (res) {
          this.tasks = res;
        }
      });
  }

  // getLatestFourDecisions() {
  //   this.httpSer
  //     .get(`${Config.CommitteeDashboard.GetLatestFourDecisions}/${this.committeeId}`)
  //     .pipe(finalize(() => { this.gettingDecisions = false; }))
  //     .subscribe(res => {
  //       if (res) {
  //         this.decisions = res;
  //         this.decisions.forEach((decision: any) => {
  //           if (decision.votersInfo) {
  //             decision.votersInfo.forEach(member => {
  //               if (member.fileName?.length > 0) {
  //                 member.image = null;
  //                 this.imageService
  //                   .setFileURL(member.fileName)
  //                   .subscribe(imgUrl => {
  //                     // add member image to the member object
  //                     member.image = imgUrl[0]?.fileUrl;
  //                   });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  // }

  getActivePolls() {
    let body = {
      pageIndex: 1,
      pageSize: 2,
    };
    this.httpSer
      .get(`${Config.CommitteeDashboard.GetActivePolls}/${this.committeeId}`, body)
      .pipe(finalize(() => { this.gettingActivePolls = false; }))
      .subscribe((res) => {
        if (res) {
          // this.pollsCount = res.count;
          this.polls = res.data;
          this.polls.forEach((poll, i) => {
            // poll.yesVoterInfo && this.votersInfo[i].push(...poll.yesVoterInfo);
            // poll.noVoterInfo && this.votersInfo[i].push(...poll.noVoterInfo);
            // poll.yesPercentage = (poll.yesCount / poll.votersCount) * 100;
            if (this.votersInfo[i]) {
              this.votersInfo[i].forEach(member => {
                if (member.fileName?.length > 0) {
                  member.image = null;
                  this.imageService
                    .setFileURL(member.fileName)
                    .subscribe(imgUrl => {
                      // add member image to the member object
                      member.image = imgUrl[0]?.fileUrl;
                    });
                }
              });
            }
          });
        }
      });
  }

  // getRecentActivities() {
  //   let body = {
  //     pageIndex: 1,
  //     pageSize: 4,
  //   };
  //   this.httpSer
  //     .get(
  //       `${Config.CommitteeDashboard.GetRecentActivities}/${this.committeeId}`,
  //       body
  //     )
  //     .pipe(
  //       finalize(() => {
  //         this.gettingRecentActivities = false;
  //       })
  //     )
  //     .subscribe(res => {
  //       if (res) {
  //         this.recentActivities = res.data;
  //         this.recentActivitiesCount = res.count;
  //       }
  //     });
  // }

  getMeetingId(id) {
    this.httpSer
      .get(`${Config.Meeting.Comments.GetById}/${id}`)
      .pipe(
        finalize(() => {
          this.gettingRecentActivities = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.goToMeetingDetails(res.meetingId);
        }
      });
  }
  // go to meeting details page
  goToMeetingDetails(id) {
    let path = `/committees-management/${RoutesVariables.Meeting.Details}`
      .replace(":committeeId", `${this.committeeId}`)
      .replace(":meetingId", `${id}`);
    this.router.navigateByUrl(path);
  }
  goToTaskDetails(id) {
    let path = `/committees-management/committee/${this.committeeId}/tasks/${id}`;
    this.router.navigateByUrl(path);
  }
  goToDecisionDetails(id) {
    let path = `/committees-management/committee/${this.committeeId}/decisions/${id}`;
    this.router.navigateByUrl(path);
  }
  goToGroupDetails(id) {
    let path = `/committees-management/committee/${this.committeeId}/groups/${id}`;
    this.router.navigateByUrl(path);
  }

  isDetailsModelOpened: boolean = false;
  isUpdateProgressModelOpened: boolean = false;
  openedTask: CommitteeTask = {} as CommitteeTask;
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
  this.getActiveTwoTasks()
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
  this.getActiveTwoTasks()
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
        this.getActiveTwoTasks();
      }
    });

}
}
