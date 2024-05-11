import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";
import { debounceTime, finalize } from "rxjs/operators";
import { EnglishLettersAndNumbersOnly } from "src/app/core/helpers/English-Letters-And-Numbers-Only.validator";
import { ArabicLettersAndNumbersOnly } from "src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator";
import { PopupService } from "src/app/shared/popup/popup.service";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { combineLatest, Subject } from "rxjs";
import { AtachmentService } from "src/app/core/services/atachment.service";
import { BAUStateService } from "../../../services/bau-state.service";
import { maxLengthValidator } from "src/app/core/helpers/max-length.validator";
import { yearValidator } from "src/app/core/helpers/date-year.validator";
import { RoutesVariables } from "../../../../routes";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-create-main-task",
  templateUrl: "./create-main-task.component.html",
  styleUrls: ["./create-main-task.component.scss"],
})
export class CreateMainTaskComponent implements OnInit {
  isLoading: boolean = false;
  isEditing: boolean = false;
  isGettingEmployees = false;
  isGettingKPIs: boolean = false;
  isGettingRoles: boolean = false;
  isLoadingMainTaskDetails: boolean = false;
  mainTaskId: any;
  mode: any;
  mainTask: any;
  form: FormGroup;
  kpIs: any[] = [];
  sector: any[] = [];
  department: any[] = [];
  section: any[] = [];
  employees: any[] = [];
  roles: any[] = [];
  availableBudget: number;
  selectedStrategicKPIs: any = [];
  lang: string = this.translateService.currentLang;
  selectedYear: string;

  formErrors: any = {};
  btnText: any;
  //attachments
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;
  maxFileSizeInMB: number = 30;

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

