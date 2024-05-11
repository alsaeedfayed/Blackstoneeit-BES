import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { EventsService } from "../../services/events.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import moment from "moment";

@Component({
  selector: "app-events-main",
  templateUrl: "./events-main.component.html",
  styleUrls: ["./events-main.component.scss"],
})
export class EventsMainComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  lang: string = this.translate.currentLang;

  totalCount = 0;
  events;
  searchModel = {
    keyword: "",
    sortBy: "",
    page: 1,
    pageSize: 1000,
  };

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private eventsService: EventsService,
    private router: Router,
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
  
    // handles language change event
    this.handleLangChange();

    // fetch all events
    this.getAllEvents(this.searchModel);
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;
      });
  }

  // fetch all events
  getAllEvents(searchModel) {
    this.eventsService.getEvents(searchModel)
      .subscribe(res => {
        res.data.forEach(element => {
          element["hasEventRegistrationEnded"] = !moment(element.registrationDeadline).isBefore();
        });

        this.totalCount = res.total;
        this.events = res.data;
      });
  }

  // go to add event page
  onAddEvent() {
    this.router.navigateByUrl('events/new');
  }

  onSearch(value: string) {
    this.searchModel.keyword = value;
    this.searchModel.page = 1;

    // fetch all events
    this.getAllEvents(this.searchModel);
  }
}
