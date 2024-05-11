import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { options } from '../../../shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GetDecisionTextService } from 'src/app/modules/committees-management/requests/services/get-decision-text/get-decision-text.service';

@Component({
  selector: 'app-form-builder-base',
  templateUrl: './form-builder-base.component.html',
  styleUrls: ['./form-builder-base.component.scss']
})
export class FormBuilderBaseComponent extends ComponentBase implements OnInit {


  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '3',
    sanitize: false,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'heading',
        'fontName',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };


  language: string = this.translate.currentLang
  @Input('dynamicFormGroup') dynamicFormGroup: FormGroup
  initDom: boolean = false
  formArr: { key: string, type: string, title: { en: string, ar: string }, isRequired: boolean }[]
  @Output('formValue') formValue: EventEmitter<any> = new EventEmitter()
  @Output('validForm') validForm: EventEmitter<boolean> = new EventEmitter()
  @Input('formArr') set fromArr(formArr) {
    if (formArr.length > 1) {
      //debugger
      this.formArr = formArr
      setTimeout(() => {
        this.createFormControl()
        // console.log('key', this.formArr[0].key)
      }, 200)
    }
  }
  @Input() inputsArr: any

  constructor(
    public translate: TranslateService,
    public translateService: TranslateConfigService,
    private fb: FormBuilder,
    private getDecisionTextService: GetDecisionTextService,
  ) {
    super(translateService, translate)
  }
  textEditorDefaultValue: string = '';
  ngOnInit(): void {
    this.handleLanguageChange()

    // get the default value of the text editor
    this.textEditorDefaultValue = this.getDecisionTextService.getText();
    this.dynamicFormGroup = this.fb.group({

    })

    this.dynamicFormGroup.valueChanges.subscribe(() => {
      this.formValue.emit(this.dynamicFormGroup.value)
      this.validForm.emit(this.dynamicFormGroup.valid && !this.isNotValid(this.dynamicFormGroup.value))
    })
  }

  // check attributes validations
  isNotValid(obj) {
    for (const key in obj) {
      if (obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === '' ||
        obj[key]?.length == 0 ||
        (typeof obj[key] === 'string' && this.removeTagsAndSpaces(obj[key]) === ''))
        return true;

    }
    return false;
  }
  removeTagsAndSpaces(inputText) {
    // Remove HTML tags using a regular expression
    const textWithoutTags = inputText.replace(/<[^>]*>/g, '');

    // Remove extra spaces using another regular expression
    const textWithoutSpaces = textWithoutTags.replace(/\s+/g, ' ');

    // Trim any leading or trailing spaces
    const trimmedText = textWithoutSpaces.replace(/&#160;/g, '').trim();
    return trimmedText;
  }
  createFormControl() {
    this.formArr.forEach(element => {
      if (element.key == "DecisionText"){

        element.isRequired ? this.dynamicFormGroup?.addControl(element.key, new FormControl(this.textEditorDefaultValue, Validators.required)) : this.dynamicFormGroup?.addControl(element.key, new FormControl(this.textEditorDefaultValue))
      }else{
        element.isRequired ? this.dynamicFormGroup?.addControl(element.key, new FormControl('', Validators.required)) : this.dynamicFormGroup?.addControl(element.key, new FormControl(''))

      }
    });

    this.initDom = true
  }
  handleLanguageChange() {
    this.translate.onLangChange.subscribe(lang => {
      this.language = lang.lang
    })
  }

}
