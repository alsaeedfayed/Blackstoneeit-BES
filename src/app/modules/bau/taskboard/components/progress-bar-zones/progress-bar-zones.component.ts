import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-progress-bar-zones",
  templateUrl: "./progress-bar-zones.component.html",
  styleUrls: ["./progress-bar-zones.component.scss"],
})
export class ProgressBarZonesComponent {
  @Input() zones: { completed: number; inProgress: number };
  lang: string = this.translate.currentLang;

  constructor(
    private translate: TranslateService,
  ) {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  calculateWidth(zone: "completed" | "inProgress"): number {
    const total = this.zones.completed + this.zones.inProgress;

    if (total === 0) {
      return 0; // No zones, width is 0
    }

    return (this.zones[zone] / total) * 100;
  }
}
