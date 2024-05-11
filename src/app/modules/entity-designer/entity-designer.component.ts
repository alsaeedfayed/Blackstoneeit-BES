import { Component, Inject, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from '../../core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { EntityBuilderConfig, EntityBuilderMode, ENTITY_BUILDER_CONFIG} from 'src/app/core/enums/entity-builder-config';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { controls } from './controls.constant';
import { FormValidatorsService } from 'src/app/shared/entity-builder/services/handle-form-validators.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-entity-designer',
  templateUrl: './entity-designer.component.html',
  styleUrls: ['./entity-designer.component.scss'],
})
export class EntityDesignerComponent extends ComponentBase implements OnInit {

  isFormValid: boolean = true;
  draggable = {
    data: 'text',
    effectAllowed: 'copy',
    disable: false,
    handle: false,
  };
  editName: boolean = false;
  entityBuilderModeEnum = EntityBuilderMode;
  lang: string = '';
  loading: boolean = false;

  formData: any = {
    name: '',
    description: '',
    requestTitle: 'form',
    formData: [
      {
        stepNumber: 1,
        description: '',
        name: '',
        controls: [],
        activeStep: true
      },
    ],
  };

  redirectFlag:boolean = false;
  redirectUrl:string="";
  redirectConfirm:boolean=false;
  contrlosBoxes: any[] = controls;
  editDescription: boolean = false;
  selectedStep: any;
  isEdit: boolean = false;
  get findControl() {
    return this.formData.formData.find(form => {
      return form.controls.length > 0
    })
  }

  redirect(){
    this.redirectFlag = false;
    this.redirectConfirm = true;
    this.route.navigate([this.redirectUrl]);
  }

  constructor(
    private http: HttpHandlerService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    @Inject(ENTITY_BUILDER_CONFIG)
    public entityBuilderConfig: EntityBuilderConfig,
    private model: PopupService,
    private formValidators: FormValidatorsService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private confirmationPopupService: ConfirmModalService,
  ) {
    super(translateService, translate);
    this.lang = this.translate.currentLang;

    this.translate.onLangChange.subscribe(lang => {
      this.lang = this.translate.currentLang;

    })
    this.route.events.subscribe((val:any) => {
      if(true && val.url != '/entity-designer' && val.url != undefined && !this.redirectConfirm && this?.selectedStep?.controls?.length > 0){
        this.redirectUrl = val.url;
        this.route.navigate(['/entity-designer']);
        this.redirectFlag=true;
        this.confirmationPopupService.open();
      }
    })
  }

  ngOnInit(): void {
    this.isEdit = !!this.activatedRoute.snapshot.queryParams.id;
    this.handelSelectActiveItem();
    this.formValidators.handelResetSaveValdtions();
    if (this.isEdit) {
      this.getFromById();
    }
  }

  getFromById() {
    this.loading = true;
    const query = {
      formId: this.activatedRoute.snapshot.queryParams.id
    }
    this.http.get(Config.FormBuilder.GetDynamicFormById, query).pipe(finalize(() => this.loading = false)).subscribe(res => {
      this.formData = res;
      console.log('this.formData ', JSON.stringify(this.formData?.formData[0]?.controls[0]?.properties?.filter(property => property.key == 'dynamicAPI')))
      this.handelSelectActiveItem();
    })
  }

  handelSelectActiveItem() {
    if (this.formData.formData.length == 1) {
      this.selectedStep = this.formData.formData[0];
    } else {
      this.selectedStep = this.formData.formData.find(step => step.activeStep);
    }

  }

  onDragStart(event: DragEvent) {
    // console.log('drag started', JSON.stringify(event, null, 2));
  }

  onDragEnd(event: DragEvent) {
    // console.log('drag ended', JSON.stringify(event, null, 2));
  }

  onDraggableCopied(event: DragEvent) {
    // console.log('draggable copied', JSON.stringify(event, null, 2));
  }

  onDragCanceled(event: DragEvent) {
    // console.log('drag cancelled', JSON.stringify(event, null, 2));
  }

  onDragover(event: DragEvent) {
    // console.log('dragover', JSON.stringify(event));
  }

  onDrop(event: DndDropEvent) {
    if (event.data.control.type == ControlTypeMode.newStep) {
      const step = {
        stepNumber: this.formData.formData.length + 1,
        controls: [],
        activeStep: true,
        description: 'form description',
        name: null,
      }
      this.selectedStep.activeStep = false;
      this.formData.formData.push(step);
      this.handelSelectActiveItem();
    } else if (event.data) {
      const controlTitle = event.data.control.properties.find(property => property.key == 'name');
      const controlTitleField = event.data.control.properties.find(property => property.key == 'title');
      const controlText = event.data.control.properties.find(property => property.key == 'text');

      // event.data.control.id = this.selectedStep.controls.length + 1;
      event.data.control.id = Math.floor(Math.random() * 100000000);

      if(event.data.control.type == ControlTypeMode.DownloadTemplate) {
        event.data.control.arTitle = controlTitleField.valueAr;
        event.data.control.enTitle = controlTitleField.value;
        event.data.control.arText = controlText.valueAr;
        event.data.control.enText = controlText.value;
      }
      else {
        event.data.control.arLabel = controlTitle.valueAr;
        event.data.control.enLabel = controlTitle.value;
      }
      this.selectedStep.controls.push(event?.data?.control);

      this.formValidators.handelUpdateFrom();

    };
  }

