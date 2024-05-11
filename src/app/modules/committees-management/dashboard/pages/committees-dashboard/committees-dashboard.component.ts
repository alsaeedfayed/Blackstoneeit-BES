import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { Config } from "src/app/core/config/api.config";
import { finalize, map, takeUntil, tap } from "rxjs/operators";
import { RoutesVariables } from "../../../routes";
import {
  RequestsSortBy,
  committeeAuditsSortBy,
  evaluationSortBy,
  sortDirections,
} from "../../../enums/enums";
import { Observable, Subject, combineLatest } from "rxjs";
import { environment } from "src/environments/environment";
import { UserService } from "src/app/core/services/user.service";
import { ModelService } from "src/app/shared/components/model/model.service";
import { ExportFilesService } from "src/app/shared/services/export-files/export-files.service";
import {
  committeesCategoriesObject,
  committeesTypes,
} from "../../models/committees-dashboard";
import { NgxCaptureService } from "ngx-capture";
import { auto } from "@popperjs/core";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MyAttService } from "./myAtt.service";

@Component({
  selector: "app-committees-dashboard",
  templateUrl: "./committees-dashboard.component.html",
  styleUrls: ["./committees-dashboard.component.scss"],
})
export class CommitteesDashboardComponent
  extends ComponentBase
  implements OnInit
{
  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = true;
  isTypesLoading: boolean = false;
  isCategoriesLoading: boolean = false;
  isTotalCommitteesCountLoading: boolean = false;
  isTotalTaskCountLoading: boolean = false;
  isTotalMeetingsCountLoading: boolean = false;
  isTotalDecisionsCountLoading: boolean = false;
  isCommitteAuditsLoading: boolean = false;

  // filtration properties
  searchValue: string = "";
  filterData: any = {};
  tempFilterData: any = {};
  emptyFIlters: boolean = true;
  appliedFiltersCount: number = 0;
  filtersCount: number = 0;

  // pagination properties
  totalItems: number = 0;
  paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // analytics properties
  totalRequests: number = 0;
  pendingRequests: number = 0;
  rejectedRequests: number = 0;
  approvedRequests: number = 0;

  totalMeetings: number = 0;
  totalTasks: number = 0;
  totalCommittees: number = 0;
  totalDecisions: number = 0;

  //audits
  committeeAudits: any[] = [];

  // all items list
  list: any = [];
  listt: any = [
    {
      title: "list title",
      status: 4,
      decisionNumber: 1,
      creationDate: "12323",
      attendanceRate: 40,
      kpiPerformance: 66,
      taskProgress: 54,
      effictivnessProgress: 23,
    },
  ];
  //get active statuses
  isActiveStatusesLoading : boolean = false
  activeStatuses : any;

  //dashboard items
  committeesTypes: committeesTypes;
  committeesCategories: committeesCategoriesObject;

  public sortedCol: committeeAuditsSortBy | null = null;
  public sortDirection: sortDirections = sortDirections.Asc;


  uploadedFiles : any[] = []
  maxFileSizeInMB: number = 10;
  supportedAttachmentTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  onUploadFile(e , _files = null) {

    const inputElement = e.target as HTMLInputElement;
    let files : FileList | null = inputElement.files;
    if(_files) files = _files;
    console.log(files)
    if(files?.length > 0)  {
      if(this.validateFileSize(files[0]) && this.validateFileType(files[0])){
        //check dublicated files
        if(this.uploadedFiles.filter(item => files[0].name === item.name).length === 0){
          //save file to show and send to the server
          let file = {
            file : files[0],
            name : files[0].name,
            size : files[0].size,
            extension: files[0].name.split(".").pop()
          }
          //push this file to the arr of files
          this.uploadedFiles.push(file);
          console.log(this.uploadedFiles)
          combineLatest(this.myAtt.uploadFilesToServer([file])).subscribe(data => {
            console.log('data' , data)
          })
        }
      }
    }

  }



  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
   // this.toastr.error(this.translate.instant("shared.fileSizeErrMsg"));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
   // this.toastr.error(this.translate.instant("shared.fileTypeErrMsg"));

    return false;
  }



  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private userSer: UserService,
    private modelService: ModelService,
    private exportFilesService: ExportFilesService,
    private captureService: NgxCaptureService,
    private exportAsService: ExportAsService,
    private myAtt : MyAttService

  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // fetch all requests
    // this.getAllRequests();
    //this.getAllEvaluations()

    //get types
    this.getCommitteesTypes();

    //get categories
    this.getCommitteeCategories();

    //get committees count
    this.getCommitteesCount();

    //get meetings count
    this.getMeetingsCount();

    //get decisions count
    this.getDecisionsCount();

    //get tasks count
    this.getTasksCount();

    //get committees audits
    this.getCommitteeAudits()

    //get active statuses
    this.getActiveStatuses()
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.language = this.translate.currentLang;
    });
  }

  // fetch all requests matching search criteria
  handleSearchValueFilter(search: string) {
    this.searchValue = search;

    // reset pagination
    this.paginationModel.pageIndex = 1;

    // fetch all requests
    this.getAllEvaluations();
  }

  // handles sort change event
  handleSortFilter(filter: any) {
    if (filter) {
      this.sortedCol = filter.sortKey;
      this.sortDirection = filter.sortDirection;
    }

    this.filterData = {
      ...this.filterData,
      ...filter,
    };

    // fetch all committee audit
    this.getCommitteeAudits();
  }

  // handles pagination change event
  handlePaginationChange(pageIndex: number) {
    this.paginationModel.pageIndex = pageIndex;

    // fetch all committee audits
    this.getCommitteeAudits();
  }

  // fetch all evaluations
  private getAllEvaluations() {
    //console.log('this')
    this.loading = true;

    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    // send a request to fetch requests
    this.httpSer
      .get(Config.CommitteeEvaluations.GetAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res) {
          // all items list
          this.list = res?.data;

          // count
          this.totalItems = res?.count;
        }
      });
  }

  isDownloading: boolean = false;
  exportList() {
    if (this.isDownloading) return;
    this.isDownloading = true;
    const body = {
      ...this.filterData,
    };
    //TODO Add the link for the export excel file
    let url = `${Config.committeesDashboard.ExportExcel}`;
    this.exportFilesService
      .exportData("POST", url, "list-of-committees.xlsx", body)
      .finally(() => {
        this.isDownloading = false;
      });
  }

  // handel requests filter
  handelFilter(filter: any) {
    if (filter) {
      this.tempFilterData = {
        ...this.filterData,
        ...filter,
      };
    }
    this.emptyFIlters = false;
  }

  // Clear filters Data
  clearFilter() {
    if (!this.emptyFIlters) {
      this.emptyFIlters = true;

      delete this.filterData?.Type;
      delete this.filterData?.Category;
      delete this.filterData?.Year;

      this.paginationModel.pageIndex = 1;
      this.getCommitteeAudits();
      this.getCommitteesTypes();
      this.getCommitteeCategories();
      this.getCommitteesCount();
      this.getMeetingsCount();
      this.getDecisionsCount();
      this.getTasksCount();
      this.getActiveStatuses();
      this.filtersCount = 0;
      this.appliedFiltersCount = 0;
    }
  }

  // get assigned to me Committees
  getMyCommittees(isAssignToMe: boolean) {
    if (isAssignToMe) {
      this.filterData = {
        ...this.filterData,
        assignedToMe: true,
      };
    } else {
      delete this.filterData.assignedToMe;
    }
    this.paginationModel.pageIndex = 1;
    this.getAllEvaluations();
  }

  // get search String from search input
  onSearch(searchString: string) {
    let searchFlag: boolean = false;

    if (searchString.trim() != "") {
      this.filterData = {
        ...this.filterData,
        searchKey: searchString,
      };
      searchFlag = true;
    } else {
      delete this.filterData.searchKey;
      searchFlag = true;
    }

    if (searchFlag) {
      this.paginationModel.pageIndex = 1;
      this.getAllEvaluations();
      searchFlag = false;
    }
  }

  // activated when search button clicked
  onSearchBtnCLicked() {
    this.paginationModel.pageIndex = 1;
    this.filterData = this.tempFilterData;
    this.getCommitteeAudits();
     this.getCommitteesTypes();
     this.getCommitteeCategories();
     this.getCommitteesCount();
     this.getMeetingsCount();
     this.getDecisionsCount();
     this.getTasksCount();
     this.getActiveStatuses();
    this.appliedFiltersCount = this.filtersCount;
  }

  // get filters count
  getFiltersCount(count: number) {
    this.filtersCount = count;
  }

  //get committees types
  getCommitteesTypes() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };


    this.isTypesLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetCommitteesTypes , query)
      .pipe(
        finalize(() => {
          this.isTypesLoading = false;
        })
      )
      .subscribe((res: committeesTypes) => {
        this.committeesTypes = res;
      });
  }

  //get committees categories
  getCommitteeCategories() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    this.isCategoriesLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetCommitteesCategories , query)
      .pipe(
        finalize(() => {
          this.isCategoriesLoading = false;
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        this.committeesCategories = res;
        //console.log('cat', this.committeesCategories)
      });
  }


  getActiveStatuses(){
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    this.isActiveStatusesLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetActiveStatuses , query)
      .pipe(
        finalize(() => {
          this.isActiveStatusesLoading = false;
        })
      )
      .subscribe((res: any) => {
        this.activeStatuses = res;
      });
  }

  // total committes
  getCommitteesCount() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    this.isTotalCommitteesCountLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetCommitteesCount, query)
      .pipe(
        finalize(() => {
          this.isTotalCommitteesCountLoading = false;
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        this.totalCommittees = res;
        //console.log('cat', this.committeesCategories)
      });
  }

  //total meetings
  getMeetingsCount() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    this.isTotalMeetingsCountLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetTotalMeetingsCount, query)
      .pipe(
        finalize(() => {
          this.isTotalMeetingsCountLoading = false;
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        this.totalMeetings = res;
        //console.log('cat', this.committeesCategories)
      });
  }

  //decisions count
  getDecisionsCount() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    this.isTotalDecisionsCountLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetTotalDecisionsCount, query)
      .pipe(
        finalize(() => {
          this.isTotalDecisionsCountLoading = false;
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        this.totalDecisions = res;
        //console.log('cat', this.committeesCategories)
      });
  }

  //main tasks count
  getTasksCount() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };
    this.isTotalTaskCountLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetTotalTasksCount, query)
      .pipe(
        finalize(() => {
          this.isTotalTaskCountLoading = false;
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        this.totalTasks = res;
        //console.log('cat', this.committeesCategories)
      });
  }

  //committees aduits
  getCommitteeAudits() {
    const query = {
      pageIndex: this.paginationModel.pageIndex,
      pageSize: this.paginationModel.pageSize,
      ...this.filterData,
    };

    this.isCommitteAuditsLoading = true;
    this.httpSer
      .get(Config.committeesDashboard.GetCommitteesAudits, query)
      .pipe(
        finalize(() => {
          this.isCommitteAuditsLoading = false;
        })
      )
      .subscribe((res: any) => {
        this.committeeAudits = res;
        this.list = res?.committees?.data;
        this.totalItems = res?.committees?.count;
      });
  }

  //capture screen
  @ViewChild('screen', {read: ElementRef})
