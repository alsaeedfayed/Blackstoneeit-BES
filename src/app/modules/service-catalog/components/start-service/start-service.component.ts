import {ToastrService} from 'ngx-toastr';
import {finalize, takeUntil} from 'rxjs/operators';
import {UserService} from 'src/app/core/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Config} from 'src/app/core/config/api.config';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectorRef,
  AfterContentChecked
} from '@angular/core';
import {HttpHandlerService} from 'src/app/core/services/http-handler.service';
import {IdataEntityPresenter} from 'src/app/core/models/form-builder.interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AtachmentService} from 'src/app/core/services/atachment.service';
import {ComponentBase} from 'src/app/core/helpers/component-base.directive';
import {TranslateConfigService} from 'src/app/core/services/translate-config.service';
import {ControlTypeMode} from 'src/app/core/enums/control-type.enums';

@Component({
  selector: 'app-start-service',
  templateUrl: './start-service.component.html',
  styleUrls: ['./start-service.component.scss']
})

export class StartServiceComponent extends ComponentBase implements OnInit, OnDestroy, AfterContentChecked {

  entity: IdataEntityPresenter;
  btnloading: boolean = false;
  loading: boolean = false;
  dataLoading: boolean = false;
  form: FormGroup;
  private endSub$ = new Subject();
  private data: any;
  serviceId: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter();
  atachmentFiles: any[] = [];
  pageTitle: string = '';
  lang: string = '';
  isEdit: boolean = false;
  hasError: boolean = false;
  errorDuplicate: boolean = false;
  repeaterColumns: Array<any> = [];
  repeaterRows: Array<any> = [];

