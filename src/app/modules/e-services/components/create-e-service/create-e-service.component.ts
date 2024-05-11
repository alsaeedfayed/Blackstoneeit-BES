import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

import { ArabicLettersAndNumbersOnly } from "src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator";
import { EnglishLettersAndNumbersOnly } from "src/app/core/helpers/English-Letters-And-Numbers-Only.validator";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { Config } from "src/app/core/config/api.config";
import { UserService } from "src/app/core/services/user.service";
import { CustomFormControl, IField } from "../CustomeControl";
import { ControlTypeMode } from "src/app/core/enums/control-type.enums";
import { AtachmentService } from "src/app/core/services/atachment.service";
import { NgxPermissionsService } from "src/app/core/modules/permissions";
import { Permissions } from "src/app/core/services/permissions";

@Component({
  selector: "app-create-e-service",
  templateUrl: "./create-e-service.component.html",
  styleUrls: ["./create-e-service.component.scss"],
})
export class CreateEServiceComponent implements OnInit {
  form: FormGroup;
  sector: any[] = [];
  department: any[] = [];
  section: any[] = [];
  EServiceType: any[] = [];
  EServiceCategory: any[] = [];
  EServiceTargetCustomer: any[] = [];
  EServiceChannels: any[] = [];
  EServiceAppliedTimes: any[] = [];
  lang: string = this.translateService.currentLang;
  isLoading: boolean = false;
  relatedServices: any = [];

  member: any[] = [];
  commitee: any[] = [];
  // this for editing
  eServiceId: string;
  serviceTitle: string;
  serviceTitleAr: string;
  canEdit: boolean = false;

  atachmentFiles: {
    [key: string]: string[];
  };

