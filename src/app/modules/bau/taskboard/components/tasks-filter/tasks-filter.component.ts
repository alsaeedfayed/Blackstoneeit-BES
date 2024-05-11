import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-tasks-filter",
  templateUrl: "./tasks-filter.component.html",
  styleUrls: ["./tasks-filter.component.scss"],
})
export class TasksFilterComponent implements OnInit {
  lang: string = this.translateService.currentLang;
  taskTrackStatus: object[] = [
    { id: 1, name: "On Track", nameAr: "علي المخطط" },
    { id: 2, name: "Off Track", nameAr: "خارج المخطط" }
  ];
  taskStaus: object[] = [
    { id: 1, name: "Open", nameAr: "مفتوح" },
    { id: 2, name: "Closed", nameAr: "مغلق" },
    { id: 3, name: "Canceled", nameAr: "ألغيت" },
  ];

  @Output() taskTrackChange = new EventEmitter<any>();
  @Output() taskStatusChange = new EventEmitter<any>();

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  onTaskTrackChange(event) {
    this.taskTrackChange.emit(event);
  }

  onTaskStatusChange(event) {
    this.taskStatusChange.emit(event);
  }
}