  constructor(
    private httpHandlerService: HttpHandlerService, public activatedRoute: ActivatedRoute, private userService: UserService,
    private router: Router, private toastr: ToastrService, private fb: FormBuilder, public uploadSer: AtachmentService,
    translate: TranslateService, translateService: TranslateConfigService, private cdref: ChangeDetectorRef) {
    super(translateService, translate);
    this.lang = translate.currentLang;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.pageTitle =
      this.serviceId = this.activatedRoute.snapshot.queryParams.serviceId;
    this.isEdit = !!this.activatedRoute.snapshot.queryParams.requesteId;
    this.form = this.fb.group({
      requstTitle: this.fb.control('', Validators.required),
    });
    this.form.valueChanges.subscribe(data => {
      this.hasError = false;
    })
    this.form.reset();
    this.getServiceForm();
    this.handleLangChange();
    if (!!this.activatedRoute.snapshot.queryParams.requesteId) {
      this.handelGetOldRequset();
    }
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getServiceForm() {
    this.loading = true;
    if (this.isEdit) this.dataLoading = true;

    const query = {
      serviceId: this.serviceId,
    };
    this.httpHandlerService
      .get(Config.FormBuilder.GetServiceForm, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {

        this.entity = res;


        let showObj = {
          key: "show",
          value: "true",
          valueAr: "",
          // allowComment: false,
          designerProperty: true,
          html: false,
          otherValue: null,
          renderProperty: true,
          selectedValues: null,
          values: null
        }

        // let showInReportObj = {
        //   key: "showInReport",
        //   value: "false",
        //   valueAr: "",
        //   allowComment: false,
        //   designerProperty: true,
        //   html: false,
        //   otherValue: null,
        //   renderProperty: true,
        //   selectedValues: null,
        //   values: null
        // }

        // let allowCommentObj = {
        //   key: "allowComment",
        //   value: "false",
        //   valueAr: "",
        //   allowComment: false,
        //   designerProperty: true,
        //   html: false,
        //   otherValue: null,
        //   renderProperty: true,
        //   selectedValues: null,
        //   values: null
        // }

        res?.formData[0]?.controls?.forEach(control => {
          // let allowCommentFound = control.properties?.findIndex((prop) => prop.key == "allowComment");
          let showFound = control.properties?.findIndex((prop) => prop.key == "show");
          // let showInReportFound = control.properties?.findIndex((prop) => prop.key == "showInReport");

          if (showFound == -1)
            control.properties.push(showObj)

          // if(showInReportFound == -1)
          //   control.properties.push(showInReportObj)

          // if (allowCommentFound == -1)
          //   control.properties.push(allowCommentObj)

          const options = control.properties.find(prop => prop.key == 'options');

          options?.values.forEach(value => {
            if (value?.isConditional == true || value?.isConditional == "true") {
              let element = res?.formData[0]?.controls.find(control => control.id == value?.conditional?.control);
              element.properties.find(prop => prop.key == 'show').value = 'false';
            }
          });

        })

        this.checkValidations();
      });
  }

  uploadFile($event) {
    this.atachmentFiles = $event;
  }

  update(e) {
    // console.log("e",e);
    //
    if (e) {
      this.errorDuplicate = true;
      this.hasError = true
    } else {
      this.errorDuplicate = false;
      this.hasError = false
    }
    this.checkValidations();
  }

  checkValidations() {
    //
    setTimeout(() => {
      this.entity.invalid = false;
      this?.entity.formData?.forEach((formdata) => {
        formdata?.controls?.forEach((control) => {
          if (control?.formControl?.status == 'INVALID') {
            //
            this.entity.invalid = true;
            // console.log("setting invalid",this.entity.invalid);
          }
          //  console.log("control",control,control?.formControl?.status);

          // if (control.innerControls && control.innerControls.formData[0]?.controls?.length > 0) {
          //   // control.innerControls.formData[0]?.controls.forEach(element => {
          //   //   //console.log('Esraa ', element)
          //   //   if(element?.formControl?.status == 'INVALID'){
          //   //
          //   //     this.entity.invalid = true;
          //   //     // console.log("setting invalid",this.entity.invalid);
          //   //     console.log("element",element,element?.formControl?.status);
          //   //   }
          //   // });

          //   this.entity.invalid = true;

          // }
        })
      })
    }, 100);
  }

  getDynamicColumnsAndRows(data) {
    this.repeaterColumns = data.columns;
    this.repeaterRows = data.rows;
    console.log(data)
  }

  getSubmitRequest() {
    this.btnloading = true;
    const obj: any = {};
    const formData = [];
    const formControls = [];
    // console.log("this.entity", this.entity);

    // this.entity.formData.forEach((formdata) => {
    //   formdata.controls.forEach((control) => {
    //     console.log(control);
    //   })
    // });
    // return;

    let repeaterObj = {};
    repeaterObj['columns'] = this.repeaterColumns;
    repeaterObj['rows'] = this.repeaterRows;
    let repeaterObjString = JSON.stringify(repeaterObj);
    // console.log('repeaterObjString ', repeaterObjString)

    this.entity?.formData?.forEach((formdata) => {
      formdata?.controls?.forEach((control) => {
        control.properties?.find(property => property.key == 'options')?.values?.forEach(element => {
          if (element?.other && element?.other?.setvalue) {
            element.other.value = element.other.setvalue;
          }
        });

        control.properties.find(property => property.key == 'value').selectedValues = control.properties?.find(property => property.key == 'value')?.selectedValues && control.properties?.find(property => property.key == 'value')?.selectedValues.length > 0 ? control.properties?.find(property => property.key == 'value')?.selectedValues : [control.properties?.find(property => property.key == 'value')?.value];

        let selectedValuesText = [];
        let selectedValuesTextAr = [];
        let selectedValues = control.properties.find(property => property.key == 'value').selectedValues;
        let selectedOptions = control.properties.find(property => property.key == 'options');
        let selectedOptionsValues = selectedOptions?.values;

        if (control.type == ControlTypeMode.Checkbox) {
          selectedOptionsValues?.forEach(option => {
            if (selectedValues?.includes(option.id)) {
              selectedValuesText.push(option.text)
              selectedValuesTextAr.push(option.textAr)
            }
          });
        }

        let linkAttachmentValue = control.properties.find(property => property.key == 'attachmentFiles')?.value;
        let linkAttachmentValueText = control.properties.find(property => property.key == 'text')?.value;
        let linkAttachmentValueTextAr = control.properties.find(property => property.key == 'text')?.valueAr;

        if (control.properties.find(property => property.key == 'show').value == "true") {
          console.log(control)
          formData.push({
            id: control.id,
            name: control.properties.find(prop => prop.key == 'name').value,
            arName: control.properties.find(prop => prop.key == 'name').valueAr,
            value: control.type == ControlTypeMode.repeater ? repeaterObjString :
              control.type == ControlTypeMode.Checkbox ? String(selectedValues) :
                control.type == ControlTypeMode.File ? JSON.stringify(control.value == undefined ? '' : {value: control.value}) :
                  control.type == ControlTypeMode.SingleSelect ? String(control.properties?.find(property => property.key == 'value')?.value) :
                    control.type == ControlTypeMode.RadioButton ? String(selectedOptionsValues.find(obj => obj.text == control.valueText)?.id) :
                      control.type == ControlTypeMode.MultipleSelect || (control.type == ControlTypeMode.UserSelect && control.multiple == true) ? String(control.value) :
                        control.type == ControlTypeMode.DownloadTemplate ? linkAttachmentValue
                          : String(control.value == undefined ? '' : control.value),
            valueText: Array.isArray(control.valueText) && isNaN(Date.parse(control.valueText[0])) ? control.valueText.join(" , ") :
              control.type == ControlTypeMode.File ? JSON.stringify(control.valueText == undefined ? '' : {value: control.valueText}) :
                control.type == ControlTypeMode.DateRange && control.valueText && control?.valueText[0] && control?.valueText[1] ? (new Date(control.valueText.split(',')[0])).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) + " , " + (new Date(control.valueText.split(',')[1])).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) :
                  control.type == ControlTypeMode.repeater ? repeaterObjString :
                    control.type == ControlTypeMode.Checkbox ? selectedValuesText.join('&') :
                      control.type == ControlTypeMode.DownloadTemplate ? linkAttachmentValueText :
                        control.valueText || '',
            valueTextAr: Array.isArray(control.valueTextAr) && isNaN(Date.parse(control.valueTextAr[0])) ? control.valueTextAr.join(" , ") :
              control.type == ControlTypeMode.File ? JSON.stringify(control.valueTextAr == undefined ? '' : {value: control.valueTextAr}) :
                control.type == ControlTypeMode.DateRange && control.valueTextAr && control?.valueTextAr[0] && control?.valueTextAr[1] ? (new Date(control.valueTextAr.split(',')[0])).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) + " , " + (new Date(control.valueTextAr.split(',')[1])).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) :
                  control.type == ControlTypeMode.repeater ? repeaterObjString :
                    control.type == ControlTypeMode.Checkbox ? selectedValuesTextAr.join(',') :
                      control.type == ControlTypeMode.DownloadTemplate ? linkAttachmentValueTextAr :
                        control.valueTextAr || '',
            type: control.type,
            // allowComment: ((control.properties?.find(prop => prop.key == 'allowComment').value) == 'true' ? true : false),
            comments: [],
            other: control.properties?.find(property => property.key == 'value')?.otherValue && typeof control.properties?.find(property => property.key == 'value')?.otherValue === 'object' ?
              JSON.stringify(control.properties?.find(property => property.key == 'value')?.otherValue) :
              control.properties?.find(property => property.key == 'value')?.otherValue && typeof control.properties?.find(property => property.key == 'value')?.otherValue !== 'object' ?
                control.properties?.find(property => property.key == 'value')?.otherValue?.toString() :
                control.properties?.find(property => property.key == 'options')?.values?.filter(val => control.properties?.find(property => property.key == 'value')?.selectedValues?.includes(val?.id))
                  .map(value => {
                    return (value?.other?.value && typeof value?.other?.value == 'object') ? JSON.stringify(value?.other?.value) : value?.other?.value
                  }).join('%sperator%')
          });
        }
      });

    });

    // console.log("formData",formData);
    // return;

    obj['formData'] = formData;
    obj['name'] = this.entity.name;
    const query = {
      serviceId: this.serviceId,
      employeeId: this.userService.getCurrentUserId(),
      requestData: obj.formData,
      ...this.form.value,
      attachments: []
    };
    debugger
    if (this.isEdit) return this.editRequest(query);

    this.httpHandlerService.post(
      Config.requests.SubmitRequest,
      query
    ).pipe(takeUntil(this.endSub$),
      finalize(() => {
        this.btnloading = false;
      })).subscribe({
      next: (res) => {
        this.entity = res;
        this.toastr.success(
          this.translate.instant('serviceCatalog.serviceSavedSuccessfully')
        );
        this.router.navigateByUrl('/requests/request-details/' + res);
      },
      error: (err) => {
        this.toastr.error(
          `${this.translate.instant('serviceCatalog.somethingWentWrong')} "${err?.error?.Message ?? ''}"`
        );
        this.hasError = true;
      },
    })
  }

  editRequest(query: any) {
    query.serviceRequestId = this.activatedRoute.snapshot.queryParams.requesteId;

    this.httpHandlerService.post(
      Config.requests.UpdateRequest,
      query
    ).pipe(takeUntil(this.endSub$),
      finalize(() => {
        this.btnloading = false;
      })).subscribe({
      next: (res) => {
        this.entity = res;
        this.toastr.success(
          this.translate.instant('serviceCatalog.serviceSavedSuccessfully')
        );
        this.router.navigateByUrl('/requests/request-details/' + res);
      },
      error: (err) => {
        this.toastr.error(
          `${this.translate.instant('serviceCatalog.somethingWentWrong')} "${err?.error?.Message ?? ''}"`
        );
      },
    })
  }

  handelGetOldRequset() {
    this.httpHandlerService
      .get(Config.requests.GetStatus, {serviceRequestId: this.activatedRoute.snapshot.queryParams.requesteId})
      .subscribe((res) => {
        setTimeout(() => {
          this.handelOldData(res);
        }, 300);
      });
  }

  statusData;

  handelOldData(data) {
    let files: any;
    this.statusData = data;
    this.form.get('requstTitle').setValue(data.requestInformation.requestTitle);
    this.entity?.formData?.forEach(form => {
      form?.controls?.forEach(control => {
        // console.log(control)
        const filedControl = this.statusData.formDataDetails.find(item => control.id == item.id)
        // console.log("filedControl", filedControl);
        // console.log("control", control);
        if (ControlTypeMode.SingleSelect == control.type) {
          // console.log(filedControl?.value)
          setTimeout(() => {
            control.formControl.setValue(Number.isNaN(Number(filedControl?.value)) ? filedControl?.value : Number(filedControl?.value))
          }, 6000)
          control.valueText = String(filedControl?.valueText)
          control.valueTextAr = String(filedControl?.valueTextAr)
          // console.log(control)
        } else if (ControlTypeMode.RadioButton == control.type) {
          control.formControl.setValue(Number.isNaN(Number(filedControl?.value)) ? filedControl?.value : Number(filedControl?.value))
        } else if (ControlTypeMode.File == control.type) {
          if (filedControl?.value && filedControl?.value != "undefined")
            // console.log(JSON.parse(filedControl?.value))
            try {
              files = JSON.parse(JSON.parse(filedControl?.value).value)
            } catch (error) {
              files = JSON.parse(filedControl?.value).value
            }
          control.formControl.setValue(files ? files : '')
          // control.formControl.setValue(filedControl?.value ? JSON.parse(filedControl?.value) : '')

        } else if (ControlTypeMode.UserSelect == control.type && !control.multiple) {
          setTimeout(() => {
            control.formControl.setValue(filedControl?.valueText != 'undefined' ? filedControl?.value : '')
          }, 6000)
          control.valueText = String(filedControl?.valueText)
          control.valueTextAr = String(filedControl?.valueTextAr)
          // control.formControl.setValue(filedControl?.valueText != 'undefined' ? filedControl?.value?.split(',')?.map(item => Number(item)) : '')
        } else if (ControlTypeMode.Checkbox == control.type) {
          control.formControl.setValue(filedControl?.valueText && filedControl?.valueText != 'undefined' ? filedControl?.value?.split(',')?.map(item => Number(item)) : '')
        } else if (ControlTypeMode.MultipleSelect == control.type) {
          setTimeout(() => {
            control.formControl.setValue(filedControl?.valueText && filedControl?.valueText != 'undefined' ? filedControl?.value?.split(',')?.map(item => Number(item)) : '')
          }, 6000)
          control.valueText = String(filedControl?.valueText)
          control.valueTextAr = String(filedControl?.valueTextAr)
        } else if (ControlTypeMode.UserSelect == control.type && control.multiple == true) {
          setTimeout(() => {
            control.formControl.setValue(filedControl?.value && filedControl?.value != 'undefined' ? filedControl?.value?.split(',')?.map(item => item) : '')
          }, 6000)
          control.valueText = String(filedControl?.valueText)
          control.valueTextAr = String(filedControl?.valueTextAr)
        } else if (ControlTypeMode.DateRange == control.type) {
          control.formControl.setValue(filedControl?.value != 'undefined' ? filedControl?.value.split(',') : '');
        } else {
          control.formControl.setValue(filedControl?.value != 'undefined' ? filedControl?.value : '')
        }
        // if(filedControl?.other)
        //   control.formControl.setValue(filedControl?.other)

        control.properties.find(property => property.key == 'show').value = (filedControl && filedControl.value) ? ((filedControl?.hidden == 'true' || filedControl?.hidden == true) ? 'false' : 'true') : control.properties.find(property => property.key == 'show').value;
      })
    })
    setTimeout(() => {
      this.dataLoading = false
    }, 6000)
  }

  handleSelectValue(control) {
    const data = control.options?.filter((option) => {
      if (typeof control.value == 'object') {
        return control.value.find(id => id == option.id);
      }
      return control.value == option.id;

    });

    return (
      data.map((item) => {
        if (control.type == ControlTypeMode.UserSelect) {
          return item.value;
        }
        return item.value;
      }) || []
    );
  }

  handleValue(control) {
    const data = String(control.value);
    return data;
  }

  handleControlValue(control) {
    if (control.options?.length > 0) {
      return this.handleSelectValue(control).toString();
    }
    if (control.type == ControlTypeMode.File) {
      return JSON.stringify(control.value);
    } else if (control.options?.length == 0 || !control.options) {
      return this.handleValue(control).toString();
    }

  }

  closeModel() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
