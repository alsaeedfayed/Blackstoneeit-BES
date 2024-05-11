import { Component, OnInit } from "@angular/core";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "src/app/core/services/user.service";
import { CustomFormControl, IField } from "../CustomeControl";

import { Config } from "src/app/core/config/api.config";
import { ControlTypeMode } from "src/app/core/enums/control-type.enums";
import { NgxPermissionsService } from "src/app/core/modules/permissions";
import { Permissions } from 'src/app/core/services/permissions';

@Component({
  selector: "app-delete-e-service",
  templateUrl: "./delete-e-service.component.html",
  styleUrls: ["./delete-e-service.component.scss"],
})
export class DeleteEServiceComponent implements OnInit {
  eServiceId: string;
  lang: string;
  form: FormGroup;
  eServiceData: any;
  atachmentFiles: {
    [key: string]: string[];
  };

  isAllowToDelete: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.delete
  );

  constructor(
    private http: HttpHandlerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userService: UserService,
    private router: Router,
    private permissionsService: NgxPermissionsService
  ) {
    this.eServiceId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    if (!!this.eServiceId && !this.isAllowToDelete)
    this.router.navigate([`/e-services`]);

    this.handelForm();
    this.getEServiceById();
    this.lang = this.translate.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  handelForm() {
    this.form = this.fb.group({
      deleteReason: new CustomFormControl(
        {
          id: 1,
          name: "Delete Reason",
          arName: "دوافع وأسباب الحذف",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      deleteObjective: new CustomFormControl(
        {
          id: 2,
          name: "Moving Main Objective",
          arName: "الهدف الرئيسي من الحذف",
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      attachment: new CustomFormControl(
        {
          id: 3,
          name: "Attachments",
          arName: "مرفقات",
          type: ControlTypeMode.File,
        } as IField,
        []
      ),
    });
  }

  getEServiceById() {
    return this.http
      .get(`${Config.EService.getEService}/${this.eServiceId}`)
      .subscribe(res => {
        this.eServiceData = res;
      });
  }

  uploadFile($event) {
    this.atachmentFiles = { value: $event };
  }

  deleteEService() {
    let requestData: Array<IField> = [];
    for (const controlName of Object.keys(this.form.controls)) {
      let custom = this.form.get(controlName) as CustomFormControl;
      if (controlName == "attachment") {
        let field = custom.probs;
        if (!field) field = {} as IField;
        field.value = JSON.stringify(this.atachmentFiles);
        field.valueText = JSON.stringify(this.atachmentFiles);
        field.valueTextAr = JSON.stringify(this.atachmentFiles);
        requestData.push(field);
      } else {
        let field = custom.probs;
        if (!field) field = {} as IField;
        field.value = custom.value?.toString() || "";
        field.valueText = field.valueText || field.value;
        field.valueTextAr = field.valueTextAr || field.value;
        requestData.push(field);
      }
    }

    let relatedEServiceId: IField = {
      id: 3,
      arName: "relatedEServiceId",
      name: "relatedEServiceId",
      value: this.eServiceId,
      hidden: true,
    } as IField;

    if (this.form.valid) {
      const body = {
        requstTitle: `PES-REMOVE-${this.eServiceData?.serviceTitle}`,
        serviceCode: "PES-REMOVE",
        employeeId: this.userService.getCurrentUserId(),
        requestData: [...(requestData as Array<IField>), relatedEServiceId],
      };
      this.http.post(Config.requests.SubmitRequest, body).subscribe(res => {
        this.router.navigate([`/requests/request-details/${res}`]);
      });
    }
  }
}