  isAllowCreateButton: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.create
  );

  isAllowToEdit: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.edit
  );

  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public uploadSer: AtachmentService,
    private permissionsService: NgxPermissionsService
  ) {
    this.eServiceId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    if (!this.eServiceId && !this.isAllowCreateButton)
      this.router.navigate([`/e-services`]);

    if (!!this.eServiceId && !this.isAllowToEdit)
      this.router.navigate([`/e-services`]);

    this.getLookups();
    this.initForm();
    this.handleLangChange();
    this.handelSelectSerctor();

    // initiat type value for form to related to
    this.form.get("unitCommitteeSwitcher").setValue(0);
    this.onTypeChange(0);
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  initForm() {
    this.form = this.fb.group({
      unitCommitteeSwitcher: new CustomFormControl(
        {
          id: 30,
          name: "Change Units And Committees",
          arName: "تبديل الوحدات واللجان",
          type: ControlTypeMode.RadioButton,
        } as IField,
        [Validators.required]
      ),
      sector: new CustomFormControl(
        {
          id: 1,
          name: "Sector",
          arName: "القطاع",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      department: new CustomFormControl(
        {
          id: 2,
          name: "Department",
          arName: "الإدارة",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      section: new CustomFormControl(
        {
          id: 3,
          name: "Section",
          arName: "القسم",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      commitee: new CustomFormControl(
        {
          id: 29,
          name: "Committee Name",
          arName: "اسم اللجنة",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      additionReason: new CustomFormControl(
        {
          id: 4,
          name: "Addition Reason",
          arName: "سبب الإضافة",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      additionMainObjectives: new CustomFormControl(
        {
          id: 5,
          name: "Addition Main Objectives",
          arName: "أهداف إضافية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      effects: new CustomFormControl(
        {
          id: 6,
          name: "Expected effects and results of implementing the request (positive and negative effects “risk management”)",
          arName:
            "الآثار والنتائج المتوقعة من تنفيذ الطلب (الاثار الايجابية والسلبية “إدارة المخاطر”)",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      attachment: new CustomFormControl(
        {
          id: 31,
          name: "Attachments",
          arName: "مرفقات",
          type: ControlTypeMode.File,
        } as IField,
        []
      ),
      title: new CustomFormControl(
        {
          id: 7,
          name: "English Name",
          arName: "الاسم باللغة بالإنجليزية",
          type: ControlTypeMode.Text,
        } as IField,
        [Validators.required, EnglishLettersAndNumbersOnly()]
      ),
      titleArabic: new CustomFormControl(
        {
          id: 8,
          name: "Arabic Name",
          arName: "الاسم باللغة العربية",
          type: ControlTypeMode.Text,
        } as IField,
        [Validators.required, ArabicLettersAndNumbersOnly()]
      ),
      description: new CustomFormControl(
        {
          id: 9,
          name: "English Description",
          arName: "الوصف باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      descriptionAr: new CustomFormControl(
        {
          id: 32,
          name: "Arabic Description",
          arName: "الوصف باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceCategory: new CustomFormControl(
        {
          id: 10,
          name: "Service Category",
          arName: "فئة الخدمة",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        [Validators.required]
      ),
      serviceType: new CustomFormControl(
        {
          id: 11,
          name: "Service Type",
          arName: "نوع الخدمة",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        [Validators.required]
      ),
      vitalService: new CustomFormControl(
        {
          id: 12,
          name: "Vital Service",
          arName: "خدمة حيوية",
          type: ControlTypeMode.RadioButton,
        } as IField,
        [Validators.required]
      ),
      targetCustomersGroup: new CustomFormControl(
        {
          id: 13,
          name: "Target Customers Group",
          arName: "مجموعة العملاء المستهدفين",
          type: ControlTypeMode.MultipleSelect,
        } as IField,
        [Validators.required]
      ),
      serviceRequirements: new CustomFormControl(
        {
          id: 14,
          name: "English Service Requirements",
          arName: "متطلبات الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceRequirementsAr: new CustomFormControl(
        {
          id: 33,
          name: "Arabic Service Requirements",
          arName: "متطلبات الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceProcedures: new CustomFormControl(
        {
          id: 15,
          name: "English Service Procedures",
          arName: "إجراءات الخدمة بالإنجليزية باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceProceduresAr: new CustomFormControl(
        {
          id: 33,
          name: "Arabic Service Procedures",
          arName: "إجراءات الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceFees: new CustomFormControl(
        {
          id: 22,
          name: "English Service Fees",
          arName: "رسوم الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      serviceFeesAr: new CustomFormControl(
        {
          id: 34,
          name: "Arabic Service Fees",
          arName: "رسوم الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      isRelatedToService: new CustomFormControl(
        {
          id: 16,
          name: "Is related to a service?",
          arName: "هل هو متعلق بخدمة؟",
          type: ControlTypeMode.RadioButton,
        } as IField,
        [Validators.required]
      ),
      relatedServices: new CustomFormControl(
        {
          id: 17,
          name: "Related Service Name",
          arName: "الخدمة المرتبطة بها",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      needApproval: new CustomFormControl(
        {
          id: 18,
          name: "Need Approval?",
          arName: "هل تحتاج إلى موافقة؟",
          type: ControlTypeMode.RadioButton,
        } as IField,
        [Validators.required]
      ),
      approval: new CustomFormControl(
        {
          id: 19,
          name: "Required Approval",
          arName: "الموافقات المطلوبة",
          type: ControlTypeMode.Text,
        } as IField,
        []
      ),
      serviceAppliedTimes: new CustomFormControl(
        {
          id: 20,
          name: "Service Applied Times",
          arName: "مرات تقديم الخدمة",
          type: ControlTypeMode.SingleSelect,
        } as IField,
        [Validators.required]
      ),
      servicesChannels: new CustomFormControl(
        {
          id: 21,
          name: "Service Channels",
          arName: "قنوات الخدمة",
          type: ControlTypeMode.MultipleSelect,
        } as IField,
        [Validators.required]
      ),
      completeDuration: new CustomFormControl(
        {
          id: 23,
          name: "English Average duration for completing the service",
          arName: "المدة المتوسطة لإكمال الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.Text,
        } as IField,
        [Validators.required]
      ),
      completeDurationAr: new CustomFormControl(
        {
          id: 35,
          name: "Arabic Average duration for completing the service",
          arName: "المدة الزمنية المتوسطة لإتمام الخدمة باللغة العربية",
          type: ControlTypeMode.Text,
        } as IField,
        [Validators.required]
      ),
      serviceSuggestions: new CustomFormControl(
        {
          id: 24,
          name: "English Service Suggestions",
          arName: "اقتراحات الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      serviceSuggestionsAr: new CustomFormControl(
        {
          id: 36,
          name: "Arabic Service Suggestions",
          arName: "اقتراحات الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      serviceBundles: new CustomFormControl(
        {
          id: 25,
          name: "English Service Bundles",
          arName: "حزم الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      serviceBundlesAr: new CustomFormControl(
        {
          id: 37,
          name: "Arabic Service Bundles",
          arName: "حزم الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      serviceNotes: new CustomFormControl(
        {
          id: 26,
          name: "English Service Notes",
          arName: "ملاحظات الخدمة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      serviceNotesAr: new CustomFormControl(
        {
          id: 38,
          name: "Arabic Service Notes",
          arName: "ملاحظات الخدمة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      FAQs: new CustomFormControl(
        {
          id: 27,
          name: "English FAQs",
          arName: "أسئلة شائعة باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      FAQsAr: new CustomFormControl(
        {
          id: 39,
          name: "Arabic FAQs",
          arName: "أسئلة شائعة باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      inquiries: new CustomFormControl(
        {
          id: 28,
          name: "English Inquiries",
          arName: "استفسارات باللغة الإنجليزية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
      inquiriesAr: new CustomFormControl(
        {
          id: 40,
          name: "Arabic Inquiries",
          arName: "استفسارات باللغة العربية",
          type: ControlTypeMode.RichText,
        } as IField,
        []
      ),
    });

    // hide type control in reques details page
    this.form.get("unitCommitteeSwitcher")["probs"]["hidden"] = true;
  }

  getEServiceById() {
    this.isLoading = true;
    return this.httpHandlerService
      .get(`${Config.EService.getEService}/${this.eServiceId}`)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        this.serviceTitle = res.serviceTitle;
        this.serviceTitleAr = res.serviceTitleAr;
        // if user try to edit not listed id redirect to create service page
        if (res.eServiceFields) {
          for (const controlName of Object.keys(this.form.controls)) {
            const customControl = this.form.get(
              controlName
            ) as CustomFormControl;

            // skip because this is main request fields that user should fullfill cant fetch them
            if (
              controlName == "additionReason" ||
              controlName == "additionMainObjectives" ||
              controlName == "effects"
            )
              continue;

            if (customControl) {
              const fieldData = res.eServiceFields.find(
                field => field.name === customControl?.probs?.name
              );
              if (fieldData) {
                // skip if controller dont have value to not break placeholder
                if (fieldData.value == null) {
                  continue;
                }

                customControl.probs = {
                  ...fieldData,
                  id: customControl.probs.id,
                };
                customControl.setValue(fieldData.value);
                let controlType = fieldData.type;
                if (controlType === ControlTypeMode.SingleSelect) {
                  customControl.setValue(parseInt(fieldData.value));
                  this.setSelectorValueText(
                    controlName,
                    fieldData.valueText,
                    fieldData.valueTextAr
                  );
                }

                if (controlType === ControlTypeMode.MultipleSelect) {
                  customControl.patchValue(
                    fieldData.value.split(",").map(id => parseInt(id.trim()))
                  );
                  this.setSelectorValueText(
                    controlName,
                    fieldData.valueText,
                    fieldData.valueTextAr
                  );
                }

                if (controlType === ControlTypeMode.RadioButton) {
                  customControl.setValue(JSON.parse(fieldData.value));
                  // rest unitCommitteeSwitcher validation base on the fetched data
                  if (controlName == "unitCommitteeSwitcher")
                    this.onTypeChange(JSON.parse(fieldData.value));
                }
              }
            }
          }
        } else {
          this.router.navigate([`e-services/requests/create-e-service/`]);
        }
      });
  }

  // set value text and value text ar after getting data
  setSelectorValueText(
    fieldName: string,
    valueText: string,
    valueTextAr: string
  ) {
    this.form.get(fieldName)["probs"].valueText = valueText;
    this.form.get(fieldName)["probs"].valueTextAr = valueTextAr;
  }

  // when change type rest validator for not current type and rest its values and make the current type requird
  onTypeChange(type: number) {
    if (type == 0) {
      this.restFieldValues("commitee");
      this.setFieldValidator(false, "commitee");
      this.setFieldValidator(true, "sector");
    } else {
      this.restFieldValues("sector");
      this.setFieldValidator(false, "sector");
      this.setFieldValidator(true, "commitee");
    }
  }

  handelSelectSerctor() {
    const sector = this.form.get("sector");
    const department = this.form.get("department");
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
    this.restFieldValues("department");
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(
      department => departmentid == department.id
    );
    this.section = department ? department.sections : [];
    this.restFieldValues("section");
  }

  setFieldValidator(condition: boolean, fieldName) {
    if (condition === true) {
      // If "yes" is selected, add Validators.required
      this.form.get(fieldName).setValidators(Validators.required);
    } else {
      // If "no" is selected, remove the Validators.required
      this.form.get(fieldName).clearValidators();
      this.restFieldValues(fieldName);
    }

    // Update the validity of the control
    this.form.get(fieldName).updateValueAndValidity();
  }

  // rest field submtion data
  restFieldValues(fieldName: string) {
    this.form.get(fieldName).setValue(null);
    if (this.form.get(fieldName)["probs"]["value"])
      delete this.form.get(fieldName)["probs"]["value"];
    if (this.form.get(fieldName)["probs"]["valueText"])
      delete this.form.get(fieldName)["probs"]["valueText"];
    if (this.form.get(fieldName)["probs"]["valueTextAr"])
      delete this.form.get(fieldName)["probs"]["valueTextAr"];
  }

  // if edit mode on user changes rest app-field and text editor rest probs interface
  restFieldAndTextEditorProbs(fieldName: string) {
    if (this.eServiceId) {
      delete this.form.get(fieldName)["probs"]["value"];
      delete this.form.get(fieldName)["probs"]["valueText"];
      delete this.form.get(fieldName)["probs"]["valueTextAr"];
    }
  }

  // take value text if the control have id not objects
  // to handle editing mood
  onSelectChange(e, id: number) {
    for (const control of Object.values(this.form.controls)) {
      let custom = control as CustomFormControl;
      let field = custom.probs;
      if (field.id == id) {
        if (typeof e === 'object' && e !== null) {
          field.valueText = e.name || e.nameEn || e.serviceTitle;
          field.valueTextAr = e.arabicName || e.nameAr || e.serviceTitleAr;
        } else {
          // If e is not an object, use the existing values
          field.valueText = field.valueText || '';
          field.valueTextAr = field.valueTextAr || '';
        }
      }
    }
  }

  // take value text if the control have array of ids not array of objects
  // to handle editing mood
  onMultiSelectChange(e, id: number) {
    for (const control of Object.values(this.form.controls)) {
      let custom = control as CustomFormControl;
      let field = custom.probs;
      if (field.id == id) {
        if (Array.isArray(e) && e.length > 0 && typeof e[0] === "object") {
          field.valueText =
            e.map(obj => obj.nameEn).join(", ");
          field.valueTextAr =
            e.map(obj => obj.nameAr).join(", ");
        } else {
          // If e is not an array of objects, use the existing values
          field.valueText = field.valueText || "";
          field.valueTextAr = field.valueTextAr || "";
        }
      }
    }
  }

  getLookups() {
    this.isLoading = true;
    const types = this.httpHandlerService.get(
      Config.Lookups.getLooktypeByServiceName +
        "EServiceType" +
        "?ServiceName=ServiceDesk"
    );
    const categories = this.httpHandlerService.get(
      Config.Lookups.getLooktypeByServiceName +
        "EServiceCategory" +
        "?ServiceName=ServiceDesk"
    );
    const targetCustomers = this.httpHandlerService.get(
      Config.Lookups.getLooktypeByServiceName +
        "EServiceTargetCustomer" +
        "?ServiceName=ServiceDesk"
    );
    const channels = this.httpHandlerService.get(
      Config.Lookups.getLooktypeByServiceName +
        "EServiceChannels" +
        "?ServiceName=ServiceDesk"
    );
    const appliedTimes = this.httpHandlerService.get(
      Config.Lookups.getLooktypeByServiceName +
        "EServiceAppliedTimes" +
        "?ServiceName=ServiceDesk"
    );

    const services = this.httpHandlerService.get(
      Config.EService.getAllEService
    );

    const hirerchy = this.httpHandlerService.get(Config.FollowUp.GetMyHirerchy);

    const commitee = this.httpHandlerService.get(
      Config.Committees.GetAllActive
    );

    forkJoin({
      types,
      categories,
      targetCustomers,
      channels,
      appliedTimes,
      services,
      hirerchy,
      commitee,
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res: any) => {
        this.EServiceType = res.types;
        this.EServiceCategory = res.categories;
        this.EServiceTargetCustomer = res.targetCustomers;
        this.EServiceChannels = res.channels;
        this.EServiceAppliedTimes = res.appliedTimes;
        this.relatedServices = res.services.data;
        this.sector = res.hirerchy;
        this.commitee = res.commitee;
        // call user data after fetching all dropdowns
        if (this.eServiceId) this.getEServiceById();
      });
  }

  uploadFile($event) {
    this.atachmentFiles = { value: $event };
  }

  onSubmit() {
    this.isLoading = true;
    let requestData: Array<IField> = [];

    for (const controlName of Object.keys(this.form.controls)) {
      let custom = this.form.get(controlName) as CustomFormControl;
      let field = custom.probs;
      if (!field) field = {} as IField;
      // delete the control if empty
      if (custom.value === null && controlName != "attachment") {
        this.restFieldValues(controlName);
      } else if (field.type == ControlTypeMode.File) {
        field.value = JSON.stringify(this.atachmentFiles);
        field.valueText = JSON.stringify(this.atachmentFiles);
        field.valueTextAr = JSON.stringify(this.atachmentFiles);
        requestData.push(field);
      } else if (field.type == ControlTypeMode.RadioButton) {
        field.value = custom.value?.toString() || "";
        field.valueText = field.value == "true" ? "Yes" : "No";
        field.valueTextAr = field.value == "true" ? "نعم" : "لا";
        requestData.push(field);
      } else {
        field.value = custom.value?.toString() || "";
        field.valueText = field.valueText || field.value;
        field.valueTextAr = field.valueTextAr || field.value;

        if (field.type == ControlTypeMode.RichText) {
          field.valueText = field.valueText.replace(
            /<p/g,
            '<p class="text-wrap"'
          );
          field.valueTextAr = field.valueTextAr.replace(
            /<p/g,
            '<p class="text-wrap"'
          );
        }
        requestData.push(field);
      }
    }

    let groupId: IField = {
      id: 7,
      arName: "group",
      name: "groupId",
      hidden: true,
      value:
        this.form.value.section?.toString() ||
        this.form.value.department?.toString() ||
        this.form.value.sector?.toString(),
    } as IField;

    let relatedEServiceId: IField = {
      id: 3,
      arName: "relatedEServiceId",
      name: "relatedEServiceId",
      value: this.eServiceId,
      hidden: true,
    } as IField;

    const requestType = this.eServiceId ? "PES-EDIT-" : "PES-ADD-";

    const requestCode = this.eServiceId ? "PES-EDIT" : "PES-ADD";

    const query = {
      requstTitle: `${requestType}${this.form.value.title}`,
      serviceCode: `${requestCode}`,
      employeeId: this.userService.getCurrentUserId(),
      requestData: [...(requestData as Array<IField>), groupId],
    };

    // in case is editinng add relatedEServiceId object to thr request
    if (this.eServiceId) {
      query.requestData.push(relatedEServiceId);
    }

    this.httpHandlerService
      .post(Config.requests.SubmitRequest, query)
      .subscribe(res => {
        this.router.navigate([`/requests/request-details/${res}`]);
      });
  }
}
