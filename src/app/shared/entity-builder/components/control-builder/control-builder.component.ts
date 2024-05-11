import { FormGroup, FormBuilder, AbstractControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';
import { Component, forwardRef, Inject, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { EntityBuilderConfig, EntityBuilderMode, ENTITY_BUILDER_CONFIG } from 'src/app/core/enums/entity-builder-config';
import { FormValidatorsService } from '../../services/handle-form-validators.service';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { IControl } from './../../../../core/models/form-builder.interfaces';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-control-builder',
  templateUrl: './control-builder.component.html',
  styleUrls: ['./control-builder.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BuilderEntityComponent),
      multi: true,
    },
  ],
})
export class BuilderEntityComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() control: IControl;
  @Input() controls: IControl[];
  // _formDataDetails
  // @Input() set formDataDetails(_formDataDetails){
  //   setTimeout(() => {
  //     this._formDataDetails = _formDataDetails;
  //   }, 400);
  // }

  @Output() formControlData: EventEmitter<AbstractControl> = new EventEmitter();
  @Output() errorDuplicateHandler: EventEmitter<boolean> = new EventEmitter();
  @Output() dynamicRowsAndColumnsHandler: EventEmitter<any> = new EventEmitter();

  controlTypeEnum = ControlTypeMode;
  form: FormGroup = this.fb.group({});
  innerValue: { [key: string]: any };
  onChange: any = () => { };
  onTouch: any = () => { };
  onValidationChange: any = () => { };
  disabled: boolean;
  entityBuilderModeEnum = EntityBuilderMode;
  loadingUsers: boolean = false;
  loadingApi: boolean = false;
  selectedOption: any;
  options = [];
  lang: string;
  dynamicData: Array<any> = [];
  columns: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private formValidators: FormValidatorsService,
    @Inject(ENTITY_BUILDER_CONFIG)
    public entityBuilderConfig: EntityBuilderConfig,
    private httpHandlerService: HttpHandlerService,
    public translateService: TranslateService,
    private popupService: PopupService
  ) { }

  ngOnChanges() {}

  get isBuilderEditMode(): boolean {
    return (
      this.entityBuilderModeEnum.Editable === this.entityBuilderConfig.mode || this.entityBuilderModeEnum.Preview === this.entityBuilderConfig.mode
    );
  }

  get isDisabled(): boolean {
    return (
      !this.isBuilderEditMode
    );
  }

  //#region types
  get isFiledType(): boolean {
    return (
      this.isFiledText ||
      this.isFiledNumber ||
      this.isEmailType ||
      this.isPhoneType
    );
  }

  get isFiledText(): boolean {
    return this.control.type === ControlTypeMode.Text;
  }

  get isFiledNumber(): boolean {
    return this.control.type === ControlTypeMode.Number || this.isPhoneType;
  }

  get isCheckbox(): boolean {
    return this.control.type === ControlTypeMode.Checkbox;
  }

  get isTextareaType(): boolean {
    return this.control.type === ControlTypeMode.Textarea;
  }

  get isSelectType(): boolean {
    return (
      this.isSingleSelectType ||
      this.isMultipleSelectType ||
      this.isUserSelectType
    );
  }

  get isSingleSelectType(): boolean {
    return this.control.type === ControlTypeMode.SingleSelect;
  }

  get isMultipleSelectType(): boolean {
    return this.control.type === ControlTypeMode.MultipleSelect;
  }
  get isUserSelectType(): boolean {
    return this.control.type === ControlTypeMode.UserSelect;
  }
  get isMultipleValuesType(): boolean {
    return this.control.multiple;
  }
  get isDateType(): boolean {
    return this.control.type === ControlTypeMode.Date;
  }

  get isDateRangeType(): boolean {
    return this.control.type === ControlTypeMode.DateRange;
  }

  get isEmailType(): boolean {
    return this.control.type === ControlTypeMode.Email;
  }

  get isRadioButtonType(): boolean {
    return this.control.type === ControlTypeMode.RadioButton;
  }

  get isPhoneType(): boolean {
    return this.control.type === ControlTypeMode.Phone;
  }
  get isFileUpload(): boolean {
    return this.control.type === ControlTypeMode.File;
  }

  get isLink(): boolean {
    return this.control.type === ControlTypeMode.DownloadTemplate;
  }

  get isRepeaterType(): boolean {
    return this.control.type === ControlTypeMode.repeater;
  }

  //#endregion
  get formControl(): AbstractControl {
    return this.form.get(this.control.name);
  }

  get controlName() {
    return this.control.name;
  }

  //#region  properties
  get controlTitle() {
    return this.control?.properties?.find(property => property.key == 'name');
  }

  get controlTitleFeild() {
    return this.control?.properties?.find(property => property.key == 'title');
  }

  get controlText() {
    return this.control?.properties?.find(property => property.key == 'text');
  }

  get controlPlaceholder() {
    return this.control?.properties?.find(property => property.key == 'placeholder');
  }

  get controlId() {
    return this.control?.properties?.find(property => property.key == 'id');
  }

  get controlValue() {
    return this.control?.properties?.find(property => property.key == 'value');
  }

  get controlShow() {
    return this.control?.properties?.find(property => property.key == 'show');
  }
  //#endregion

  //#region validations
  get controlRequired() {
    return this.control?.validations?.find(validation => validation.key == 'required');
  }

  get controlMinimumLength() {
    return this.control?.validations?.find(validation => validation.key == 'minimumLength');
  }

  get controlMaximumLength() {
    return this.control?.validations?.find(validation => validation.key == 'maximumLength');
  }

  get controlMaxDateToday() {
    return this.control?.validations?.find(validation => validation.key == 'today');
  }

  get controlMinDate() {
    return this.control?.validations?.find(validation => validation.key == 'minDate' && validation.type == 'date');
  }

  get controlFileSize() {
    return this.control?.validations?.find(validation => validation.key == 'sizeFile');
  }

  get controlFileTypes() {
    return this.control?.validations?.find(validation => validation.key == 'fileType');
  }

  get controlMinDateDate() {
    return this.control?.validations?.find(validation => validation.key == 'minDate' && validation.type == 'control');
  }

  get controlPattern() {
    return this.control?.validations?.find(validation => validation.key == 'pattern');
  }

  get controOptions() {
    return this.control?.properties?.find(property => property.key == 'options');
  }

  get controNotEqual() {
    return this.control.properties?.find(property => property.key == 'notEqual');
  }

  get controlApi() {
    return this.control.properties?.find(property => property.key == 'api');
  }

  get controlDynamicApi() {
    return this.control.properties.find(property => property.key == 'dynamicAPI');
  }

  get ValueDynamicApi() {
    return this.control.valueDynamicApi?.values?.length > 0;
  }

  get controOptionsApi() {

    const api = this.control?.properties?.find(property => property.key == 'api');
    const dynamicAPI = this.control?.properties?.find(property => property.key == 'dynamicAPI');

    if (api?.value) {
      if (this.control.valueApi) {
        // this.handelLang();
        // console.log("api",this.control.valueApi);
        return this.control.valueApi;
      } else {
        if (this.options.length == 0 && !this.loadingApi) {
          this.loadingApi = true;
          this.httpHandlerService.get(Config.Lookups.lookupService + '?ServiceName=ServiceDesk').subscribe(data => {
            this.loadingApi = false;
            const lookup = data.find(e => e.lookupType == api?.value);
            this.options = lookup.lookupResult;
            this.control.valueApi = {
              values: this.options
            }
            this.selectValue = (this.translateService.currentLang == 'ar' ? 'nameAr' : 'nameEn');
            return this.control.valueApi;
          })
        } else {
          return this.options;
        }
      }
    }
    else if (dynamicAPI?.value) {
      if (this.control.valueDynamicApi) {
        // this.handelLang();
        // console.log("api",this.control.valueApi);
        return this.control.valueDynamicApi;
      } else {
        if (this.options.length == 0 && !this.loadingApi) {
          this.loadingApi = true;
          // console.log('dyncmic api ', dynamicAPI)
          // console.log('control ', this.control)
          if (dynamicAPI?.method?.toLowerCase() == 'get' || this.controlDynamicApi?.method?.toLowerCase() == 'get') {
            const uri = dynamicAPI?.uri || this.controlDynamicApi?.uri
            this.httpHandlerService.get(uri).subscribe(data => {
              this.loadingApi = false;
              //   const lookup = data.find(e=>e.lookupType == api?.value);
              //  this.options = lookup.lookupResult;
              this.options = data;
              this.control.valueDynamicApi = {
                values: this.options
              }
              this.selectValue = (this.translateService.currentLang == 'ar' ? dynamicAPI?.displayArabicProperty : dynamicAPI?.displayProperty);
              return this.control.valueDynamicApi;
            })
          }
        } else {
          return this.options;
        }
      }
    }
    else {
      // console.log("options",this.controOptions);
      return this.controOptions;
    }
  }

  get controHint() {
    return this.control?.properties?.find(property => property.key == 'hint');
  }

  get handelMaxDateFromControl() {
    const control = this.controls.find(control => this.controlMinDateDate?.type == 'control' && this.controlMinDateDate?.value == control.id)
    if (control) {
      return control?.properties?.find(prop => prop.key == 'value')
    }
    return null;
  }

  get controlLinkAttachmentFiles() {
    return this.control.properties.find(property => property.key == 'attachmentFiles');
  }

  //#endregion

  label: string;
  selectValue: string;
  placeholder: string;
  massage = null;

  get indexControl() {
    return this.controls.indexOf(this.control);
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      this.handelLang();
    });
    this.handleFormBuilder();
    this.handleChangeValue();
    this.handelLang();
    this.formValidators.handleRequired(this.formControl, this.control);
    this.formValidators.handleMaxLength(this.formControl, this.control);
    this.formValidators.handleMinLength(this.formControl, this.control);
    this.formValidators.handleMaxNummber(this.formControl, this.control);
    this.formValidators.handleMinNummber(this.formControl, this.control);
    this.formValidators.handlePattern(this.formControl, this.control);
    this.formValidators.handleEmail(this.formControl, this.control);
    this.formValidators.handleMinDate(this.formControl, this.control, this.controls);
    this.handleInitValue();
    //this.handleConditionalControl();
    this.handleSelectedData();
    if (this.isUserSelectType) {
      this.handleUserSelect();
    }
    // may be need it in edit mode
    // this.handleConditionalControl();
  }

  handelLang() {

    this.lang = this.translateService.currentLang;
    const dynamicAPI = this.control?.properties?.find(property => property.key == 'dynamicAPI');

    if (this.control.properties.find(property => property.key == 'api')?.value)
      this.selectValue = this.translateService.currentLang == 'ar' ? 'nameAr' : 'nameEn';

    else if (this.control.properties.find(property => property.key == 'dynamicAPI')?.value) {
      this.selectValue = this.translateService.currentLang == 'ar' ? dynamicAPI?.displayArabicProperty : dynamicAPI?.displayProperty;
    }

    else if (this.control.type != ControlTypeMode.UserSelect)
      this.selectValue = this.translateService.currentLang == 'ar' ? 'textAr' : 'text';
    else this.selectValue = 'value';
  }

  handelOtherValue(value, other): any {

    let index = this.controOptions?.values?.findIndex(value => value.id == other.id);
    if (value) {
      if (this.controOptions?.values[index]?.other?.value && Array.isArray(this.controOptions?.values[index]?.other?.value)) {
        this.controOptions.values[index].other.setvalue = this.controOptions?.values[index]?.other?.value?.map(val => {
          return this.controOptions?.values[index]?.other?.values?.find(item => item?.id == val)
        })
      } else {
        this.controOptions.values[index].other.setvalue = JSON.parse(JSON.stringify(value));
      }
    }

    // found.
    // if (
    //   this.controlValue.otherValue != null && this.controlValue.otherValue != undefined
    // ) {
    //   if(!other){
    //     this.control.isOther = "true";
    //     this.controlValue.otherValue = value;
    //   }else{
    //     let found = this.controOptions?.values.find(value => value.id == other.id);
    //     found.other
    //   }
    // }


    // this.controlValue.otherValue = value;
    // if (this.isSingleSelectType || this.isRadioButtonType) {
    // console.log
    // let option = this.controOptions?.values.find((option) => value == option.id);
    // if (
    //   !!option && option.isOther
    // ) {
    //   this.control.isOther = "true";
    //   this.controlValue.otherValue = value;
    // } else {
    //   this.control.isOther = "false";
    // }
    // }
  }

  writeValue(obj: { [key: string]: any }): void {
    this.innerValue = obj || ({} as { [key: string]: any });
    this.form.patchValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  handleFormBuilder() {
    this.form.addControl(this.controlName, this.fb.control(null));
    this.handleEventFormControl();
  }

  handleChangeValue() {
    this.formControl.valueChanges.pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))).subscribe((value) => {
      this.onChange(value);
      // this.handelOtherValue(value);
      if (this.isDateType) {
        this.controlValue.value = value ? new Date(value).toISOString() : null;
      } else if (this.isCheckbox || this.isMultipleSelectType) {
        this.controlValue.selectedValues = value;
      } else {
        this.controlValue.value = value;
      }
      this.handelGetValue();
      this.handleEventFormControl();
      //this.handleConditionalControl();
    });
  }

  handleEventFormControl() {
    this.control.formControl = this.formControl;
  }

  handleInitValue() {
    if (!!this.controlValue.value)
      this.formControl.setValue(this.controlValue.value);
  }

  handleSelectedData() {
    if (this.isMultipleSelectType) {
      const selectedIds = [];
      this.control?.options?.forEach((option) => {
        if (option.selected) {
          selectedIds.push(option.id);
        }
      });
      this.formControl.setValue(selectedIds);
    }
    if (this.isSingleSelectType) {
      const selectedOption = this.control?.options?.find(
        (option) => option.selected
      );
      this.formControl.setValue(selectedOption?.id);
    }
  }

  //search on users
  searchUsers(value: string) {
    if(value && this.isUserSelectType) 
      this.handleUserSelect(value?.trim());
  }

  handleUserSelect(value = '') {
    this.loadingUsers = true;
    let users = [];
    const query = {
      PageIndex: 1,
      PageSize: 30,
      fullName: value
    };
    this.httpHandlerService
      .get(Config.UserManagement.GetAll, query)
      .pipe(finalize(() => (this.loadingUsers = false)))
      .subscribe((res) => {
        users = res.data.map((user) => {
          return {
            id: user.id,
            text: user.fullName,
            textAr: user.fullName,
            value: user.fullName,
            selected: false,
          };
        });
        this.controOptions.values = users;
      });
  }

  handelGetValue() {
    if (this.isSingleSelectType || this.isRadioButtonType) {
      this.handelSingelValue();
    } else if (this.isMultipleSelectType || this.isCheckbox || this.isUserSelectType) {
      this.handelMultipleValue();
    }
    else if (this.isDateRangeType) {
      this.control.value = this.controlValue?.value?.join(',');
      this.control.valueText = this.controlValue?.value?.join(',');
      this.control.valueTextAr = this.controlValue?.value?.join(',');
    }
    // if (this.isFileUpload) {
    //   this.control.valueText = JSON.stringify(this.controlValue?.value);
    //   this.control.value = JSON.stringify(this.controlValue?.value);
    //   this.control.valueTextAr = JSON.stringify(this.controlValue?.valueAr);
    // }
    else {
      this.control.valueText = this.controlValue?.value;
      this.control.value = this.controlValue?.value;
      this.control.valueTextAr = this.controlValue?.valueAr || this.controlValue?.value;
    }
  }

  getUploadedFiles(files) {
    console.log(files)
    console.log(this.control)
    this.control.valueText = JSON.stringify(files);
    this.control.value = JSON.stringify(files);
    this.control.valueTextAr = JSON.stringify(files);
  }

  handelSingelValue() {

    let option = this.controOptions?.values.find((option) => this.controlValue.value
      == option.id);

    if (!!this.selectedOption && !!this.selectedOption.other) {
      if (this.selectedOption?.id != option?.id && this.selectedOption?.other?.showOther != null) {
        this.selectedOption.other.showOther = false;
      }
      this.selectedOption = option;
      this.handelShowOtherOption();
    } else {
      this.selectedOption = option;
      this.handelShowOtherOption();
    }
    let foundedItem = this.control.valueDynamicApi?.values?.find(obj => obj.id == this.controlValue?.value)
    setTimeout(() => {
      if(this.control.valueApi) {
        if(this.control.valueApi?.values?.length > 0)
          this.control.valueApi?.values?.forEach(value => {
            if(this.controlValue.value == value.code) {
              this.control.value = this.controlValue?.value;
              this.control.valueText = value?.nameEn;
              this.control.valueTextAr = value?.nameAr;
            }
          });
      }
      else {
        this.control.valueText = option?.text;
        this.control.valueTextAr = option?.textAr;
      }

      if (this.ValueDynamicApi) {
        this.control.value = this.controlValue?.value;
        this.control.valueText = foundedItem?.name;
        this.control.valueTextAr = foundedItem?.arabicName || foundedItem?.nameAr;
      }
    }, 200);
  }

  handelShowOtherOption() {
    if (!!this.selectedOption?.other) {
      this.selectedOption.other.showOther = true;
    }
  }

  // handleConditionalControl(valueId?, isChecked?){

  //   const value = valueId || (this.control?.properties?.find(property => property?.key == "value")?.value) || (this.control?.properties?.find(property => property?.key == "value")?.selectedValues);

  //   const options = this.control?.properties?.find(property => property?.key == "options")?.values;

  //   options?.forEach(option => {
  //     if (option?.isConditional) {
  //       const index = this.controls.findIndex(control => control.id == option?.conditional?.control);
  //       if (index != -1 && (this.control.type == this.controlTypeEnum.SingleSelect || this.control.type == this.controlTypeEnum.RadioButton || this.control.type == this.controlTypeEnum.MultipleSelect || this.control.type == this.controlTypeEnum.Checkbox)) {
  //         this.controls[index].properties.find(property => property.key == 'show').value = 'false';
  //       }
  //     }
  //   });

  //   const selectedOption = options?.find(option => option.id == value) || options?.filter(option => value?.includes(option?.id));
  //   // console.log('selectedOption ', selectedOption)

  //   let show = 'false';

  //   // if(((this.controlTypeEnum.Checkbox == this.control.type || this.control.type == this.controlTypeEnum.RadioButton) && isChecked) || this.control.type == this.controlTypeEnum.SingleSelect)
  //   if (((this.controlTypeEnum.Checkbox == this.control.type || this.control.type == this.controlTypeEnum.RadioButton)) || this.control.type == this.controlTypeEnum.SingleSelect || this.control.type == this.controlTypeEnum.MultipleSelect) 
  //     show = 'true';

  //   if(this.control.type == this.controlTypeEnum.Checkbox) 
  //     selectedOption.isChecked = isChecked;

  //   if(this.control.type == this.controlTypeEnum.Checkbox && selectedOption.isChecked && (selectedOption?.isConditional == true || selectedOption?.isConditional == "true")) {
  //     show = 'true';
  //     //selectedOption.isShow = 'true';
  //   }
  //   else if(this.control.type == this.controlTypeEnum.Checkbox && !selectedOption.isChecked && selectedOption?.conditional?.control != 0 && (selectedOption?.isConditional == true || selectedOption?.isConditional == "true")) {
  //     show = 'false';
  //     //selectedOption.isShow = 'false';
  //   }
  //   // else if(this.control.type == this.controlTypeEnum.Checkbox && !selectedOption.isChecked && selectedOption?.conditional?.control == 0 && (selectedOption?.isConditional == false || selectedOption?.isConditional == "false")) 
  //   //   show = 'true';

  //   if(Array.isArray(selectedOption)) {
  //     selectedOption.forEach(element => {
  //       if (element?.isConditional == true || element?.isConditional == "true") {
  //         const index = this.controls.findIndex(control => control.id == element.conditional.control);
  //         if (index != -1) {
  //           this.controls[index].properties.find(property => property.key == 'show').value = show;

  //           const controlsWithNoOptions = [];
  //           this.controls.forEach(control => {
  //             control.properties.forEach(property => {
  //               if (property.key == 'options' && property.values.length == 0) {
  //                 controlsWithNoOptions.push(control)
  //               }
  //             })
  //           })

  //           // controlsWithNoOptions.forEach((obj: IControl) => {
  //           //   if(obj.id != selectedOption.conditional.control) {

  //           //     let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //           //     if (indexToRemove != -1) {
  //           //       obj.validations.splice(indexToRemove, 1);
  //           //       obj.formControl?.removeValidators(Validators.required)
  //           //       obj.formControl?.updateValueAndValidity();
  //           //     }
  //           //     else {
  //           //       obj.formControl?.addValidators(Validators.required)
  //           //       obj.formControl?.updateValueAndValidity();
  //           //     }
  //           //   }
  //           // })

  //           const unSelectedOptions = controlsWithNoOptions.filter(obj => obj.id != element.conditional.control)
  //           unSelectedOptions.forEach((obj: IControl) => {
  //             let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //             if (indexToRemove != -1) {
  //               // obj.validations.splice(indexToRemove, 1);
  //               obj.formControl?.removeValidators(Validators.required)
  //               obj.formControl?.updateValueAndValidity();
  //             }
  //             else {
  //               obj.formControl?.addValidators(Validators.required)
  //               obj.formControl?.updateValueAndValidity();
  //             }
  //           })
  //           const SelectedOptions = controlsWithNoOptions.filter(obj => obj.id == element.conditional.control)
  //           SelectedOptions.forEach((obj: IControl) => {
  //             let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //             if (indexToRemove != -1) {
  //               // obj.validations.splice(indexToRemove, 1);
  //               obj.formControl?.addValidators(Validators.required)
  //               obj.formControl?.updateValueAndValidity();
  //             }
  //             // else {
  //             //   obj.formControl?.addValidators(Validators.required)
  //             //   obj.formControl?.updateValueAndValidity();
  //             // }
  //           })

  //         }
  //       }
  //     });
  //   }
  //   else
  //     if (selectedOption?.isConditional == true || selectedOption?.isConditional == "true") {
  //       const index = this.controls.findIndex(control => control.id == selectedOption?.conditional?.control);
  //       if (index != -1) {
  //         this.controls[index].properties.find(property => property.key == 'show').value = show;

  //         const controlsWithNoOptions = [];
  //         this.controls.forEach(control => {
  //           control.properties.forEach(property => {
  //             if (property.key == 'options' && property.values.length == 0) {
  //               controlsWithNoOptions.push(control)
  //             }
  //           })
  //         })

  //         // controlsWithNoOptions.forEach((obj: IControl) => {
  //         //   if(obj.id != selectedOption.conditional.control) {

  //         //     let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //         //     if (indexToRemove != -1) {
  //         //       obj.validations.splice(indexToRemove, 1);
  //         //       obj.formControl?.removeValidators(Validators.required)
  //         //       obj.formControl?.updateValueAndValidity();
  //         //     }
  //         //     else {
  //         //       obj.formControl?.addValidators(Validators.required)
  //         //       obj.formControl?.updateValueAndValidity();
  //         //     }
  //         //   }
  //         // })
  //         const unSelectedOptions = controlsWithNoOptions.filter(obj => obj.id != selectedOption?.conditional?.control)
  //         unSelectedOptions.forEach((obj: IControl) => {
  //           let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //           if (indexToRemove != -1) {
  //             // obj.validations.splice(indexToRemove, 1);
  //             obj.formControl?.removeValidators(Validators.required)
  //             obj.formControl?.updateValueAndValidity();
  //           }
  //           else {
  //             obj.formControl?.addValidators(Validators.required)
  //             obj.formControl?.updateValueAndValidity();
  //           }
  //         })

  //         const SelectedOptions = controlsWithNoOptions.filter(obj => obj.id == selectedOption?.conditional?.control)
  //         SelectedOptions.forEach((obj: IControl) => {
  //           let indexToRemove = obj.validations.findIndex(obj => obj.key === 'required');
  //           if (indexToRemove != -1) {
  //             // obj.validations.splice(indexToRemove, 1);
  //             obj.formControl?.addValidators(Validators.required)
  //             obj.formControl?.updateValueAndValidity();
  //           }
  //           // else {
  //           //   obj.formControl?.addValidators(Validators.required)
  //           //   obj.formControl?.updateValueAndValidity();
  //           // }
  //         })

  //       }
  //     }
  //     // else
  //     // if (selectedOption?.isConditional == false || selectedOption?.isConditional == "false") {
  //     //   const index = this.controls.findIndex(control => control.id == selectedOption?.conditional?.control);
  //     //   if (index != -1)
  //     //     this.controls[index].properties.find(property => property.key == 'show').value = 'true';
  //     // }
  // }

  handleConditionalControl(valueId?, isChecked?) {

    const optionValues = this.control?.properties?.find(property => property?.key == "options")?.values;
    const selectedOption = optionValues?.find(option => option.id == valueId);
    //const selectedOptions = optionValues?.filter(option => valueId?.includes(option?.id));
    // const conditionalControl = this.controls.find(control => control.id == selectedOption?.conditional?.control);

    if(this.control.type == ControlTypeMode.SingleSelect || this.control.type == ControlTypeMode.MultipleSelect || this.control.type == ControlTypeMode.RadioButton) {
      
      optionValues?.forEach(option => {
        if (option?.isConditional) {
          if(((this.control.type == ControlTypeMode.SingleSelect || this.control.type == ControlTypeMode.RadioButton) && option?.id == valueId)
                || (this.control.type == ControlTypeMode.MultipleSelect && valueId?.includes(option?.id))) {
            this.controls.forEach(control => {
              if(control.id == option?.conditional?.control) {
                control.properties.find(property => property.key == 'show').value = 'true';
                let indexToRemove = control?.validations?.findIndex(obj => obj.key === 'required');

                if (indexToRemove != -1) {
                  control.formControl?.addValidators(Validators.required)
                  control.formControl?.updateValueAndValidity();
                }
              }
            })
          }
          else {
            this.controls.forEach(control => {
              if(control.id == option?.conditional?.control) {
                control.properties.find(property => property.key == 'show').value = 'false';
                let indexToRemove = control?.validations?.findIndex(obj => obj.key === 'required');
                if (indexToRemove != -1) {
                  control.formControl?.removeValidators(Validators.required)
                  control.formControl?.updateValueAndValidity();
                }
                // else {
                //   control.formControl?.addValidators(Validators.required)
                //   control.formControl?.updateValueAndValidity();
                // }
              }
            })
          }
        }
      })
    }

    if(this.control.type == ControlTypeMode.Checkbox) {

      //const value = this.control?.properties?.find(property => property?.key == "value")?.selectedValues;
      //console.log('this.control ', this.control)

      optionValues?.forEach(option => {
        if(option?.isConditional) {
          if(valueId.includes(option?.id)) {
            option.isChecked = true;
            this.controls.forEach(control => {
              if(control.id == option?.conditional?.control) {
                if(option.isChecked) {
                 // console.log('selectedValues ', selectedValues)
                  control.properties.find(property => property.key == 'show').value = 'true';
                  let indexToRemove = control?.validations?.findIndex(obj => obj.key === 'required');
                  if (indexToRemove != -1) {
                    control.formControl?.addValidators(Validators.required)
                    control.formControl?.updateValueAndValidity();
                  }
                }
                else {
                  control.properties.find(property => property.key == 'show').value = 'false';
                  let indexToRemove = control?.validations?.findIndex(obj => obj.key === 'required');
                  if (indexToRemove != -1) {
                    control.formControl?.removeValidators(Validators.required)
                    control.formControl?.updateValueAndValidity();
                  }
                  // else {
                  //   control.formControl?.addValidators(Validators.required)
                  //   control.formControl?.updateValueAndValidity();
                  // }
                  // selectedValues.slice(option, 1)
                  // console.log('selectedValues ', selectedValues)
                }

              }
            })
          }
          else {
            this.controls.forEach(control => {
              if(control.id == option?.conditional?.control) {
                control.properties.find(property => property.key == 'show').value = 'false';
                let indexToRemove = control?.validations?.findIndex(obj => obj.key === 'required');
                if (indexToRemove != -1) {
                  control.formControl?.removeValidators(Validators.required)
                  control.formControl?.updateValueAndValidity();
                }
                // else {
                //   control.formControl?.addValidators(Validators.required)
                //   control.formControl?.updateValueAndValidity();
                // }
              }
            })
          }
        }
      })
    }

    //if(this.control.type == ControlTypeMode.Checkbox) {

  //     selectedOption.isChecked = isChecked;

  //   if(this.control.type == ControlTypeMode.Checkbox && selectedOption.isChecked && (selectedOption?.isConditional == true || selectedOption?.isConditional == "true")) {
  //     show = 'true';
  //     //selectedOption.isShow = 'true';
  //   }
  //   else if(this.control.type == ControlTypeMode.Checkbox && !selectedOption.isChecked && selectedOption?.conditional?.control != 0 && (selectedOption?.isConditional == true || selectedOption?.isConditional == "true")) {
  //     show = 'false';
  //     //selectedOption.isShow = 'false';
  //   }
  //   // else if(this.control.type == ControlTypeMode.Checkbox && !selectedOption.isChecked && selectedOption?.conditional?.control == 0 && (selectedOption?.isConditional == false || selectedOption?.isConditional == "false"))
  //   //   show = 'true';
    //}
  }

  handelShowMultipleOtherOption() {
    // let check = false;
    // this.controls.forEach((control, index) => {
    //   control.errorDuplicate = false;

    //   if (control?.validations?.findIndex(validation => validation.key == "notEqual") != -1) {

    //     const notEqualControl = control?.validations?.find(validation => validation.key == "notEqualControl");
    //     const otherControl = this.controls?.find(otherControl => otherControl?.id == notEqualControl?.value);
    //     const value = this.controlValue?.value;
    //     const optionsApi = control.valueApi;
    //     const options = control.properties.find(property => property.key == "options")
    //     const otherValue = otherControl?.value;
    //     const otherOptionsApi = otherControl?.valueApi;
    //     const otherOptions = otherControl?.properties.find(property => property.key == "options");
    //     if (value && value == otherValue && ((optionsApi?.values?.length > 0 && JSON.stringify(optionsApi?.values) == JSON.stringify(otherOptionsApi?.values)) || (options?.value && JSON.stringify(options?.value) == JSON.stringify(otherOptions?.value)))) {
    //         control.errorDuplicate = true;
    //         check = true;
    //     }
    //   }
    // });
    // this.errorDuplicateHandler.emit(check);

    //reset other for other options
    if (!this.isMultipleSelectType) {
      const value = this.control?.properties?.find(property => property.key == "value")?.value;
      this.control?.properties?.find(property => property.key == "options")?.values?.forEach(element => {
        if (element.id != value && element?.other) {
          element.other.value = "";
          element.other.setvalue = "";
        }
      });
      return;
    }

    this.handelRemoveOldValueFromOther();
    // console.log("this.controlValue",this.controlValue.selectedValues);
    // console.log("this.controOptions",this.controOptions);

    this.controOptions?.values?.forEach(value => {
      if (value.other && value.other.showOther != null) {
        value.other.showOther = false;
      }
      if (this.controlValue?.selectedValues?.includes(value?.id)) {
        if (value.other && value.other.showOther != null) {
          value.other.showOther = true;
        }
      }
    });

  }

  handelNotEqual() {
    if(this.isSingleSelectType) {

      let singleSelectNotEqualControls = this.controls?.filter(control => control?.type == ControlTypeMode.SingleSelect && control.valueApi && control.valueApi?.values.length > 0)
      let notEqualControlsIds = singleSelectNotEqualControls?.filter(control => control.validations?.find(validation => validation?.key == "notEqualControl")).map(obj => obj.id)
      let relatedNotEqualControls = [];

      for (let i = 0; i < singleSelectNotEqualControls.length; i++) {

        let control1 = singleSelectNotEqualControls.find(singleNotEqualControl => singleNotEqualControl.id == notEqualControlsIds[i])
        let controlFilterValue
        singleSelectNotEqualControls?.forEach(singleNotEqualControl => {
          if(singleNotEqualControl?.id == control1?.id)
            controlFilterValue = singleNotEqualControl.validations?.find(validation => validation?.key == "notEqualControl")?.value
        })
        let control2 = singleSelectNotEqualControls.find(singleNotEqualControl => controlFilterValue  == singleNotEqualControl?.id)
        relatedNotEqualControls.push({ control1: control1, control2: control2 })

      }

      relatedNotEqualControls?.forEach((obj, index) => {

        const isNullish = Object.values(obj).every(value => {
          if (value === undefined) {
            return true;
          }
          return false;
        });

        if(!isNullish) {
          obj.control1.errorDuplicate = false;
          obj.control2.errorDuplicate = false;
          if(obj.control1 && Object.keys(obj.control1).length > 0 && obj.control2 && Object.keys(obj.control2).length > 0) {
            let obj1Value = obj?.control1?.properties?.find(property => property.key == 'value').value ;
            let obj2Value = obj?.control2?.properties?.find(property => property.key == 'value').value ;
            if(obj1Value && obj2Value && obj1Value == obj2Value) {
              obj.control2.errorDuplicate = true;
              this.errorDuplicateHandler.emit(obj.control2.errorDuplicate);
            }
            else
              this.errorDuplicateHandler.emit(obj.control2.errorDuplicate);
          }
        }

      })
    }
  }

  handelRemoveOldValueFromOther() {
    this.controOptions.values.map(option => {
      const isSelected = this.controlValue.selectedValues.indexOf(option.id) > 0;
      if (!isSelected && !!option && !!option?.other && this.selectedOption?.other?.showOther != null) {
        option.other.showOther = false;
      }
    })
  }

  handlShowOther(option) {
    this.controOptions?.values?.forEach(value => {
      if (this.isRadioButtonType && value?.id != option.id && value?.other) {
        value.other.value = "";
        value.other.setvalue = "";
      }
    });

    if (this.isCheckbox && this?.control?.value?.split(",").includes(option.id.toString()) && option?.other) {
      option.other.value = "";
      option.other.setvalue = "";
    }

    if (option?.other?.showOther != null) {
      option.other.showOther = !option?.other?.showOther
    }
  }

  handelMultipleValue() {
    if (this.isMultipleSelectType || this.isCheckbox) {
      // let itemsLabel = [];
      // let itemsLabelAr = [];

      // // console.log("this.controlValue",this.controlValue);

      // this.controlValue.selectedValues.forEach(value => {
      //   const option = this.controOptionsApi?.values.find((option) => option.id == value);

      //   // console.log("option",option);

      //   itemsLabel.push(option?.text??option?.textEn??option?.name??option?.nameEn);
      //   itemsLabelAr.push(option?.textAr??option?.nameAr);

      // })

      setTimeout(() => {
        if(this.control.valueApi && this.control.valueApi?.values?.length > 0) {
          const ids = this.control.valueApi?.values.map(val => {
            if (this.controlValue.selectedValues?.includes(val?.code)) {
              return val?.code;
            }
          }).filter(val => val != null);

          this.control.value = ids.join();

          this.control.valueText = ids.map(value => {
            let element = this.control.valueApi?.values?.find(element => element.code == value);
            return element?.nameEn;
          }).join('&');

          this.control.valueTextAr = ids.map(value => {
              let element = this.control.valueApi?.values?.find(element => element.code == value);
              return element?.nameAr;
          }).join();

        }
        else if(this.control.valueDynamicApi && this.control.valueDynamicApi?.values?.length > 0) {
          const ids = this.control.valueDynamicApi?.values.map(val => {
            if (this.controlValue.selectedValues.includes(val?.id)) {
              return val?.id;
            }
          }).filter(val => val != null);

          this.control.value = ids.join();

          this.control.valueText = ids.map(value => {
            let element = this.control.valueDynamicApi?.values?.find(element => element.id == value);
            return element?.name;
          }).join('&');

          this.control.valueTextAr = ids.map(value => {
              let element = this.control.valueDynamicApi?.values?.find(element => element.id == value);
              return element?.arabicName;
          }).join();

        }
        else {
          const ids = this.controOptions.values.map(val => {
            if (this.controlValue.selectedValues.includes(val?.id)) {
              return val?.id;
            }
          }).filter(val => val != null);

          this.control.value = ids.join();

          this.control.valueText = ids.map(value => {
            let option = this.controOptionsApi?.values.find((option) => option.id == value);
            return option?.text ?? option?.textEn ?? option?.name ?? option?.nameEn;
          }).join('&');


          this.control.valueTextAr = ids.map(value => {
            let option = this.controOptionsApi?.values.find((option) => option.id == value);
            return option?.textAr ?? option?.nameAr;
          }).join();
        }

      }, 200);
    }

    if (this.isUserSelectType) {
      let itemsLabel = [];
      let itemsLabelAr = [];

      // console.log("this.controlValue",this.controlValue);

      if (Array.isArray(this.controlValue?.value)) {
        this.controlValue?.value?.forEach(value => {
          const option = this.controOptionsApi?.values.find((option) => option.id == value);

          // console.log("option",option);

          itemsLabel.push(option?.text ?? option?.textEn ?? option?.name ?? option?.nameEn);
          itemsLabelAr.push(option?.textAr ?? option?.nameAr);

        })
      } else {
        const option = this.controOptionsApi?.values.find((option) => option.id == this.controlValue?.value);
        itemsLabel.push(option?.text ?? option?.textEn ?? option?.name ?? option?.nameEn);
        itemsLabelAr.push(option?.textAr ?? option?.nameAr);
      }

      setTimeout(() => {
        this.control.value = this.controlValue.value ? this.controlValue.value : this.controlValue.selectedValues.join();
        this.control.valueText = itemsLabel.join()
        this.control.valueTextAr = itemsLabelAr.join() || itemsLabel.join();
      }, 200);
    }

  }

  moveUpControl() {
    this.arrayMove(this.indexControl, (this.indexControl - 1))
  }

  moveDownControl() {
    this.arrayMove(this.indexControl, (1 + this.indexControl))
  }

  arrayMove(fromIndex, toIndex) {
    var element = this.controls[fromIndex];
    this.controls.splice(fromIndex, 1);
    this.controls.splice(toIndex, 0, element);
  }

  deleteControl() {
    this.controls.splice(this.indexControl, 1)
  }

  editModel() {
    let index = this.control?.validations?.findIndex(validation => validation.key == 'fileType');
    if (index && index != -1) {
      this.control.validations[index].isSaved = false;
      this.control.validations[index].oldValue = this.control.validations[index].value;
    }
    index = this.control?.validations?.findIndex(validation => validation.key == 'sizeFile');
    if (index && index != -1) {
      this.control.validations[index].isSaved = false;
      this.control.validations[index].oldValue = this.control.validations[index].value;
    }
    this.popupService.open('entity-modal' + this.control.id)
  }

  onPopupClose() {
    this.popupService.close();
  }

  onDragover(evt) {
    //console.log(evt)
  }

  onDrop(evt: DndDropEvent) {
    if (evt.data) {
      if (evt.data.control.type != ControlTypeMode.repeater) {
        const controlTitle = evt.data.control.properties.find(property => property.key == 'name')

        // event.data.control.id = this.selectedStep.controls.length + 1
        evt.data.control.id = Math.floor(Math.random() * 100000000)
        evt.data.control.arLabel = controlTitle.valueAr
        evt.data.control.enLabel = controlTitle.value
        evt.data.control.value = null;
        evt.data.control.valueText = null;
        evt.data.control.valueTextAr = null;
        // evt.data.control.icon = null;
        // evt.data.control.isOther = null;
        // evt.data.control.multiple = null;
        // evt.data.control.textAr = null;
        // evt.data.control.textEn = null;
        // evt.data.control.titleAr = null;
        // evt.data.control.titleEn = null;
        // evt.data.control.uri = null;
        // evt.data.control.innerControls = null;
        if (!this.control.innerControls) {
          this.control.innerControls = {
            formData: [],
            name: '',
            description: '',
            requestTitle: ''
          }
          this.control.innerControls.formData[0] = { name: '', description: '', stepNumber: 1, controls: [] };
        }
        this.control.innerControls.formData[0].controls.push(evt.data.control);
        this.control.innerControls.formData[0].controls.forEach(element => {
          if(element.type == ControlTypeMode.UserSelect) {
            // let optionsObj = element.properties.find(property => property.key == 'options');
            // optionsObj = { ...optionsObj, values: [] };
            // console.log('optionsObj after ', optionsObj)
            element.properties.forEach(property => {
              if(property.key == 'options')
              property = { ...property, values: [] };
            })
          }
        })
        // console.log('from repeater ', this.control)

        this.formValidators.handelUpdateFrom()
      }
    }
  }

  addDynamicControls(data) {
    let column;
    if (this.columns.length == 0) {
      for (let index = 0; index < data.length; index++) {
        column = {
          label: this.lang == 'ar' ? data[index].arLabel : data[index].enLabel,
          enLabel: data[index].enLabel,
          arLabel: data[index].arLabel
        }
        this.columns.push(column);
      }
    }

    let row = {};
    for (let index = 0; index < data.length; index++) {
      const label = this.lang == 'ar' ? data[index].arLabel : data[index].enLabel;
      row[label] = data[index].valueText;
      row['id'] = Math.floor(Math.random() * 100);
    }
    this.dynamicData.push(row);
    this.control.formControl.setValue(this.dynamicData)

    // Emit Rows and Columns
    this.dynamicRowsAndColumnsHandler.emit({ columns: this.columns, rows: this.dynamicData })

    // Clear Repeater Inputs
    this.control.innerControls.formData[0].controls.forEach((control)=> {
      control.formControl.setValue(null);
      control.formControl.markAsPristine();
    })

  }

  itemDeletedHandler(evt){
    this.control.formControl.setValue(evt)
  }

  arraysAreEqual(arr1, arr2): boolean {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
  }

}
