import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControl } from 'src/app/core/models/form-builder.interfaces';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { FormValidatorsService } from '../../services/handle-form-validators.service';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AllowFoundControlsOnly } from './AllowFoundControlsOnly.validator';
import { Config } from 'src/app/core/config/api.config';
import { ILookup } from 'src/app/modules/lookup-mangement/interfaces/interfaces';
import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
@Component({
  selector: 'app-entity-modal',
  templateUrl: './entity-modal.component.html',
  styleUrls: ['./entity-modal.component.scss'],
})
export class EntityModalComponent implements OnInit , OnChanges , AfterViewChecked {

  language: string = null;
  public lookupTypes: { code: string; id: number,nameEn:string,nameAr:string }[] = [];
  public dynamicUtilites: {arabicLabel: string, displayArabicProperty: string, displayProperty: string, label: string, method: string, uri: string}[] = [];

  @Input() control: IControl;
  controls = new Array<IControl>();
  @Input() set Controls(controls){
    this.controls = controls;
  }

  @Input() formControl: AbstractControl;
  availablecontrols = [];

  isConnected : boolean = false;
  isMaxDateToday: boolean = false;
  isMinimumLength: boolean = false;
  isMaximumLength: boolean = false;
  isRequired: boolean = false;
  isPattern: boolean = false;
  isMinDate: boolean = false;
  isFileType: boolean = false;
  isFileSize: boolean = false;
  isMultiSelect: boolean = false;
  isNotEqualSelect: boolean = false;
  isMinDateControl: boolean = false;
  dateControls: any[] = [];
  signleSelectControls: any[] = [];
  items: any = [];
  item: any = {};
  isEdit: boolean = false;
  selectValue: string;
  controlTypeEnum = ControlTypeMode;
  hint: any = {};
  placeholder: any = {};
  title: any = {};
  form: FormGroup;
  otherItem: any = {};
  otherList = [
    {
      title: 'Short Text',
      arTitle: 'نص قصير',
      type: ControlTypeMode.Text,
    },
    {
      title: 'Long Text',
      arTitle: 'نص طويل',
      type: ControlTypeMode.Textarea,
    },
    {
      title: 'Number',
      arTitle: 'أرقام',
      type: ControlTypeMode.Number,
    },
    {
      title: 'Date',
      arTitle: 'تاريخ',
      type: ControlTypeMode.Date,
    },
    {
      title: 'Date Range',
      arTitle: 'رينج تاريخ',
      type: ControlTypeMode.DateRange,
    },
    {
      title: 'Checkbox',
      arTitle: 'خيارات متعدده',
      type: ControlTypeMode.Checkbox,
    },
    {
      title: 'Radio button',
      arTitle: 'زر الراديو',
      type: ControlTypeMode.RadioButton,
    },
    {
      title: 'Single Select',
      arTitle: 'اختيار واحد',
      type: ControlTypeMode.SingleSelect,
    },
    {
      title: 'Multi Select',
      arTitle: 'تحديد متعدد',
      type: ControlTypeMode.MultipleSelect,
    },
  ]
  isShow : boolean = true;
 // isShowInReport : boolean = false;

  supportedFormats = [
    { item_id: 1, item_text: 'PDF' },
    { item_id: 2, item_text: 'DOC' },
    { item_id: 3, item_text: 'DOCX' },
    { item_id: 4, item_text: 'XML' },
    { item_id: 5, item_text: 'XLSX' },
    { item_id: 6, item_text: 'XLS' },
    { item_id: 7, item_text: 'JPG' },
    { item_id: 8, item_text: 'JPEG' },
    { item_id: 9, item_text: 'PNG' },
    { item_id: 10, item_text: 'GIF' },
    { item_id: 11, item_text: 'PPT' },
    { item_id: 12, item_text: 'PPTX' },
    { item_id: 13, item_text: 'TXT' }
  ];