childElement: ElementRef<HTMLElement>;



exportAsConfig: ExportAsConfig = {
  type: 'png', // the type you want to download
  elementIdOrContent: 'elementEx', // the id of html/table element
}

exportPng() {
  // download the file using old school javascript method
  this.exportAsService.save(this.exportAsConfig, 'committees dashboard').subscribe()
  // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  this.exportAsService.get(this.exportAsConfig).subscribe(content => {
  });
}

  // capture() {

  //   const dimensions = this.childElement.nativeElement.getBoundingClientRect();
  //   var body = document.body,
  //     html = document.documentElement;

  //   var height = Math.max(
  //     body.scrollHeight,
  //     body.offsetHeight,
  //     html.clientHeight,
  //     html.scrollHeight,
  //     html.offsetHeight
  //   );

  //   var width = document.body.clientWidth
  //   this.captureService
  //     .getImage(document.body, false, {
  //       x: this.language === 'en' ?  120 : 0,
  //       y: this.language === 'en' ?  230 : '',
  //       width: dimensions.width + 50,
  //       height: dimensions.height,
  //       useCORS : true
  //     })
  //     .pipe(
  //       tap(img => {
  //       })
  //     )
  //     .subscribe(res => {
  //       let screenShot = this.DataURIToBlob(res);
  //       let a = document.createElement("a"); //Create <a>
  //       a.href = `${res}`; //Image Base64  here
  //       a.download = "committees dashboard.png"; //File name Here
  //       document.body.appendChild(a);
  //       a.click(); //Downloaded file
  //       document.body.removeChild(a);
  //     });
  // }

  // in case convert to blob
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }
}
