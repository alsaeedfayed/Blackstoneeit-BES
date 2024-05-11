import { AbstractControl } from '@angular/forms';
import { FormGroupData } from 'src/app/shared/entity-builder/model/form-group-data.model';
import { ControlTypeMode } from '../enums/control-type.enums';

export interface IdataEntityPresenter {
  name: string;
  description: string,
  requestTitle: string;
  formData: Array<IFormStepData>;
  invalid?: boolean;
}

export interface IFormStepData {
  stepNumber: number;
  controls: Array<IControl>;
  formGroup?: FormGroupData;
  activeStep?: boolean,
  name: string,
  editName?: boolean,
  editDescription?: boolean,
  description: string,
}

export interface IControl {
  errorDuplicate?: boolean;
  id: number;
  name: string;
  arLabel: string;
  enLabel: string;
  arTitle: string;
  enTitle: string;
  arText: string;
  enText: string;
  type: ControlTypeMode;
  validations?: Array<IValidation>;
  sort: number;
  arPlaceholder: string;
  enPlaceholder: string;
  value: any;
  valueApi? : any,
  valueDynamicApi? : any,
  options: Array<IOption>;
  formControl?: AbstractControl;
  arMassage: string;
  enMassage: string;
  isOther?: string;
  isConditional?: string;
  valueText?: string,
  valueTextAr?: string,
  fileTypes?: string,
  maxSize?: number,
  updateValueAndValidity?: boolean,
  multiple?: boolean,
  properties?: Array<IProperty>,
  notEqual? : boolean,
  comments?: Array<any>
  innerControls?: IdataEntityPresenter;
}

export interface IValidation {
  isSaved?: boolean;
  key: string,
  type?: string,
  value: any,
  oldValue?: any,
  message: string,
  messageAr: string
}

export interface IOption {
  id: number;
  value: string;
  valueAr: string;
  selected: boolean;
}

export interface IProperty {
  key: string;
  value: any | [];
  values: any | [];
  selectedValues: any | [];
  valueAr: string;
  otherValue?: string;
  designerProperty: boolean;
  renderProperty: boolean;
  html?: boolean;
 // allowComment?: boolean;
  displayProperty?: string;
  displayArabicProperty?: string;
  uri?: string;
  linkUri?: string;
  linkIcon?: string;
  method?: string;
}