  supportedLinkAttachmentTypes: string[] = ['pdf', 'xls', 'xlsx', 'doc', 'docx']
  parsedControlLinkAttachmentFiles

  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    itemsShowLimit: 3,
  };

  minimumLength = {
    key: "minimumLength",
    value: '',
    message: '',
    messageAr: ''
  }

  required = {
    key: "required",
    value: '',
    message: '',
    messageAr: ''
  }

  maximumLength = {
    key: "maximumLength",
    value: '',
    message: '',
    messageAr: ''
  }

  pattern = {
    key: "pattern",
    value: '',
    message: '',
    messageAr: ''
  }

  maxDateToday = {
    key: "today",
    value: 'today',
    message: '',
    messageAr: ''
  }

  minDate = {
    key: "minDate",
    type: "date",
    value: '',
    message: '',
    messageAr: ''
  }

  multiSelect = {
    key: "multiple",
    value: '',
    message: '',
    messageAr: ''
  }

  NotEqualSelect = {
    key: "notEqual",
    value: null,
    message: '',
    messageAr: ''
  }

  fileType = {
    key: "fileType",
    value: [],
    message: '',
    messageAr: '',
    isSaved : false
  }

  sizeFile = {
    key: "sizeFile",
    value: '',
    message: '',
    messageAr: '',
    isSaved : false
  }

  selectDateControl = {
    key: "minDate",
    type: "control",
    value: '',
    message: '',
    messageAr: ''
  }

  selectNotEqualControl = {
    key: "notEqualControl",
    type: "control",
    value: '',
    message: '',
    messageAr: ''
  }

  // allowComment:boolean = false;

  attachmentFiles: any[] = [];

  onItemSelect(data){
    this.fileType.value.push(data);
  }

  onSelectAll(data){
    this.fileType.value = data;
  }

  get controlTitle() {
    return this.control?.properties?.find(property => property.key == 'name');
  }

  get controlTitleFeild() {
    return this.control?.properties?.find(property => property.key == 'title');
  }

  get controlText() {
    return this.control?.properties?.find(property => property.key == 'text');
  }

  get controlApi() {
    return this.control.properties.find(property => property.key == 'api');
  }

  get controlDynamicApi() {
    return this.control.properties.find(property => property.key == 'dynamicAPI');
  }

  get controlNotEqual() {
    return this.control.properties.find(property => property.key == 'notEqual');
  }

  get controlItemsType() {
    return this.control.properties.find(property => property.key == 'itemsType');
  }

  get controlPlaceholder() {
    return this.control?.properties?.find(property => property.key == 'placeholder');
  }

  get controHint() {
    return this.control?.properties?.find(property => property.key == 'hint');
  }

  get controlShow() {
    return this.control?.properties?.find(property => property.key == 'show');
  }

  // get controlShowInReport() {
  //   return this.control?.properties?.find(property => property.key == 'showInReport');
  // }

  get controOptions() {
    return this.control?.properties?.find(property => property.key == 'options');
  }

  // get controlAllowComment() {
  //   return this.control?.properties?.find(property => property.key == 'allowComment');
  // }

  get controlLinkAttachmentFiles() {
    return this.control.properties.find(property => property.key == 'attachmentFiles');
  }

  reBuildDate: boolean = false;

  get isFiledType(): boolean {
    return (
      this.isFiledText ||
      this.isFiledNumber ||
      this.isEmailType ||
      this.isPhoneType
    );
  }

  get isUserSelectType(): boolean {
    return this.control.type === ControlTypeMode.UserSelect;
  }

  get isEmailType(): boolean {
    return this.control.type === ControlTypeMode.Email;
  }

  get isDateType(): boolean {
    return this.control.type === ControlTypeMode.Date;
  }
  get isDateRangeType(): boolean {
    return this.control.type === ControlTypeMode.DateRange;
  }
  get isFiledText(): boolean {
    return this.control.type === ControlTypeMode.Text;
  }

  get isFiledTextArea(): boolean {
    return this.control.type === ControlTypeMode.Textarea;
  }

  get isFiledNumber(): boolean {
    return this.control.type === ControlTypeMode.Number || this.isPhoneType;
  }

  get isPhoneType(): boolean {
    return this.control.type === ControlTypeMode.Phone;
  }

  get isFileUpload(): boolean {
    return this.control.type === ControlTypeMode.File;
  }

  get isRadioButtonType(): boolean {
    return this.control.type === ControlTypeMode.RadioButton;
  }

  get isSelectType(): boolean {
    return (
      this.isSingleSelectType ||
      this.isMultipleSelectType
    );
  }

  get isSingleSelectType(): boolean {
    return this.control.type === ControlTypeMode.SingleSelect;
  }

  get isMultipleSelectType(): boolean {
    return this.control.type === ControlTypeMode.MultipleSelect;
  }

  get isCheckbox(): boolean {
    return this.control.type === ControlTypeMode.Checkbox;
  }

  get isLink(): boolean {
    return this.control.type === ControlTypeMode.DownloadTemplate;
  }

  get isRepeater(): boolean {
    return this.control.type === ControlTypeMode.repeater;
  }

  get controFileType() {
    return this.control?.validations?.find(valid => valid.key == 'fileType');
  }

  get controFileSize() {
    return this.control?.validations?.find(valid => valid.key == 'sizeFile');
  }

  get controlRequired() {
    return this.control?.validations?.find(validation => validation.key == 'required');
  }

  get controlMultiSelect() {
    return this.control?.validations?.find(validation => validation.key == 'multiple');
  }

  get controlNotEqualSelect() {
    return this.control?.validations?.find(validation => validation.key == 'notEqual');
  }

  get controlPattern() {
    return this.control?.validations?.find(validation => validation.key == 'pattern');
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

  get controlMinDateDate() {
    return this.control?.validations?.find(validation => validation.key == 'minDate' && validation.type == 'control');
  }

  constructor(private popupService: PopupService, private formValidators: FormValidatorsService,
    private fb: FormBuilder,
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute, private httpHandlerService: HttpHandlerService,
    private cdr: ChangeDetectorRef
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.handleOnlySingleSelectControl();
    this.handleOnlyDateControls();

    this.formValidators.updateForm.subscribe(data => {
      this.isConnected = false;
      // this.isShow = true;
      // this.form.get('show').setValue(true);
      this.controls.forEach(control => {
         const options = control?.properties?.find(property => property?.key == "options")?.values;
         options?.forEach(option => {
          if(option?.conditional?.control == this.control.id && option?.isConditional){
            this.control.properties.find(property => property.key == 'show').value = false;
            if(this.control.id == this.control.id){
              this.isConnected = true;
              this.isShow = false;
              this.form.get('show').setValue(false);
            }
          }
        })
      })
    })
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.isEdit = !!this.activatedRoute.snapshot.queryParams.id;

    this.isConnected = false;

    this.handelForm();
    this.handleOnlyDateControls();
    this.handleOnlySingleSelectControl();
    this.handelUpdateControl();
    this.translateService.onLangChange.subscribe((lang) => {
      this.handelLang();
    });
    this.handelLang();
    if(this.control.type == ControlTypeMode.SingleSelect || this.control.type == ControlTypeMode.MultipleSelect) {
      this.getAllLookups();
      this.getDynamicUtilities();
    }

    // this.isShow = true;
    // this.form.get('show').setValue(true);
    // this.isShowInReport = false;
    // this.form.get('showInReport').setValue(false);


    this.controls.forEach(control => {
         const options = control?.properties?.find(property => property?.key == "options")?.values;
         options?.forEach(option => {
          if(option?.conditional?.control == this.control.id && option?.isConditional){
            this.control.properties.find(property => property.key == 'show').value = false;
            if(this.control.id == this.control.id){
              this.isConnected = true;
              this.isShow = false;
              this.form.get('show').setValue(false);
            }
          }
        })
    })
    this.handleAvailablecontrols();
  }

  handelLang() {
    this.language = this.translateService.currentLang;
    this.selectValue = this.translateService.currentLang == 'ar' ? 'arTitle' : 'title';
  }

  private getAllLookups() {
    this.httpHandlerService.get(`${Config.Lookups.lookupService}?ServiceName=ServiceDesk`)
      .subscribe((lookups: ILookup[]) => {
        this.lookupTypes = lookups.map((lookup) => {
          return {
            code: lookup.lookupType,
            id: lookup.lookupResult[0]?.lookupTypeId,
            nameEn: lookup.lookupTypeNameEn,
            nameAr: lookup.lookupTypeNameAr
          };
        });
      });
  }

  dynamicUtilitesItem: any //{arabicLabel: string, displayArabicProperty: string, displayProperty: string, label: string, method: string, uri: string};
  private getDynamicUtilities() {
    this.httpHandlerService.get(`${Config.Lookups.getDynamicAPIs}`)
      .subscribe((res) => {
        this.dynamicUtilites = res.map((utility) => {
          return {
            label: utility.label,
            arabicLabel: utility.arabicLabel,
            method: utility.method,
            uri: utility.uri,
            // id: lookup.lookupResult[0]?.lookupTypeId,
            displayProperty: utility.displayProperty,
            displayArabicProperty: utility.displayArabicProperty
          };
        });
      }
      );
     // this.dynamicUtilitesItem = this.dynamicUtilites[0];
    }

 // )}

  selectDynamicUtilityValue(_utility) {
    //let utility;
    if (typeof _utility == 'string') {
      this.dynamicUtilitesItem = this.dynamicUtilites.find(item => item.label == _utility)
    }
    else
    this.dynamicUtilitesItem = _utility;
    this.controlDynamicApi.uri = this.dynamicUtilitesItem?.uri;
    this.controlDynamicApi.displayProperty = this.dynamicUtilitesItem?.displayProperty;
    this.controlDynamicApi.displayArabicProperty = this.dynamicUtilitesItem?.displayArabicProperty;
    this.controlDynamicApi.method = this.dynamicUtilitesItem?.method;

    //this.form.get('dynamicAPI').setValue(utility.)
  }

  handleOnlyDateControls() {
    if (this.isDateType) {
      this.dateControls = this.controls?.filter(control => control.type == ControlTypeMode.Date && control.id != this.control.id);
    }
  }

  handleOnlySingleSelectControl(){
    if (this.isSingleSelectType) {
      this.signleSelectControls = this.controls?.filter(control => control.type == ControlTypeMode.SingleSelect && control.id != this.control.id
        && (
          ((control.properties?.find(property => property.key == "api")?.value && control.properties?.find(property => property.key == "api")?.value == this.form?.get('api').value))
          ||
          ((control.properties?.find(property => property.key == "dynamicAPI")?.value && control.properties?.find(property => property.key == "dynamicAPI")?.value == this.form?.get('dynamicAPI').value))
        ))
    }
  }

  handelUpdateControl() {
    this.formValidators.updateForm.subscribe(form => {
      this.handleOnlyDateControls();
      this.handleOnlySingleSelectControl();
    })
    this.form.valueChanges.subscribe(data => {
      this.handleOnlyDateControls();
      this.handleOnlySingleSelectControl();
    })
  }

  async handelForm() {

    this.form = this.fb.group({
      label: (this.control.type == ControlTypeMode.Checkbox || this.control.type == ControlTypeMode.RadioButton || this.control.type == ControlTypeMode.File || this.control.type == ControlTypeMode.DownloadTemplate) ? this.fb.control(null) : this.fb.control(null, Validators.required),
      labelAr: (this.control.type == ControlTypeMode.Checkbox || this.control.type == ControlTypeMode.RadioButton || this.control.type == ControlTypeMode.File || this.control.type == ControlTypeMode.DownloadTemplate) ? this.fb.control(null, ArabicLettersAndNumbersOnly()) : this.fb.control(null, [Validators.required, ArabicLettersAndNumbersOnly()]),
      title: (this.control.type != ControlTypeMode.DownloadTemplate) ? this.fb.control(null) : this.fb.control(null, Validators.required),
      titleAr: (this.control.type != ControlTypeMode.DownloadTemplate) ? this.fb.control(null, ArabicLettersAndNumbersOnly()) : this.fb.control(null, [Validators.required, ArabicLettersAndNumbersOnly()]),
      text: (this.control.type != ControlTypeMode.DownloadTemplate) ? this.fb.control(null) : this.fb.control(null, Validators.required),
      textAr: (this.control.type != ControlTypeMode.DownloadTemplate) ? this.fb.control(null, ArabicLettersAndNumbersOnly()) : this.fb.control(null, [Validators.required, ArabicLettersAndNumbersOnly()]),
      hint: this.fb.control('',[EnglishLettersAndNumbersWithComma()]),
      hintAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      api : this.fb.control(null),
      dynamicAPI : this.fb.control(null),
      // allowComment : this.fb.control(false),
      show : this.fb.control(true),
     // showInReport : this.fb.control(false),
      itemsType : this.fb.control(0),
      placeholder: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      placeholderAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      minimumLength: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      minimumLengthMsg: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      minimumLengthMsgAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      maximumLength: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      maximumLengthMsg: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      maximumLengthMsgAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      requiredMsg: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      requiredMsgAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      pattern: this.fb.control(''),
      patternMsg: this.fb.control('',[EnglishLettersAndNumbersOnly()]),
      patternMsgAr: this.fb.control(null, [ArabicLettersAndNumbersOnly()]),
      minDate: this.fb.control(null),
      conditionalControls : this.fb.array([]),
      fileType: this.fb.control(''),
      sizeFile: this.fb.control(''),
      multiSelect: this.fb.control(''),
      notEqual: this.fb.control(''),
      notEqualControl: this.fb.control('', []),
      minDateControl: this.fb.control(null),
      attachmentFiles: (this.control.type != ControlTypeMode.DownloadTemplate) ? this.fb.control([]) : this.fb.control([], [Validators.required])
    });

    this.form.get('notEqualControl').setAsyncValidators(AllowFoundControlsOnly(this.form));


    this.handelOldData();
    this.form.get('itemsType').valueChanges.subscribe(data => {
      if(data == 0){
        this.controlApi.value = null;
        this.form.get('api').setValue(null);
        this.controlDynamicApi.value = null;
        this.form.get('dynamicAPI').setValue(null);
      }else{
        this.items = [];
      }
    })
    this.form.get('notEqual').valueChanges.subscribe(data => {
      this.form.get('notEqualControl').setValue('');
    });
    this.form.get('api').valueChanges.subscribe(data => {
      this.form.get('notEqualControl').setValue('');
    })
    this.form.get('api').valueChanges.subscribe(data => {
      this.form.get('notEqualControl').setValue('');
    })
    this.form.get('dynamicAPI').valueChanges.subscribe(data => {
      this.form.get('notEqualControl').setValue('');
    })

  }

  handelOldData() {
    this.form.get('label').setValue(this.controlTitle?.value);
    this.form.get('labelAr').setValue(this.controlTitle?.valueAr);
    this.form.get('title').setValue(this.controlTitleFeild?.value);
    this.form.get('titleAr').setValue(this.controlTitleFeild?.valueAr);
    this.form.get('text').setValue(this.controlText?.value);
    this.form.get('textAr').setValue(this.controlText?.valueAr);
    // this.form.get('allowComment').setValue(this.controlAllowComment?.value=="true" || this.controlAllowComment?.value==true);
    // this.allowComment = this.form.get('allowComment').value == true || this.form.get('allowComment').value == 'true';
    this.form.get('show').setValue(this.controlShow?.value=="true" || this.controlShow?.value==true);
   // this.form.get('showInReport').setValue(this.controlShowInReport?.value=="true" || this.controlShowInReport?.value==true);
    this.isShow = this.form.get('show').value == true || this.form.get('show').value == 'true';
   // this.isShowInReport = this.form.get('showInReport').value == true || this.form.get('showInReport').value == 'true';

    this.form.get('hint').setValue(this.controHint?.value);
    this.form.get('hintAr').setValue(this.controHint?.valueAr);
    this.form.get('placeholder').setValue(this.controlPlaceholder?.value);
    this.form.get('placeholderAr').setValue(this.controlPlaceholder?.valueAr);
    this.form.get('api').setValue(this.controlApi?.value);
    this.form.get('dynamicAPI').setValue(this.controlDynamicApi?.value);
    this.form.get('itemsType').setValue(this.controlItemsType?.value || (this.controlApi?.value ? 1 : this.controlDynamicApi?.value ? 2 : 0) || 0);

    if(this.controlLinkAttachmentFiles?.value) {
      this.parsedControlLinkAttachmentFiles = JSON.parse(this.controlLinkAttachmentFiles?.value)
      this.form.get('attachmentFiles').setValue(JSON.parse(this.controlLinkAttachmentFiles?.value));
    }

    if (!!this.isEdit) {
      if (!!this.controFileSize) {
        this.handelOldSizeFile();
      }
      if (!!this.controFileType) {
        this.handelFileType();
      }

      if (!!this.controlRequired) {
        this.handelOldRequired();
      }

      if(!!this.controlMultiSelect) {
        this.handelOldMultiSelect();
      }

      if(!!this.controlNotEqualSelect) {
        this.handleOldNotEqualSelect();
      }

      if (!!this.controlMinimumLength) {
        this.handelOldMinimum();
      }
      if (!!this.controlMaximumLength) {
        this.handelOldMaximum();
      }
      if (!!this.controlMaxDateToday) {
        this.handelOldMaxDateToday();
      }
      if (!!this.controlMinDate) {
        this.handelOldMinDate();
      }

      if (!!this.controlMinDateDate) {
        this.handelOldMinDateFromControl();
      }

      if (!!this.controlPattern) {
        this.handelOldPattern();
      }
    }

    if (!!this.controOptions?.values) {
      this.handelOldOptions();
    }
  }

  isArabicWithNumbersAndCommas(text: string): boolean {
    const arabicPattern = /^[\u0621-\u064A\d\-_\s,]+$/;
    return arabicPattern.test(text);
  }

  isEnglishWithNumbersAndCommas(text: string): boolean {
    const englishPattern = /^[\w\d,$&-_ ]+$/;
    return englishPattern.test(text);
  }

  handelOldSizeFile() {
    this.isFileSize = true;
    this.sizeFile.value = this.controFileSize.value;
    this.sizeFile.isSaved = null;
    this.handelSizeFile();
  }

  handelFileType() {
    this.isFileType = true;
    this.fileType.value = this.controFileType.value?.split(",");
    this.fileType.isSaved = null;
    this.handelTypeFile();
  }

  handelOldOptions() {
    this.items = this.controOptions.values;
  }

  handelOldRequired() {
    this.isRequired = true;
    this.required.value = this.controlRequired.value;
    this.required.message = this.controlRequired.message;
    this.required.messageAr = this.controlRequired.messageAr;
    this.handelRequired();
  }

  handelOldMultiSelect() {
    this.isMultiSelect = true;
    this.multiSelect.value = this.controlMultiSelect.value;
    this.handelMultiSelect();
  }

  handleOldNotEqualSelect(){
    this.NotEqualSelect.value = (this.controlNotEqual.value == "true");
    this.controlNotEqual.value = this.NotEqualSelect.value;
    this.form.get('notEqual').setValue(this.NotEqualSelect.value);
    this.isNotEqualSelect = this.NotEqualSelect.value;
    this.selectNotEqualControl.value = this.control.validations.find(validation => validation.key == "notEqualControl").value;;
  }

  handelOldPattern() {
    this.isPattern = true;
    this.pattern.value = this.controlPattern.value;
    this.pattern.message = this.controlPattern.message;
    this.pattern.messageAr = this.controlPattern.messageAr;
    this.handelPattern();
  }

  handelOldMinimum() {
    this.isMinimumLength = true;
    this.minimumLength.value = this.controlMinimumLength.value;
    this.minimumLength.message = this.controlMinimumLength.message;
    this.minimumLength.messageAr = this.controlMinimumLength.messageAr;
    this.handelMinimumLength();
  }

  handelOldMaximum() {
    this.isMaximumLength = true;
    this.maximumLength.value = this.controlMaximumLength.value;
    this.maximumLength.message = this.controlMaximumLength.message;
    this.maximumLength.messageAr = this.controlMaximumLength.messageAr;
    this.handelMaximumLength();
  }

  handelOldMinDate() {
    this.isMinDate = true;
    this.minDate.value = new Date(this.controlMinDate.value) as any;
    this.minDate.message = this.controlMinDate.message;
    this.minDate.messageAr = this.controlMinDate.messageAr;
    this.handelMinDate();
  }

  handelOldMaxDateToday() {
    this.isMaxDateToday = true;
    this.maxDateToday.value = this.controlMaxDateToday.value
    this.maxDateToday.message = this.controlMaxDateToday.message;
    this.maxDateToday.messageAr = this.controlMaxDateToday.messageAr;
    this.handelMaxDateToday();
  }

  handelOldMinDateFromControl() {
    this.isMinDateControl = true;
    this.selectDateControl.value = this.controlMinDateDate.value
    this.selectDateControl.message = this.controlMinDateDate.message;
    this.selectDateControl.messageAr = this.controlMinDateDate.messageAr;
    this.handelMinDateFromControl();
  }

  handelSizeFile() {
    const sizeFile = this.control?.validations?.findIndex(validation => validation.key == 'sizeFile');
    if (this.isFileSize) {
      this.form.get('sizeFile').addValidators(Validators.required);
      if (sizeFile > -1) this.control.validations[sizeFile] = this.sizeFile
      else this.control.validations.push(this.sizeFile)
    } else if (sizeFile > -1) {
      this.form.get('sizeFile').removeValidators(Validators.required);
      this.form.get('sizeFile').reset();
      this.control.validations.splice(sizeFile, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelTypeFile() {
    const fileType = this.control?.validations?.findIndex(validation => validation.key == 'fileType');
    if (this.isFileType) {
      this.form.get('fileType').addValidators(Validators.required);
      if (fileType > -1) this.control.validations[fileType] = this.fileType
      else this.control.validations.push(this.fileType)
    } else if (fileType > -1) {
      this.form.get('fileType').removeValidators(Validators.required);
      this.form.get('fileType').reset();
      this.control.validations.splice(fileType, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMinDateFromControl() {
    const minDateControl = this.control?.validations?.findIndex(validation => validation.key == 'minDate' && validation.type == 'control');
    if (this.isMinDateControl) {
      this.form.get('minDateControl').setValidators(Validators.required);
      this.form.get('minDateControl').updateValueAndValidity();
      if (minDateControl > -1) this.control.validations[minDateControl] = this.selectDateControl
      else this.control.validations.push(this.selectDateControl);
    } else if (minDateControl > -1) {
      this.form.get('minDateControl').removeValidators(Validators.required);
      this.form.get('minDateControl').reset();
      this.control.validations.splice(minDateControl, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelNotEqualFromControl() {
    const notEqualControl = this.control?.validations?.findIndex(validation => validation.key == 'notEqualControl' && validation.type == 'control');
    if (this.isNotEqualSelect) {
      // this.form.get('notEqualControl').addValidators(Validators.required);
      if (notEqualControl > -1) this.control.validations[notEqualControl] = this.selectNotEqualControl
      else this.control.validations.push(this.selectNotEqualControl);
    } else if (notEqualControl > -1) {
      // this.form.get('notEqualControl').removeValidators(Validators.required);
      this.form.get('notEqualControl').reset();
      this.control.validations.splice(notEqualControl, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMinDate() {
    const minDate = this.control?.validations?.findIndex(validation => validation.key == 'minDate' && validation?.type == "date");
    if (this.isMinDate) {
      if (this.isMaxDateToday) {
        this.isMaxDateToday = false;
        this.handelMaxDateToday();
      }
      this.form.get('minDate').addValidators(Validators.required);
      if (minDate > -1) this.control.validations[minDate] = this.minDate
      else {
        if(!this.control.validations){
          this.control.validations = [];
        }
        this.control.validations.push(this.minDate)
      }
    } else if (minDate > -1) {
      this.form.get('minDate').removeValidators(Validators.required);
      this.form.get('minDate').reset();
      this.control.validations.splice(minDate, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMaxDateToday() {
    const maxDatetoday = this.control?.validations?.findIndex(validation => validation.key == 'today');
    if (this.isMaxDateToday) {
      if (this.isMinDate) {
        this.isMinDate = false;
        this.handelMinDate()
      }
      if (maxDatetoday > -1) this.control.validations[maxDatetoday] = this.maxDateToday
      else this.control.validations.push(this.maxDateToday)
    } else if (maxDatetoday > -1) {
      this.control.validations.splice(maxDatetoday, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMinimumLength() {
    const isAddedMinimumLength = this.control?.validations?.findIndex(validation => validation.key == 'minimumLength');
    if (this.isMinimumLength) {
      this.form.get('minimumLength').addValidators(Validators.required);
      this.form.get('minimumLengthMsg').addValidators(Validators.required);
      this.form.get('minimumLengthMsgAr').addValidators(Validators.required);
      if (isAddedMinimumLength > -1) this.control.validations[isAddedMinimumLength] = this.minimumLength
      else this.control.validations.push(this.minimumLength);
    } else if (isAddedMinimumLength > -1) {
      this.form.get('minimumLength').removeValidators(Validators.required);
      this.form.get('minimumLengthMsg').removeValidators(Validators.required);
      this.form.get('minimumLengthMsgAr').removeValidators(Validators.required);
      this.form.get('minimumLength').reset();
      this.form.get('minimumLengthMsg').reset();
      this.form.get('minimumLengthMsgAr').reset();
      this.control.validations.splice(isAddedMinimumLength, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMaximumLength() {
    const isAddedMaximumLength = this.control?.validations?.findIndex(validation => validation.key == 'maximumLength');
    if (this.isMaximumLength) {
      this.form.get('maximumLength').addValidators(Validators.required);
      this.form.get('maximumLengthMsg').addValidators(Validators.required);
      this.form.get('maximumLengthMsgAr').addValidators(Validators.required);
      if (isAddedMaximumLength > -1) this.control.validations[isAddedMaximumLength] = this.maximumLength
      else this.control.validations.push(this.maximumLength);
    } else if (isAddedMaximumLength > -1) {
      this.form.get('maximumLength').removeValidators(Validators.required);
      this.form.get('maximumLengthMsg').removeValidators(Validators.required);
      this.form.get('maximumLengthMsgAr').removeValidators(Validators.required);
      this.form.get('maximumLength').reset();
      this.form.get('maximumLengthMsg').reset();
      this.form.get('maximumLengthMsgAr').reset();
      this.control.validations.splice(isAddedMaximumLength, 1)
    }
    this.form.updateValueAndValidity();
  }

  handleAllowComment(){
    // this.form.get('allowComment').setValue(this.allowComment);
    // this.control.properties.find(property => property.key == "allowComment").value = this.form.get('allowComment')?.value;
    // console.log("form",this.form);
  }

  handleShow(){
    this.form.get('show').setValue(this.isShow);
    this.control.properties.find(property => property.key == "show").value = this.form.get('show').value;
    // if(!this.isShow){
    //   const isRequired = this.control?.validations?.findIndex(validation => validation.key == 'required');
    //   this.form.get('requiredMsg').removeValidators(Validators.required);
    //   this.form.get('requiredMsgAr').removeValidators(Validators.required);
    //   // this.form.get('requiredMsg').reset();
    //   // this.form.get('requiredMsgAr').reset();
    //   this.control.validations.splice(isRequired, 1);
    //   this.isRequired=false;
    // }else if(this.isRequired){
    //   this.form.get('requiredMsg').addValidators(Validators.required);
    //   this.form.get('requiredMsgAr').addValidators(Validators.required);
    // }
    //console.log("deubg",this.isShow,this.controlShow,this.form.get('show'));
    // debugger
  }

  // handleShowInReport(){
  //   this.form.get('showInReport').setValue(this.isShowInReport);
  //   this.control.properties.find(property => property.key == "showInReport").value = this.form.get('showInReport')?.value;
  //   console.log("form",this.form);
  // }

  handelRequired() {
    const isRequired = this.control?.validations?.findIndex(validation => validation.key == 'required');
    if (this.isRequired) {
      this.form.get('requiredMsg').addValidators(Validators.required);
      this.form.get('requiredMsgAr').addValidators(Validators.required);
    if (isRequired > -1) this.control.validations[isRequired] = this.required
    else this.control.validations?.push(this.required);
    } else if (isRequired > -1) {
      this.form.get('requiredMsg').removeValidators(Validators.required);
      this.form.get('requiredMsgAr').removeValidators(Validators.required);
      this.form.get('requiredMsg').reset();
      this.form.get('requiredMsgAr').reset();
      this.control.validations.splice(isRequired, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelMultiSelect() {
    const isMultiSelect = this.control?.validations?.findIndex(validation => validation.key == 'multiple');
    if (this.isMultiSelect) {
      this.control.multiple = true;
      // this.form.get('requiredMsg').addValidators(Validators.required);
      // this.form.get('requiredMsgAr').addValidators(Validators.required);
    if (isMultiSelect > -1) this.control.validations[isMultiSelect] = this.multiSelect
    else this.control.validations.push(this.multiSelect);
    } else if (isMultiSelect > -1) {
      // this.form.get('requiredMsg').removeValidators(Validators.required);
      // this.form.get('requiredMsgAr').removeValidators(Validators.required);
      // this.form.get('requiredMsg').reset();
      // this.form.get('requiredMsgAr').reset();
      this.control.validations.splice(isMultiSelect, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelNotEqualSelect(e) {
    const value = e.target.checked;
    this.controlNotEqual.value = value.toString();
    this.form.get('notEqual').setValue(value.toString());
    const isNotEqualSelect = this.control?.validations?.findIndex(validation => validation.key == 'notEqual');
    if (this.isNotEqualSelect) {
      this.control.notEqual = true;
    if (isNotEqualSelect > -1) this.control.validations[isNotEqualSelect] = this.NotEqualSelect
    else this.control.validations.push(this.NotEqualSelect);
    } else if (isNotEqualSelect > -1) {
      this.control.validations.splice(isNotEqualSelect, 1)
    }
    this.form.updateValueAndValidity();
  }

  handelPattern() {
    const isPattern = this.control?.validations?.findIndex(validation => validation.key == 'pattern');
    if (this.isPattern) {
      this.form.get('pattern').addValidators(Validators.required);
      this.form.get('patternMsg').addValidators(Validators.required);
      this.form.get('patternMsgAr').addValidators(Validators.required);
     // this.control.validations.push(this.required)
      if (isPattern > -1) this.control.validations[isPattern] = this.pattern
      else this.control.validations.push(this.pattern);
    } else if (isPattern > -1) {
      this.form.get('pattern').removeValidators(Validators.required);
      this.form.get('patternMsg').removeValidators(Validators.required);
      this.form.get('patternMsgAr').removeValidators(Validators.required);
      this.form.get('pattern').reset();
      this.form.get('patternMsg').reset();
      this.form.get('patternMsgAr').reset();
      this.control.validations.splice(isPattern, 1)
    }
    this.form.updateValueAndValidity();
  }

  addItem() {
    this.item.id = Math.round(Math.random() * 2000)
    this.items.push(this.item);
    this.item = {};
  }

  setApi(){
    this.item.id = Math.round(Math.random() * 2000)
    this.items.push(this.item);
    this.item = {};
  }

  deleteItem(index) {
    const conditionalControls = (this.form.get('conditionalControls') as  FormArray);
    let found=false;
    for(let i=0;i<conditionalControls.length;i++){
      if(conditionalControls.at(i).get("control").value == this.items[index]?.id){
        found=true;
        (this.form.get('conditionalControls') as  FormArray).removeAt(i);
      }
    }
    if(found==false && !this.items[index]?.conditional?.control){
      for(let i=0;i<conditionalControls.length;i++){
        if(!conditionalControls.at(i).get("control").value){
          (this.form.get('conditionalControls') as  FormArray).removeAt(i);
          break;
        }
      }
    }
    this.items.splice(index, 1);
  }

  deleteOther(index,array){
    array.splice(index,1);
  }

  save() {
    this.sizeFile.isSaved = true;
    this.fileType.isSaved = true;
    this.formValidators.reBuildValidators(this.formControl, this.control);
    this.handelUpdatePropripes();
    this.onPopupClose();
    this.formValidators.handelUpdateFrom();
  }

  handelUpdatePropripes() {
   // debugger
    if(this.controlTitle) {
      this.controlTitle.value = this.form.get('label').value;
      this.controlTitle.valueAr = this.form.get('labelAr').value;
    }
    // this.placeholder.value = this.form.get('placeholder').value;
    // this.placeholder.valueAr = this.form.get('placeholderAr').value;
    if(this.controlPlaceholder) {
      this.controlPlaceholder.value = this.form.get('placeholder').value;
      this.controlPlaceholder.valueAr = this.form.get('placeholderAr').value;
    }
    if(this.controlTitleFeild) {
      this.controlTitleFeild.value = this.form.get('title').value;
      this.controlTitleFeild.valueAr = this.form.get('titleAr').value;
    }
    if(this.controlText) {
      this.controlText.value = this.form.get('text').value;
      this.controlText.valueAr = this.form.get('textAr').value;
    }
    if(this.controlApi)
      this.controlApi.value = this.form.get('api').value;

    if(this.controlDynamicApi)
      this.controlDynamicApi.value = this.form.get('dynamicAPI').value;

    if(this.controlNotEqual)
      this.controlNotEqual.value = this.form.get('notEqual').value;

    if(this.controlLinkAttachmentFiles)
      this.controlLinkAttachmentFiles.value = this.form.get('attachmentFiles').value;

    this.controHint.value = this.form.get('hint')?.value;
    this.controHint.valueAr = this.form.get('hintAr')?.value;
    this.controlShow.value = this.form.get('show')?.value;
    // this.controlShowInReport.value = this.form.get('showInReport')?.value;
    this.minDate.value = this.form.get('minDate')?.value;
    this.control.arLabel = this.form.get('labelAr').value;
    this.control.enLabel = this.form.get('label').value;

    this.control.arTitle = this.form.get('titleAr').value;
    this.control.enTitle = this.form.get('title').value;

    this.control.arText = this.form.get('textAr').value;
    this.control.enText = this.form.get('text').value;

    if (!!this.isSelectType || !!this.isRadioButtonType || !!this.isCheckbox) {
      this.controOptions.values = this.items;
    }

    if(this.controlLinkAttachmentFiles) {
      this.controlLinkAttachmentFiles.value = this.form.get('attachmentFiles').value;
      let icon = this.controlLinkAttachmentFiles.value?.find(attachment => attachment?.extension?.slice(1));
      let uri = this.controlLinkAttachmentFiles.value?.find(attachment => attachment?.fileName);
      this.controlLinkAttachmentFiles.linkIcon = icon.extension?.slice(1);
      this.controlLinkAttachmentFiles.linkUri = uri.fileName;
      this.controlLinkAttachmentFiles.value = JSON.stringify(this.controlLinkAttachmentFiles.value);
    }
  }

  handelOther(option) {
    option.other = {
      type: ControlTypeMode.Text,
      value: '',
      showOther: false,
      values: []
    }
  }

  handleConditional(option){
    if(!option?.conditional){
      option.conditional = {
        type: ControlTypeMode.Text,
        value: '',
        showOther: false,
        values: []
      }
    }
    const conditionalControls = this.form.get('conditionalControls') as FormArray;
    let conditionalControl,conditionalControlIndex;
    for(let i=0;i<conditionalControls.length;i++){
      if(conditionalControls.at(i).value.id == option.id){
        conditionalControl = conditionalControls.at(i);
        conditionalControlIndex = i;
      }
    }
    if(option.isConditional){
      if(!conditionalControl){
        (this.form.get('conditionalControls') as FormArray).push(
          new FormGroup({
            id: new FormControl(option?.id),
            control: new FormControl(option?.conditional?.control)
          })
        )
        conditionalControl = (this.form.get('conditionalControls') as FormArray)[(this.form.get('conditionalControls') as FormArray).length-1];
        conditionalControlIndex = (this.form.get('conditionalControls') as FormArray).length-1;
      }
      (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.addValidators(Validators.required);
      (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.updateValueAndValidity();
    }else{
      (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.clearValidators();
      (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.reset();
      (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
    this.handleAvailablecontrols();
  }

  addOtherItem(option) {
    const obj = Object.assign({}, option.other)
    option.other.values.push({
      id: Math.round(Math.random() * 2000),
      text: obj.label,
      textAr: obj.labelAr,
    });
    delete option.other.label
    delete option.other.labelAr
  }

  onPopupClose() {
    for(let i=0;i<this.controls.length;i++){
      const options = this.controls[i]?.properties?.find(property => property?.key == "options")?.values;
      for(let j=0;j<options?.length;j++){
        if(options[j]?.isConditional && !options[j]?.conditional?.control){
          this.controls[i].properties.find(property => property.key == "options").values[j].isConditional = false;
        }
      }
    }
    this.popupService.close();
  }

  handleConditionalControl(option,controlId){
    let index;
    const conditionalControls = (this.form.get('conditionalControls') as FormArray);
    let conditionalControl,conditionalControlIndex;
    for(let i=0;i<conditionalControls.length;i++){
      if(conditionalControls.at(i).value.id == option.id){
        conditionalControl = conditionalControls.at(i);
        conditionalControlIndex = i;
      }
    }
    (this.form.get('conditionalControls') as FormArray).at(conditionalControlIndex)?.get('control')?.setValue(controlId);
    index = this.controls.findIndex(item => item.id == controlId);
    if(index != -1){
      this.controls[index].properties.find(property => property.key == 'show').value = false;
    }
  }

  handleAvailablecontrols(){
    let connectedControls = [];
      this.controls.forEach(control => {
        const options = control?.properties?.find(property => property.key == "options")?.values;
        options?.forEach(option => {
          if(option?.isConditional && option?.conditional?.control){
            const index = this.controls.findIndex(control => control.id == option.conditional.control);
            if(index != -1)
              connectedControls.push(this.controls[index].id)
          }
        });
      });
      // this.availablecontrols = this.controls.filter(control => (control.id != this.control.id) && (!connectedControls.includes(control.id)));
      this.availablecontrols = this.controls.filter(control => (control.id != this.control.id));
  }

  uploadFile(event) {
    if(event == null)
      this.attachmentFiles = []
    else
      this.attachmentFiles = [...event];
    this.form.get('attachmentFiles').setValue(this.attachmentFiles)
  }

}
