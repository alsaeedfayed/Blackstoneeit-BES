import { Component, Input, OnChanges, OnInit, SimpleChanges, Renderer2,Inject  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-requests-translations',
  templateUrl: './requests-translations.component.html',
  styleUrls: ['./requests-translations.component.scss']
})
export class RequestsTranslationsComponent implements OnInit, OnChanges {

  @Input() lang: string
  @Input() overviewForm
  @Input() organizationForm
  @Input() isFormSubmitted: boolean
  @Input() isTranslationRequired: boolean
  @Input() requestData
  translatedEnFieldsForm: FormGroup;

  constructor(private fb: FormBuilder,private http: HttpHandlerService, @Inject(DOCUMENT) private _document: HTMLDocument, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.overviewForm && this.organizationForm) {
      this.initTranslatedEnFieldsForm({ ...this.overviewForm, ...this.organizationForm })
    }
  }

  ngOnInit() {
    this.initTranslatedEnFieldsForm()
  }

  initTranslatedEnFieldsForm(data?) {
    this.translatedEnFieldsForm = this.fb.group({
      projectNameEn: [this.lang === 'en' ? data?.projectName : this.requestData?.name?.en, this.isTranslationRequired ? Validators.required : null],
      projectNameAr: [this.lang === 'ar' ? data?.projectName : this.requestData?.name?.ar, this.isTranslationRequired ? Validators.required : null],
      projectDescriptionEn: [this.lang === 'en' ? data?.projectDescription : this.requestData?.description?.en, this.isTranslationRequired ? Validators.required : null],
      projectDescriptionAr: [this.lang === 'ar' ? data?.projectDescription : this.requestData?.description?.ar, this.isTranslationRequired ? Validators.required : null],
      projectExpectedOutcomesEn: [this.lang === 'en' ? data?.projectOutcomes : this.requestData?.expectedOutcomes?.en, this.isTranslationRequired ? Validators.required : null],
      projectExpectedOutcomesAr: [this.lang === 'ar' ? data?.projectOutcomes : this.requestData?.expectedOutcomes?.ar, this.isTranslationRequired ? Validators.required : null],
      projectExpectedBenefitsEn: [this.lang === 'en' ? data?.projectExpectedBenefits : this.requestData?.expectedBenefits?.en, this.isTranslationRequired ? Validators.required : null],
      projectExpectedBenefitsAr: [this.lang === 'ar' ? data?.projectExpectedBenefits : this.requestData?.expectedBenefits?.ar, this.isTranslationRequired ? Validators.required : null],
      projectScopeEn: [this.lang === 'en' ? data?.projectScope : this.requestData?.projectScope?.en, this.isTranslationRequired ? Validators.required : null],
      projectScopeAr: [this.lang === 'ar' ? data?.projectScope : this.requestData?.projectScope?.ar, this.isTranslationRequired ? Validators.required : null],
      projectOutScopeEn: [this.lang === 'en' ? data?.projectOutOfScope : this.requestData?.outOfScope?.en, this.isTranslationRequired ? Validators.required : null],
      projectOutScopeAr: [this.lang === 'ar' ? data?.projectOutOfScope : this.requestData?.outOfScope?.ar, this.isTranslationRequired ? Validators.required : null],
      externalEntitiesEn: [this.lang === 'en' ? data?.externalEntities : this.requestData?.externalEntities?.en, this.isTranslationRequired ? Validators.required : null],
      externalEntitiesAr: [this.lang === 'ar' ? data?.externalEntities : this.requestData?.externalEntities?.ar, this.isTranslationRequired ? Validators.required : null],
    })
  }

  get getTranslatedEnFieldsForm() {
    return this.translatedEnFieldsForm.controls
  }

  translateAll(from:string, to:string){
    let body = {
      "text": Array.from(this._document.querySelectorAll('.'+from)).map((item : any) => {
        let x = {
          key : this.renderer.parentNode(item).getElementsByTagName('label')[0].innerHTML.replaceAll(/\s/g,'').replace(':',''),
          value : item.value
        };
        return x;
      }),
      "from": from,
      "to": to
    };
    this.http.post(Config.Lookups.createTranslation, body).subscribe(data => {
      const items = Array.from(this._document.querySelectorAll('.'+to));
      data.translations.forEach((translation,index) => {
        (items[index] as any).value = translation.translatedValue;
        if(from == 'en') {
          this.translatedEnFieldsForm.controls['projectNameAr'].setValue((items[0] as any).value);
          this.translatedEnFieldsForm.controls['projectDescriptionAr'].setValue((items[1] as any).value);
          this.translatedEnFieldsForm.controls['projectScopeAr'].setValue((items[2] as any).value);
          this.translatedEnFieldsForm.controls['projectOutScopeAr'].setValue((items[3] as any).value);
          this.translatedEnFieldsForm.controls['projectExpectedOutcomesAr'].setValue((items[4] as any).value);
          this.translatedEnFieldsForm.controls['projectExpectedBenefitsAr'].setValue((items[5] as any).value);
        }
        else if(from == 'ar') {
          this.translatedEnFieldsForm.controls['projectNameEn'].setValue((items[0] as any).value);
          this.translatedEnFieldsForm.controls['projectDescriptionEn'].setValue((items[1] as any).value);
          this.translatedEnFieldsForm.controls['projectScopeEn'].setValue((items[2] as any).value);
          this.translatedEnFieldsForm.controls['projectOutScopeEn'].setValue((items[3] as any).value);
          this.translatedEnFieldsForm.controls['projectExpectedOutcomesEn'].setValue((items[4] as any).value);
          this.translatedEnFieldsForm.controls['projectExpectedBenefitsEn'].setValue((items[5] as any).value);
        }
      });
    })
  }

}
