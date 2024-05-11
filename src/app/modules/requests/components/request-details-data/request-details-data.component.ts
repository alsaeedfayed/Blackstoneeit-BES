import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from "@angular/core";
import { IPerson } from "src/app/shared/PersonItem/iPerson";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ControlTypeMode } from "src/app/core/enums/control-type.enums";
import { AtachmentService } from "src/app/core/services/atachment.service";
import { RequestStatus } from "./enum";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "./../../../../core/services/http-handler.service";
import { CommentStatus } from "../request-comments/enums";

@Component({
  selector: "app-request-details-data",
  templateUrl: "./request-details-data.component.html",
  styleUrls: ["./request-details-data.component.scss"],
})
export class RequestDetailsDataComponent implements OnInit, OnChanges {
  data: any;
  tempPersonInfo: any;
  _isCapturing: boolean = false;

  @Input() set Data(data: any) {
    this.data = data;
    this.data?.formDataDetails?.forEach(element => {
      if (element.type == ControlTypeMode.repeater)
        element.valueText = JSON.parse(element.value);
    });
    this.item = this.data?.formDataDetails[0];
    this.item.selected = true;
    //console.log('from input ', this.item)
  }

  @Input()
  public set isCapturing(v: boolean) {
    this._isCapturing = v;
    // If the capturing is true take a temp copy of this.steps and modify the origin array to remove the profileImage value to avoid CORS origin error that cause by html2canvas request.
    if (this._isCapturing) {
      this.personInfo &&
        (this.tempPersonInfo = JSON.parse(JSON.stringify(this.personInfo)));

      this.tempPersonInfo = {
        ...this.tempPersonInfo,
        fileName: null,
        profileImage: null,
      };
    }
  }
  private endSub$ = new Subject();
  personInfo: any;
  controlTypeMode: any = ControlTypeMode;
  lang: string = this.translateService.currentLang;

  requestStatusEnum = RequestStatus;
  commentStatus = CommentStatus;
  item: any;

  constructor(
    private _http: HttpHandlerService,
    private attachmentSrv: AtachmentService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(lang => {
      this.lang = this.translateService.currentLang;
    });
  }

  ngAfterViewInit() {
    // Get all elements with class "text-editor"
    const TextEditors =
      this.elementRef.nativeElement.querySelectorAll(".text-editor");
    // Loop through each "text-editor" element
    TextEditors.forEach(TextEditorContainer => {
      // Check if TextEditorContainer exists
      if (TextEditorContainer) {
        // Find all unordered lists (ul) within the TextEditorContainer
        const ulElements = TextEditorContainer.querySelectorAll("ul");
        // Loop through each ul element and apply the list style type
        ulElements.forEach(ul => {
          ul.style.listStyleType = "disc";
        });
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.Data) {
      this.data = changes.Data.currentValue;
      this.personInfo = this.data?.requestInformation.userData;
      this.personInfo &&
        (this.tempPersonInfo = JSON.parse(JSON.stringify(this.personInfo)));
      this.tempPersonInfo.fileName = null;

      await this.data.formDataDetails.forEach(async control => {
        if (
          (control?.type == 4 || control?.type == 5) &&
          !control.valueText &&
          control?.value
        ) {
          let val = await this._http
            .get(Config.Lookups.getLookupCode + "/" + control?.value)
            .toPromise();
          control.valueTextAr = val?.nameAr;
          control.valueText = val?.nameEn;
        }
      });
    }
  }

  getFileURL(fileName: string) {
    this.attachmentSrv.getAttachmentURLs(fileName).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          window.open(res[0].fileUrl);
        }
      },
      error: err => {
        this.toastr.error(
          this.translateService.instant("shared.somethingWentWrong")
        );
      },
    });
  }

  onViewFile(file: { extension: string; fileName: string }) {
    this._http
      .post(Config.fileService.getFilesUrls, [file.fileName])
      .pipe(takeUntil(this.endSub$))
      .subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            window.open(res[0].fileUrl);
          }
        },
        error: err => {
          this.toastr.error("Something Went Wrong");
        },
      });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  toArray(files) {
    let filesList;
    if (files)
      try {
        filesList = JSON.parse(JSON.parse(files).value);
      } catch (error) {
        filesList = JSON.parse(files).value;
      }
    return filesList;
  }

  convetToArray(arr) {
    if (this.lang == "ar") return [...arr?.split(",")];
    else return [...arr?.split("&")] || [...arr?.split(",")];
  }

  checkDate(date) {
    return this.isDate(date) && !date.includes(",");
  }

  checkOther(other) {
    if (other) {
      let x = other.replaceAll("%sperator%", "");
      return x != "";
    } else {
      return false;
    }
  }

  formatDate(date) {
    return date?.replaceAll('"', "")?.replaceAll("[", "")?.replaceAll("]", "");
  }

  jsonParse(data) {
    return JSON.parse(data);
  }

  isDate = str => {
    if (str) {
      let [y, M, d, h, m, s] = str?.split(/[- : T Z]/);
      return y && M <= 12 && d <= 31 ? true : false;
    } else {
      return false;
    }
  };

  checkDateRange(date) {
    const arr = date?.split(",");
    if (arr?.length == 2) {
      return this.isDate(arr[0]);
    } else return false;
  }

  checkObject(obj) {
    try {
      let x = JSON.parse(obj);
      return x
        .map(item => (this.lang == "en" ? item.text : item.textAr))
        .join(" , ");
    } catch (e) {
      return false;
    }
  }

  clickFormDataDetailsItem(item) {
    this.item = item;
    this.data?.formDataDetails.forEach(element => {
      element.selected = false;
      if (element.id == item.id) item.selected = true;
    });
    //console.log(item);
  }

  approveComment() {
    this.item.status = CommentStatus.Approved;
  }

  rejectComment() {
    this.item.status = CommentStatus.Rejected;
  }

  getLinkIcon(value) {
    let arr = JSON.parse(value);
    return arr[0].extension;
  }

  getLinkURI(value) {
    let arr = JSON.parse(value);
    return arr[0].fileName;
  }
}
