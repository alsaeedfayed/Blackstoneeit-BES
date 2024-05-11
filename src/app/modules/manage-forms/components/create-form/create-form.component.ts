import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { IdataEntityPresenter } from 'src/app/core/models/form-builder.interfaces';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
})
export class CreateFormComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter();
  @Output() update: EventEmitter<void> = new EventEmitter();
  isBtnLoading: boolean = false;
  form: FormGroup;
  formData: IdataEntityPresenter = {
    name: '',
    description: '',
    requestTitle: 'laptop request',
    formData: [
      {
        stepNumber: 1,
        description: '',
        name: '',
        controls: [
          {
            id: 1,
            name: 'txt_Delegation_user',
            enLabel: 'User',
            arLabel: 'الموظف',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.UserSelect,
            // validations: {
            //   required: true,
            //   minimumLength: 0,
            //   maximumLength: 0,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'إختر اسم الموظف المفوض له',
            enPlaceholder: 'Select User',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 2,
            name: 'txt_Permissions_description',
            enLabel: 'Permisssions Description',
            arLabel: 'صلاحيات المفوض له',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Textarea,
            // validations: {
            //   required: true,
            //   minimumLength: 3,
            //   maximumLength: 500,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'صلاحيات المفوض بها',
            enPlaceholder: 'Type Text Here',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 3,
            name: 'select_Delegation_Period',
            enLabel: 'Delegation Period',
            arLabel: 'مدة التفويض',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.SingleSelect,
            // validations: {
            //   required: true,
            //   minimumLength: 3,
            //   maximumLength: 12,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'مدة التفويض',
            enPlaceholder: 'Delegation Period',
            value: null,

            arMassage: 'اختبار',
            enMassage: 'test',
            options: [
              {
                id: 1,
                value: 'One Month',
                valueAr: 'شهر واحد',
                selected: true,
              },
              {
                id: 2,
                value: 'Two Months',
                valueAr: 'شهرين',
                selected: false,
              },
              {
                id: 3,
                value: 'Three Months',
                valueAr: 'ثلاثة أشهر',
                selected: false,
              },
              {
                id: 4,
                value: 'other',
                valueAr: 'اخري',
                selected: false,
              },
            ]
          },
          {
            id: 4,
            name: 'checkbox_Delegation_Type',
            enLabel: 'Delegation Type',
            arLabel: 'نوع التفويض',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Checkbox,
            // validations: {
            //   required: false,
            //   minimumLength: 0,
            //   maximumLength: 0,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'التفويض',
            enPlaceholder: 'Delegation',
            value: '',

            options: [
              { id: 1, value: 'Financial', valueAr: 'مالي', selected: true },
              { id: 2, value: 'Official', valueAr: 'اداري', selected: false },
            ],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 5,
            name: 'radio_Delegation_Type',
            enLabel: 'Delegation Type',
            arLabel: 'نوع التفويض',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.RadioButton,
            // validations: {
            //   required: false,
            //   minimumLength: 0,
            //   maximumLength: 0,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'التفويض',
            enPlaceholder: 'Delegation',
            value: '',

            options: [
              { id: 1, value: 'Financial', valueAr: 'مالي', selected: true },
              { id: 2, value: 'Official', valueAr: 'اداري', selected: false },
            ],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 6,
            name: 'text_Financial_Limit',
            enLabel: 'Financial Limit (AED)',
            arLabel: 'الحد المالي',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Number,
            // validations: {
            //   required: true,
            //   minimumLength: 1,
            //   maximumLength: 12,
            //   pattern: '^[0-9]*$',
            // },
            sort: 1,
            arPlaceholder: '',
            enPlaceholder: '',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 7,
            name: 'text_Financial_Limit',
            enLabel: 'Phone',
            arLabel: 'التلفون',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Phone,
            // validations: {
            //   required: true,
            //   minimumLength: 1,
            //   maximumLength: 12,
            //   pattern: null,
            // },
            sort: 1,
            arPlaceholder: 'التلفون',
            enPlaceholder: 'Phone',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 8,
            name: 'text_Financial_Limit',
            enLabel: 'Email',
            arLabel: 'البريد الاكتروني',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Email,
            // validations: {
            //   required: true,
            //   minimumLength: 1,
            //   maximumLength: 200,
            //   pattern: null,
            // },
            sort: 1,
            enPlaceholder: 'Email',
            arPlaceholder: 'البريد الاكتروني',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 9,
            name: 'text_Financial_Limit',
            enLabel: 'date of the crime',
            arLabel: 'تاريخ وقوع الجريمه',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Date,
            // validations: {
            //   required: true,
            //   minimumLength: 1,
            //   maximumLength: 20,

            // },
            sort: 1,
            arPlaceholder: 'Date',
            enPlaceholder: 'تاريخ',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
          {
            id: 10,
            name: 'text_Financial_Limit',
            enLabel: "The date the crime was discovered",
            arLabel: 'تاريخ اكتشاف الجريمه',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.Date,
            // validations: {
            //   required: true,
            //   minimumLength: 1,
            //   maximumLength: 20,
            //   min: {
            //     controlId: 9,
            //     value: '',
            //     error: {
            //       ar: "يرجي ادخال تاريخ بعد تاريخ وقوع الجريمه",
            //       en: "Please enter a date after the date the crime occurred."
            //     }
            //   }
            // },
            sort: 1,
            arPlaceholder: 'Date',
            enPlaceholder: 'تاريخ',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test',
          },
          {
            id: 11,
            name: 'text_Financial_Limit',
            enLabel: 'File upload',
            arLabel: 'رفع الملفات',
            enTitle: '',
            arTitle: '',
            enText: '',
            arText: '',
            type: ControlTypeMode.File,
            // validations: {
            //   required: true,
            //   minimumLength: 0,
            //   maximumLength: 0,
            // },
            sort: 1,
            arPlaceholder: '',
            enPlaceholder: '',
            value: '',

            options: [],
            arMassage: 'اختبار',
            enMassage: 'test'
          },
        ],
      },
    ],
  };
  constructor(
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.fb.control('', Validators.required),
    });
  }

  createForm() {
    this.isBtnLoading = true;
    this.formData.name = this.form.value.name;
    this.httpHandlerService
      .post(Config.FormBuilder.CreateForm, this.formData)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        this.closePopup();
        if (res.success) {
          this.update.emit();
          this.toastr.success(
            this.translateService.instant('manageForms.formSavedSuccessfully')
          );
        } else this.toastr.error(res.message);
      });
  }

  closePopup() {
    this.close.emit();
    this.modelService.close();
  }
}
