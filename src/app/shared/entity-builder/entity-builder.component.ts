import { AfterViewInit, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { EntityBuilderConfig, EntityBuilderMode, ENTITY_BUILDER_CONFIG} from 'src/app/core/enums/entity-builder-config';
import { IdataEntityPresenter } from 'src/app/core/models/form-builder.interfaces';

@Component({
  selector: 'app-entity-builder',
  templateUrl: './entity-builder.component.html',
  styleUrls: ['./entity-builder.component.scss'],
})
export class EntityBuilderComponent implements AfterViewInit {
  @Input() entity: IdataEntityPresenter;
  // _formDataDetails
  // @Input() set formDataDetails(_formDataDetails){
  //   setTimeout(() => {
  //     this._formDataDetails = _formDataDetails;
  //   }, 200);
  // }
  @Output() updateHandler : EventEmitter<any> = new EventEmitter<any>();
  @Output() dynamicRowsAndColumnsHandler: EventEmitter<any> = new EventEmitter();

  mode: EntityBuilderMode;
  entityBuilderModeEnum = EntityBuilderMode;

  constructor(
    @Inject(ENTITY_BUILDER_CONFIG)
    public entityBuilderConfig: EntityBuilderConfig,

  ) {
    this.mode = this.entityBuilderConfig.mode;
  }
  ngAfterViewInit(): void {
    this.handleFormsChanges();
  }

  handleFormsChanges() {
    this.handleFormsStatus();
    //JSON.stringify(this)
    // console.log('this.entity builder  ', JSON.stringify(this.entity?.formData[0]?.controls[0]?.properties?.filter(property => property.key == 'dynamicAPI')))
    this.entity?.formData?.map((form) => {
      form?.formGroup?.valueChanges.subscribe((e) => {
        this.handleFormsStatus();
      });
    });
  }

  handleFormsStatus() {
    let isFormInvalid : boolean = false;
    let isInnerControlsFormInvalid : boolean = false;
    // console.log('this.entity from status  ', JSON.stringify(this.entity?.formData[0]?.controls[0]?.properties?.filter(property => property.key == 'dynamicAPI')))
    if(this.entity) {
      isFormInvalid = this.entity?.formData.some((form) => {
        return form.formGroup.invalid;
      });

      isInnerControlsFormInvalid = this.entity?.formData[0].controls.some((control) => {
        return control.innerControls?.formData[0].formGroup.invalid
      });

      this.entity.invalid = isFormInvalid || isInnerControlsFormInvalid;

      // this.entity.invalid = this.entity?.formData.some((form) => {
      //   return form.formGroup.invalid;
      // });
    }
  }

  emitDynamicRowsAndColumns(data) {
    this.dynamicRowsAndColumnsHandler.emit({columns: data.columns, rows: data.rows})
  }

  emitUpdate(event) {
    this.updateHandler.emit(event)
  }

}