  uploadingFile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private httpService: HttpHandlerService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private router: Router,
    private BAUState: BAUStateService,
    private cdref: ChangeDetectorRef,
    public ngbDateParserFormatter: NgbDateParserFormatter
  ) {
    this.setupHirerchyDebounce();
  }

  ngOnInit(): void {
    this.selectedYear = this.route.parent.snapshot.paramMap.get("year");
    this.mainTaskId = this.route.snapshot.paramMap.get("mainTaskId");
    this.getMyHirerchy();

    this.getAvailableBudget();
    this.initForm();
    this.handleLangChange();
    this.handelSelectSerctor();

    if (this.mainTaskId) this.isLoadingMainTaskDetails = true;
    setTimeout(() => {
      this.handleMode();
    }, 1000);

    // Subscribe to changes in the startDate control
    this.form.get("startDate")?.valueChanges.subscribe(() => {
      // Update the endDate control to trigger validation
      this.form.get("endDate")?.updateValueAndValidity();
    });
  }

  handleMode() {
    if (!this.mainTaskId) {
      this.mode = "create";
      this.btnText = "bau.createMainTask";
      this.getKPIs();
      this.getRoles();
      this.getEmployees();

    } else {
      this.getMainTaskDetails();
      this.mode = this.route.snapshot.queryParamMap.get("mode").toString();
      this.btnText = this.mode == "edit" ? "shared.save" : "bau.createMainTask";
    }
  }

  private hirerchyDebounceSubject: Subject<any> = new Subject();

  private setupHirerchyDebounce(): void {
    this.hirerchyDebounceSubject
      .pipe(debounceTime(500)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe(() => {
        if (this.form.get("departmentId").value !== null) {
          this.selectedStrategicKPIs = [];
          this.form.get("kpIs").patchValue([]);
          this.form.get("assignedTo").setValue(null);
          this.form.get("linkedRoles").patchValue([]);
          this.isGettingRoles = true;
          this.isGettingKPIs = true;
          this.isGettingEmployees = true;
          this.getRoles();
          this.getKPIs();
          this.getEmployees();
        } else {
          // rest hirerchy based values if rest hirerchy
          this.kpIs = [];
          this.employees = [];
          this.roles = [];
          this.selectedStrategicKPIs = [];
          this.form.get("kpIs").patchValue([]);
          this.form.get("assignedTo").setValue(null);
          this.form.get("linkedRoles").patchValue([]);
        }
      });
  }

  // Call this function when you want to trigger the debounced action
  public triggerHirerchyDebounced(): void {
    this.hirerchyDebounceSubject.next();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  getAvailableBudget() {
    this.httpService
      .get(
        `${Config.BAU.TasksManagement.getAvailableBudgetMainTask}${this.selectedYear}`
      )
      .subscribe(res => {
        this.isLoading = false;
        this.availableBudget = res.availableBudget;
      });
  }

  getKPIs() {
    this.isGettingKPIs = true;
    this.kpIs = [];
    const groupId =
      this.form?.value.sectionId?.toString() ||
      this.form?.value.departmentId?.toString() ||
      this.form?.value.sectorId?.toString() ||
      null;
    this.httpService
      .post(Config.MangeScorecards.getYearGoals, {
        groupId: groupId,
      })
      .subscribe(res => {
        this.isLoading = false;
        this.isGettingKPIs = false;
        this.kpIs = res;
        // if (this.mode !== 'create') this.getKpisListObjects()
      });
  }

  getRoles() {
    this.isGettingRoles = true;
    this.roles = [];

    const groupId =
      this.form?.value.sectionId?.toString() ||
      this.form?.value.departmentId?.toString() ||
      this.form?.value.sectorId?.toString() ||
      null;
    let rolesUrl = Config.BAU.TasksManagement.getGroupRoles;
    if (groupId !== null) {
      rolesUrl += `?groupId=${groupId}`;
    }
    this.httpService.get(rolesUrl).subscribe(res => {
      this.isLoading = false;
      this.isGettingRoles = false;
      this.roles = res.map(obj => ({ ...obj, checked: false }));
      if (this.mode !== "create" && this.roles.length > 0) this.setRoles();
    });
  }

  getEmployees(id = null) {
    this.isGettingEmployees = true;
    this.employees = [];
    let groupId =
      this.form?.value.sectionId?.toString() ||
      this.form?.value.departmentId?.toString() ||
      this.form?.value.sectorId?.toString() ||
      null;
    if (groupId == null) {
      groupId = id;
    }
    this.httpService
      .get(Config.UserManagement.GroupId, { groupId })
      .pipe(
        finalize(() => {
          this.isGettingEmployees = false;
        })
      )
      .subscribe(res => {
        if (res) {
          this.employees = res;
          this.cdref.detectChanges();
        }
      });
  }

  getKpisListObjects() {
    this.selectedStrategicKPIs = this.kpIs[0]["children"].map(obj => {
      this.mainTask.relatedKPIs.map(id => {
        if (id == obj.id) return { ...obj };
      });
    });
  }

  getMyHirerchy() {
    this.isLoading = true;
    this.httpService.get(Config.FollowUp.GetMyHirerchy).subscribe(res => {
      this.isLoading = false;
      this.sector = res;
      setTimeout(() => {
        this.triggerHirerchyDebounced();
      });
    });
  }

  handelSelectSerctor() {
    const sector = this.form.get("sectorId");
    const department = this.form.get("departmentId");
    sector.valueChanges.subscribe(value => {
      this.handelFindDepartments(value);
    });
    department.valueChanges.subscribe(value => {
      this.handelFindSections(value);
    });
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find(sector => sectorid == sector.id);
    this.department = sector ? sector.departments : [];
    this.form.get("departmentId").setValue(null);
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(
      department => departmentid == department.id
    );
    this.section = department ? department.sections : [];
    this.form.get("sectionId").setValue(null);
  }

  initForm(): void {
    this.form = this.fb.group({
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
      kpIs: [[]],
      importanceLevel: [null, [Validators.required]],
      budget: [null, [Validators.required, this.validateBudget.bind(this)]],
      startDate: [
        null,
        [Validators.required, yearValidator(+this.selectedYear)],
      ],
      endDate: [
        null,
        [
          Validators.required,
          yearValidator(+this.selectedYear),
          this.endDateValidator("startDate"),
        ],
      ],
      sectorId: [null, [Validators.required]],
      departmentId: [null, [Validators.required]],
      sectionId: [null],
      assignedTo: [null],
      linkedRoles: [[]],
      attachments: [[]],
    });
  }

  setOldValues() {
    this.selectedStrategicKPIs = this.mainTask.relatedKPIs;
    // this.form.setValue({
    //   titleEn: this.mainTask.titleEn,
    //   titleAr: this.mainTask.titleAr,
    //   description: this.mainTask.description,
    //   kpIs: this.mainTask.relatedKPIs
    //     ? this.mainTask.relatedKPIs.map(obj => obj["id"])
    //     : [],
    //   importanceLevel: this.mainTask.importanceLevel,
    //   budget: this.mainTask.budget,
    //   startDate: this.mainTask.startDate,
    //   endDate: this.mainTask.endDate,
    //   sectorId: this.mainTask.sector.id,
    //   departmentId: this.mainTask.department.id,
    //   sectionId: this.mainTask.section ? this.mainTask.section.id : null,
    //   assignedTo: this.mainTask.assignedTo.id,
    //   linkedRoles: this.mainTask.linkedRoles.map(obj => obj["id"]),
    //   attachments: this.mainTask.attachments,
    // });

    this.form.controls.titleEn.setValue(this.mainTask.titleEn);
    this.form.controls.titleAr.setValue(this.mainTask.titleAr);
    this.form.controls.description.setValue(this.mainTask.description);
    this.form.controls.kpIs.setValue(this.mainTask.relatedKPIs
      ? this.mainTask.relatedKPIs.map(obj => obj["id"])
      : []);
    this.form.controls.importanceLevel.setValue(this.mainTask.importanceLevel);
    this.form.controls.budget.setValue(this.mainTask.budget);
    this.form.controls.startDate.setValue(this.mainTask.startDate);
    this.form.controls.endDate.setValue(this.mainTask.endDate);
    this.form.controls.sectorId.setValue(this.mainTask.sector.id);
    this.form.controls.departmentId.setValue(this.mainTask.department.id);
    this.form.controls.sectionId.setValue(this.mainTask.section ? this.mainTask.section.id : null);
    this.form.controls.assignedTo.setValue(this.mainTask.assignedTo.id || null);
    this.form.controls.linkedRoles.setValue(this.mainTask.linkedRoles.map(obj => obj["id"]));
    this.form.controls.attachments.setValue(this.mainTask.attachments);

    this.oldAttachments = this.mainTask.attachments;
    this.attachments = this.oldAttachments;

    // in edit mode add subtraction budget
    if (this.mode != "create")
      this.availableBudget = this.availableBudget + this.mainTask.budget;
    // this.uploadingFile = true
    this.getKPIs();
    this.getRoles();
    this.getEmployees();
  }

  // make budget control not valid if its bigger than the availableBudget
  validateBudget(control) {
    const budgetValue = control.value;
    if (
      budgetValue !== null && // Add a null check if necessary
      (budgetValue >= 0 && budgetValue <= this.availableBudget)
    ) {
      return null; // Valid
    } else {
      return { invalidBudget: true }; // Invalid
    }
  }

  endDateValidator(startDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateControl = control.parent?.get(startDateControlName);

      // Check if the startDateControl is not found
      if (!startDateControl) {
        return null; // Return null to indicate no error
      }

      const startDate = startDateControl.value;
      const endDate = control.value;

      // Check if either startDate or endDate is null before comparison
      if (startDate !== null && endDate !== null) {
        const startDateUTC = new Date(startDate); // Convert to Date object
        const endDateUTC = new Date(endDate); // Convert to Date object

        // Compare dates
        if (endDateUTC < startDateUTC) {
          return { endDateSmallerThanStartDate: true };
        }
      }
      return null;
    };
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

  // Function to update linkedRoles based on checked checkboxes
  updateLinkedRoles() {
    const linkedRoles = this.roles
      .filter(role => role.checked)
      .map(role => role.id);
    this.form.get("linkedRoles").patchValue(linkedRoles);
  }

  onOpenKPIsModal() {
    this.popupService.open("KPIs-Select");
  }

  onPopupClose() {
    this.popupService.close();
  }

  getSelectedKpiObjects(kpis: any) {
    this.selectedStrategicKPIs = kpis;
  }

  getSelectedKpiIds(numbers: number[]) {
    this.form.get("kpIs").patchValue(numbers);
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
      .post(Config.BAU.TasksManagement.createMainTask, requestBody)
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
    requestBody.id = this.mainTaskId;
    this.httpService
      .put(Config.BAU.TasksManagement.editMainTask, requestBody)
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

  setRoles() {
    this.isGettingRoles = true;
    this.mainTask?.linkedRoles.forEach(item => {
      this.roles = this.roles.map(obj => {
        if (obj.id === item.id) {
          return { ...obj, checked: true };
        }
        return obj;
      });
    });
    this.isGettingRoles = false;
  }

  getMainTaskDetails() {
    // send a request to fetch tasks
    this.httpService
      .get(`${Config.BAU.MainTasks.getDetails}/${this.mainTaskId}`)
      .pipe(finalize(() => (this.isLoadingMainTaskDetails = false)))
      .subscribe(res => {
        if (res) {
          this.mainTask = res;
          this.setOldValues();

          // this.getEmployees(this.mainTask.sector.id);
          // setTimeout(() => {
          //   if (this.employees.length > 0) {
          //   }
          // }, 1000);
        }
      });
  }
}
