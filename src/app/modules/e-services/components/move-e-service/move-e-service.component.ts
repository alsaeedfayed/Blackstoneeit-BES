import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { CustomFormControl, IField } from '../CustomeControl';

import { Config } from 'src/app/core/config/api.config';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';

import { Permissions } from 'src/app/core/services/permissions';

@Component({
  selector: 'app-move-e-service',
  templateUrl: './move-e-service.component.html',
  styleUrls: ['./move-e-service.component.scss'],
})
export class MoveEServiceComponent implements OnInit {
  sector: any[] = [];
  department: any[] = [];
  section: any[] = [];
  commitee: any[] = [];
  form: FormGroup;
  eServiceId: string;
  eServiceData: any;
  lang: string;
  atachmentFiles: {
    [key: string]: string[];
  };

  isAllowToMove: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.EService.move
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
    if (!!this.eServiceId && !this.isAllowToMove)
    this.router.navigate([`/e-services`]);

    this.handelForm();
    this.getMyHirerchy();
    this.getCommitee();
    this.getEServiceById();
    this.lang = this.translate.currentLang;
    this.handleLangChange();
    // initiat type value for form to related to
    this.form.get('unitCommitteeSwitcher').setValue(0);
    this.onTypeChange(0);
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  handelForm() {
    this.form = this.fb.group({
      unitCommitteeSwitcher: new CustomFormControl(
        {
          id: 7,
          name: 'Change Units And Committees',
          arName: 'تبديل الوحدات واللجان',
          type: ControlTypeMode.RadioButton,
        } as IField,
        [Validators.required]
      ),
      sector: new CustomFormControl(
        {
          id: 1,
          name: 'Sector',
          arName: 'القطاع',
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      department: new CustomFormControl(
        {
          id: 2,
          name: 'Department',
          arName: 'الإدارة',
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      section: new CustomFormControl(
        {
          id: 3,
          name: 'Section',
          arName: 'القسم',
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      commitee: new CustomFormControl(
        {
          id: 8,
          name: 'Committee Name',
          arName: 'اسم اللجنة',
          type: ControlTypeMode.SingleSelect,
        } as IField,
        []
      ),
      movingReason: new CustomFormControl(
        {
          id: 4,
          name: 'Moving Reason',
          arName: 'دوافع وأسباب النقل',
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      movingObjective: new CustomFormControl(
        {
          id: 5,
          name: 'Moving Main Objective',
          arName: 'الهدف الرئيسي من الطلب',
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      expectedEffect: new CustomFormControl(
        {
          id: 6,
          name: 'Expected effects and results of implementing the request (positive and negative effects “risk management”)',
          arName:
            'الآثار والنتائج المتوقعة من تنفيذ الطلب (الاثار الايجابية والسلبية “إدارة المخاطر”)',
          type: ControlTypeMode.RichText,
        } as IField,
        [Validators.required]
      ),
      attachment: new CustomFormControl(
        {
          id: 7,
          name: 'Attachments',
          arName: 'مرفقات',
          type: ControlTypeMode.File,
        } as IField,
        []
      ),
    });

    this.handelSelectSerctor();

    // hide type control in reques details page
    this.form.get('unitCommitteeSwitcher')['probs']['hidden'] = true;
  }

  handelSelectSerctor() {
    const sector = this.form.get('sector');
    const department = this.form.get('department');
    sector.valueChanges.subscribe((value) => {
      this.handelFindDepartments(value);
    });
    department.valueChanges.subscribe((value) => {
      this.handelFindSections(value);
    });
  }

  getMyHirerchy() {
    this.http.get(Config.FollowUp.GetMyHirerchy).subscribe((res) => {
      this.sector = res;
    });
  }

  getCommitee() {
    this.http.get(Config.Committees.GetAllActive).subscribe((data) => {
      this.commitee = data;
    });
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find((sector) => sectorid == sector.id);
    this.department = sector ? sector.departments : [];
    this.restFieldValues('department');
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(
      (department) => departmentid == department.id
    );
    this.section = department ? department.sections : [];
    this.restFieldValues('section');
  }

  // rest field submtion data
  restFieldValues(fieldName: string) {
    this.form.get(fieldName).setValue(null);

    if (this.form.get(fieldName)['probs']['value'])
      delete this.form.get(fieldName)['probs']['value'];
    if (this.form.get(fieldName)['probs']['valueText'])
      delete this.form.get(fieldName)['probs']['valueText'];
    if (this.form.get(fieldName)['probs']['valueTextAr'])
      delete this.form.get(fieldName)['probs']['valueTextAr'];
  }

  // when change type rest validator for not current type and rest its values and make the current type requird
  onTypeChange(type: number) {
    if (type == 0) {
      this.restFieldValues('commitee');
      this.setFieldValidator(false, 'commitee');
      this.setFieldValidator(true, 'sector');
    } else {
      this.restFieldValues('sector');
      this.setFieldValidator(false, 'sector');
      this.setFieldValidator(true, 'commitee');
    }
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

  getEServiceById() {
    return this.http
      .get(`${Config.EService.getEService}/${this.eServiceId}`)
      .subscribe((res) => {
        this.eServiceData = res;
      });
  }

  uploadFile($event) {
    this.atachmentFiles = { value: $event };
  }

  moveEService() {
    let requestData: Array<IField> = [];
    for (const controlName of Object.keys(this.form.controls)) {
      let custom = this.form.get(controlName) as CustomFormControl;

      // delete the control if empty
      if (custom.value === null && controlName != 'attachment') {
        this.restFieldValues(controlName);
      } else if (controlName == 'attachment') {
        let field = custom.probs;
        if (!field) field = {} as IField;
        field.value = JSON.stringify(this.atachmentFiles);
        field.valueText = JSON.stringify(this.atachmentFiles);
        field.valueTextAr = JSON.stringify(this.atachmentFiles);
        requestData.push(field);
      } else {
        let field = custom.probs;
        if (!field) field = {} as IField;
        field.value = custom.value?.toString() || '';
        field.valueText = field.valueText || field.value;
        field.valueTextAr = field.valueTextAr || field.value;

        if (field.type == 17) {
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
      arName: 'group',
      name: 'groupId',
      value:
        this.form.value.section?.toString() ||
        this.form.value.department?.toString() ||
        this.form.value.sector?.toString(),
      hidden: true,
    } as IField;

    let relatedEServiceId: IField = {
      id: 8,
      arName: 'relatedEServiceId',
      name: 'relatedEServiceId',
      value: this.eServiceId,
      hidden: true,
    } as IField;
    for (let i = 0; i < this.eServiceData.eServiceFields.length; i++) {
      this.eServiceData.eServiceFields[i].hidden = true;
    }
    this.eServiceData.eServiceFields.splice(0, 5)
    if (this.form.valid) {
      const body = {
        requstTitle: `PES-MOVE-${this.eServiceData?.serviceTitle}`,
        serviceCode: 'PES-TRANS',
        employeeId: this.userService.getCurrentUserId(),
        requestData: [
          ...(requestData as Array<IField>),
          ...this.eServiceData.eServiceFields,
          groupId,
          relatedEServiceId,
        ],
      };
      this.http.post(Config.requests.SubmitRequest, body).subscribe((res) => {
        this.router.navigate([`/requests/request-details/${res}`]);
      });
    }
  }

  onSelectChange(e, id: number) {
    for (const control of Object.values(this.form.controls)) {
      let custom = control as CustomFormControl;
      let field = custom.probs;
      if (field.id == id) {
        field.valueText = e.name || e.nameEn;
        field.valueTextAr = e.arabicName || e.nameAr;
      }
    }
  }
}
