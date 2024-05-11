import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";
import { debounceTime, finalize, map } from "rxjs/operators";
import { EnglishLettersAndNumbersOnly } from "src/app/core/helpers/English-Letters-And-Numbers-Only.validator";
import { ArabicLettersAndNumbersOnly } from "src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { combineLatest, Subject } from "rxjs";
import { AtachmentService } from "src/app/core/services/atachment.service";
import { BAUStateService } from "../../../services/bau-state.service";
import { maxLengthValidator } from "src/app/core/helpers/max-length.validator";
import { yearValidator } from "src/app/core/helpers/date-year.validator";
import { PopupService } from "../../../../../../shared/popup/popup.service";
import { an, en } from "@fullcalendar/core/internal-common";

@Component({
  selector: "app-create-sub-task",
  templateUrl: "./create-sub-task.component.html",
  styleUrls: ["./create-sub-task.component.scss"],
})
export class CreateSubTaskComponent implements OnInit {
  isLoading: boolean = false;
  isEditing: boolean = false;
  isGettingEmployees = false;
  isGettingmainTasks = false;

  subTaskId: string;
  mainTaskId: string;

  form: FormGroup;
  availableBudget: number = 0;
  selectedValue: any = {};
  lang: string = this.translateService.currentLang;
  selectedYear: string;
  employees: any[] = [];
  mainTasks: any[] = [];
  mode: any;
  private employeesSearchDebounceSubject: Subject<any> = new Subject();
  memberSearchValue: string = "";
  employeeLoadCount: number = 1;
  isFilterFollowLoading = false;
  //attachments
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;
  maxFileSizeInMB: number = 30;
  uploadingFile: boolean = false;
  followUps: any = [];
  filteredData: any = [];
  btnText: any;
  isDisabled: any = false;
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

  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "150px",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "3",
    sanitize: true,
    outline: false,
    toolbarPosition: "top",
    toolbarHiddenButtons: [
      [
        "subscript",
        "superscript",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "heading",
        "fontName",
      ],
      [
        "textColor",
        "backgroundColor",
        "customClasses",
        "insertImage",
        "insertVideo",
        "insertHorizontalRule",
        "removeFormat",
        "toggleEditorMode",
      ],
    ],
  };
  subTask: any;

  mainTaskStartDate;
  mainTaskEndtDate;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private httpService: HttpHandlerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private router: Router,
    private BAUState: BAUStateService,
    public popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.selectedYear = this.route.parent.snapshot.paramMap.get("year");
    this.subTaskId = this.route.snapshot.paramMap.get("TaskId");
    this.initForm();
    this.handleLangChange();
    this.getEmployees();
    this.getMainTasks();
    this.getFollowUps();
    this.mode = this.route.snapshot.queryParamMap.get("mode");
    if (!this.mode) {
      this.mode = "create";
      this.btnText = "bau.createMainTask";
      this.getAvailableBudget();
      this.getRelatedMainTaskDetails();

    } else {
      this.getSubTaskDetails();
      this.btnText = this.mode == "edit" ? "shared.edit" : "bau.copy";
    }
    this.setupEmployeesSearchDebounce();
  }

  onItemChange(selectedValue: string) {
    this.selectedValue = selectedValue;
  }

  getSubTaskDetails() {
    this.isLoading = true;
    // send a request to fetch tasks
    this.httpService
      .get(`${Config.BAU.TasksManagement.getSubTaskDetails}/${this.subTaskId}`)
      .pipe()
      .subscribe(res => {
        if (res) {
          this.subTask = res;
          this.mainTaskId = this.subTask.mainTaskId;
          this.getAvailableBudget();
          this.getRelatedMainTaskDetails();
          setTimeout(() => {
            this.setOLdData();
          }, 100);
        }
      });
  }

  private setupEmployeesSearchDebounce(): void {
    this.employeesSearchDebounceSubject
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe(() => {
        this.isGettingEmployees = true;
        this.employeeLoadCount = 1;
        this.employees = [];
        this.getEmployees();
      });
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  getAvailableBudget() {
    this.httpService
      .get(
        `${Config.BAU.TasksManagement.getAvailableBudgetTask}${this.mainTaskId}`
      )
      .subscribe(res => {
        this.isLoading = false;
        this.availableBudget = res.availableBudget;

        // in edit mode add subtraction budget
        if (this.mode != "create")
          this.availableBudget = this.availableBudget + this.subTask.budget;

        this.form.controls.budget.updateValueAndValidity();
      });
  }

  getMainTasks() {
    this.isGettingmainTasks = true;
    this.httpService
      .get(`${Config.BAU.TasksManagement.getMainTasks}${this.selectedYear}`)
      .pipe(
        finalize(() => {
          this.isGettingmainTasks = false;
        })
      )
      .subscribe(res => {
        this.mainTasks = res;
        // set dafault value of main task selector of the task u triger from
        this.form.get("mainTaskId").setValue(+this.mainTaskId);
      });

  }


  getRelatedMainTaskDetails() {
    this.httpService
      .get(`${Config.BAU.MainTasks.getDetails}/${this.mainTaskId}`)
      .subscribe(res => {
        if (res) {
          this.mainTaskStartDate = res.startDate;
          this.mainTaskEndtDate = res.endDate;
        }
      });
  }

  //search on members selection
  searchEmployees(value: any) {
    if (value.term.trim()) {
      this.memberSearchValue = value.term.trim();
      this.employeesSearchDebounceSubject.next();
    }
  }

  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getEmployees();
  }

  getEmployees() {
    this.isGettingEmployees = true;
    this.httpService
      .get(Config.UserManagement.GetAll, {
        pageIndex: this.employeeLoadCount,
        pageSize: 1000,
        fullName: this.memberSearchValue,
      })
      .pipe(
        finalize(() => {
          this.isGettingEmployees = false;
        })
      )
      .subscribe(res => {
        if (res) {
          if (this.employeeLoadCount == 1) this.employees = res.data;
          else {
            res.data.forEach(element => {
              this.employees.push(element);
            });
          }
        }
      });
  }

  initForm(): void {
    if (this.mode !== "copy" && this.mode !== "edit") {
      this.mainTaskId = this.route.snapshot.paramMap.get("TaskId");
    }
    this.form = this.fb.group({
      mainTaskId: [this.mainTaskId, [Validators.required]],
      titleEn: [
        null,
        [
          Validators.required,
          EnglishLettersAndNumbersOnly(),
          maxLengthValidator(250),
        ],
      ],
      titleAr: [
        null,
        [
          Validators.required,
          ArabicLettersAndNumbersOnly(),
          maxLengthValidator(250),
        ],
      ],
      description: [null, [Validators.required]],
      importanceLevel: [null, [Validators.required]],
      budget: [null, [Validators.required, this.validateBudget.bind(this)]],
      dueDate: [null, [Validators.required, yearValidator(+this.selectedYear), this.validateDueDate.bind(this)]],
      assignedTo: [null, [Validators.required]],
      attachments: [[]],
    });
    // this.form.get("mainTaskId").setValue(this.mainTaskId);
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    this.form.controls.dueDate.updateValueAndValidity();
  }
  validateDueDate(control: any): { [key: string]: boolean } | null {
    const selectedDueDate: Date = control.value;
    if (selectedDueDate > this.mainTaskStartDate && selectedDueDate < this.mainTaskEndtDate ) {
      return null; // Valid due date
    } else {
      return { 'invalidDueDate': true }; // Invalid due date
    }
  }

  setOLdData() {
    // this.form.setValue({
    //   mainTaskId: this.subTask.mainTaskId,
    //   titleEn: this.subTask.titleEn,
    //   titleAr: this.subTask.titleAr,
    //   description: this.subTask.description,
    //   importanceLevel: this.subTask.importanceLevel,
    //   budget: this.subTask.budget,
    //   dueDate: this.subTask.dueDate,
    //   assignedTo: this.subTask.assignedToInfo.id,
    //   attachments: this.subTask.attachments,
    // });
    this.form.get("mainTaskId").setValue(this.subTask.mainTaskId);
    this.form.get("titleEn").setValue(this.subTask.titleEn);
    this.form.get("titleAr").setValue(this.subTask.titleAr);
    this.form.get("description").setValue(this.subTask.description);
    this.form.get("importanceLevel").setValue(this.subTask.importanceLevel);
    this.form.get("budget").setValue(this.subTask.budget);
    this.form.get("dueDate").setValue(this.subTask.dueDate);
    this.form.get("assignedTo").setValue(this.subTask.assignedToInfo.id);
    this.form.get("attachments").setValue(this.subTask.attachments);

    // this.form.controls.budget.setErrors({ incorrect: false });
    this.form.get("mainTaskId").setValue(this.subTask.mainTaskId);
    this.isLoading = false;
    this.oldAttachments = this.subTask.attachments;
  }

  // make budget control not valid if its bigger than the availableBudget
  validateBudget(control) {
    const budgetValue = control.value;
    if (
      budgetValue !== null && // Add a null check if necessary
      budgetValue >= 0 &&
      budgetValue <= this.availableBudget
    ) {
      return null; // Valid
    } else {
      return { invalidBudget: true }; // Invalid
    }
  }

  // Change date value to onDateSelect
  onDateSelect(
    control: string,
    dateObject: { year: number; month: number; day: number }
  ) {
    const { year, month, day } = dateObject;
    const date = new Date(year, month - 1, day, 22, 0, 0, 0); // Set hours, minutes, seconds and milliseconds to 0
    const formattedDate = date.toISOString();
    this.form.get(control).setValue(formattedDate);
  }

  //attachment functions

  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.uploadingFile = true;

      if (
        this.validateFileSize(e.target.files[0]) &&
        this.validateFileType(e.target.files[0])
      ) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(
            item => e.target.files[0].name === item.name
          ).length === 0 &&
          this.oldAttachments.filter(
            item => e.target.files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split(".").pop(),
          };

          this.uploadedFiles.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(
              finalize(() => {
                this.uploadingFile = false;
              })
            )
            .subscribe(data => {
              //push into array of files to be  with the new decision request
              if (this.attachments == null) this.attachments = [];
              this.attachments.push(data[0]);
              this.toastr.success(
                this.translateService.instant(
                  "shared.documentWasSuccessfullyAdded"
                )
              );
            });
        } else {
          this.uploadingFile = false;
          this.toastr.error(
            this.translateService.instant(
              "shared.validations.fileAlreadyUploaded"
            )
          );
        }
      } else {
        this.uploadingFile = false;
      }
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translateService.instant("shared.fileSizeErrMsg"));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translateService.instant("shared.fileTypeErrMsg"));
    return false;
  }

  onViewLocalFile(i, type: string) {
    if (type.includes("old")) {
      this.attachmentService
        .getAttachmentURLs(this.oldAttachments[i].fileName)
        .subscribe(r => {
          window.location.href = r[0].fileUrl;
        });
    } else {
      let file = this.uploadedFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = function (e) {
        const link = document.createElement("a");
        link.href = e.target.result.toString();
        link.download = file.name;
        link.click();
        link.remove();
      };
    }
  }

  onDeleteFile(i, type: string) {
    // TODO when delete request is created

    if (type == "new") {
      this.uploadedFiles.splice(i, 1);
      this.attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translateService.instant("shared.removed"));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }

  onSelectMainTask($event) {
    if ($event?.id) {
      // update url main task id
      if (this.mode == "create")
      this.router.navigateByUrl(
        `/bau/taskboard/${this.selectedYear}/create-sub-task/${$event.id}`
      );
      else this.router.navigateByUrl(
        `/bau/taskboard/${this.selectedYear}/edit-sub-task/${$event.id}?mode=edit`
      );
      this.mainTaskId = $event.id;
      // get related main task data
      this.getRelatedMainTaskDetails();
      this.getAvailableBudget();
    }
  }

  onPopupClose() {
    this.popupService.close();
    this.setImportedTask(this.selectedValue);
  }

  setImportedTask(task) {
    if (!task) return;
    // this.form.get("titleEn").setValue(task.title);
    // this.form.get("titleAr").setValue(task.title);
    this.form.get("description").setValue(task.description);
    this.form.get("dueDate").setValue(task.dueDate);
    this.form.get("assignedTo").setValue(task.assignedTo);
    this.form.get("attachments").setValue(task.attachments);
    // this.form.get("mainTaskId").setValue(this.mainTaskId);
    this.form.get("importanceLevel").setValue(null);
    this.form.get("budget").setValue(null);
    // this.form.setValue({
    //   titleEn: task.title ?? null,
    //   titleAr: task.title ?? null,
    //   description: task.description ?? null,
    //   dueDate: task.dueDate ?? null,
    //   assignedTo: task.assignedTo ?? null,
    //   attachments: task.attachments ?? null,
    //   mainTaskId: this.mainTaskId ?? null,
    //   importanceLevel: "" ?? null,
    //   budget: "" ?? null,
    // });
    // this.form.controls["titleEn"].disable();
    // this.form.controls["titleAr"].disable();
    // this.form.controls["description"].disable();
    // this.form.controls["assignedTo"].disable();
    // this.form.controls["dueDate"].disable();
    this.isDisabled = true;
    this.isDisabled
      ? (this.editorConfig.editable = false)
      : (this.editorConfig.editable = true);
    this.oldAttachments = task.attachments;
    this.attachments = task.attachments;

    const titleArControl = this.form.get("titleAr");
    const titleEnControl = this.form.get("titleEn");

    // Remove ArabicLettersAndNumbersOnly validator
    titleArControl.clearValidators();

    // Remove EnglishLettersAndNumbersOnly validator
    titleEnControl.clearValidators();

    // Update the form controls to reflect the changes
    titleArControl.updateValueAndValidity();
    titleEnControl.updateValueAndValidity();
    // get sure that controls are empty
    // for importing another item after importing first time
    titleEnControl.setValue(null);
    titleArControl.setValue(null);
    // chack the title lang and set it immediately base in lang
    if (this.isArabic(task.title)) {
      titleArControl.setValue(task.title);
    } else {
      titleEnControl.setValue(task.title);
    }
    // call translation api and set values after return
    this.translateText(task.title).subscribe(
      translation => {
        if (this.isArabic(task.title)) {
          titleEnControl.setValue(translation);
        } else {
          titleArControl.setValue(translation);
        }
      },
      error => {
        // set them as it is if  anything wrong happen
        titleEnControl.setValue(task.title);
        titleArControl.setValue(task.title);
      }
    );
  }

  translateText(text: string) {
    const textLang = this.isArabic(text) ? "ar" : "en";
    const textLangTranslationTo = this.isArabic(text) ? "en" : "ar";
    let requestBody = {
      text: [
        {
          key: textLang,
          value: text,
        },
      ],
      from: textLang,
      to: textLangTranslationTo,
    };
    return this.httpService
      .post(`${Config.Lookups.createTranslation}`, requestBody)
      .pipe(map(res => res.translations[0].translatedValue));
  }

  isArabic(text: string): boolean {
    // Arabic Unicode range
    const arabicRegex = /[\u0600-\u06FF]/;

    // Test if the text contains Arabic characters
    return arabicRegex.test(text);
  }

  onOpenFollowUpModal() {
    this.popupService.open("follow_up");
  }

  searchFollowUp(trim) {
    this.isFilterFollowLoading = true;
    this.filteredData = this.followUps.filter(item =>
      item.title.toLowerCase().includes(trim.toLowerCase())
    );
    this.isFilterFollowLoading = false;
  }

  getFollowUps() {
    this.httpService
      .get(Config.BAU.TasksManagement.searchFollowUp)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.followUps = res;
          this.filteredData = this.followUps;
        }
      });
  }

  onSubmit() {
    this.isLoading = true;

    let requestBody = {
      yearTaskBoard: this.selectedYear,
      ...this.form.value,
    };
    const modifiedAttachments = this.attachments?.map(attachment => {
      // Create a new object without the fileUrl property
      const { fileUrl, ...newAttachment } = attachment;
      return newAttachment;
    });
    // Assign the modified array to requestBody.attachments
    requestBody.attachments = modifiedAttachments ? modifiedAttachments : [];
    if (this.mode == "edit") {
      this.edit(requestBody);
    } else {
      this.create(requestBody);
    }
  }

  create(requestBody) {
    this.httpService
      .post(Config.BAU.TasksManagement.createSubTask, requestBody)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.BAUState.triggerInsightsReload();
          this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        }
      });
  }

  edit(requestBody) {
    requestBody.id = this.subTaskId;
    this.httpService
      .put(Config.BAU.TasksManagement.editSubTask, requestBody)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.BAUState.triggerInsightsReload();
          this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
        }
      });
  }
}
