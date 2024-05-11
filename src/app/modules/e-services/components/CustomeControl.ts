import { FormControl } from '@angular/forms';

export class CustomFormControl extends FormControl {
  public probs: IField;

  constructor(_props: IField, validators:any) {
    super(null, validators);
    this.probs =  _props;
  }
}

export interface IField
{
    id:number ,
    name : string,
    arName: string ,
    type: number ,
    value: string ,
    valueText: string,
    valueTextAr : string,
    other : string ,
    controlName: string,
    hidden?: boolean
    // 1 Text , 2 Number , 3 TextArea, 4 Single Select, 5 Multiple Select, 6 Radio Buuton, 7 Checkbox, 8 Date , 9 File, 10 Image, 11 UserSelct, 12 Email, 13 Phone
}