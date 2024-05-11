import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { BAUStateService } from "../../services/bau-state.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { PopupService } from "src/app/shared/popup/popup.service";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";

@Component({
  selector: "app-main-tasks",
  templateUrl: "./main-tasks.component.html",
  styleUrls: ["./main-tasks.component.scss"],
})
export class MainTasksComponent extends ComponentBase implements OnInit {
  shouldReload = true;
  private reloadSubscription: Subscription;

  constructor(
    private BAUState: BAUStateService,
    private router: Router,
    private route: ActivatedRoute,
    translate: TranslateService,
    translateService: TranslateConfigService,
    private popupService: PopupService,
    private httpService: HttpHandlerService
  ) {
    super(translateService, translate);
    this.reloadSubscription = this.BAUState.reload$.subscribe(() => {
      this.reloadInsightsChild();
    });
  }

  currentChildRoute: string | null = null;
  headerTitle: string;
  selectedYear: string;

  ngOnInit() {
    // trigger search if there is no year for sub routes
    // because search bar trigger search and sub routes dont have search bar
    this.selectedYear = this.route.snapshot.paramMap.get("year");
    if(!this.BAUState.getYear() || this.BAUState.getYear() && this.BAUState.getHasBoard())
    this.onSearch({
      selectedYear: this.selectedYear
    });

    this.handleLangChange();
    // get the current route child endpoint to set header title
    this.currentChildRoute = this.getCurrentChildRoute(this.route);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentChildRoute = this.getCurrentChildRoute(this.route);
      });
  }

  private getCurrentChildRoute(route: ActivatedRoute): string | null {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.routeConfig?.path || null;
  }

  // get route header title
  getRouteHeader(route: string): string {
    switch (route) {
      case "main-task/management/create":
        return this.translate.instant("bau.createNewMainTask");
      case "main-task/management/edit/:mainTaskId":
        return this.translate.instant("bau.editMainTask");
      case "main-task/management/copy/:mainTaskId":
        return this.translate.instant("bau.copyNewMainTask");
      case "create-sub-task/:TaskId":
        return this.translate.instant("bau.createNewTask");
      case "edit-sub-task/:TaskId":
        return this.translate.instant("bau.editTask");
      default:
        return this.translate.instant("bau.taskBoard");
    }
  }

  reloadInsightsChild() {
    this.shouldReload = false;
    setTimeout(() => {
      this.shouldReload = true;
    });
  }

  ngOnDestroy() {
    this.reloadSubscription.unsubscribe();
  }

  modalTitle: string;
  lang: string = this.translate.currentLang;
  hasBoard: boolean;
  canCreateTaskBoard: boolean;

  handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  onPopupClose() {
    this.popupService.close();
  }

  handleCreateButtonClick() {
    this.popupService.open("plan-start");
  }

  onSearch(searchData: any) {
    if(searchData.selectedYear)
    this.httpService
      .get(
        `${Config.BAU.TasksManagement.checkBoard}/${searchData.selectedYear}`
      )
      .subscribe(res => {
        this.hasBoard = res.hasBoard;
        this.canCreateTaskBoard = res.canCreateTaskBoard;
        this.BAUState.setBAUState(res);
      });
  }
}