  backStep() {
    const index = this.formData.formData.indexOf(this.selectedStep)
    this.selectedStep.activeStep = false;
    this.selectedStep = this.formData.formData[index - 1];
    this.selectedStep.activeStep = true;
  }

  nextStep() {
    const index = this.formData.formData.indexOf(this.selectedStep)
    this.selectedStep.activeStep = false;
    this.selectedStep = this.formData.formData[index + 1];
    this.selectedStep.activeStep = true;
  }

  confirmationDelete() {
    this.model.open('confrontation-delete');
  }

  onDeleteStep(){
    this.confirmationPopupService.open();
  }

  deleteStep() {
    this.backStep();
    const index = this.formData.formData.indexOf(this.selectedStep);
    this.formData.formData.splice(index + 1, 1);
    this.formData.formData.forEach(function(element,key) {
      element.stepNumber = key+1;
    });
  }

  msgText() {
    return this.redirectFlag ? `${this.translate.instant('entityDesigner.sureRedirect')} `:`${this.translate.instant('entityDesigner.deleteStepConfermation')} `;
  }

  saveForm() {
    this.formValidators.handelAddValdtions();
    if (this.isEdit) {
      this.handelUpdateForm();
      return
    }
    const data = this.handelDeleteFormGroup();
    debugger
    if(data&&this.isFormValid){
      this.http.post(Config.FormBuilder.CreateDynamicForm, data).subscribe(res => {
        if(this.isFormValid){
          this.redirectConfirm=true;
          this.route.navigate(['/manage-forms']);
        }
      })
    }
  }

  handelUpdateForm() {
    const form = this.handelDeleteFormGroup();
    form.formId = Number(this.activatedRoute.snapshot.queryParams.id);
    // form.formData?.forEach(form => {
    //   form?.controls?.forEach(control => {
    //     const options = control.properties.find(prop => prop.key == 'options');
    //     options?.values.forEach(value => {
    //       if(value?.isConditional == true || value?.isConditional == "true"){
    //         value.isConditional = value?.isConditional?.toString();
    //         //debugger
    //         let element = form.controls.find(control => control.id == value?.conditional?.control);
    //         // const showelement = element.properties.find(prop => prop.key == 'show').value;
    //         element.properties.find(prop => prop.key == 'show').value = 'false' //showelement.toString();
    //         // console.log('element ', element)
    //       }
    //     });
    //   })
    // })
    if(form&&this.isFormValid)
      this.http.put(Config.FormBuilder.UpdateDynamicForm, form).subscribe(res => {
        this.redirectConfirm=true;
        this.route.navigate(['/manage-forms']);
      })
  }

