import { AbstractControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { IControl } from 'src/app/core/models/form-builder.interfaces';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { MinDate } from 'src/app/core/helpers/minDate.validator';
import { Subject } from 'rxjs';

@Injectable()
export class FormValidatorsService {
  rebuildFormValidation: Subject<any> = new Subject();
  updateForm: Subject<any> = new Subject();
  formData: any = {};
  constructor() { }

  handleRequired(formControl: AbstractControl, control: IControl) {
    const required = control?.validations?.find(
      (validation) => validation.key == 'required'
    );
    if (!!required) {
      formControl.addValidators(Validators.required);
    } else {
      formControl.removeValidators(Validators.required);
    }
  }

  handleMaxLength(formControl: AbstractControl, control: IControl) {
    const maximumLength = control?.validations?.find(
      (validation) => validation.key == 'maximumLength'
    );
    if (!!maximumLength) {
      formControl.addValidators(Validators.maxLength(maximumLength.value));
    }
  }

  handleMinLength(formControl: AbstractControl, control: IControl) {
    const minimumLength = control?.validations?.find(
      (validation) => validation.key == 'minimumLength'
    );
    if (!!minimumLength) {
      formControl.addValidators(Validators.minLength(minimumLength.value));
    }
  }

  handleMaxNummber(formControl: AbstractControl, control: IControl) {
    const maxNmuber = control?.validations?.find(
      (validation) => validation.key == 'max'
    );
    if (!!maxNmuber && maxNmuber.type == 'number') {
      formControl.addValidators(Validators.max(maxNmuber.value));
    }
  }

  handleMinNummber(formControl: AbstractControl, control: IControl) {
    const minNmuber = control?.validations?.find(
      (validation) => validation.key == 'min'
    );
    if (!!minNmuber && minNmuber.type == 'number') {
      formControl.addValidators(Validators.max(minNmuber.value));
    }
  }
  handleEmail(formControl: AbstractControl, control: IControl) {
    if (control.type == ControlTypeMode.Email) {
      formControl.addValidators(Validators.email);
    }
  }

  handlePattern(formControl: AbstractControl, control: IControl) {
    const pattern = control?.validations?.find(
      (validation) => validation.key == 'pattern'
    );
    if (!!pattern) {
      formControl.addValidators(Validators.pattern(pattern.value));
    }
  }

  handleMinDate(
    formControl: AbstractControl,
    control: IControl,
    controls: IControl[]
  ) {
    const minDate = control?.validations?.find(
      (validation) => validation.key == 'min'
    );

    if (control.type == ControlTypeMode.Date && !!minDate) {
      const controlMin = controls?.find((item) => item.id == minDate.value);
      if (!!controlMin) {
        controlMin.formControl.valueChanges.subscribe((value) => {
          this.handelDateMinValidator(
            formControl,
            controlMin.formControl,
            control
          );
        });
      }

      formControl.valueChanges.subscribe((value) => {
        this.handelDateMinValidator(
          formControl,
          controlMin.formControl,
          control
        );
        control.updateValueAndValidity = false;
      });
    }
  }

  handelDateMinValidator(
    addControl: AbstractControl,
    minControl: AbstractControl,
    control: IControl
  ) {
    if (!!minControl.value && !!addControl.value) {
      addControl.clearValidators();
      addControl.addValidators(MinDate(minControl.value));
      addControl.updateValueAndValidity();
      this.reBuildValidators(addControl, control);
    } else {
      addControl.clearValidators();
      this.reBuildValidators(addControl, control);
    }
  }

  reBuildValidators(formControl: AbstractControl, control: IControl) {
    this.handleEmail(formControl, control);
    this.handlePattern(formControl, control);
    this.handleMinLength(formControl, control);
    this.handleMaxLength(formControl, control);
    this.handleMaxNummber(formControl, control);
    this.handleRequired(formControl, control);
  }

  handelUpdateFrom() {
    this.updateForm.next(this.formData);
  }

  handelSaveValdtionsForm() {
    const validations = {};
    this.formData?.controls?.forEach(control => {
      validations[control.id] = control.validations
    })
    localStorage.setItem('formData', JSON.stringify(validations))
  }

  handelResetSaveValdtions() {
    localStorage.removeItem('formData')
  }

  handelAddValdtions() {
    const valdtions = JSON.parse(localStorage.getItem('formData'))
    if (!valdtions) return;
    this.formData.controls?.forEach(control => {
      control.validations = valdtions[control.id];
    })
  }
}
