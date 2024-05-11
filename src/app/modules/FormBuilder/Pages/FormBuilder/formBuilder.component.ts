import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';
import { IdataEntityPresenter } from 'src/app/core/models/form-builder.interfaces';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'form-builder',
  templateUrl: './formBuilder.component.html',
  styleUrls: ['./formBuilder.component.scss'],
})
export class FormBuilderComponent {
  public data: IdataEntityPresenter = {} as IdataEntityPresenter;
  loading: boolean = false;
  constructor(
    private httpHandlerService: HttpHandlerService,
    private toastr: ToastrService
  ) {
  }
  controlTypeEnum = ControlTypeMode;

  saveForm() {
    this.loading = true;
    const formData = [];
    const formControls = [];
    const query = {};

    this.data?.formData?.forEach((formdata) => {
      formdata?.controls?.forEach((control) => {
        formControls.push({
          id: control.id,
          name: control?.name,
          arLabel: control.arLabel,
          enLabel: control.enLabel,
          type: control.type,
          validations: control.validations,
          sort: control.sort,
          arPlaceholder: control.arPlaceholder,
          enPlaceholder: control.enPlaceholder,
          value: control.value,
          options: control.options,
        });
      });
      formdata.stepNumber;
    });
    formData.push({
      stepNumber: 1,
      controls: formControls,
    });

    query['formData'] = formData;
    query['name'] = this.data.name;

    this.httpHandlerService
      .post(Config.FormBuilder.CreateForm, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.toastr.success('Form saved successfully');
      });
  }
}
