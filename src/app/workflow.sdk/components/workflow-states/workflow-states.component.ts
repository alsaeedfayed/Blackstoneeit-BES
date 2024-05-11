import {
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { ImageService } from "../workflow-person-item/image.service";
import { ModelService } from "../workflow-model/model.service";
import ar from "@angular/common/locales/ar";

@Component({
  selector: "workflow-states",
  templateUrl: "./workflow-states.component.html",
  styleUrls: ["./workflow-states.component.scss"],
})
export class WorkflowStatesComponent implements OnInit {
  lang: string = this.translateService.currentLang;
  currentItem: any;
  tasks: any;
  reviewHistory: any;
  tempSteps: any[] = [];
  _isCapturing: boolean = false;

  @Input() showTasks: boolean = true;
  @Input() steps: any = [];
  @Input() emptyMsg: string = "manageWorkflow.noContent";
  @Input() modalID: any = "workflow-popup";
  @Input()
  public set isCapturing(v: boolean) {
    this._isCapturing = v;

    // If the capturing is true take a temp copy of this.steps and modify the origin array to remove the profileImage value to avoid CORS origin error that cause by html2canvas request.
    if (this._isCapturing) {
      this.tempSteps = JSON.parse(JSON.stringify(this.steps));

      this.steps.map(item => {
        item.owner && (item.owner = { ...item.owner, profileImage: null });
      });
    } else if (!this._isCapturing && this.tempSteps?.length > 0) {
      this.steps = [...this.tempSteps];
    }
  }

  constructor(
    public translateService: TranslateService,
    private modelService: ModelService,
    private imageService: ImageService
  ) {
    // for date pipe
    registerLocaleData(ar);
  }

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  public setImage(name: string) {
    return this.imageService.setFileURL(name).pipe(take(1));
  }

  // on state item click
  onItemClick(item) {
    this.currentItem = item;

    if (item.tasks && item.tasks.length !== 0) {
      this.tasks = item.tasks;
      this.modelService.open(this.modalID);
    }

    this.reviewHistory = [];
    if (item.reviewHistory && item.reviewHistory.length !== 0) {
      this.reviewHistory = item.reviewHistory;
    }
  }

  onClosePopup() {
    this.modelService.close();
  }
}
