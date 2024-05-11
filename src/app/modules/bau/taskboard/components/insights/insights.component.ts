import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";
import { openCloseScaleAnimation } from "../../animation/open-close-scale.animation";
import { BAUStateService } from "../../services/bau-state.service";

@Component({
  selector: "app-insights",
  templateUrl: "./insights.component.html",
  styleUrls: ["./insights.component.scss"],
  animations: [openCloseScaleAnimation],
})
export class InsightsComponent implements OnInit {
  lang: string = this.translateService.currentLang;
  insights;
  isLoading: boolean = true;
  budget: number = 0;
  canChangeBudget: boolean = false;
  //input work load data
  workLoadDataMainEmployees: any[];
  workLoadDataMainSections: any[];
  workLoadDataSubEmployees : any[];
  workLoadDataSubSections : any[]

  //inputs cols data
  //employees
  colsDataEmployees = [
    {
      userField: "basicInfo",
      field1: "tasksCount",
      field2: "tasksCount",
      header: "Workload Employee",
      headerAr: "العبء العملي الموظف",
    },
    {
      userField: "basicInfo",
      field1: "tasksCount",
      field2: "tasksCount",
      header: "Main Task/Tasks Count",
      headerAr: "المهمة الرئيسية/عدد المهام",
    },
  ];

  //sections
  colsDataSections = [
    {
      userField: "basicInfo",
      field1: "mainTasksCount",
      field2: "subTasksCount",
      header: "Workload Section",
      headerAr: "العبء العملي القسم",
    },
    {
      userField: "basicInfo",
      field1: "mainTasksCount",
      field2: "subTasksCount",
      header: "Main Task/Tasks Count",
      headerAr: "المهمة الرئيسية/عدد المهام",
    },
  ];

  colsDataBestContributersTasks = [
    {
      userField: "basicInfo",
      field1: "subTasksCount",
      field2: "subTasksCount",
      header: "Workload Section",
      headerAr: "العبء العملي القسم",
    },
    {
      userField: "basicInfo",
      field1: "subTasksCount",
      field2: "subTasksCount",
      header: "Main Task/Tasks Count",
      headerAr: "المهمة الرئيسية/عدد المهام",
    },
  ];


  private paramMapSubscription: Subscription;

  constructor(
    private httpService: HttpHandlerService,
    private translateService: TranslateService,
    private BAUState: BAUStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.BAUState.getCanChangeBudget().subscribe(res => {
      this.canChangeBudget = res;
    });
    this.paramMapSubscription = this.route.paramMap.subscribe(
      (params: Params) => {
        const year = +params.get("year");
        if (year) {
          this.getInsights(year);
        }
      }
    );
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  getInsights(year: number) {
    this.isLoading = true;
    this.httpService
      .get(`${Config.taskBoard.getIsights}/${year}`)
      .subscribe(res => {
        this.isLoading = false;
        this.insights = res;
        this.workLoadDataMainEmployees = this.insights?.mainTasksEmployeesWorkLoad;
        this.workLoadDataMainSections = this.insights?.mainTasksSectionsWorkLoad;
        this.workLoadDataSubEmployees = this.insights?.subtasksEmployeesWorkLoad;
        this.workLoadDataSubSections  = this.insights?.subtasksSectionsWorkLoad;
        this.budget = res.totalBudget;
      });
  }




  isMainTaskscontributers : boolean = true
    onSwitchChangeContributers(event : boolean) {
      if(event){
        this.isMainTaskscontributers = false
      }
      else {
        this.isMainTaskscontributers = true
      }
    }

    isWorkSectionMain : boolean = true
    //sections
    onSwitchSeciton(event : boolean){
      if(event){
        this.isWorkSectionMain = false
      }
      else {
        this.isWorkSectionMain = true
      }
    }


  // if Image crash add object key isImageLoad to switch it with default icon
  onRolesCoverageImageCrash(index: number) {
    this.insights.employeesWorkLoad[index].basicInfo["isImageLoad"] = false;
  }

  inputFieldState = "closed";

  toggleInputField() {
    this.inputFieldState = this.inputFieldState === "open" ? "closed" : "open";
  }

  onChangeBudget(budget: number) {
    console.log(budget);
  }

  ngOnDestroy(): void {
    // Don't forget to unsubscribe to avoid memory leaks
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
  }
}
