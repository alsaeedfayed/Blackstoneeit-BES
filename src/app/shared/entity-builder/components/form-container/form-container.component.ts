import { Component, Input, OnInit, AfterViewInit, Inject, Output, EventEmitter } from '@angular/core';
import { IFormStepData} from 'src/app/core/models/form-builder.interfaces';
import { FormGroupData } from '../../model/form-group-data.model';
import { EntityBuilderConfig, EntityBuilderMode, ENTITY_BUILDER_CONFIG } from 'src/app/core/enums/entity-builder-config';
import { FormValidatorsService } from '../../services/handle-form-validators.service';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit, AfterViewInit {

  @Input() formData: IFormStepData;
  // _formDataDetails
  // @Input() set formDataDetails(_formDataDetails){
  //   setTimeout(() => {
  //     this._formDataDetails = _formDataDetails;
  //   }, 300);
  // }
  @Output() updateHandler : EventEmitter<any> = new EventEmitter<any>();
  @Output() dynamicRowsAndColumnsHandler: EventEmitter<any> = new EventEmitter();

  form: FormGroupData = new FormGroupData();
  onValidationChange: any = () => { };
  entityBuilderModeEnum = EntityBuilderMode;
  editDescription: boolean = false;
  editName: boolean = false;
  errorDuplicate: boolean = false;
  constructor(@Inject(ENTITY_BUILDER_CONFIG)
  public entityBuilderConfig: EntityBuilderConfig, private formValidators: FormValidatorsService) { }


  ngAfterViewInit(): void {
    this.handleFormBuilder();
    this.handleFormChanges();
  }


  ngOnInit(): void {
    this.formValidators.formData = this.formData;
    this.handelUpdateControl();
  }

  handelUpdateControl() {
    this.formValidators.updateForm.subscribe(form => {
      this.formValidators.formData = form;
    })
  }

  handleFormBuilder() {
    this.formData.controls.map((control) => {
      this.form.addControl(control.id, control.formControl);
    });
    this.formData.formGroup = this.form;
    // console.log(this.entityBuilderConfig.mode, 'mode')
  }

  changeText() {
    // console.log(event)
  }

  handleFormChanges() {
    this.form.valueChanges.subscribe((value) => {
      this.formData.formGroup = this.form;
      this.updateHandler.emit(this.errorDuplicate);
    });
  }

  test() {
    event.stopPropagation();
    // console.log(this.formData)
  }

  emitDynamicRowsAndColumns(data) {
    this.dynamicRowsAndColumnsHandler.emit({columns: data.columns, rows: data.rows})
  }

}