  handelDeleteFormGroup() {
    const formData = { ...this.formData };
    let valid=true;
    formData?.formData?.forEach(form => {
      delete form.formGroup;

      form?.controls?.forEach(control => {
        control.value = null;
        control.valueText = null;
        control.valueTextAr = null;
        const index = control.properties.findIndex(proprty => proprty.key == "value");
        if(index != -1){
          control.properties[index].value = "";
          control.properties[index].otherValue = "";
        }
        delete control.formControl;
        if (control.type == ControlTypeMode.UserSelect) {
          const options = control.properties.find(prop => prop.key == 'options');
          options.values = [];
        }

        if(control.type == ControlTypeMode.MultipleSelect){
          control.multiple = true;
        }

        if(control.type == ControlTypeMode.SingleSelect){
          const notEqual = control.properties.find(prop => prop.key == 'notEqual');
          notEqual.value = notEqual?.value?.toString();

          const notEqualValidation = control.validations?.find(validation => validation.key == 'notEqual');
          if(notEqualValidation)
            notEqualValidation.value = "";
        }

        if (control.type == ControlTypeMode.Checkbox || control.type == ControlTypeMode.RadioButton|| control.type == ControlTypeMode.SingleSelect|| control.type == ControlTypeMode.MultipleSelect) {
          const options = control.properties.find(prop => prop.key == 'options');
          const api = control.properties.find(prop => prop.key == 'api');
          const dynamicAPI = control.properties.find(prop => prop.key == 'dynamicAPI');

          if( (control.valueApi?.values?.length > 0 && options.values.length == 0 && !api?.value)) {
            this.isFormValid = false;
            valid = false;
            this.toaster.error(this.translate.instant('shared.validations.checkboxOrRadioAtleastOneOption'));
          }
          else if( (control.valueDynamicApi?.values?.length > 0 && options.values.length == 0 && !dynamicAPI?.value)) {
            this.isFormValid = false;
            valid = false;
            this.toaster.error(this.translate.instant('shared.validations.checkboxOrRadioAtleastOneOption'));
          }
          else {
            this.isFormValid = true;
          }

        }

        if (control.type == ControlTypeMode.File){
          const validationIndex = control.validations.findIndex(validation => {
            return validation.key == "fileType"
          });
          if(validationIndex != -1 && control?.validations[validationIndex]?.value){
            control.validations[validationIndex].value = control?.validations[validationIndex]?.value?.join(",");
          }
        }

        if(control.type == ControlTypeMode.DownloadTemplate) {
          const attachmentFiles = control.properties.find(property => property.key == 'attachmentFiles');

          if(!attachmentFiles.value) {
            this.isFormValid = false;
            valid = false;
            this.toaster.error(this.translate.instant('shared.validations.linkMustValue'));
          }
          else {
            this.isFormValid = true;
            valid = true;
          }
        }

        const options = control.properties.find(prop => prop.key == 'options');
        for(let i=0;i<options?.values?.length;i++){
          const value = options?.values[i];
          if(value?.other && [5,6,7].includes(value?.other?.type)&&value?.other?.values?.length==0){
            valid = false;
            this.isFormValid = false;
            this.toaster.error(this.translate.instant('shared.validations.checkboxOrRadioAtleastOneOption'));
          }
        }

        // const allowComment = control.properties.find(prop => prop.key == 'allowComment')?.value;
        // control.properties.find(prop => prop.key == 'allowComment').value = allowComment.toString();

        const show = control.properties.find(prop => prop.key == 'show').value;
        control.properties.find(prop => prop.key == 'show').value = show.toString();

        if (control.type == ControlTypeMode.Date){
          const validationIndex = control.validations.findIndex(validation => {
            return validation.key == "minDate"
          });
          if(validationIndex != -1 && control?.validations[validationIndex]?.value){
            control.validations[validationIndex].value = control?.validations[validationIndex]?.value?.toString();
          }
        }

        if (control.type == ControlTypeMode.repeater){
          delete control.innerControls.formData[0].formGroup;
          delete control.innerControls.requestTitle;
          delete control.innerControls.name;
          delete control.innerControls.description;

          control.innerControls.formData[0].controls.forEach(element => {
            delete element.formControl;

            // const allowCommentInInnerControls = element.properties.find(prop => prop.key == 'allowComment')?.value;
            // element.properties.find(prop => prop.key == 'allowComment').value = allowCommentInInnerControls.toString();

            const showInInnerControls = element.properties.find(prop => prop.key == 'show').value;
            element.properties.find(prop => prop.key == 'show').value = showInInnerControls.toString();
          });
        }

        // const showInReport = control.properties.find(prop => prop.key == 'showInReport')?.value;
        // control.properties.find(prop => prop.key == 'showInReport').value = showInReport.toString();


        //reset values & other value
        if(EntityBuilderMode.View != this.entityBuilderConfig.mode){
          const value = control.properties.find(prop => prop.key == 'value');
          value.selectedValues = [];
          value.value = "";
          value.otherValue = "";

          const options = control.properties.find(prop => prop.key == 'options');
          options?.values.forEach(value => {
            if(value.other){
              value.other.value = "";
              // value.other.values = [];
              if(value.other.showOther != null){
                value.other.showOther = false;
              }
            }
            // if(value?.isConditional == true || value?.isConditional == "true" || value?.isConditional == false || value?.isConditional == "false"){
            //   value.isConditional = value?.isConditional?.toString();
            //   //debugger
            //   //let element = form.controls.find(control => control.id == value?.conditional?.control);
            //   // const showelement = element.properties.find(prop => prop.key == 'show').value;
            //   // element.properties.find(prop => prop.key == 'show').value = 'false' //showelement.toString();
            //   // console.log('element ', element)
            // }
          });
        }
      })

      this.isFormValid = this.isFormValid && valid;
    })

    this.isFormValid = this.isFormValid && valid;
    return formData;
  }

  changeTabs(mode: EntityBuilderMode) {
    if (Number(mode) == 0 || Number(mode)) {
      this.entityBuilderConfig.mode = mode;
      if (mode != 1) {
        this.formValidators.handelSaveValdtionsForm();
      }
      setTimeout(() => {
        this.formValidators.handelAddValdtions();
        console.log('this.formData from change tab after settimeout', JSON.stringify(this.formData?.formData[0]?.controls[0]?.properties?.filter(property => property.key == 'dynamicAPI')))
      }, 200);
    }
    console.log('this.formData from change tab', JSON.stringify(this.formData?.formData[0]?.controls[0]?.properties?.filter(property => property.key == 'dynamicAPI')))
    // for(let i=0;i<this.selectedStep.controls.length;i++){
    //   this.selectedStep.controls[i].properties.find(property => property.key == 'value').value = null;
    //   const options = this.selectedStep.controls[i].properties.find(property => property.key == "options")?.values;
    //   options?.forEach(option => {
    //     if(option?.isConditional && option?.conditional?.control){
    //       const index = this.selectedStep.controls.findIndex(control => control.id == option.conditional.control);
    //       console.log("setting false;")
    //       this.selectedStep.controls[index].properties.find(property => property.key == 'show').value = 'false';
    //     }
    //   });
    // }
  }

}
